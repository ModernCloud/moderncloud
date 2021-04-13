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
            version: Joi.string().optional().default('*').label('Version')
        });
        this.validRequest = await schema.validateAsync(this.req.body || {});
    }

    async createPackage() {
        this.package = await Package.query().insert({
            user_id: this.currentUser.id,
            project_id: this.validRequest.project_id,
            name: this.validRequest.name,
            version: this.validRequest.version
        });
    }
}

module.exports = CreateAction;