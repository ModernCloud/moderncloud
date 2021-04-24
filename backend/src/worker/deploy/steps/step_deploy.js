const shelljs = require('shelljs');
const {Environment, EnvironmentOutput, Endpoint, Function} = require('../../../common/db');

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
        throw new Error(`Failed: terraform init | Task: ${job.task.id}`);
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
        throw new Error(`Failed: terraform apply | Task: ${job.task.id}`);
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
        throw new Error(`Failed: terraform output | Task: ${job.task.id}`);
    }
    return JSON.parse(result.stdout);
}

async function updateEnvironmentOutputs(job, json) {
    await Environment.query()
        .where('id', job.environment.id)
        .update({
            'api_gateway_id': json.api_gateway_id.value,
            'api_gateway_url': json.api_gateway_url.value,
            'api_gateway_arn': json.api_gateway_arn.value,
            'output': JSON.stringify(json)
        });
}

module.exports = {
    run: async (job) => {
        shelljs.env['TF_VAR_aws_region'] = job.environment.region;
        shelljs.env['TF_VAR_aws_access_key'] = job.environment.access_key;
        shelljs.env['TF_VAR_aws_secret_key'] = job.environment.secret_key;
        await runInit(job);
        await runApply(job);
        let output = await runOutput(job);
        await updateEnvironmentOutputs(job, output);
    }
}