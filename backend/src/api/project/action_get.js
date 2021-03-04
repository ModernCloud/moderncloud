const ApiAction = require('../action');
const ApiError = require('../error');
const { Project } = require('../../common/db');

class GetAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.loadProject();
        return this.response.success({project: this.project}, 200);
    }

    async loadProject() {
        this.project = await Project.query()
            .where('user_id', this.currentUser.id)
            .where('id', this.req.params.id)
            .first();
        if (!(this.project instanceof Project)) {
            throw new ApiError('Project not found!', 10502, 404);
        }
    }
}

module.exports = GetAction;