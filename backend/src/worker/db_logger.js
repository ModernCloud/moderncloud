const moment = require('moment');
const {Task, TaskLog} = require('../common/db');

class DBLogger {
    constructor(task) {
        this.task = task;
    }

    async info(message) {
        return this.log(message);
    }

    async error (message) {
        return this.log(message);
    }

    async log(message) {
        let currentDate = moment().utc().format('YYYY-MM-DD HH:mm:ss');
        await Task.query().where('id', this.task.id).update({'updated_at': currentDate});
        await TaskLog.query().insert({
            task_id: this.task.id,
            detail: message,
            created_at: currentDate
        });
    }
}

module.exports = DBLogger;