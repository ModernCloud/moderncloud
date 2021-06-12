class StepFinalize {
    constructor(workerTask) {
        this.workerTask = workerTask;
    }

    static factory(workerTask) {
        return new StepFinalize(workerTask);
    }

    async run() {
        await this.workerTask.updateTaskStatus(1);
    }
}

module.exports = StepFinalize;