const ApiAction = require('../action');
const ApiError = require('../error');
const { Function } = require('../../common/db');

class GetAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.loadFunction();
        return this.response.success({function: this.function}, 200);
    }

    async loadFunction() {
        this.function = await Function.query()
            .where('user_id', this.currentUser.id)
            .where('id', this.req.params.id)
            .first();
        if (!(this.function instanceof Function)) {
            throw new ApiError('Function not found!', 10503, 404);
        }
    }
}

module.exports = GetAction;