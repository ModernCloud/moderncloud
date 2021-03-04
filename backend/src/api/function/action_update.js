const Joi = require('joi');
const ApiAction = require('../action');
const ApiError = require('../error');
const { Function } = require('../../common/db');

class UpdateAction extends ApiAction
{
    async tryExecute() {
        this.function = null;
        await this.checkUser();
        await this.validateParams();
        await this.loadFunction();
        await this.updateFunction();
        return this.response.success({id: this.function.id}, 200);
    }

    async validateParams() {
        let schema = Joi.object({
            project_id: Joi.number().required(),
            name: Joi.string().alphanum().optional(),
            main_file: Joi.string().optional(),
            handler: Joi.string().optional(),
            runtime: Joi.string().optional(),
            code: Joi.string().optional()
        });
        this.validRequest = await schema.validateAsync(this.req.body || {});
    }

    async loadFunction() {
        this.function = await Function.query()
            .where('user_id', this.currentUser.id)
            .where('project_id', this.validRequest.project_id)
            .where('id', this.req.params.id)
            .first();
        if (!(this.function instanceof Function)) {
            throw new ApiError('Function not found!', 10503, 404);
        }
    }

    async updateFunction() {
        let updateParams = {};
        if (this.validRequest.name) {
            updateParams.name = this.validRequest.name;
        }
        if (this.validRequest.main_file) {
            updateParams.main_file = this.validRequest.main_file;
        }
        if (this.validRequest.handler) {
            updateParams.handler = this.validRequest.handler;
        }
        if (this.validRequest.runtime) {
            updateParams.runtime = this.validRequest.runtime;
        }
        if (this.validRequest.code) {
            updateParams.code = this.validRequest.code;
        }
        if (Object.keys(updateParams).length > 0) {
            await Function.query().where('id', this.function.id).update(updateParams);
        }
    }
}

module.exports = UpdateAction;