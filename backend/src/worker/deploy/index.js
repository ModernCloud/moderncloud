const moment = require('moment');
const path = require('path');
const {Task, Environment, Project} = require('../../common/db');
const TaskLogger = require('../task_logger');

class TaskDeploy {
    constructor(task, json) {
        this.task = task;
        this.taskLogger = new TaskLogger(task);
        this.json = json;
    }

    async run() {
        try {
            await this.loadProject();
            await this.loadEnvironment();
            await require('./steps').run(this);
        } catch (e) {
            console.log(e);
            await this.updateTaskStatus(2);
        }
    }

    async loadProject() {
        this.project = await Project.query().findById(this.task.project_id);
        if (!(this.project instanceof Project)) {
            throw new Error(`Project not found!`);
        }
    }

    async loadEnvironment() {
        this.environment = await Environment.query().findById(this.task.environment_id);
        if (!(this.environment instanceof Environment)) {
            throw new Error(`Environment not found!`);
        }
        if (this.environment.certificate_validation_options == null) {
            this.environment.certificate_validation_options = {};
        }
    }

    async updateTaskStatus(status) {
        let currentDate = moment().utc().format('YYYY-MM-DD HH:mm:ss');
        await Task.query()
            .where('id', this.task.id)
            .update({'current_status': status, 'updated_at': currentDate});
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

    getLambdaPackagesNodejsRoot(functionName) {
        return path.join(this.getProjectRoot(), 'lambda_packages', functionName, 'nodejs');
    }

    getLambdaPackagesPythonRoot(functionName) {
        return path.join(this.getProjectRoot(), 'lambda_packages', functionName, 'python');
    }

    getLambdaPackagesRoot(functionName) {
        return path.join(this.getProjectRoot(), 'lambda_packages', functionName);
    }

    getPackagesNodejsRoot() {
        return path.join(this.getProjectRoot(), 'packages', 'nodejs');
    }

    getPackagesRoot() {
        return path.join(this.getProjectRoot(), 'packages');
    }

    getTerraformTemplates() {
        return path.join(__dirname, 'terraform_templates');
    }
}

module.exports = TaskDeploy;