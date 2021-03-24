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
    app.get('/environments/:id/variables', async (req, res) => {
        await require('./action_variables').execute(req, res);
    });
    app.put('/environments/:id/variables', async (req, res) => {
        await require('./action_variables_update').execute(req, res);
    });
    app.post('/environments/:id/destroy', async (req, res) => {
        await require('./action_destroy').execute(req, res);
    });
    app.post('/environments/:id/add-domain', async (req, res) => {
        await require('./action_domain_add').execute(req, res);
    });
    app.post('/environments/:id/delete-domain', async (req, res) => {
        await require('./action_domain_delete').execute(req, res);
    });
};