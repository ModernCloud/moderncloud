module.exports = app => {
    app.get('/packages/search-api', async (req, res) => {
        await require('./action_search_api').execute(req, res);
    });
    app.get('/packages', async (req, res) => {
        await require('./action_search').execute(req, res);
    });
    app.get('/packages/count', async (req, res) => {
        await require('./action_package_count').execute(req, res);
    });
    app.post('/packages', async (req, res) => {
        await require('./action_create').execute(req, res);
    });
    app.put('/packages/:id', async (req, res) => {
        await require('./action_update').execute(req, res);
    });
    app.get('/packages/:id', async (req, res) => {
        await require('./action_get').execute(req, res);
    });
    app.delete('/packages/:id', async (req, res) => {
        await require('./action_delete').execute(req, res);
    });
}