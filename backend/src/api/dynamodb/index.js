module.exports = app => {
    app.get('/dynamodb', async (req, res) => {
        await require('./action_search').execute(req, res);
    });
    app.post('/dynamodb', async (req, res) => {
        await require('./action_create').execute(req, res);
    });
    app.put('/dynamodb/:id', async (req, res) => {
        await require('./action_update').execute(req, res);
    });
    app.get('/dynamodb/:id', async (req, res) => {
        await require('./action_get').execute(req, res);
    });
    app.delete('/dynamodb/:id', async (req, res) => {
        await require('./action_delete').execute(req, res);
    });
}