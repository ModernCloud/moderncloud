const ApiAction = require('../action');
const ApiError = require('../error');
const { Environment } = require('../../common/db');
const CloudwatchLogs = require('../../common/aws/cloudwatch_logs');

class GetAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.loadEnvironment();
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

    async loadLogEvents() {
        let cloudwatchLogs = new CloudwatchLogs(this.environment);
        this.logEvents = await cloudwatchLogs.getStreamEvents(this.req.params.function_name, this.req.params.stream_name);
    }
}

module.exports = GetAction;