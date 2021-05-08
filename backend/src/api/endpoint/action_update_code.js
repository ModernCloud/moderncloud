const Joi = require('joi');
const ApiAction = require('../action');
const { Endpoint } = require('../../common/db');

class UpdateAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.validateParams();
        await this.updateCode();
        return this.response.success({}, 200);
    }

    async validateParams() {
        let schema = Joi.object({
            project_id: Joi.number().required(),
            code: Joi.string().optional().allow(null, '').label('Code'),
        });
        this.validRequest = await schema.validateAsync(this.req.body || {});
    }

    async updateCode() {
        await Endpoint.query()
            .where('id', this.req.params.id)
            .where('user_id', this.currentUser.id)
            .where('project_id', this.validRequest.project_id)
            .update({code: this.validRequest.code});
    }
}

module.exports = UpdateAction;