const {Environment} = require('../../../common/db');
const Command = require('../../command');

async function runInit(job) {
    let command = `terraform init \
-backend-config="access_key=$TF_VAR_aws_access_key" \
-backend-config="secret_key=$TF_VAR_aws_secret_key" \
-input=false -no-color -force-copy`;
    let result = await Command.run({
        logger: job.taskLogger,
        command: command,
        options: {
            cwd: job.getTerraformRoot(),
            env: {
                TF_VAR_aws_region: job.environment.region,
                TF_VAR_aws_access_key: job.environment.access_key,
                TF_VAR_aws_secret_key: job.environment.secret_key
            }
        }
    })
    if (result.exitCode > 0) {
        throw new Error(`Failed: terraform init | Task: ${job.task.id}`);
    }
}

async function runApply(job) {
    let result = await Command.run({
        logger: job.taskLogger,
        command: `terraform apply -input=false -auto-approve -no-color`,
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
        throw new Error(`Failed: terraform apply | Task: ${job.task.id}`);
    }
}

async function runOutput(job) {
    let result = await Command.run({
        logger: job.taskLogger,
        command: `terraform output -json -no-color`,
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
        throw new Error(`Failed: terraform output | Task: ${job.task.id}`);
    }
    return JSON.parse(result.stdout());
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
        await runInit(job);
        await runApply(job);
        let output = await runOutput(job);
        await updateEnvironmentOutputs(job, output);
    }
}