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
        await this.loadLogEvents();
        return this.response.success({log_events: this.logEvents}, 200);
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

    async loadLogEvents() {
        if (this.environment.api_gateway_id == null) {
            this.logEvents = [];
            return;
        }
        let functionName = `${this.project.name}_${this.environment.name}_${this.req.params.function_name}`;
        let cloudwatchLogs = new CloudwatchLogs(this.environment);
        this.logEvents = await cloudwatchLogs.getStreamEvents(functionName, Buffer.from(this.req.params.stream_name, 'base64').toString());
    }
}

module.exports = GetAction;