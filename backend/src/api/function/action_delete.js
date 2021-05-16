const ApiAction = require('../action');
const ApiError = require('../error');
const { Function, Package } = require('../../common/db');
const updatePackagesFolder = require('../package/update_packages_folder');

class GetAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.loadFunction();
        await this.deleteFunction();
        await this.deletePackages();
        await updatePackagesFolder(this.function.project_id);
        return this.response.success({}, 200);
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

    async deleteFunction() {
        await Function.query()
            .where('user_id', this.currentUser.id)
            .where('id', this.req.params.id)
            .delete();
    }

    async deletePackages() {
        await Package.query()
            .where('user_id', this.currentUser.id)
            .where('file_id', this.req.params.id)
            .where('file_type', 'function')
            .delete();
    }
}

module.exports = GetAction;