const Joi = require('joi');
const ApiAction = require('../action');
const { Project } = require('../../common/db');

class CreateAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.validateParams();
        await this.createProject();
        return this.response.success({id: this.project.id}, 201);
    }

    async validateParams() {
        let schema = Joi.object({
            name: Joi.string().alphanum().required(),
        });
        this.validRequest = await schema.validateAsync(this.req.body || {});
    }

    async createProject() {
        this.project = await Project.query().insert({
            user_id: this.currentUser.id,
            name: this.validRequest.name
        });
    }
}

module.exports = CreateAction;