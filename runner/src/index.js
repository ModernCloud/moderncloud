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
    console.log(req.headers, req.header('authorization'));
    try {
        if (req.header('authorization') !== `Bearar ${process.env.TOKEN}`) {
            throw new Error('Access denied!');
        }
        await updatePackagesFolder(req.body.project_id);
        res.status(200).json({});
    } catch (e) {
        console.log(e);
        res.status(400).json({});
    }
});

const server = app.listen(process.env.PORT, () => console.log(`Listening on port: ${process.env.PORT}`));
require('./lsp')(server);
