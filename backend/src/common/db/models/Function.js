const { Model } = require('objection');

class Function extends Model {
    static get tableName() {
        return 'function';
    }
}

module.exports = Function;