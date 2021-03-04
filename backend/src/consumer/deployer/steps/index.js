module.exports = {
    run: async (job) => {
        await require('./step_directories').run(job);
        await require('./step_terraform_files').run(job);
        await require('./step_source_code').run(job);
        await require('./step_packages').run(job);
        await require('./step_deploy').run(job);
        await require('./step_finalize').run(job);
    }
}