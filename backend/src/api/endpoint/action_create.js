const Joi = require('joi');
const ApiAction = require('../action');
const { Endpoint } = require('../../common/db');

class CreateAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.validateParams();
        await this.createEndpoint();
        return this.response.success({id: this.endpoint.id}, 201);
    }

    async validateParams() {
        let schema = Joi.object({
            project_id: Joi.number().required(),
            user_name: Joi.string().required(),
            method: Joi.string().allow('GET', 'POST', 'PUT', 'DELETE').required(),
            path: Joi.string().required()
        });
        this.validRequest = await schema.validateAsync(this.req.body || {});
    }

    async createEndpoint() {
        this.endpoint = await Endpoint.query().insert({
            user_id: this.currentUser.id,
            project_id: this.validRequest.project_id,
            user_name: this.validRequest.user_name,
            name: 'endpoint_function_' + Date.now(),
            main_file: 'index.js',
            handler: 'index.handler',
            runtime: 'nodejs14.x',
            code: `exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({"time": Date.now()}),
  }
}`,
            method: this.validRequest.method,
            path: this.validRequest.path
        });
    }
}

module.exports = CreateAction;