require('dotenv').config()
const express = require('express');
const app = express();
app.use(express.text());
app.use(express.json());
app.set('etag', false);
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
});

const server = app.listen(process.env.PORT, () => console.log(`Listening on port: ${process.env.PORT}`));
require('./lsp')(server);
