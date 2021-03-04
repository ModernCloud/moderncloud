const ApiAction = require('../action');
const { Function } = require('../../common/db');

class GetAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.deleteFunction();
        return this.response.success({}, 200);
    }

    async deleteFunction() {
        await Function.query()
            .where('user_id', this.currentUser.id)
            .where('id', this.req.params.id)
            .delete();
    }
}

module.exports = GetAction;