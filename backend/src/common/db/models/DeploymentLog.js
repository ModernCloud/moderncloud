const { Model } = require('objection');

class DeploymentLog extends Model {
    static get tableName() {
        return 'deployment_log';
    }
}

module.exports = DeploymentLog;