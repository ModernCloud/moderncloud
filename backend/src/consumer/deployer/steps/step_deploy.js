const shelljs = require('shelljs');
const {Deployment, Environment} = require('../../../common/db');

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
    let json = JSON.parse(result.stdout);
    await Environment.query()
        .where('id', job.environment.id)
        .update({
            'api_gateway_id': json.api_gateway_id.value,
            'api_gateway_url': json.api_gateway_url.value,
            'api_gateway_arn': json.api_gateway_arn.value,
        });
}

module.exports = {
    run: async (job) => {
        await runInit(job);
        await runApply(job);
        await runOutput(job);
    }
}