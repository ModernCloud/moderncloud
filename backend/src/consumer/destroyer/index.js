const {Environment, Project} = require('../../common/db');
const path = require('path');

class Destroyer {
    constructor(message) {
        this.message = message;
        this.json = JSON.parse(Buffer.from(message.content).toString());
    }

    async run() {
        try {
            await this.loadEnvironment();
            await this.loadProject();
            await require('./steps').run(this);
        } catch (e) {
            console.log(e);
        }
    }

    async loadEnvironment() {
        this.environment = await Environment.query()
            .findById(this.json.environment_id);
        if (!(this.environment instanceof Environment)) {
            throw new Error(`Environment not found!`);
        }
    }

    async loadProject() {
        this.project = await Project.query().findById(this.environment.project_id);
        if (!(this.project instanceof Project)) {
            throw new Error(`Project not found!`);
        }
    }

    getProjectRoot() {
        return path.join(process.env.STORAGE, 'projects', `${this.project.id}`, `${this.environment.id}`);
    }

    getTerraformRoot() {
        return path.join(this.getProjectRoot(), 'terraform');
    }
}

module.exports = Destroyer;