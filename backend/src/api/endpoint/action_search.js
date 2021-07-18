const Joi = require('joi');
const ApiAction = require('../action');
const { Endpoint } = require('../../common/db');

class SearchAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.validateParams();
        await this.loadEndpoints();
        return this.response.success({endpoints: this.endpoints});
    }

    async validateParams() {
        let schema = Joi.object({
            project_id: Joi.number().required()
        });
        this.validRequest = await schema.validateAsync(this.req.query || {});
    }

    async loadEndpoints() {
        this.endpoints = await Endpoint.query()
            .where('user_id', this.currentUser.id)
            .where('project_id', this.validRequest.project_id)
            .orderBy('user_name');
    }
}

module.exports = SearchAction;