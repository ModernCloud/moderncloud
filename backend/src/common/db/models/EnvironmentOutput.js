const { Model } = require('objection');

class EnvironmentOutput extends Model {
    static get tableName() {
        return 'environment_output';
    }
}

module.exports = EnvironmentOutput;