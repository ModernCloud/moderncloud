const { Model } = require('objection');

class EnvironmentVariable extends Model {
    static get tableName() {
        return 'environment_variable';
    }
}

module.exports = EnvironmentVariable;