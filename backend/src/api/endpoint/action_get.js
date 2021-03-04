const ApiAction = require('../action');
const ApiError = require('../error');
const { Endpoint } = require('../../common/db');

class GetAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.loadEndpoint();
        return this.response.success({endpoint: this.endpoint}, 200);
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
}

module.exports = GetAction;