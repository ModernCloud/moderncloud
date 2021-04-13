const Joi = require('joi');
const ApiAction = require('../action');
const ApiError = require('../error');
const { Environment, EnvironmentVariable } = require('../../common/db');

class UpdateAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.validateParams();
        await this.loadEnvironment();
        await this.updateVariables();
        return this.response.success({}, 200);
    }

    async validateParams() {
        let schema = Joi.object({
            variables: Joi.array().required().label('Variables')
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

    async updateVariables() {
        let variableIds = this.validRequest.variables.map(item => {
            return item.id;
        });
        await EnvironmentVariable.query()
            .where('environment_id', this.req.params.id)
            .whereNotIn('id', variableIds)
            .delete();
        for (const variable of this.validRequest.variables) {
            await EnvironmentVariable.query()
                .insert({
                    user_id: this.currentUser.id,
                    project_id: this.environment.project_id,
                    environment_id: this.environment.id,
                    name: variable.name,
                    value: variable.value
                })
                .onConflict(['environment_id', 'name'])
                .merge();
        }
    }
}

module.exports = UpdateAction;