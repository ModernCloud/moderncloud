module.exports = app => {
    app.get('/deployments', async (req, res) => {
        await require('./action_search').execute(req, res);
    });
    app.post('/deployments', async (req, res) => {
        await require('./action_create').execute(req, res);
    });
    app.get('/deployments/:id', async (req, res) => {
        await require('./action_get').execute(req, res);
    });
}