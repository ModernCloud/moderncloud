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
            name: Joi.string().alphanum().required()
        });
        this.validRequest = await schema.validateAsync(this.req.body || {});
    }

    async createFunction() {
        this.function = await Function.query().insert({
            user_id: this.currentUser.id,
            project_id: this.validRequest.project_id,
            name: this.validRequest.name,
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