const Joi = require('joi');
const ApiAction = require('../action');
const { Environment, Task, TaskLog } = require('../../common/db');

class SearchAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.validateParams();
        await this.loadEnvironments();
        return this.response.success({environments: this.environments});
    }

    async validateParams() {
        let schema = Joi.object({
            project_id: Joi.number().required(),
            with_last_deployment: Joi.boolean().optional().default(false),
            with_last_success_deployment: Joi.boolean().optional().default(false)
        });
        this.validRequest = await schema.validateAsync(this.req.query || {});
    }

    async loadEnvironments() {
        this.environments = await Environment.query()
            .where('user_id', this.currentUser.id)
            .where('project_id', this.validRequest.project_id)
            .orderBy('name');
        for (const index in this.environments) {
            if (this.environments[index].output == null) {
                this.environments[index].output = {};
            }
            await this.loadLastDeployment(index);
            await this.loadLastSuccessDeployment(index);
        }
    }

    async loadLastDeployment(index) {
        if (this.validRequest.with_last_deployment === false) {
            return;
        }
        let deployment = await Task.query()
            .where('user_id', this.currentUser.id)
            .where('environment_id', this.environments[index].id)
            .whereIn('name', ['deploy', 'destroy'])
            .orderBy('id', 'desc')
            .first();
        if (deployment instanceof Task) {
            deployment.logs = await TaskLog.query()
                .where('task_id', deployment.id)
                .orderBy('created_at');
        } else {
            deployment = null;
        }
        this.environments[index].last_deployment = deployment;
    }

    async loadLastSuccessDeployment(index) {
        if (this.validRequest.with_last_success_deployment === false) {
            return;
        }
        let deployment = await Task.query()
            .where('user_id', this.currentUser.id)
            .where('environment_id', this.environments[index].id)
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
        this.environments[index].last_success_deployment = deployment;
    }
}

module.exports = SearchAction;