const path = require('path');
const shelljs = require('shelljs');
const { Package } = require('../../../common/db');
const render = require('../../../common/template/render');

async function createPackageFile(job) {
    let packages = await Package.query().orderBy('name');
    render(
        path.join(job.getTerraformTemplates(), 'package.json.twig'),
        path.join(job.getPackagesRoot(), 'package.json'),
        {packages: packages}
    )
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