const fs = require('fs');

module.exports = {
    run: async (job) => {
        fs.mkdirSync(job.getProjectRoot(), {recursive: true});
        fs.mkdirSync(job.getFunctionsRoot(), {recursive: true});
        fs.mkdirSync(job.getEndpointsRoot(), {recursive: true});
        fs.mkdirSync(job.getPackagesNodejsRoot(), {recursive: true});
        fs.mkdirSync(job.getTerraformRoot(), {recursive: true});
        fs.mkdirSync(job.getTmpRoot(), {recursive: true});
    }
}