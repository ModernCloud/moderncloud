const ApiAction = require('../action');
const ApiError = require('../error');
const { Package } = require('../../common/db');
const updatePackagesFolder = require('./update_packages_folder');

class GetAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.loadPackage();
        await this.deletePackage();
        await updatePackagesFolder(this.package.project_id);
        return this.response.success({}, 200);
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

    async deletePackage() {
        await Package.query()
            .where('user_id', this.currentUser.id)
            .where('id', this.req.params.id)
            .delete();
    }
}

module.exports = GetAction;