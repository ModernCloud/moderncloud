const ApiAction = require('../action');
const ApiError = require('../error');
const { Endpoint, Package } = require('../../common/db');
const updatePackagesFolder = require('../package/update_packages_folder');

class GetAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.loadEndpoint();
        await this.deleteEndpoint();
        await this.deletePackages();
        await updatePackagesFolder(this.endpoint.project_id);
        return this.response.success({}, 200);
    }

    async loadEndpoint() {
        this.endpoint = await Endpoint.query()
            .where('user_id', this.currentUser.id)
            .where('id', this.req.params.id)
            .first();
        if (!(this.endpoint instanceof Endpoint)) {
            throw new ApiError('Endpoint not found!', 10508, 404);
        }
    }

    async deleteEndpoint() {
        await Endpoint.query()
            .where('user_id', this.currentUser.id)
            .where('id', this.req.params.id)
            .delete();
    }

    async deletePackages() {
        await Package.query()
            .where('user_id', this.currentUser.id)
            .where('file_id', this.req.params.id)
            .where('file_type', 'endpoint')
            .delete();
    }
}

module.exports = GetAction;