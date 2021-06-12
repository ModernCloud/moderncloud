const { Environment } = require('../../../common/db');
const Command = require('../../command');

class StepTerraformDestroy {
    constructor(workerTask) {
        this.workerTask = workerTask;
    }

    static factory(workerTask) {
        return new StepTerraformDestroy(workerTask);
    }

    async run() {
        await this.runDestroy();
        await this.resetEnvironment();
    }

    async runDestroy() {
        let result = await Command.run({
            logger: this.workerTask.dbLogger,
            command: `terraform destroy -auto-approve -input=false -no-color`,
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
            throw new Error(`Failed: terraform destroy | Task: ${this.workerTask.task.id}`);
        }
    }

    async resetEnvironment() {
        await Environment.query()
            .where('id', this.workerTask.environment.id)
            .update({
                api_gateway_id: null,
                api_gateway_url: null,
                api_gateway_arn: null,
                output: null
            });
    }
}

module.exports = StepTerraformDestroy;