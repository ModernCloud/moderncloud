module.exports = app => {
    app.get('/functions', async (req, res) => {
        await require('./action_search').execute(req, res);
    });
    app.post('/functions', async (req, res) => {
        await require('./action_create').execute(req, res);
    });
    app.put('/functions/:id', async (req, res) => {
        await require('./action_update').execute(req, res);
    });
    app.get('/functions/:id', async (req, res) => {
        await require('./action_get').execute(req, res);
    });
    app.delete('/functions/:id', async (req, res) => {
        await require('./action_delete').execute(req, res);
    });
}