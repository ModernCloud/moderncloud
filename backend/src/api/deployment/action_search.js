const Joi = require('joi');
const { Deployment } = require('../../common/db');
const ApiAction = require('../action');

class SearchAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.validateParams();
        await this.loadDeployments();
        return this.response.success({deployments: this.deployments});
    }

    async validateParams() {
        let schema = Joi.object({
            project_id: Joi.number().required()
        });
        this.validRequest = await schema.validateAsync(this.req.query || {});
    }

    async loadDeployments() {
        this.deployments = await Deployment.query()
            .select('deployment.*')
            .select('environment.name AS environment_name')
            .join('environment', 'environment.id', 'environment_id')
            .where('deployment.user_id', this.currentUser.id)
            .where('deployment.project_id', this.validRequest.project_id)
            .orderBy('deployment.updated_at', 'desc');
    }
}

module.exports = SearchAction;