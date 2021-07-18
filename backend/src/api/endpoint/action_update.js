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
            user_name: Joi.string().optional().label('Name'),
            method: Joi.string().allow('GET', 'POST', 'PUT', 'DELETE').optional().label('Method'),
            runtime: Joi.string().allow('python3.8', 'nodejs14.x').required().label('Runtime'),
            path: Joi.string().optional().label('Path'),
            code: Joi.string().optional().label('Code'),
            description: Joi.string().optional().allow(null, '').label('Description'),
            memory_size: Joi.number().optional().default(128).min(128).max(10240).label('Memory Size'),
            timeout: Joi.number().optional().default(3).min(3).max(900).label('Timeout')
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
        if (this.validRequest.hasOwnProperty('user_name')) {
            updateParams.user_name = this.validRequest.user_name;
        }
        if (this.validRequest.hasOwnProperty('method')) {
            updateParams.method = this.validRequest.method;
        }
        if (this.validRequest.hasOwnProperty('path')) {
            updateParams.path = this.validRequest.path;
        }
        if (this.validRequest.hasOwnProperty('code')) {
            updateParams.code = this.validRequest.code;
        }
        if (this.validRequest.hasOwnProperty('description')) {
            updateParams.description = this.validRequest.description;
        }
        if (this.validRequest.hasOwnProperty('memory_size')) {
            updateParams.memory_size = this.validRequest.memory_size;
        }
        if (this.validRequest.hasOwnProperty('timeout')) {
            updateParams.timeout = this.validRequest.timeout;
        }
        if (Object.keys(updateParams).length > 0) {
            await Endpoint.query().where('id', this.endpoint.id).update(updateParams);
        }
    }
}

module.exports = UpdateAction;