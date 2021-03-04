module.exports = app => {
    app.get('/projects', async (req, res) => {
        await require('./action_search').execute(req, res);
    });
    app.post('/projects', async (req, res) => {
        await require('./action_create').execute(req, res);
    });
    app.get('/projects/:id', async (req, res) => {
        await require('./action_get').execute(req, res);
    });
    app.put('/projects/:id', async (req, res) => {
        await require('./action_update').execute(req, res);
    });
}