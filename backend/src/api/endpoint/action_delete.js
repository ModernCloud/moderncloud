const ApiAction = require('../action');
const { Endpoint } = require('../../common/db');

class GetAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.deleteEndpoint();
        return this.response.success({}, 200);
    }

    async deleteEndpoint() {
        await Endpoint.query()
            .where('user_id', this.currentUser.id)
            .where('id', this.req.params.id)
            .delete();
    }
}

module.exports = GetAction;