const ApiAction = require('../action');
const ApiError = require('../error');
const { Environment } = require('../../common/db');
const Certificate = require('../../common/aws/certificate');
const ApiGateway = require('../../common/aws/api_gateway');

class DeleteDomainAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.loadEnvironment();
        await this.validateEnvironment();
        await this.deleteResources();
        return this.response.success({}, 200);
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

    async validateEnvironment() {
        if (this.environment.domain_name == null || this.environment.certificate_arn == null) {
            throw new ApiError('Domain not found!', 10513, 404);
        }
        if (this.environment.access_key == null || this.environment.secret_key == null) {
            throw new ApiError('Please set AWS credentials!', 10512, 400);
        }
    }

    async deleteResources() {
        try {
            await (new ApiGateway(this.environment)).deleteDomain();
        } catch (e) {
            if (e.message !== 'Invalid domain name identifier specified') {
                throw e;
            }
        }
        try {
            await (new Certificate(this.environment)).deleteCertificate();
        } catch (e) {
            if (e.name === 'ResourceInUseException') {
                throw new ApiError('Resource in use, please try again 5 minutes later.', 10514, 400);
            }
            if (e.name !== 'ResourceNotFoundException') {
                throw e;
            }
        }
        await Environment.query().where('id', this.environment.id).update({
            domain_name: null,
            certificate_arn: null,
            certificate_validation_options: null,
            cloudfront_domain_name: null
        });
    }
}

module.exports = DeleteDomainAction;