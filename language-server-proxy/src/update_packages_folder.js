const fs = require('fs');
const path = require('path');
const { Package } = require('./db');
const render = require('./render');
const shelljs = require('shelljs');

async function npmInstall(projectId) {
    let runtime = 'nodejs14.x';
    let packages = await Package.query()
        .where('project_id', projectId)
        .where('runtime', runtime);
    let runtimePackageFolder = `${process.env.PACKAGES_ROOT}/${projectId}/${runtime}`;
    fs.mkdirSync(runtimePackageFolder, {recursive: true});
    render(
        path.join(__dirname, 'package.json.twig'),
        path.join(runtimePackageFolder, 'package.json'),
        {packages: packages}
    )
    shelljs.exec(`npm install --no-fund --no-audit --prod --no-optional --ignore-scripts --no-bin-links --prefix "${runtimePackageFolder}"`, {silent: true});
}

async function pipInstall(projectId) {
    let runtime = 'python3.8';
    let packages = await Package.query()
        .where('project_id', projectId)
        .where('runtime', runtime);
    let runtimePackageFolder = `${process.env.PACKAGES_ROOT}/${projectId}/${runtime}/python`;
    fs.mkdirSync(runtimePackageFolder, {recursive: true});
    render(
        path.join(__dirname, 'requirements.txt.twig'),
        path.join(runtimePackageFolder, 'requirements.txt'),
        {packages: packages}
    )
    let commands = [
        `python3 -m venv ${runtimePackageFolder}`,
        `source ${runtimePackageFolder}/bin/activate`,
        `pip -q install pip-tools`,
        `pip-sync -q ${runtimePackageFolder}/requirements.txt`,
        `deactivate`
    ];
    shelljs.exec(commands.join(' && '), {silent: true});
}

module.exports = async (projectId, runtime) => {
    if (runtime == null || runtime.indexOf('nodejs') > -1) {
        await npmInstall(projectId);
    }
    if (runtime == null || runtime.indexOf('python') > -1) {
        await pipInstall(projectId);
    }
};