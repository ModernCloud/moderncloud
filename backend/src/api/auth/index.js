module.exports = app => {
    app.post('/auth/signup', async (req, res) => {
        await require('./action_signup').execute(req, res)
    });
    app.post('/auth/generate-token', async (req, res) => {
        await require('./action_generate_token').execute(req, res);
    });
    app.post('/auth/verify-google', async (req, res) => {
        await require('./action_verify_google').execute(req, res);
    });
    app.get('/auth/my-info', async (req, res) => {
        await require('./action_get').execute(req, res);
    });
    app.get('/auth/current-subscription', async (req, res) => {
        await require('./action_current_subscription').execute(req, res);
    });
    app.get('/auth/invoices', async (req, res) => {
        await require('./action_invoices').execute(req, res);
    });
    app.post('/auth/my-info', async (req, res) => {
        await require('./action_update').execute(req, res);
    });
}