const fs = require('fs');

async function removeFiles(job) {
    fs.rmdirSync(job.getProjectRoot(), {recursive: true});
}

module.exports = {
    run: async (job) => {
        await removeFiles(job);
    }
}