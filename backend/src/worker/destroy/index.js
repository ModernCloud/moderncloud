const WorkerTask = require('../worker_task');

class TaskDestroy extends WorkerTask {
    async runSteps() {
        await require('./steps/step_terraform_destroy').factory(this).run();
        await require('./steps/step_remove_project_files').factory(this).run();
        await require('../common/steps/step_finalize').factory(this).run();
    }
}

module.exports = TaskDestroy;