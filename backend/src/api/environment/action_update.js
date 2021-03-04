const Joi = require('joi');
const ApiAction = require('../action');
const ApiError = require('../error');
const { Environment } = require('../../common/db');

class UpdateAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.validateParams();
        await this.loadEnvironment();
        await this.updateEnvironment();
        return this.response.success({}, 200);
    }

    async validateParams() {
        let schema = Joi.object({
            project_id: Joi.number().required(),
            name: Joi.string().alphanum().optional(),
            region: Joi.string().optional(),
            access_key: Joi.string().optional(),
            secret_key: Joi.string().optional()
        });
        this.validRequest = await schema.validateAsync(this.req.body || {});
    }

    async loadEnvironment() {
        this.environment = await Environment.query()
            .where('user_id', this.currentUser.id)
            .where('project_id', this.validRequest.project_id)
            .where('id', this.req.params.id)
            .first();
        if (!(this.environment instanceof Environment)) {
            throw new ApiError('Environment not found!', 10504, 404);
        }
    }

    async updateEnvironment() {
        let updateParams = {};
        if (this.validRequest.name) {
            updateParams.name = this.validRequest.name;
        }
        if (this.validRequest.region) {
            updateParams.region = this.validRequest.region;
        }
        if (this.validRequest.access_key) {
            updateParams.access_key = this.validRequest.access_key;
        }
        if (this.validRequest.secret_key) {
            updateParams.secret_key = this.validRequest.secret_key;
        }
        if (Object.keys(updateParams).length > 0) {
            await Environment.query().where('id', this.environment.id).update(updateParams);
        }
    }
}

module.exports = UpdateAction;