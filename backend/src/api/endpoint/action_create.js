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
            user_name: Joi.string().required().label('Name'),
            method: Joi.string().allow('GET', 'POST', 'PUT', 'DELETE').required().label('Method'),
            runtime: Joi.string().allow('python3.8', 'nodejs14.x').required().label('Runtime'),
            path: Joi.string().required().label('Path'),
            description: Joi.string().required().allow(null, '').label('Description'),
            memory_size: Joi.number().optional().default(128).min(128).max(10240).label('Memory Size'),
            timeout: Joi.number().optional().default(3).min(3).max(900).label('Timeout')
        });
        this.validRequest = await schema.validateAsync(this.req.body || {});
    }

    async createEndpoint() {
        let mainFile = 'index.js';
        let handler = 'index.handler';
        let code = `exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({"time": Date.now()}),
  }
}`;
        if (this.validRequest.runtime.indexOf('python') > -1) {
            mainFile = 'index.py';
            code = `
import json

def handler(event, context):
    message = "Hello World!"  
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({
            "Message ": message
        })
    }
`;
        }
        this.endpoint = await Endpoint.query().insert({
            user_id: this.currentUser.id,
            project_id: this.validRequest.project_id,
            user_name: this.validRequest.user_name,
            name: 'endpoint_function_' + Date.now(),
            main_file: mainFile,
            handler: handler,
            runtime: this.validRequest.runtime,
            code: code,
            method: this.validRequest.method,
            path: this.validRequest.path,
            description: this.validRequest.description,
            memory_size: this.validRequest.memory_size,
            timeout: this.validRequest.timeout
        });
    }
}

module.exports = CreateAction;