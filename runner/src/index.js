require('dotenv').config()
const express = require('express');
const updatePackagesFolder = require('./update_packages_folder');

const app = express();
app.use(express.text());
app.use(express.json());
app.set('etag', false);
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
});

app.get('/', (req, res) => {
    res.status(200).json({status: 'OK'});
});

app.post('/packages/sync', async (req, res) => {
    try {
        if (req.header('authorization') !== `Bearar ${process.env.TOKEN}`) {
            return res.status(401).json({});
        }
        await updatePackagesFolder(req.body.project_id, req.body.runtime || null);
        res.status(200).json({});
    } catch (e) {
        console.error(e);
        res.status(400).json({});
    }
});

const server = app.listen(process.env.PORT, () => console.log(`Listening on port: ${process.env.PORT}`));
require('./lsp')(server);
