const { Model } = require('objection');

class User extends Model {
    static get tableName() {
        return 'user';
    }
}

module.exports = User;