const shelljs = require('shelljs');
const { Environment, EnvironmentOutput } = require('../../../common/db');

async function runDestroy(job) {
    await job.addLog(`$ terraform destroy -auto-approve`);
    let result = shelljs.exec(`terraform -chdir=${job.getTerraformRoot()} destroy -auto-approve -input=false -no-color`, {silent: true});
    if (result.stdout) {
        await job.addLog(result.stdout);
    }
    if (result.stderr) {
        await job.addLog(result.stderr);
    }
    if (result.code > 0) {
        throw new Error(`Failed: terraform destroy | Task: ${job.task.id}`);
    }
}

async function updateEnvironment(job) {
    await Environment.query()
        .where('id', job.environment.id)
        .update({
            api_gateway_id: null,
            api_gateway_url: null,
            api_gateway_arn: null,
            output: null
        });
}

module.exports = {
    run: async (job) => {
        await runDestroy(job);
        await updateEnvironment(job);
    }
}