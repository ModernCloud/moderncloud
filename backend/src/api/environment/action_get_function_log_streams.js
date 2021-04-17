const ApiAction = require('../action');
const ApiError = require('../error');
const { Environment, Project } = require('../../common/db');
const CloudwatchLogs = require('../../common/aws/cloudwatch_logs');

class GetAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.loadEnvironment();
        await this.loadProject();
        await this.loadLogStreams();
        return this.response.success({log_streams: this.logStreams}, 200);
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

    async loadProject() {
        this.project = await Project.query().where('id', this.environment.project_id).first();
        if (!(this.project instanceof Project)) {
            throw new ApiError('Project not found!', 10502, 404);
        }
    }

    async loadLogStreams() {
        if (this.environment.api_gateway_id == null) {
            this.logStreams = [];
            return;
        }
        let functionName = `${this.project.name}_${this.environment.name}_${this.req.params.function_name}`;
        let cloudwatchLogs = new CloudwatchLogs(this.environment);
        this.logStreams = await cloudwatchLogs.getLogStreams(functionName);
    }
}

module.exports = GetAction;