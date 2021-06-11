const { Environment } = require('../../../common/db');
const Command = require('../../command');

async function runDestroy(job) {
    let result = await Command.run({
        logger: job.taskLogger,
        command: `terraform destroy -auto-approve -input=false -no-color`,
        options: {
            cwd: job.getTerraformRoot(),
            env: {
                TF_VAR_aws_region: job.environment.region,
                TF_VAR_aws_access_key: job.environment.access_key,
                TF_VAR_aws_secret_key: job.environment.secret_key
            }
        }
    });
    if (result.exitCode > 0) {
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