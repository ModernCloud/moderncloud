const { Model } = require('objection');

class Project extends Model {
    static get tableName() {
        return 'project';
    }
}

module.exports = Project;