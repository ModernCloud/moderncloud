const ApiAction = require('../action');
const ApiError = require('../error');
const { Environment, EnvironmentVariable } = require('../../common/db');

class GetAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.loadEnvironment();
        await this.loadVariables();
        return this.response.success({variables: this.variables}, 200);
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

    async loadVariables() {
        this.variables = await EnvironmentVariable.query()
            .where('user_id', this.currentUser.id)
            .where('environment_id', this.environment.id)
            .orderBy('name');
    }
}

module.exports = GetAction;