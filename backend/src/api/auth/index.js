module.exports = app => {
    app.post('/auth/signup', async (req, res) => {
        await require('./action_signup').execute(req, res)
    });
    app.post('/auth/generate-token', async (req, res) => {
        await require('./action_generate_token').execute(req, res);
    });
    app.get('/auth/my-info', async (req, res) => {
        await require('./action_get').execute(req, res);
    });
    app.post('/auth/my-info', async (req, res) => {
        await require('./action_update').execute(req, res);
    });
}