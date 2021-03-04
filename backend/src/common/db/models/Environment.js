const { Model } = require('objection');

class Environment extends Model {
    static get tableName() {
        return 'environment';
    }
}

module.exports = Environment;