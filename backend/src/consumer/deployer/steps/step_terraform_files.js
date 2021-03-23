const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const { Function, Endpoint, EnvironmentVariable, Dynamodb } = require('../../../common/db');
const render = require('../../../common/template/render');

async function updateTerraformFiles(job) {
    fs.copyFileSync(path.join(job.getTerraformTemplates(), 'iam.tf'), path.join(job.getTerraformRoot(), 'iam.tf'));
    fs.copyFileSync(path.join(job.getTerraformTemplates(), 'main.tf'), path.join(job.getTerraformRoot(), 'main.tf'));
    fs.copyFileSync(path.join(job.getTerraformTemplates(), 'variables.tf'), path.join(job.getTerraformRoot(), 'variables.tf'));
    render(
        path.join(job.getTerraformTemplates(), 'terraform.tfvars.twig'),
        path.join(job.getTerraformRoot(), 'terraform.tfvars'),
        {
            aws: {
                region: job.environment.region,
                access_key: job.environment.access_key,
                secret_key: job.environment.secret_key
            }
        }
    )
}

async function removeFiles(job) {
    for (const filePath of fs.readdirSync(job.getTerraformRoot())) {
        if (filePath.indexOf('lambda_') > -1
            || filePath.indexOf('endpoint_') > -1
            || filePath.indexOf('api_gateway_') > -1) {
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

async function createFunctionFiles(job) {
    let functions = await Function.query().where('project_id', job.project.id);
    let envVariables = await EnvironmentVariable.query()
        .where('project_id', job.project.id)
        .where('environment_id', job.environment.id);
    for (const row of functions) {
        render(
            path.join(job.getTerraformTemplates(), 'lambda.tf.twig'),
            path.join(job.getTerraformRoot(), `lambda_${row.name}.tf`),
            {
                project: job.project,
                environment: {
                    ...job.environment,
                    variables: envVariables
                },
                function: {
                    name: row.name,
                    handler: row.handler,
                    runtime: row.runtime,
                    root: path.join(job.getFunctionsRoot(), row.name),
                    zip_file: path.join(job.getTmpRoot(), `function_${row.name}.zip`)
                }
            }
        );
    }
}

async function createCertificate(job) {
    render(
        path.join(job.getTerraformTemplates(), 'certificate.tf.twig'),
        path.join(job.getTerraformRoot(), `certificate_${job.project.name}.tf`),
        {
            project: job.project,
            environment: job.environment
        }
    );
}

async function createApiGatewayFiles(job) {
    let endpoints = await Endpoint.query().where('project_id', job.project.id);
    render(
        path.join(job.getTerraformTemplates(), 'api_gateway.tf.twig'),
        path.join(job.getTerraformRoot(), `api_gateway_${job.project.name}.tf`),
        {
            project: job.project,
            endpoints: endpoints,
            environment: job.environment
        }
    );
}

async function createEndpointFiles(job) {
    let endpoints = await Endpoint.query().where('project_id', job.project.id);
    let envVariables = await EnvironmentVariable.query()
        .where('project_id', job.project.id)
        .where('environment_id', job.environment.id);
    for (const row of endpoints) {
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
                }
            }
        )
    }
}

async function createPackages(job) {
    render(
        path.join(job.getTerraformTemplates(), 'packages.tf.twig'),
        path.join(job.getTerraformRoot(), `packages.tf`),
        {
            project: job.project,
            environment: job.environment,
            root: job.getPackagesRoot(),
            zip_file: path.join(job.getTmpRoot(), `packages.zip`)
        }
    )
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
                    attributes: JSON.parse(row.attributes)
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
        await createCertificate(job);
        await createApiGatewayFiles(job);
        await createEndpointFiles(job);
        await createPackages(job);
        await createDynamoDBFiles(job);
    }
}