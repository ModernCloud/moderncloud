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
            'IAMReadOnlyAccess',
            'AWSLambda_FullAccess',
            'AmazonS3FullAccess',
            'AmazonDynamoDBFullAccess',
            'CloudWatchFullAccess',
            'AmazonAPIGatewayAdministrator',
            'AWSCertificateManagerFullAccess'
        ];
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
    }
}

module.exports = Service;