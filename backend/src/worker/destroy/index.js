const moment = require('moment');
const {Task, TaskLog, Environment, Project} = require('../../common/db');
const path = require('path');

class TaskDestroy {
    constructor(task, json) {
        this.task = task;
        this.json = json;
    }

    async run() {
        try {
            await this.loadEnvironment();
            await this.loadProject();
            await require('./steps').run(this);
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

    async updateTaskStatus(status) {
        let currentDate = moment().utc().format('YYYY-MM-DD HH:mm:ss');
        await Task.query()
            .where('id', this.task.id)
            .update({'current_status': status, 'updated_at': currentDate});
    }

    async addLog(detail) {
        let currentDate = moment().utc().format('YYYY-MM-DD HH:mm:ss');
        await Task.query()
            .where('id', this.task.id)
            .update({'updated_at': currentDate});

        await TaskLog.query().insert({
            task_id: this.task.id,
            detail: detail,
            created_at: currentDate
        });
    }

    getProjectRoot() {
        return path.join(process.env.STORAGE, 'projects', `${this.project.id}`, `${this.environment.id}`);
    }

    getTerraformRoot() {
        return path.join(this.getProjectRoot(), 'terraform');
    }
}

module.exports = TaskDestroy;