const path = require('path');
const moment = require('moment');
const { Task, Environment, Project } = require('../common/db');
const DBLogger = require('./db_logger');

class WorkerTask {
    constructor(task, jobMessage) {
        this.task = task;
        this.jobMessage = jobMessage;
        this.dbLogger = new DBLogger(task);
    }

    static async factory(jobMessage) {
        let task = await Task.query().where('id', jobMessage.task_id).first();
        if (!(task instanceof Task)) {
            throw new Error(`Task not found: ${jobMessage.task_id}`);
        }
        let WorkerTaskClass = require(path.join(__dirname, task.name));
        return new WorkerTaskClass(task, jobMessage);
    }

    async run() {
        try {
            await this.loadEnvironment();
            await this.loadProject();
            await this.runSteps();
        } catch (e) {
            console.log(e);
            await this.updateTaskStatus(2);
        }
    }

    async loadEnvironment() {
        this.environment = await Environment.query().findById(this.task.environment_id);
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

    async runSteps() {

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

    getTerraformRoot() {
        return path.join(this.getProjectRoot(), 'terraform');
    }

    getTmpRoot() {
        return path.join(this.getProjectRoot(), 'tmp');
    }
}

module.exports = WorkerTask;