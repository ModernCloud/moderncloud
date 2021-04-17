const moment = require('moment');
const ApiAction = require('../action');
const ApiError = require('../error');
const { Environment, Project } = require('../../common/db');
const Cloudwatch = require('../../common/aws/cloudwatch');

class GetAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.loadEnvironment();
        await this.loadProject();
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

    async loadProject() {
        this.project = await Project.query().where('id', this.environment.project_id).first();
        if (!(this.project instanceof Project)) {
            throw new ApiError('Project not found!', 10502, 404);
        }
    }

    async loadMetrics() {
        if (this.environment.api_gateway_id == null) {
            this.metrics = {};
            return;
        }
        let functionName = `${this.project.name}_${this.environment.name}_${this.req.params.function_name}`;
        let timeRange = [moment().subtract(this.req.query.time_period ?? 1, 'hours'), moment()];
        let cloudwatch = new Cloudwatch(this.environment);
        let [invocations, errors, concurrency, duration] = await Promise.all([
            cloudwatch.getInvocationMetrics(functionName, 60, timeRange),
            cloudwatch.getErrorsMetrics(functionName, 60, timeRange),
            cloudwatch.getConcurrencyMetrics(functionName, 60, timeRange),
            cloudwatch.getDurationMetrics(functionName, 60, timeRange),
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