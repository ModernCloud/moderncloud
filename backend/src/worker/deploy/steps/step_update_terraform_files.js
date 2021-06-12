const path = require('path');
const fs = require('fs');
const get = require('lodash/get');
const rimraf = require('rimraf');
const { Function, Endpoint, Package, EnvironmentVariable, Dynamodb } = require('../../../common/db');
const render = require('../../../common/template/render');

class StepUpdateTerraformFiles {
    constructor(workerTask) {
        this.workerTask = workerTask;
    }

    static factory(workerTask) {
        return new StepUpdateTerraformFiles(workerTask);
    }

    async run() {
        await this.removeFiles();
        await this.updateTerraformFiles();
        await this.createFunctionFiles();
        await this.createApiGatewayFiles();
        await this.createEndpointFiles();
        await this.createDynamoDBFiles();
    }

    async removeFiles() {
        for (const filePath of fs.readdirSync(this.workerTask.getTerraformRoot())) {
            let extension = filePath.split('.').pop();
            if (['tf', 'tfvars'].indexOf(extension) > -1) {
                fs.unlinkSync(path.join(this.workerTask.getTerraformRoot(), filePath));
            }
        }

        for (const folderPath of fs.readdirSync(this.workerTask.getFunctionsRoot())) {
            rimraf.sync(path.join(this.workerTask.getFunctionsRoot(), folderPath));
        }

        for (const folderPath of fs.readdirSync(this.workerTask.getEndpointsRoot())) {
            rimraf.sync(path.join(this.workerTask.getEndpointsRoot(), folderPath));
        }

        for (const folderPath of fs.readdirSync(this.workerTask.getTmpRoot())) {
            rimraf.sync(path.join(this.workerTask.getTmpRoot(), folderPath));
        }
    }

    async updateTerraformFiles() {
        render(
            path.join(this.workerTask.getTerraformTemplates(), 'main.tf.twig'),
            path.join(this.workerTask.getTerraformRoot(), 'main.tf'),
            {
                terraform_s3_bucket: this.workerTask.environment.terraform_s3_bucket
            }
        );
        fs.copyFileSync(path.join(this.workerTask.getTerraformTemplates(), 'iam.tf'), path.join(this.workerTask.getTerraformRoot(), 'iam.tf'));
        fs.copyFileSync(path.join(this.workerTask.getTerraformTemplates(), 'variables.tf'), path.join(this.workerTask.getTerraformRoot(), 'variables.tf'));
    }

    async createFunctionFiles() {
        let functions = await Function.query().where('project_id', this.workerTask.project.id);
        let envVariables = await EnvironmentVariable.query()
            .where('project_id', this.workerTask.project.id)
            .where('environment_id', this.workerTask.environment.id);
        for (const row of functions) {
            let hasPackage = await this.createLambdaPackages(row);
            render(
                path.join(this.workerTask.getTerraformTemplates(), 'lambda.tf.twig'),
                path.join(this.workerTask.getTerraformRoot(), `${row.name}.tf`),
                {
                    project: this.workerTask.project,
                    environment: {
                        ...this.workerTask.environment,
                        variables: envVariables
                    },
                    function: {
                        ...row,
                        root: path.join(this.workerTask.getFunctionsRoot(), row.name),
                        zip_file: path.join(this.workerTask.getTmpRoot(), `${row.name}.zip`)
                    },
                    hasPackage: hasPackage
                }
            );
        }
    }

    async createApiGatewayFiles() {
        let endpoints = await Endpoint.query().where('project_id', this.workerTask.project.id);
        render(
            path.join(this.workerTask.getTerraformTemplates(), 'api_gateway.tf.twig'),
            path.join(this.workerTask.getTerraformRoot(), `api_gateway_${this.workerTask.project.name}.tf`),
            {
                project: this.workerTask.project,
                endpoints: endpoints,
                environment: this.workerTask.environment,
                hasValidCertificate: get(this.workerTask.environment, 'certificate_validation_options.ValidationStatus', 'PENDING_VALIDATION') === 'SUCCESS'
            }
        );
    }

    async createEndpointFiles() {
        let endpoints = await Endpoint.query().where('project_id', this.workerTask.project.id);
        let envVariables = await EnvironmentVariable.query()
            .where('project_id', this.workerTask.project.id)
            .where('environment_id', this.workerTask.environment.id);
        for (const row of endpoints) {
            let hasPackage = await this.createLambdaPackages(row);
            render(
                path.join(this.workerTask.getTerraformTemplates(), 'endpoint.tf.twig'),
                path.join(this.workerTask.getTerraformRoot(), `${row.name}.tf`),
                {
                    project: this.workerTask.project,
                    environment: {
                        ...this.workerTask.environment,
                        variables: envVariables
                    },
                    endpoint: {
                        ...row,
                        root: path.join(this.workerTask.getEndpointsRoot(), row.name),
                        zip_file: path.join(this.workerTask.getTmpRoot(), `${row.name}.zip`)
                    },
                    hasPackage: hasPackage
                }
            )
        }
    }

    async createLambdaPackages(lambdaRow) {
        let hasPackage = await Package.query()
            .where('project_id', this.workerTask.project.id)
            .where('file_id', lambdaRow.id)
            .where('file_type', lambdaRow instanceof Endpoint ? 'endpoint' : 'function')
            .count() > 0;
        if (hasPackage) {
            let layerName = `${this.workerTask.project.name}_${this.workerTask.environment.name}_${lambdaRow.name}`;
            render(
                path.join(this.workerTask.getTerraformTemplates(), 'packages.tf.twig'),
                path.join(this.workerTask.getTerraformRoot(), `${layerName}_packages.tf`),
                {
                    layer_name: layerName,
                    root: this.workerTask.getLambdaPackagesRoot(lambdaRow.name),
                    zip_file: path.join(this.workerTask.getTmpRoot(), `${layerName}_packages.zip`)
                }
            )
        }
        return hasPackage;
    }

    async createDynamoDBFiles() {
        let tables = await Dynamodb.query().where('project_id', this.workerTask.project.id);
        for (const row of tables) {
            render(
                path.join(this.workerTask.getTerraformTemplates(), 'dynamodb.tf.twig'),
                path.join(this.workerTask.getTerraformRoot(), `dynamodb_${row.name}.tf`),
                {
                    project: this.workerTask.project,
                    environment: this.workerTask.environment,
                    table: {
                        ...row,
                        attributes: row.attributes
                    }
                }
            )
        }
    }
}

module.exports = StepUpdateTerraformFiles;