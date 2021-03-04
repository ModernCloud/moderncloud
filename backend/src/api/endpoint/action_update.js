const Joi = require('joi');
const ApiAction = require('../action');
const ApiError = require('../error');
const { Endpoint } = require('../../common/db');

class UpdateAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.validateParams();
        await this.loadEndpoint();
        await this.updateEndpoint();
        return this.response.success({}, 200);
    }

    async validateParams() {
        let schema = Joi.object({
            project_id: Joi.number().required(),
            method: Joi.string().allow('GET', 'POST', 'PUT', 'DELETE').optional(),
            path: Joi.string().optional(),
            code: Joi.string().optional()
        });
        this.validRequest = await schema.validateAsync(this.req.body || {});
    }

    async loadEndpoint() {
        this.endpoint = await Endpoint.query()
            .where('user_id', this.currentUser.id)
            .where('project_id', this.validRequest.project_id)
            .where('id', this.req.params.id)
            .first();
        if (!(this.endpoint instanceof Endpoint)) {
            throw new ApiError('Endpoint not found!', 10508, 404);
        }
    }

    async updateEndpoint() {
        let updateParams = {};
        if (this.validRequest.method) {
            updateParams.method = this.validRequest.method;
        }
        if (this.validRequest.path) {
            updateParams.path = this.validRequest.path;
        }
        if (this.validRequest.code) {
            updateParams.code = this.validRequest.code;
        }
        if (Object.keys(updateParams).length > 0) {
            await Endpoint.query().where('id', this.endpoint.id).update(updateParams);
        }
    }
}

module.exports = UpdateAction;