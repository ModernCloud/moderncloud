const ApiAction = require('../action');
const ApiError = require('../error');
const { Package } = require('../../common/db');

class GetAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.loadPackage();
        return this.response.success({package: this.package}, 200);
    }

    async loadPackage() {
        this.package = await Package.query()
            .where('user_id', this.currentUser.id)
            .where('id', this.req.params.id)
            .first();
        if (!(this.package instanceof Package)) {
            throw new ApiError('Package not found!', 10509, 404);
        }
    }
}

module.exports = GetAction;