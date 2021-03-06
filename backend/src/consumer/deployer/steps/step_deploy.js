const shelljs = require('shelljs');

async function runInit(job) {
    await job.addLog(`$ terraform init`);
    let result = shelljs.exec(`terraform -chdir=${job.getTerraformRoot()} init -input=false -no-color`, {silent: true});
    await job.addLog(result.stdout || result.stderr);
    if (result.code > 0) {
        throw new Error(`Failed: terraform init | Deployment: ${job.deployment.id}`);
    }
}

async function runPlan(job) {
    await job.addLog(`$ terraform plan`);
    let result = shelljs.exec(`terraform -chdir=${job.getTerraformRoot()} plan -input=false -no-color`, {silent: true});
    await job.addLog(result.stdout || result.stderr);
    if (result.code > 0) {
        throw new Error(`Failed: terraform plan | Deployment: ${job.deployment.id}`);
    }
}

async function runApply(job) {
    await job.addLog(`$ terraform apply -auto-approve`);
    let result = shelljs.exec(`terraform -chdir=${job.getTerraformRoot()} apply -input=false -auto-approve -no-color`, {silent: true});
    await job.addLog(result.stdout || result.stderr);
    if (result.code > 0) {
        throw new Error(`Failed: terraform apply | Deployment: ${job.deployment.id}`);
    }
}

module.exports = {
    run: async (job) => {
        await runInit(job);
        await runPlan(job); // TODO: Save plan file and use with apply
        await runApply(job);
    }
}