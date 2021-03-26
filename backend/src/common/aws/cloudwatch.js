const { CloudWatch } = require("@aws-sdk/client-cloudwatch");

class CloudwatchService {
    constructor(environment) {
        this.environment = environment;
        this.awsClient = new CloudWatch({region: environment.region, credentials: {accessKeyId: environment.access_key, secretAccessKey: environment.secret_key}});
    }

    async getInvocationMetrics(functionName, periodInSeconds, timeRange) {
        return this.awsClient.getMetricData({
            MetricDataQueries: [
                {
                    Id: 'functionMetrics',
                    MetricStat: {
                        Metric: {
                            Dimensions: [
                                {Name: 'FunctionName', Value: functionName}
                            ],
                            MetricName: 'Invocations',
                            Namespace: 'AWS/Lambda'
                        },
                        Period: 300,
                        Stat: 'Sum'
                    }
                },
            ],
            StartTime: timeRange[0].toDate(),
            EndTime: timeRange[1].toDate()
        });
    }

    async getErrorsMetrics(functionName, periodInSeconds, timeRange) {
        return this.awsClient.getMetricData({
            MetricDataQueries: [
                {
                    Id: 'functionMetrics',
                    MetricStat: {
                        Metric: {
                            Dimensions: [
                                {Name: 'FunctionName', Value: functionName}
                            ],
                            MetricName: 'Errors',
                            Namespace: 'AWS/Lambda'
                        },
                        Period: 300,
                        Stat: 'Sum'
                    }
                },
            ],
            StartTime: timeRange[0].toDate(),
            EndTime: timeRange[1].toDate()
        });
    }

    async getDurationMetrics(functionName, periodInSeconds, timeRange) {
        return this.awsClient.getMetricData({
            MetricDataQueries: [
                {
                    Id: 'functionMetrics',
                    MetricStat: {
                        Metric: {
                            Dimensions: [
                                {Name: 'FunctionName', Value: functionName}
                            ],
                            MetricName: 'Duration',
                            Namespace: 'AWS/Lambda'
                        },
                        Period: 300,
                        Stat: 'Average'
                    }
                },
            ],
            StartTime: timeRange[0].toDate(),
            EndTime: timeRange[1].toDate()
        });
    }

    async getConcurrencyMetrics(functionName, periodInSeconds, timeRange) {
        return this.awsClient.getMetricData({
            MetricDataQueries: [
                {
                    Id: 'functionMetrics',
                    MetricStat: {
                        Metric: {
                            Dimensions: [
                                {Name: 'FunctionName', Value: functionName}
                            ],
                            MetricName: 'ConcurrentExecutions',
                            Namespace: 'AWS/Lambda'
                        },
                        Period: 300,
                        Stat: 'Average'
                    }
                },
            ],
            StartTime: timeRange[0].toDate(),
            EndTime: timeRange[1].toDate()
        });
    }
}

module.exports = CloudwatchService;