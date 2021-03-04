const ApiAction = require('../action');
const { Package } = require('../../common/db');

class GetAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.deletePackage();
        return this.response.success({}, 200);
    }

    async deletePackage() {
        await Package.query()
            .where('user_id', this.currentUser.id)
            .where('id', this.req.params.id)
            .delete();
    }
}

module.exports = GetAction;