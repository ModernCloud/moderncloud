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
            user_name: Joi.string().optional().label('Name'),
            main_file: Joi.string().optional().label('Main File'),
            handler: Joi.string().optional().label('Handler'),
            runtime: Joi.string().allow('python3.8', 'nodejs14.x').required().label('Runtime'),
            code: Joi.string().optional().label('Code'),
            description: Joi.string().optional().allow(null, '').label('Description'),
            memory_size: Joi.number().optional().default(128).min(128).max(10240).label('Memory Size'),
            timeout: Joi.number().optional().default(3).min(3).max(900).label('Timeout')
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
        if (this.validRequest.hasOwnProperty('user_name')) {
            updateParams.user_name = this.validRequest.user_name;
        }
        if (this.validRequest.hasOwnProperty('main_file')) {
            updateParams.main_file = this.validRequest.main_file;
        }
        if (this.validRequest.hasOwnProperty('handler')) {
            updateParams.handler = this.validRequest.handler;
        }
        if (this.validRequest.hasOwnProperty('runtime')) {
            updateParams.runtime = this.validRequest.runtime;
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
            await Function.query().where('id', this.function.id).update(updateParams);
        }
    }
}

module.exports = UpdateAction;