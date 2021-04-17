module.exports = app => {
    app.post('/tasks/:task_name/run', async (req, res) => {
        await require('./action_create').execute(req, res);
    });
    app.get('/tasks/:id', async (req, res) => {
        await require('./action_get').execute(req, res);
    });
}