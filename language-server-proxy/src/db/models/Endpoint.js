const { Model } = require('objection');

class Endpoint extends Model {
    static get tableName() {
        return 'endpoint';
    }
}

module.exports = Endpoint;