const Joi = require('joi');
const ApiAction = require('../action');
const ApiError = require('../error');
const { Environment } = require('../../common/db');
const IAM = require('../../common/aws/iam');
const S3 = require('../../common/aws/s3');

class UpdateAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.validateParams();
        await this.checkAWSPermissions();
        await this.loadEnvironment();
        await this.updateEnvironment();
        await this.createS3Bucket();
        return this.response.success({}, 200);
    }

    async validateParams() {
        let schema = Joi.object({
            project_id: Joi.number().required(),
            name: Joi.string().alphanum().optional().label('Name'),
            region: Joi.string().optional().label('Region'),
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

    async loadEnvironment() {
        this.environment = await Environment.query()
            .where('user_id', this.currentUser.id)
            .where('project_id', this.validRequest.project_id)
            .where('id', this.req.params.id)
            .first();
        if (!(this.environment instanceof Environment)) {
            throw new ApiError('Environment not found!', 10504, 404);
        }
    }

    async updateEnvironment() {
        let updateParams = {};
        if (this.validRequest.hasOwnProperty('name')) {
            updateParams.name = this.validRequest.name;
        }
        if (this.validRequest.hasOwnProperty('region')) {
            updateParams.region = this.validRequest.region;
        }
        if (this.validRequest.hasOwnProperty('access_key')) {
            updateParams.access_key = this.validRequest.access_key;
        }
        if (this.validRequest.hasOwnProperty('secret_key')) {
            updateParams.secret_key = this.validRequest.secret_key;
        }
        if (Object.keys(updateParams).length > 0) {
            await Environment.query().where('id', this.environment.id).update(updateParams);
        }
    }

    async createS3Bucket() {
        if (this.environment.terraform_s3_bucket == null
            && this.environment.access_key
            && this.environment.secret_key) {
            let awsUser = await (new IAM(this.environment.access_key, this.environment.secret_key)).getUser();
            let terraformS3Bucket = `terraform-${awsUser.User.UserId}-${Date.now()}`.toLowerCase();
            await (new S3(this.environment)).create(terraformS3Bucket);
            await Environment.query().where('id', this.environment.id).update({
                terraform_s3_bucket: terraformS3Bucket
            });
        }
    }
}

module.exports = UpdateAction;