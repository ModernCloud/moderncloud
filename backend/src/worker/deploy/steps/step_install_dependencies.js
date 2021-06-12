const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const { Endpoint, Function, Package } = require('../../../common/db');
const render = require('../../../common/template/render');
const Command = require('../../command');

class StepInstallDependencies {
    constructor(workerTask) {
        this.workerTask = workerTask;
    }

    static factory(workerTask) {
        return new StepInstallDependencies(workerTask);
    }

    async run() {
        await this.installEndpointDependencies();
        await this.installFunctionDependencies();
    }

    async installEndpointDependencies() {
        let endpoints = await Endpoint.query().where('project_id', this.workerTask.project.id).orderBy('name');
        for (const row of endpoints) {
            await this.installDependencies(row);
        }
    }

    async installFunctionDependencies() {
        let functions = await Function.query().where('project_id', this.workerTask.project.id).orderBy('name');
        for (const row of functions) {
            await this.installDependencies(row);
        }
    }

    async installDependencies(lambda) {
        let packages = await Package.query()
            .where('project_id', this.workerTask.project.id)
            .where('file_id', lambda.id)
            .where('file_type', lambda instanceof Endpoint ? 'endpoint' : 'function')
            .orderBy('name');
        if (packages.length === 0) {
            rimraf.sync(this.workerTask.getLambdaPackagesRoot(lambda.name));
            return;
        }
        if (lambda.runtime.indexOf('python') > -1) {
            await this.runPipInstall(lambda, packages);
        } else {
            await this.runNpmInstall(lambda, packages);
        }
    }

    async runNpmInstall(lambda, packages) {
        fs.mkdirSync(this.workerTask.getLambdaPackagesNodejsRoot(lambda.name), {recursive: true});
        render(
            path.join(this.workerTask.getTerraformTemplates(), 'package.json.twig'),
            path.join(this.workerTask.getLambdaPackagesNodejsRoot(lambda.name), 'package.json'),
            {packages: packages}
        )
        let result = await Command.run({
            logger: this.workerTask.dbLogger,
            command: `npm install --no-fund --no-audit --prod --no-optional --ignore-scripts --no-bin-links`,
            options: {
                cwd: this.workerTask.getLambdaPackagesNodejsRoot(lambda.name)
            }
        });
        if (result.exitCode > 0) {
            throw new Error(`Failed: npm install --prefix "${this.workerTask.getLambdaPackagesNodejsRoot(lambda.name)}" | Task: ${this.workerTask.task.id}`);
        }
    }

    async runPipInstall(lambda, packages) {
        fs.mkdirSync(this.workerTask.getLambdaPackagesPythonRoot(lambda.name), {recursive: true});
        render(
            path.join(this.workerTask.getTerraformTemplates(), 'requirements.txt.twig'),
            path.join(this.workerTask.getLambdaPackagesPythonRoot(lambda.name), 'requirements.txt'),
            {packages: packages}
        )
        let commands = [
            `python3 -m venv ${this.workerTask.getLambdaPackagesPythonRoot(lambda.name)}`,
            `source ${this.workerTask.getLambdaPackagesPythonRoot(lambda.name)}/bin/activate`,
            `pip install pip-tools`,
            `pip-sync ${this.workerTask.getLambdaPackagesPythonRoot(lambda.name)}/requirements.txt`
        ];
        let result = await Command.run({
            logger: this.workerTask.dbLogger,
            command: commands.join(' && ')
        });
        if (result.exitCode > 0) {
            throw new Error(`Failed: pip install -r requirements.txt --prefix "${this.workerTask.getLambdaPackagesNodejsRoot(lambda.name)}" | Task: ${this.workerTask.task.id}`);
        }
    }
}

module.exports = StepInstallDependencies;