const Joi = require('joi');
const ApiAction = require('../action');
const { Environment } = require('../../common/db');

class CreateAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.validateParams();
        await this.createEnvironment();
        return this.response.success({id: this.environment.id}, 201);
    }

    async validateParams() {
        let schema = Joi.object({
            project_id: Joi.number().required(),
            name: Joi.string().alphanum().required(),
            region: Joi.string().required(),
            access_key: Joi.string().required(),
            secret_key: Joi.string().required()
        });
        this.validRequest = await schema.validateAsync(this.req.body || {});
    }

    async createEnvironment() {
        this.environment = await Environment.query().insert({
            user_id: this.currentUser.id,
            project_id: this.validRequest.project_id,
            name: this.validRequest.name,
            region: this.validRequest.region,
            access_key: this.validRequest.access_key,
            secret_key: this.validRequest.secret_key
        });
    }
}

module.exports = CreateAction;