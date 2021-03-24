const shelljs = require('shelljs');
const {Deployment} = require('../../../common/db');

async function runInit(job) {
    await job.addLog(`$ terraform init`);
    let result = shelljs.exec(`terraform -chdir=${job.getTerraformRoot()} init -input=false -no-color`, {silent: true});
    if (result.stdout) {
        await job.addLog(result.stdout);
    }
    if (result.stderr) {
        await job.addLog(result.stderr);
    }
    if (result.code > 0) {
        throw new Error(`Failed: terraform init | Deployment: ${job.deployment.id}`);
    }
}

async function runPlan(job) {
    await job.addLog(`$ terraform plan`);
    let result = shelljs.exec(`terraform -chdir=${job.getTerraformRoot()} plan -input=false -no-color`, {silent: true});
    if (result.stdout) {
        await job.addLog(result.stdout);
    }
    if (result.stderr) {
        await job.addLog(result.stderr);
    }
    if (result.code > 0) {
        throw new Error(`Failed: terraform plan | Deployment: ${job.deployment.id}`);
    }
}

async function runApply(job) {
    await job.addLog(`$ terraform apply -auto-approve`);
    let result = shelljs.exec(`terraform -chdir=${job.getTerraformRoot()} apply -input=false -auto-approve -no-color`, {silent: true});
    if (result.stdout) {
        await job.addLog(result.stdout);
    }
    if (result.stderr) {
        await job.addLog(result.stderr);
    }
    if (result.code > 0) {
        throw new Error(`Failed: terraform apply | Deployment: ${job.deployment.id}`);
    }
}

async function runOutput(job) {
    await job.addLog(`$ terraform output -json`);
    let result = shelljs.exec(`terraform -chdir=${job.getTerraformRoot()} output -json -no-color`, {silent: true});
    if (result.stdout) {
        await job.addLog(result.stdout);
    }
    if (result.stderr) {
        await job.addLog(result.stderr);
    }
    if (result.code > 0) {
        throw new Error(`Failed: terraform output | Deployment: ${job.deployment.id}`);
    }
    await Deployment.query()
        .where('id', job.deployment.id)
        .update({'output': result.stdout});
}

module.exports = {
    run: async (job) => {
        await runInit(job);
        await runPlan(job); // TODO: Save plan file and use with apply
        await runApply(job);
        await runOutput(job);
    }
}