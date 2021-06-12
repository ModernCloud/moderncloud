const fs = require('fs');

class StepCreateDirectories {
    constructor(workerTask) {
        this.workerTask = workerTask;
    }

    static factory(workerTask) {
        return new StepCreateDirectories(workerTask);
    }

    async run() {
        fs.mkdirSync(this.workerTask.getProjectRoot(), {recursive: true});
        fs.mkdirSync(this.workerTask.getFunctionsRoot(), {recursive: true});
        fs.mkdirSync(this.workerTask.getEndpointsRoot(), {recursive: true});
        fs.mkdirSync(this.workerTask.getTerraformRoot(), {recursive: true});
        fs.mkdirSync(this.workerTask.getTmpRoot(), {recursive: true});
    }
}

module.exports = StepCreateDirectories;