const Joi = require('joi');
const ApiAction = require('../action');
const ApiError = require('../error');
const { Package, Project } = require('../../common/db');
const updatePackagesFolder = require('./update_packages_folder');

class CreateAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.validateParams();
        await this.loadProject();
        await this.createPackage();
        await updatePackagesFolder(this.package.project_id);
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

    async loadProject() {
        this.project = await Project.query()
            .where('user_id', this.currentUser.id)
            .where('id', this.validRequest.project_id)
            .first();
        if (!(this.project instanceof Project)) {
            throw new ApiError('Project not found!', 10502, 404);
        }
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