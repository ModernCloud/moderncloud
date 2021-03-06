const path = require('path');
const fs = require('fs');
const shelljs = require('shelljs');
const TemplateFile = require('template-file');
const { Package } = require('../../../common/db');

async function createPackageFile(job) {
    fs.copyFileSync(path.join(job.getTerraformTemplates(), 'package.json'), path.join(job.getPackagesRoot(), 'package.json'));
    let packages = await Package.query().orderBy('name');
    let newContent = await TemplateFile.renderFile(path.join(job.getPackagesRoot(), 'package.json'), {
        packages: packages
    });
    fs.writeFileSync(path.join(job.getPackagesRoot(), 'package.json'), newContent);
}

async function runNpmInstall(job) {
    await job.addLog(`$ npm install`);
    let result = shelljs.exec(`npm install --prefix "${job.getPackagesRoot()}"`, {silent: true});
    await job.addLog(result.stdout || result.stderr);
    if (result.code > 0) {
        throw new Error(`Failed: npm install --prefix "${job.getPackagesRoot()}" | Deployment: ${job.deployment.id}`);
    }
}

module.exports = {
    run: async (job) => {
        await createPackageFile(job);
        await runNpmInstall(job);
    }
}