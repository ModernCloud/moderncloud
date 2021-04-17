const { Model } = require('objection');

class TaskLog extends Model {
    static get tableName() {
        return 'task_log';
    }
}

module.exports = TaskLog;