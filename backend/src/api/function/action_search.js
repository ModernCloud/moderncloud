const Joi = require('joi');
const ApiAction = require('../action');
const { Function } = require('../../common/db');

class SearchAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.validateParams();
        await this.loadFunctions();
        return this.response.success({functions: this.functions});
    }

    async validateParams() {
        let schema = Joi.object({
            project_id: Joi.number().required()
        });
        this.validRequest = await schema.validateAsync(this.req.query || {});
    }

    async loadFunctions() {
        this.functions = await Function.query()
            .where('user_id', this.currentUser.id)
            .where('project_id', this.validRequest.project_id)
            .orderBy('user_name');
    }
}

module.exports = SearchAction;