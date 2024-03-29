const ApiError = require('../../api/error');
const mapValues = require('lodash/mapValues');
const values = require('lodash/values');
const intersection = require('lodash/intersection');
const { IAM } = require("@aws-sdk/client-iam");

class Service {
    constructor(accessKey, secretKey) {
        this.iamClient = new IAM({region: 'us-east-1', credentials: {accessKeyId: accessKey, secretAccessKey: secretKey}});
    }

    async hasPermissions() {
        let requiredPermissions = [
            'IAMFullAccess',
            'AWSLambda_FullAccess',
            'AmazonS3FullAccess',
            'AmazonDynamoDBFullAccess',
            'CloudWatchFullAccess',
            'CloudFrontFullAccess',
            'AmazonAPIGatewayAdministrator',
            'AWSCertificateManagerFullAccess'
        ];
        try {
            let result = await this.iamClient.getUser({});
            let resultGroups = await this.iamClient.listGroups({});
            let groupNames = values(mapValues(resultGroups.Groups, 'GroupName'));
            let resultAttachedPolicies = await this.iamClient.listAttachedUserPolicies({UserName: result.User.UserName});
            let attachedPolicyNames = values(mapValues(resultAttachedPolicies.AttachedPolicies, 'PolicyName'));
            for (const groupName of groupNames) {
                let resultAttachedGroupPolicies = await this.iamClient.listAttachedGroupPolicies({GroupName: groupName});
                let groupPolicies = values(mapValues(resultAttachedGroupPolicies.AttachedPolicies, 'PolicyName'));
                attachedPolicyNames.push(...groupPolicies);
            }
            if (attachedPolicyNames.indexOf('AdministratorAccess') > -1) {
                return true;
            }
            let permissions = intersection(requiredPermissions, attachedPolicyNames);
            return permissions.length === requiredPermissions.length;
        } catch (e) {
            if (e.Code && e.Code === 'InvalidClientTokenId') {
                throw new ApiError('AWS credential is invalid!', 10522, 400);
            }
            throw e;
        }
    }

    async getUser() {
        return await this.iamClient.getUser({});
    }
}

module.exports = Service;