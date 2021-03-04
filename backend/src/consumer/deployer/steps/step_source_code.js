const path = require('path');
const fs = require('fs');
const { Function, Endpoint } = require('../../../common/db');

async function setUpFunctionFiles(job) {
    let functions = await Function.query().where('project_id', job.project.id);
    for (const row of functions) {
        let root = path.join(job.getFunctionsRoot(), row.name);
        let file = path.join(root, row.main_file);
        fs.mkdirSync(root, {recursive: true});
        fs.writeFileSync(file, row.code);
    }
}

async function setUpEndpointFiles(job) {
    let endpoints = await Endpoint.query().where('project_id', job.project.id);
    for (const row of endpoints) {
        let root = path.join(job.getEndpointsRoot(), row.name);
        let file = path.join(root, row.main_file);
        fs.mkdirSync(root, {recursive: true});
        fs.writeFileSync(file, row.code);
    }
}

module.exports = {
    run: async (job) => {
        await setUpFunctionFiles(job);
        await setUpEndpointFiles(job);
    }
}