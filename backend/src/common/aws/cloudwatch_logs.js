const { CloudWatchLogs } = require("@aws-sdk/client-cloudwatch-logs");

class CloudwatchService {
    constructor(environment) {
        this.environment = environment;
        this.awsClient = new CloudWatchLogs({region: environment.region, credentials: {accessKeyId: environment.access_key, secretAccessKey: environment.secret_key}});
    }

    async getLogStreams(functionName) {
        return this.awsClient.describeLogStreams({
            logGroupName: `/aws/lambda/${functionName}`,
            descending: true,
            orderBy: 'LastEventTime'
        });
    }

    async getStreamEvents(functionName, streamName) {
        return this.awsClient.getLogEvents({
            logGroupName: `/aws/lambda/${functionName}`,
            logStreamName: streamName
        });
    }
}

module.exports = CloudwatchService;