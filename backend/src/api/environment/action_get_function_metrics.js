const moment = require('moment');
const ApiAction = require('../action');
const ApiError = require('../error');
const { Environment } = require('../../common/db');
const Cloudwatch = require('../../common/aws/cloudwatch');

class GetAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.loadEnvironment();
        await this.loadMetrics();
        return this.response.success({metrics: this.metrics}, 200);
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

    async loadMetrics() {
        if (this.environment.api_gateway_id == null) {
            this.metrics = {};
            return;
        }
        let timeRange = [moment().subtract(this.req.query.time_period ?? 1, 'hours'), moment()];
        let cloudwatch = new Cloudwatch(this.environment);
        let [invocations, errors, concurrency, duration] = await Promise.all([
            cloudwatch.getInvocationMetrics(this.req.params.function_name, 60, timeRange),
            cloudwatch.getErrorsMetrics(this.req.params.function_name, 60, timeRange),
            cloudwatch.getConcurrencyMetrics(this.req.params.function_name, 60, timeRange),
            cloudwatch.getDurationMetrics(this.req.params.function_name, 60, timeRange),
        ]);
        this.metrics = {
            invocations: invocations,
            errors: errors,
            concurrency: concurrency,
            duration: duration
        };
    }
}

module.exports = GetAction;