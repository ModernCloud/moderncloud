const { Model } = require('objection');

class PythonPackage extends Model {
    static get tableName() {
        return 'python_package';
    }
}

module.exports = PythonPackage;