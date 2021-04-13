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
            description: Joi.string().required().allow(null, '').label('Description'),
            memory_size: Joi.number().optional().default(128).min(128).max(10240).label('Memory Size'),
            timeout: Joi.number().optional().default(3).min(3).max(900).label('Timeout')
        });
        this.validRequest = await schema.validateAsync(this.req.body || {});
    }

    async createFunction() {
        this.function = await Function.query().insert({
            user_id: this.currentUser.id,
            project_id: this.validRequest.project_id,
            user_name: this.validRequest.user_name,
            name: 'function_' + Date.now(),
            description: this.validRequest.description,
            memory_size: this.validRequest.memory_size,
            timeout: this.validRequest.timeout,
            main_file: 'index.js',
            handler: 'index.handler',
            runtime: 'nodejs14.x',
            code: `exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({"time": Date.now()}),
  }
}`,
        });
    }
}

module.exports = CreateAction;