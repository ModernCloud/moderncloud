const Joi = require('joi');
const ApiAction = require('../action');
const { Package } = require('../../common/db');

class CountAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.validateParams();
        await this.calculateCount();
        return this.response.success({total: this.total});
    }

    async validateParams() {
        let schema = Joi.object({
            project_id: Joi.number().required(),
            file_id: Joi.number().allow(null).optional().default(null),
            file_type: Joi.string().allow('endpoint', 'function', null).optional().default(null)
        });
        this.validRequest = await schema.validateAsync(this.req.query || {});
    }

    async calculateCount() {
        this.total = await Package.query()
            .where('user_id', this.currentUser.id)
            .where('project_id', this.validRequest.project_id)
            .where('file_id', this.validRequest.file_id)
            .where('file_type', this.validRequest.file_type)
            .count();
        this.total = this.total[0].count;
    }
}

module.exports = CountAction;