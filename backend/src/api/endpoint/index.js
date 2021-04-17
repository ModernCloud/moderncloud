module.exports = app => {
    app.get('/endpoints', async (req, res) => {
        await require('./action_search').execute(req, res);
    });
    app.post('/endpoints', async (req, res) => {
        await require('./action_create').execute(req, res);
    });
    app.put('/endpoints/:id', async (req, res) => {
        await require('./action_update').execute(req, res);
    });
    app.put('/endpoints/:id/code', async (req, res) => {
        await require('./action_update_code').execute(req, res);
    });
    app.get('/endpoints/:id', async (req, res) => {
        await require('./action_get').execute(req, res);
    });
    app.delete('/endpoints/:id', async (req, res) => {
        await require('./action_delete').execute(req, res);
    });
}