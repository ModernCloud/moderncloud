const Joi = require('joi');
const ApiAction = require('../action');
const { Environment, Deployment, DeploymentLog } = require('../../common/db');

class SearchAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.validateParams();
        await this.loadEnvironments();
        await this.loadLastDeployment();
        return this.response.success({environments: this.environments});
    }

    async validateParams() {
        let schema = Joi.object({
            project_id: Joi.number().required(),
            with_last_deployment: Joi.boolean().optional().default(false)
        });
        this.validRequest = await schema.validateAsync(this.req.query || {});
    }

    async loadEnvironments() {
        this.environments = await Environment.query()
            .where('user_id', this.currentUser.id)
            .where('project_id', this.validRequest.project_id)
            .orderBy('name');
    }

    async loadLastDeployment() {
        if (this.validRequest.with_last_deployment === false) {
            return;
        }
        for (const index in this.environments) {
            let deployment = await Deployment.query()
                .where('environment_id', this.environments[index].id)
                .orderBy('id', 'desc')
                .first();
            if (deployment instanceof Deployment) {
                deployment.logs = await DeploymentLog.query()
                    .where('deployment_id', deployment.id)
                    .orderBy('created_at');
            } else {
                deployment = null;
            }
            this.environments[index].last_deployment = deployment;
        }
    }
}

module.exports = SearchAction;