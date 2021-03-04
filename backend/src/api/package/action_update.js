const Joi = require('joi');
const ApiAction = require('../action');
const ApiError = require('../error');
const { Package } = require('../../common/db');

class UpdateAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.validateParams();
        await this.loadPackage();
        await this.updatePackage();
        return this.response.success({}, 200);
    }

    async validateParams() {
        let schema = Joi.object({
            project_id: Joi.number().required(),
            name: Joi.string().optional(),
            version: Joi.string().optional()
        });
        this.validRequest = await schema.validateAsync(this.req.body || {});
    }

    async loadPackage() {
        this.package = await Package.query()
            .where('user_id', this.currentUser.id)
            .where('project_id', this.validRequest.project_id)
            .where('id', this.req.params.id)
            .first();
        if (!(this.package instanceof Package)) {
            throw new ApiError('Package not found!', 10509, 404);
        }
    }

    async updatePackage() {
        let updateParams = {};
        if (this.validRequest.name) {
            updateParams.name = this.validRequest.name;
        }
        if (this.validRequest.version) {
            updateParams.version = this.validRequest.version;
        }
        if (Object.keys(updateParams).length > 0) {
            await Package.query().where('id', this.package.id).update(updateParams);
        }
    }
}

module.exports = UpdateAction;