const { Model } = require('objection');

class Dynamodb extends Model {
    static get tableName() {
        return 'dynamodb';
    }
}

module.exports = Dynamodb;