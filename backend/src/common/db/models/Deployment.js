const { Model } = require('objection');

class Deployment extends Model {
    static get tableName() {
        return 'deployment';
    }
}

module.exports = Deployment;