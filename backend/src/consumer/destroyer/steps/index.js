module.exports = {
    run: async (job) => {
        await require('./step_destroy').run(job);
        await require('./step_rmdir').run(job);
    }
}