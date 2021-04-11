const ApiAction = require('../action');
const ApiError = require('../error');
const { Environment } = require('../../common/db');
const Certificate = require('../../common/aws/certificate');
const ApiGateway = require('../../common/aws/api_gateway');
const get = require('lodash/get');

class AttachDomainAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.loadEnvironment();
        await this.checkCertificateStatus();
        await this.attachDomain();
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

    async checkCertificateStatus() {
        let resultDetail = await (new Certificate(this.environment)).updateDetails();
        if (this.environment.certificate_validation_options == null
            || get(resultDetail, 'Certificate.DomainValidationOptions[0].ValidationStatus', null) !== 'SUCCESS') {
            throw new ApiError('Waiting domain ownership verification!', 10506, 400);
        }
    }

    async attachDomain() {
        await (new ApiGateway(this.environment)).setDomain();
    }
}

module.exports = AttachDomainAction;