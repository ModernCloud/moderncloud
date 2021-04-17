const { Model } = require('objection');

class Task extends Model {
    static get tableName() {
        return 'task';
    }
}

module.exports = Task;