const ApiAction = require('../action');
const ApiError = require('../error');
const { Environment, Deployment, DeploymentLog } = require('../../common/db');
const Certificate = require('../../common/aws/certificate');

class GetAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.loadEnvironment();
        await this.loadLastSuccessDeployment();
        if (this.req.query.hasOwnProperty('refresh_certificate_validation_options')
            && this.req.query.refresh_certificate_validation_options) {
            await (new Certificate(this.environment)).updateDetails();
        }
        return this.response.success({environment: this.environment}, 200);
    }

    async loadEnvironment() {
        this.environment = await Environment.query()
            .where('user_id', this.currentUser.id)
            .where('id', this.req.params.id)
            .first();
        if (!(this.environment instanceof Environment)) {
            throw new ApiError('Environment not found!', 10504, 404);
        }
    }

    async loadLastSuccessDeployment() {
        if (this.req.query.hasOwnProperty('with_last_success_deployment') === false) {
            return;
        }
        let deployment = await Deployment.query()
            .where('environment_id', this.environment.id)
            .where('current_status', 1)
            .orderBy('id', 'desc')
            .first();
        if (deployment instanceof Deployment) {
            deployment.logs = await DeploymentLog.query()
                .where('deployment_id', deployment.id)
                .orderBy('created_at');
            deployment.output = JSON.parse(deployment.output) ?? {};
        } else {
            deployment = null;
        }
        this.environment.last_success_deployment = deployment;
    }
}

module.exports = GetAction;