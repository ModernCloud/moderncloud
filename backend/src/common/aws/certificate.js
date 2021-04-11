const { Environment } = require('../db');
const { ACM } = require("@aws-sdk/client-acm");

function delay(t, val) {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve(val);
        }, t);
    });
}

class Certificate {
    constructor(environment) {
        this.environment = environment;
        this.acmClient = new ACM({region: "us-east-1", credentials: {accessKeyId: environment.access_key, secretAccessKey: environment.secret_key}});
    }

    async requestCertificate() {
        let resultCertificate = await this.acmClient.requestCertificate({DomainName: this.environment.domain_name, ValidationMethod: 'DNS'});
        this.environment.certificate_arn = resultCertificate.CertificateArn;
        await this.updateDetails();
    }

    async updateDetails() {
        let resultDetail = await this.acmClient.describeCertificate({CertificateArn: this.environment.certificate_arn});
        this.environment.certificate_validation_options = JSON.stringify(resultDetail.Certificate.DomainValidationOptions[0]);
        await Environment.query().where('id', this.environment.id).update({
            certificate_arn: this.environment.certificate_arn,
            certificate_validation_options: this.environment.certificate_validation_options
        });
        if (resultDetail.Certificate.DomainValidationOptions[0].ResourceRecord === undefined) {
            await delay(2000);
            return await this.updateDetails();
        }
        return resultDetail;
    }

    async deleteCertificate() {
        await this.acmClient.deleteCertificate({CertificateArn: this.environment.certificate_arn});
    }
}

module.exports = Certificate;