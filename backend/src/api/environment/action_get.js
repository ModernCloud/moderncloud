const ApiAction = require('../action');
const ApiError = require('../error');
const { Environment, Task, TaskLog } = require('../../common/db');
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
        if (this.environment.output == null) {
            this.environment.output = {};
        }
    }

    async loadLastSuccessDeployment() {
        if (this.req.query.hasOwnProperty('with_last_success_deployment') === false) {
            return;
        }
        let deployment = await Task.query()
            .where('user_id', this.currentUser.id)
            .where('environment_id', this.environment.id)
            .whereIn('name', ['deploy', 'destroy'])
            .where('current_status', 1)
            .orderBy('id', 'desc')
            .first();
        if (deployment instanceof Task) {
            deployment.logs = await TaskLog.query()
                .where('task_id', deployment.id)
                .orderBy('created_at');
        } else {
            deployment = null;
        }
        this.environment.last_success_deployment = deployment;
    }
}

module.exports = GetAction;