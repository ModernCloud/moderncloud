const ApiAction = require('../action');
const ApiError = require('../error');
const { Environment } = require('../../common/db');
const Certificate = require('../../common/aws/certificate');

class DeleteDomainAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.loadEnvironment();
        await this.deleteCertificate();
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

    async deleteCertificate() {
        if (this.environment.domain_name == null || this.environment.certificate_arn == null) {
            throw new ApiError('Domain not found!', 10513, 404);
        }
        if (this.environment.access_key == null || this.environment.secret_key == null) {
            throw new ApiError('Please set AWS credentials!', 10512, 400);
        }
        await (new Certificate(this.environment)).deleteCertificate();
    }
}

module.exports = DeleteDomainAction;