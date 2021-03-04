module.exports = app => {
    app.get('/environments', async (req, res) => {
        await require('./action_search').execute(req, res);
    });
    app.post('/environments', async (req, res) => {
        await require('./action_create').execute(req, res);
    });
    app.put('/environments/:id', async (req, res) => {
        await require('./action_update').execute(req, res);
    });
    app.get('/environments/:id', async (req, res) => {
        await require('./action_get').execute(req, res);
    });
};