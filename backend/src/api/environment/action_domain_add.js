const Joi = require('joi');
const ApiAction = require('../action');
const ApiError = require('../error');
const { Environment } = require('../../common/db');
const Certificate = require('../../common/aws/certificate');

class AddDomainAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.validateParams();
        await this.loadEnvironment();
        await this.requestCertificate();
        return this.response.success({}, 200);
    }

    async validateParams() {
        let schema = Joi.object({
            domain_name: Joi.string().allow(null, '').domain().optional().default(null)
        });
        this.validRequest = await schema.validateAsync(this.req.body || {});
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

    async requestCertificate() {
        if (this.environment.domain_name != null) {
            throw new ApiError('Domain already added!', 10511, 400);
        }
        if (this.environment.access_key == null || this.environment.secret_key == null) {
            throw new ApiError('Please set AWS credentials!', 10512, 400);
        }
        await this.updateDomainName();
        await (new Certificate(this.environment)).requestCertificate();
    }

    async updateDomainName() {
        await Environment.query().where('id', this.environment.id).update({
            domain_name: this.validRequest.domain_name
        });
        this.environment.domain_name = this.validRequest.domain_name;
    }
}

module.exports = AddDomainAction;