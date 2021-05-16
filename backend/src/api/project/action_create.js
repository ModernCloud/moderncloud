const Joi = require('joi');
const ApiAction = require('../action');
const { Project, Environment, Endpoint, Function } = require('../../common/db');
const updatePackagesFolder = require('../package/update_packages_folder');

class CreateAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.validateParams();
        await this.createProject();
        await this.createDefaultEnvironments();
        await this.createDefaultEndpoints();
        await this.createDefaultFunctions();
        await updatePackagesFolder(this.project.id);
        return this.response.success({id: this.project.id}, 201);
    }

    async validateParams() {
        let schema = Joi.object({
            name: Joi.string().alphanum().required().label('Name'),
        });
        this.validRequest = await schema.validateAsync(this.req.body || {});
    }

    async createProject() {
        this.project = await Project.query().insert({
            user_id: this.currentUser.id,
            name: this.validRequest.name
        });
    }

    async createDefaultEnvironments() {
        await Environment.query().insert({
            user_id: this.currentUser.id,
            project_id: this.project.id,
            name: 'dev',
            region: 'us-east-1'
        });
        await Environment.query().insert({
            user_id: this.currentUser.id,
            project_id: this.project.id,
            name: 'prod',
            region: 'us-east-1'
        });
    }

    async createDefaultEndpoints() {
        await Endpoint.query().insert({
            user_id: this.currentUser.id,
            project_id: this.project.id,
            user_name: 'Hello World',
            name: 'endpoint_function_' + Date.now(),
            main_file: 'index.js',
            handler: 'index.handler',
            runtime: 'nodejs14.x',
            code: `exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({time: Date.now(), message: "my-endpoint"}),
  }
}`,
            method: 'GET',
            path: '/hello-world'
        });
    }

    async createDefaultFunctions() {
        await Function.query().insert({
            user_id: this.currentUser.id,
            project_id: this.project.id,
            name: 'my-function',
            main_file: 'index.js',
            handler: 'index.handler',
            runtime: 'nodejs14.x',
            code: `exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({time: Date.now(), message: "my-function"}),
  }
}`,
        });
    }
}

module.exports = CreateAction;