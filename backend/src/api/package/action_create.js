const Joi = require('joi');
const ApiAction = require('../action');
const { Package } = require('../../common/db');

class CreateAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.validateParams();
        await this.createPackage();
        return this.response.success({id: this.package.id}, 201);
    }

    async validateParams() {
        let schema = Joi.object({
            project_id: Joi.number().required(),
            name: Joi.string().required().label('Name'),
            version: Joi.string().optional().default('*').label('Version'),
            file_id: Joi.number().allow(null).optional().default(null),
            file_type: Joi.string().allow('endpoint', 'function', null).optional().default(null)
        });
        this.validRequest = await schema.validateAsync(this.req.body || {});
    }

    async createPackage() {
        this.package = await Package.query().insert({
            user_id: this.currentUser.id,
            project_id: this.validRequest.project_id,
            name: this.validRequest.name,
            version: this.validRequest.version,
            file_id: this.validRequest.file_id,
            file_type: this.validRequest.file_type
        });
    }
}

module.exports = CreateAction;