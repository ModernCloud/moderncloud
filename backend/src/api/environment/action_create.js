const Joi = require('joi');
const ApiAction = require('../action');
const ApiError = require('../error');
const { Environment } = require('../../common/db');
const IAM = require('../../common/aws/iam');

class CreateAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.validateParams();
        await this.checkAWSPermissions();
        await this.createEnvironment();
        return this.response.success({id: this.environment.id}, 201);
    }

    async validateParams() {
        let schema = Joi.object({
            project_id: Joi.number().required(),
            name: Joi.string().alphanum().required().label('Name'),
            region: Joi.string().required().label('Region'),
            access_key: Joi.string().allow(null, '').optional().default(null).label('Access Key'),
            secret_key: Joi.string().allow(null, '').optional().default(null).label('Secret Key')
        });
        this.validRequest = await schema.validateAsync(this.req.body || {});
    }

    async checkAWSPermissions() {
        if (this.validRequest.access_key && this.validRequest.secret_key) {
            let hasPermissions = await (new IAM(this.validRequest.access_key, this.validRequest.secret_key)).hasPermissions();
            if (hasPermissions === false) {
                throw new ApiError('Your AWS credential does not have required permissions!', 10515, 400);
            }
        }
    }

    async createEnvironment() {
        this.environment = await Environment.query().insert({
            user_id: this.currentUser.id,
            project_id: this.validRequest.project_id,
            name: this.validRequest.name,
            region: this.validRequest.region,
            access_key: this.validRequest.access_key,
            secret_key: this.validRequest.secret_key
        });
    }
}

module.exports = CreateAction;