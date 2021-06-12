const fs = require('fs');

class StepRemoveProjectFiles {
    constructor(workerTask) {
        this.workerTask = workerTask;
    }

    static factory(workerTask) {
        return new StepRemoveProjectFiles(workerTask);
    }

    async run() {
        fs.rmdirSync(this.workerTask.getProjectRoot(), {recursive: true});
    }
}

module.exports = StepRemoveProjectFiles;