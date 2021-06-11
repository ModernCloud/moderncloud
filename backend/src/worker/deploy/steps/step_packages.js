const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const { Endpoint, Function, Package } = require('../../../common/db');
const render = require('../../../common/template/render');
const Command = require('../../command');

async function createEndpointDependencies(job) {
    let endpoints = await Endpoint.query().where('project_id', job.project.id).orderBy('name');
    for (const row of endpoints) {
        await installDependencies(job, row);
    }
}

async function createFunctionDependencies(job) {
    let functions = await Function.query().where('project_id', job.project.id).orderBy('name');
    for (const row of functions) {
        await installDependencies(job, row);
    }
}

async function installDependencies(job, lambda) {
    let packages = await Package.query()
        .where('project_id', job.project.id)
        .where('file_id', lambda.id)
        .where('file_type', lambda instanceof Endpoint ? 'endpoint' : 'function')
        .orderBy('name');
    if (packages.length === 0) {
        rimraf.sync(job.getLambdaPackagesRoot(lambda.name));
        return false;
    }
    if (lambda.runtime.indexOf('python') > -1) {
        await runPipInstall(job, lambda, packages);
    } else {
        await runNpmInstall(job, lambda, packages);
    }
    return true;
}

async function runNpmInstall(job, lambda, packages) {
    fs.mkdirSync(job.getLambdaPackagesNodejsRoot(lambda.name), {recursive: true});
    render(
        path.join(job.getTerraformTemplates(), 'package.json.twig'),
        path.join(job.getLambdaPackagesNodejsRoot(lambda.name), 'package.json'),
        {packages: packages}
    )
    let result = await Command.run({
        logger: job.taskLogger,
        command: `npm install --no-fund --no-audit --prod --no-optional --ignore-scripts --no-bin-links`,
        options: {
            cwd: job.getLambdaPackagesNodejsRoot(lambda.name)
        }
    });
    if (result.exitCode > 0) {
        throw new Error(`Failed: npm install --prefix "${job.getLambdaPackagesNodejsRoot(lambda.name)}" | Task: ${job.task.id}`);
    }
}

async function runPipInstall(job, lambda, packages) {
    fs.mkdirSync(job.getLambdaPackagesPythonRoot(lambda.name), {recursive: true});
    render(
        path.join(job.getTerraformTemplates(), 'requirements.txt.twig'),
        path.join(job.getLambdaPackagesPythonRoot(lambda.name), 'requirements.txt'),
        {packages: packages}
    )
    let commands = [
        `python3 -m venv ${job.getLambdaPackagesPythonRoot(lambda.name)}`,
        `source ${job.getLambdaPackagesPythonRoot(lambda.name)}/bin/activate`,
        `pip install pip-tools`,
        `pip-sync ${job.getLambdaPackagesPythonRoot(lambda.name)}/requirements.txt`
    ];
    let result = await Command.run({
        logger: job.taskLogger,
        command: commands.join(' && ')
    });
    if (result.exitCode > 0) {
        throw new Error(`Failed: pip install -r requirements.txt --prefix "${job.getLambdaPackagesNodejsRoot(lambda.name)}" | Task: ${job.task.id}`);
    }
}

module.exports = {
    run: async (job) => {
        await createEndpointDependencies(job);
        await createFunctionDependencies(job);
    }
}