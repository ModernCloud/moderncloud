const { Environment } = require('../db');
const { APIGateway } = require("@aws-sdk/client-api-gateway");

class Client {
    constructor(environment) {
        this.environment = environment;
        this.apiGatewayClient = new APIGateway({
            region: environment.region,
            credentials: {
                accessKeyId: environment.access_key,
                secretAccessKey: environment.secret_key
            }
        });
    }

    async setDomain() {
        let DomainName = await this.apiGatewayClient.createDomainName({
            domainName: this.environment.domain_name,
            certificateArn: this.environment.certificate_arn
        });
        let BasePath = await this.apiGatewayClient.createBasePathMapping({
            domainName: this.environment.domain_name,
            restApiId: this.environment.api_gateway_id,
            stage: this.environment.name
        });
        await Environment.query().where('id', this.environment.id).update({
            cloudfront_domain_name: DomainName.distributionDomainName
        });
        return {
            domain: DomainName,
            basePath: BasePath
        }
    }

    async deleteDomain() {
        await this.apiGatewayClient.deleteBasePathMapping({
            basePath: '(none)',
            domainName: this.environment.domain_name
        });
        await this.apiGatewayClient.deleteDomainName({
            domainName: this.environment.domain_name
        });
    }
}

module.exports = Client;