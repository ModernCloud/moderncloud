const Joi = require('joi');
const ApiAction = require('../action');
const ApiError = require('../error');
const { Project } = require('../../common/db');

class UpdateAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.validateParams();
        await this.loadProject();
        await this.updateProject();
        return this.response.success({});
    }

    async validateParams() {
        let schema = Joi.object({
            name: Joi.string().alphanum().optional().label('Name'),
        });
        this.validRequest = await schema.validateAsync(this.req.body || {});
    }

    async loadProject() {
        this.project = await Project.query()
            .where('user_id', this.currentUser.id)
            .where('id', this.req.params.id)
            .first();
        if (!(this.project instanceof Project)) {
            throw new ApiError('Project not found!', 10502, 404);
        }
    }

    async updateProject() {
        let updateParams = {};
        if (this.validRequest.hasOwnProperty('name')) {
            updateParams.name = this.validRequest.name;
        }
        if (Object.keys(updateParams).length > 0) {
            await Project.query().where('id', this.project.id).update(updateParams);
        }
    }
}

module.exports = UpdateAction;