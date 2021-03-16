const ApiAction = require('../action');
const ApiError = require('../error');
const { Dynamodb } = require('../../common/db');

class GetAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.loadTable();
        return this.response.success({table: this.table}, 200);
    }

    async loadTable() {
        this.table = await Dynamodb.query()
            .where('user_id', this.currentUser.id)
            .where('id', this.req.params.id)
            .first();
        if (!(this.table instanceof Dynamodb)) {
            throw new ApiError('Dynamodb table not found!', 10510, 404);
        }
    }
}

module.exports = GetAction;