const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const TemplateFile = require('template-file');
const { Function, Project, Endpoint } = require('../../../common/db');

async function updateTerraformFiles(job) {
    fs.copyFileSync(path.join(job.getTerraformTemplates(), 'iam.tf'), path.join(job.getTerraformRoot(), 'iam.tf'));
    fs.copyFileSync(path.join(job.getTerraformTemplates(), 'main.tf'), path.join(job.getTerraformRoot(), 'main.tf'));
    fs.copyFileSync(path.join(job.getTerraformTemplates(), 'terraform.tfvars'), path.join(job.getTerraformRoot(), 'terraform.tfvars'));
    fs.copyFileSync(path.join(job.getTerraformTemplates(), 'variables.tf'), path.join(job.getTerraformRoot(), 'variables.tf'));
    let newContent = await TemplateFile.renderFile(path.join(job.getTerraformRoot(), 'terraform.tfvars'), {
        aws: {
            region: job.environment.region,
            access_key: job.environment.access_key,
            secret_key: job.environment.secret_key
        }
    });
    fs.writeFileSync(path.join(job.getTerraformRoot(), 'terraform.tfvars'), newContent);
}

async function removeFiles(job) {
    for (const filePath of fs.readdirSync(job.getTerraformRoot())) {
        if (filePath.indexOf('lambda_') > -1 || filePath.indexOf('api_gateway_') > -1) {
            fs.unlinkSync(path.join(job.getTerraformRoot(), filePath));
        }
    }

    for (const folderPath of fs.readdirSync(job.getFunctionsRoot())) {
        rimraf.sync(path.join(job.getFunctionsRoot(), folderPath));
    }

    for (const folderPath of fs.readdirSync(job.getLayersRoot())) {
        rimraf.sync(path.join(job.getLayersRoot(), folderPath));
    }
}

async function createFunctionFiles(job) {
    let functions = await Function.query().where('project_id', job.project.id);
    let lambdaTemplate = path.join(job.getTerraformTemplates(), 'lambda.tf');
    for (const row of functions) {
        let functionFile = path.join(job.getTerraformRoot(), `lambda_${row.name}.tf`);
        fs.copyFileSync(lambdaTemplate, functionFile);
        let newContent = await TemplateFile.renderFile(functionFile, {
            function: {
                name: row.name,
                handler: row.handler,
                runtime: row.runtime,
                root: path.join(job.getFunctionsRoot(), row.name),
                zip_file: path.join(job.getTmpRoot(), `${row.name}.zip`)
            }
        });
        fs.writeFileSync(functionFile, newContent);
    }
}

async function createApiGatewayFiles(job) {
    let project = await Project.query().where('id', job.project.id).first();
    let apiTemplate = path.join(job.getTerraformTemplates(), 'api_gateway.tf');
    let apiFile = path.join(job.getTerraformRoot(), `api_gateway_${project.name}.tf`);
    fs.copyFileSync(apiTemplate, apiFile);
    let endpoints = await Endpoint.query().where('project_id', project.id);
    let newContent = await TemplateFile.renderFile(apiFile, {
        project: project,
        endpoints: endpoints,
        environment: job.environment
    });
    fs.writeFileSync(apiFile, newContent);
}

async function createEndpointFiles(job) {
    let endpoints = await Endpoint.query().where('project_id', job.project.id);
    let endpointTemplate = path.join(job.getTerraformTemplates(), 'endpoint.tf');
    for (const row of endpoints) {
        let endpointFile = path.join(job.getTerraformRoot(), `endpoint_${row.name}.tf`);
        fs.copyFileSync(endpointTemplate, endpointFile);
        let newContent = await TemplateFile.renderFile(endpointFile, {
            endpoint: {
                ...row,
                root: path.join(job.getFunctionsRoot(), row.name),
                zip_file: path.join(job.getTmpRoot(), `${row.name}.zip`)
            }
        });
        fs.writeFileSync(endpointFile, newContent);
    }
}

module.exports = {
    run: async (job) => {
        await removeFiles(job);
        await updateTerraformFiles(job);
        await createFunctionFiles(job);
        await createApiGatewayFiles(job);
        await createEndpointFiles(job);
    }
}