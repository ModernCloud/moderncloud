const ApiAction = require('../action');
const ApiError = require('../error');
const { Environment } = require('../../common/db');
const CloudwatchLogs = require('../../common/aws/cloudwatch_logs');

class GetAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.loadEnvironment();
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

    async loadLogStreams() {
        if (this.environment.api_gateway_id == null) {
            this.logStreams = [];
            return;
        }
        let cloudwatchLogs = new CloudwatchLogs(this.environment);
        this.logStreams = await cloudwatchLogs.getLogStreams(this.req.params.function_name);
    }
}

module.exports = GetAction;