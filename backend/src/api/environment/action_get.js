const ApiAction = require('../action');
const ApiError = require('../error');
const { Environment } = require('../../common/db');
const Certificate = require('../../common/aws/certificate');

class GetAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.loadEnvironment();
        if (this.req.query.hasOwnProperty('refresh_certificate_validation_options')
            && this.req.query.refresh_certificate_validation_options) {
            await (new Certificate(this.environment)).updateDetails();
        }
        return this.response.success({environment: this.environment}, 200);
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
}

module.exports = GetAction;