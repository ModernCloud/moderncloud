const path = require('path');
const WorkerTask = require('../worker_task');

class TaskDeploy extends WorkerTask {
    async runSteps() {
        await require('./steps/step_create_directories').factory(this).run();
        await require('./steps/step_update_terraform_files').factory(this).run();
        await require('./steps/step_prepare_source_code').factory(this).run();
        await require('./steps/step_install_dependencies').factory(this).run();
        await require('./steps/step_terraform_apply').factory(this).run();
        await require('../common/steps/step_finalize').factory(this).run();
    }

    getFunctionsRoot() {
        return path.join(this.getProjectRoot(), 'functions');
    }

    getEndpointsRoot() {
        return path.join(this.getProjectRoot(), 'endpoints');
    }

    getLambdaPackagesNodejsRoot(functionName) {
        return path.join(this.getProjectRoot(), 'lambda_packages', functionName, 'nodejs');
    }

    getLambdaPackagesPythonRoot(functionName) {
        return path.join(this.getProjectRoot(), 'lambda_packages', functionName, 'python');
    }

    getLambdaPackagesRoot(functionName) {
        return path.join(this.getProjectRoot(), 'lambda_packages', functionName);
    }

    getTerraformTemplates() {
        return path.join(__dirname, 'terraform_templates');
    }
}

module.exports = TaskDeploy;