const Joi = require('joi');
const ApiAction = require('../action');
const { Dynamodb } = require('../../common/db');

class SearchAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.validateParams();
        await this.loadTables();
        return this.response.success({tables: this.tables});
    }

    async validateParams() {
        let schema = Joi.object({
            project_id: Joi.number().required()
        });
        this.validRequest = await schema.validateAsync(this.req.query || {});
    }

    async loadTables() {
        this.tables = await Dynamodb.query()
            .where('user_id', this.currentUser.id)
            .where('project_id', this.validRequest.project_id)
            .orderBy('name');
    }
}

module.exports = SearchAction;