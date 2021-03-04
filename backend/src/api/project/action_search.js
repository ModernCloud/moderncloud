const ApiAction = require('../action');
const { Project } = require('../../common/db');

class SearchAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.loadProjects();
        return this.response.success({projects: this.projects});
    }

    async loadProjects() {
        this.projects = await Project.query()
            .where('user_id', this.currentUser.id)
            .orderBy('name');
    }
}

module.exports = SearchAction;