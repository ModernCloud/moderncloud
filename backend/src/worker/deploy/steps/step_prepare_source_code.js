const path = require('path');
const fs = require('fs');
const { Function, Endpoint } = require('../../../common/db');

class StepPrepareSourceCode {
    constructor(workerTask) {
        this.workerTask = workerTask;
    }

    static factory(workerTask) {
        return new StepPrepareSourceCode(workerTask);
    }

    async run() {
        await this.prepareFunctionFiles();
        await this.prepareEndpointFiles();
    }

    async prepareFunctionFiles() {
        let functions = await Function.query().where('project_id', this.workerTask.project.id);
        for (const row of functions) {
            let root = path.join(this.workerTask.getFunctionsRoot(), row.name);
            let file = path.join(root, row.main_file);
            fs.mkdirSync(root, {recursive: true});
            fs.writeFileSync(file, row.code);
        }
    }

    async prepareEndpointFiles() {
        let endpoints = await Endpoint.query().where('project_id', this.workerTask.project.id);
        for (const row of endpoints) {
            let root = path.join(this.workerTask.getEndpointsRoot(), row.name);
            let file = path.join(root, row.main_file);
            fs.mkdirSync(root, {recursive: true});
            fs.writeFileSync(file, row.code);
        }
    }
}

module.exports = StepPrepareSourceCode;