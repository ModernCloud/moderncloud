const Joi = require('joi');
const ApiAction = require('../action');
const { Function } = require('../../common/db');

class CreateAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.validateParams();
        await this.createFunction();
        return this.response.success({id: this.function.id}, 201);
    }

    async validateParams() {
        let schema = Joi.object({
            project_id: Joi.number().required(),
            user_name: Joi.string().required().label('Name'),
            runtime: Joi.string().allow('python3.8', 'nodejs14.x').required().label('Runtime'),
            description: Joi.string().required().allow(null, '').label('Description'),
            memory_size: Joi.number().optional().default(128).min(128).max(10240).label('Memory Size'),
            timeout: Joi.number().optional().default(3).min(3).max(900).label('Timeout')
        });
        this.validRequest = await schema.validateAsync(this.req.body || {});
    }

    async createFunction() {
        let mainFile = 'index.js';
        let handler = 'index.handler';
        let code = `
exports.handler = (event, context, callback) => {
   console.log("Received event: ", event);
   callback(null, {
       "greetings": "Hello World!"
   });
}`;
        if (this.validRequest.runtime.indexOf('python') > -1) {
            mainFile = 'index.py';
            code = `
def lambda_handler(event, context):
    print("Received event: ", event)
    return {
        "greetings": "Hello World!"
    }`;
        }
        this.function = await Function.query().insert({
            user_id: this.currentUser.id,
            project_id: this.validRequest.project_id,
            user_name: this.validRequest.user_name,
            name: 'function_' + Date.now(),
            description: this.validRequest.description,
            memory_size: this.validRequest.memory_size,
            timeout: this.validRequest.timeout,
            main_file: mainFile,
            handler: handler,
            runtime: this.validRequest.runtime,
            code: code
        });
    }
}

module.exports = CreateAction;