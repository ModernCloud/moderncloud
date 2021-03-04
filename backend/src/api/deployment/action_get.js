const ApiAction = require('../action');
const ApiError = require('../error');
const { Deployment, DeploymentLog } = require('../../common/db');

class GetAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.loadDeployment();
        await this.loadLogs();
        return this.response.success({deployment: this.deployment, logs: this.logs});
    }

    async loadDeployment() {
        this.deployment = await Deployment.query()
            .where('user_id', this.currentUser.id)
            .where('id', this.req.params.id)
            .first();
        if (!(this.deployment instanceof Deployment)) {
            throw new ApiError('Deployment not found!', 10505, 404);
        }
    }

    async loadLogs() {
        this.logs = await DeploymentLog.query()
            .where('deployment_id', this.deployment.id)
            .orderBy('created_at');
    }
}

module.exports = GetAction;