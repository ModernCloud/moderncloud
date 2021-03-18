const shelljs = require('shelljs');

async function runDestroy(job) {
    let result = shelljs.exec(`terraform -chdir=${job.getTerraformRoot()} destroy -auto-approve -input=false -no-color`, {silent: true});
    if (result.code > 0) {
        throw new Error(`Failed: terraform destroy`);
    }
}

module.exports = {
    run: async (job) => {
        await runDestroy(job);
    }
}