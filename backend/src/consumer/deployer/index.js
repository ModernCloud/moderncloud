const moment = require('moment');
const {Deployment, DeploymentLog, Environment, Project} = require('../../common/db');
const path = require('path');

class Deployer {
    constructor(message) {
        this.message = message;
        this.json = JSON.parse(Buffer.from(message.content).toString());
    }

    async run() {
        try {
            await this.loadDeployment();
            await this.loadProject();
            await this.loadEnvironment();
            await require('./steps').run(this);
        } catch (e) {
            console.log(e);
            if (this.deployment instanceof Deployment) {
                await this.updateTaskStatus(2);
            }
        }
    }

    async loadDeployment() {
        this.deployment = await Deployment.query()
            .where('id', this.json.deployment_id)
            .where('current_status', 0)
            .first();
        if (!(this.deployment instanceof Deployment)) {
            throw new Error(`Deployment not found!`);
        }
    }

    async loadProject() {
        this.project = await Project.query().findById(this.deployment.project_id);
        if (!(this.project instanceof Project)) {
            throw new Error(`Project not found!`);
        }
    }

    async loadEnvironment() {
        this.environment = await Environment.query().findById(this.deployment.environment_id);
        if (!(this.environment instanceof Environment)) {
            throw new Error(`Environment not found!`);
        }
    }

    async updateTaskStatus(status) {
        let currentDate = moment().utc().format('YYYY-MM-DD HH:mm:ss');
        await Deployment.query()
            .where('id', this.deployment.id)
            .update({'current_status': status, 'updated_at': currentDate});
    }

    async addLog(detail) {
        let currentDate = moment().utc().format('YYYY-MM-DD HH:mm:ss');
        await Deployment.query()
            .where('id', this.deployment.id)
            .update({'updated_at': currentDate});

        await DeploymentLog.query().insert({
            deployment_id: this.deployment.id,
            detail: detail,
            created_at: currentDate
        });
    }

    getProjectRoot() {
        return path.join(process.env.STORAGE, 'projects', `${this.project.id}`, `${this.environment.id}`);
    }

    getFunctionsRoot() {
        return path.join(this.getProjectRoot(), 'functions');
    }

    getEndpointsRoot() {
        return path.join(this.getProjectRoot(), 'endpoints');
    }

    getTerraformRoot() {
        return path.join(this.getProjectRoot(), 'terraform');
    }

    getTmpRoot() {
        return path.join(this.getProjectRoot(), 'tmp');
    }

    getPackagesRoot() {
        return path.join(this.getProjectRoot(), 'packages', 'nodejs');
    }

    getTerraformTemplates() {
        return path.join(__dirname, 'terraform_templates');
    }
}

module.exports = Deployer;