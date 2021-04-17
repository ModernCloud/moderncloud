const ApiAction = require('../action');
const ApiError = require('../error');
const { Task, TaskLog } = require('../../common/db');

class GetAction extends ApiAction
{
    async tryExecute() {
        await this.checkUser();
        await this.loadTask();
        await this.loadLogs();
        return this.response.success({task: this.task, logs: this.logs});
    }

    async loadTask() {
        this.task = await Task.query()
            .where('user_id', this.currentUser.id)
            .where('id', this.req.params.id)
            .first();
        if (!(this.task instanceof Task)) {
            throw new ApiError('Task not found!', 10516, 404);
        }
    }

    async loadLogs() {
        this.logs = await TaskLog.query()
            .where('task_id', this.task.id)
            .orderBy('created_at');
    }
}

module.exports = GetAction;