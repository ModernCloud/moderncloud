const { S3 } = require("@aws-sdk/client-s3");

class S3Service {
    constructor(environment) {
        this.environment = environment;
        this.awsClient = new S3({
            region: environment.region,
            credentials: {accessKeyId: environment.access_key, secretAccessKey: environment.secret_key}
        });
    }

    async create(bucketName) {
        return await this.awsClient.createBucket({
            Bucket: bucketName
        });
    }
}

module.exports = S3Service;