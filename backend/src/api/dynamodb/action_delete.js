const ApiAction = require('../action');
const { Dynamodb } = require('../../common/db');

class GetAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.deleteTable();
        return this.response.success({}, 200);
    }

    async deleteTable() {
        await Dynamodb.query()
            .where('user_id', this.currentUser.id)
            .where('id', this.req.params.id)
            .delete();
    }
}

module.exports = GetAction;