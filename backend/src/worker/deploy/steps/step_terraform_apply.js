const {Environment} = require('../../../common/db');
const Command = require('../../command');

class StepTerraformApply {
    constructor(workerTask) {
        this.workerTask = workerTask;
    }

    static factory(workerTask) {
        return new StepTerraformApply(workerTask);
    }

    async run() {
        await this.runInit();
        await this.runApply();
        let output = await this.runOutput();
        await this.updateEnvironmentOutputs(output);
    }

    async runInit() {
        let command = `terraform init \
-backend-config="access_key=$TF_VAR_aws_access_key" \
-backend-config="secret_key=$TF_VAR_aws_secret_key" \
-input=false -no-color -force-copy`;
        let result = await Command.run({
            logger: this.workerTask.dbLogger,
            command: command,
            options: {
                cwd: this.workerTask.getTerraformRoot(),
                env: {
                    TF_VAR_aws_region: this.workerTask.environment.region,
                    TF_VAR_aws_access_key: this.workerTask.environment.access_key,
                    TF_VAR_aws_secret_key: this.workerTask.environment.secret_key
                }
            }
        })
        if (result.exitCode > 0) {
            throw new Error(`Failed: terraform init | Task: ${this.workerTask.task.id}`);
        }
    }

    async runApply() {
        let result = await Command.run({
            logger: this.workerTask.dbLogger,
            command: `terraform apply -input=false -auto-approve -no-color`,
            options: {
                cwd: this.workerTask.getTerraformRoot(),
                env: {
                    TF_VAR_aws_region: this.workerTask.environment.region,
                    TF_VAR_aws_access_key: this.workerTask.environment.access_key,
                    TF_VAR_aws_secret_key: this.workerTask.environment.secret_key
                }
            }
        });
        if (result.exitCode > 0) {
            throw new Error(`Failed: terraform apply | Task: ${this.workerTask.task.id}`);
        }
    }

    async runOutput() {
        let result = await Command.run({
            logger: this.workerTask.dbLogger,
            command: `terraform output -json -no-color`,
            options: {
                cwd: this.workerTask.getTerraformRoot(),
                env: {
                    TF_VAR_aws_region: this.workerTask.environment.region,
                    TF_VAR_aws_access_key: this.workerTask.environment.access_key,
                    TF_VAR_aws_secret_key: this.workerTask.environment.secret_key
                }
            }
        });
        if (result.exitCode > 0) {
            throw new Error(`Failed: terraform output | Task: ${this.workerTask.task.id}`);
        }
        return JSON.parse(result.stdout());
    }

    async updateEnvironmentOutputs(output) {
        await Environment.query()
            .where('id', this.workerTask.environment.id)
            .update({
                'api_gateway_id': output.api_gateway_id.value,
                'api_gateway_url': output.api_gateway_url.value,
                'api_gateway_arn': output.api_gateway_arn.value,
                'output': JSON.stringify(output)
            });
    }
}

module.exports = StepTerraformApply;