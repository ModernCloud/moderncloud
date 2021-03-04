const Joi = require('joi');
const ApiAction = require('../action');
const { Environment } = require('../../common/db');

class SearchAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.validateParams();
        await this.loadEnvironments();
        return this.response.success({environments: this.environments});
    }

    async validateParams() {
        let schema = Joi.object({
            project_id: Joi.number().required()
        });
        this.validRequest = await schema.validateAsync(this.req.query || {});
    }

    async loadEnvironments() {
        this.environments = await Environment.query()
            .where('user_id', this.currentUser.id)
            .where('project_id', this.validRequest.project_id)
            .orderBy('name');
    }
}

module.exports = SearchAction;