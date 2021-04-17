module.exports = {
    run: async (job) => {
        await job.updateTaskStatus(1);
    }
}