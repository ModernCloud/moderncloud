const path = require('path');
const fs = require('fs');
const get = require('lodash/get');
const rimraf = require('rimraf');
const { Function, Endpoint, Package, EnvironmentVariable, Dynamodb } = require('../../../common/db');
const render = require('../../../common/template/render');

async function removeFiles(job) {
    for (const filePath of fs.readdirSync(job.getTerraformRoot())) {
        let extension = filePath.split('.').pop();
        if (['tf', 'tfvars'].indexOf(extension) > -1) {
            fs.unlinkSync(path.join(job.getTerraformRoot(), filePath));
        }
    }

    for (const folderPath of fs.readdirSync(job.getFunctionsRoot())) {
        rimraf.sync(path.join(job.getFunctionsRoot(), folderPath));
    }

    for (const folderPath of fs.readdirSync(job.getEndpointsRoot())) {
        rimraf.sync(path.join(job.getEndpointsRoot(), folderPath));
    }

    for (const folderPath of fs.readdirSync(job.getTmpRoot())) {
        rimraf.sync(path.join(job.getTmpRoot(), folderPath));
    }
}

async function updateTerraformFiles(job) {
    render(
        path.join(job.getTerraformTemplates(), 'main.tf.twig'),
        path.join(job.getTerraformRoot(), 'main.tf'),
        {
            terraform_s3_bucket: job.environment.terraform_s3_bucket
        }
    );
    fs.copyFileSync(path.join(job.getTerraformTemplates(), 'iam.tf'), path.join(job.getTerraformRoot(), 'iam.tf'));
    fs.copyFileSync(path.join(job.getTerraformTemplates(), 'variables.tf'), path.join(job.getTerraformRoot(), 'variables.tf'));
}

async function createFunctionFiles(job) {
    let functions = await Function.query().where('project_id', job.project.id);
    let envVariables = await EnvironmentVariable.query()
        .where('project_id', job.project.id)
        .where('environment_id', job.environment.id);
    for (const row of functions) {
        let hasPackage = await createLambdaPackages(job, row);
        render(
            path.join(job.getTerraformTemplates(), 'lambda.tf.twig'),
            path.join(job.getTerraformRoot(), `${row.name}.tf`),
            {
                project: job.project,
                environment: {
                    ...job.environment,
                    variables: envVariables
                },
                function: {
                    ...row,
                    root: path.join(job.getFunctionsRoot(), row.name),
                    zip_file: path.join(job.getTmpRoot(), `${row.name}.zip`)
                },
                hasPackage: hasPackage
            }
        );
    }
}

async function createApiGatewayFiles(job) {
    let endpoints = await Endpoint.query().where('project_id', job.project.id);
    render(
        path.join(job.getTerraformTemplates(), 'api_gateway.tf.twig'),
        path.join(job.getTerraformRoot(), `api_gateway_${job.project.name}.tf`),
        {
            project: job.project,
            endpoints: endpoints,
            environment: job.environment,
            hasValidCertificate: get(job.environment, 'certificate_validation_options.ValidationStatus', 'PENDING_VALIDATION') === 'SUCCESS'
        }
    );
}

async function createEndpointFiles(job) {
    let endpoints = await Endpoint.query().where('project_id', job.project.id);
    let envVariables = await EnvironmentVariable.query()
        .where('project_id', job.project.id)
        .where('environment_id', job.environment.id);
    for (const row of endpoints) {
        let hasPackage = await createLambdaPackages(job, row);
        render(
            path.join(job.getTerraformTemplates(), 'endpoint.tf.twig'),
            path.join(job.getTerraformRoot(), `${row.name}.tf`),
            {
                project: job.project,
                environment: {
                    ...job.environment,
                    variables: envVariables
                },
                endpoint: {
                    ...row,
                    root: path.join(job.getEndpointsRoot(), row.name),
                    zip_file: path.join(job.getTmpRoot(), `${row.name}.zip`)
                },
                hasPackage: hasPackage
            }
        )
    }
}


async function createLambdaPackages(job, lambda) {
    let hasPackage = await Package.query()
        .where('project_id', job.project.id)
        .where('file_id', lambda.id)
        .where('file_type', lambda instanceof Endpoint ? 'endpoint' : 'function')
        .first() instanceof Package;
    if (hasPackage) {
        let layerName = `${job.project.name}_${job.environment.name}_${lambda.name}`;
        render(
            path.join(job.getTerraformTemplates(), 'packages.tf.twig'),
            path.join(job.getTerraformRoot(), `${layerName}_packages.tf`),
            {
                layer_name: layerName,
                root: job.getLambdaPackagesRoot(lambda.name),
                zip_file: path.join(job.getTmpRoot(), `${layerName}_packages.zip`)
            }
        )
    }
    return hasPackage;
}

async function createDynamoDBFiles(job) {
    let tables = await Dynamodb.query().where('project_id', job.project.id);
    for (const row of tables) {
        render(
            path.join(job.getTerraformTemplates(), 'dynamodb.tf.twig'),
            path.join(job.getTerraformRoot(), `dynamodb_${row.name}.tf`),
            {
                project: job.project,
                environment: job.environment,
                table: {
                    ...row,
                    attributes: row.attributes
                }
            }
        )
    }
}

module.exports = {
    run: async (job) => {
        await removeFiles(job);
        await updateTerraformFiles(job);
        await createFunctionFiles(job);
        await createApiGatewayFiles(job);
        await createEndpointFiles(job);
        await createDynamoDBFiles(job);
    }
}