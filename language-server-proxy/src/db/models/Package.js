const { Model } = require('objection');

class Package extends Model {
    static get tableName() {
        return 'package';
    }
}

module.exports = Package;