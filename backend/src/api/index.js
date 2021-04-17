require('dotenv').config()
const express = require('express');
const app = express();
app.use(express.text());
app.use(express.json());
app.set('etag', false);
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
})

require('./auth')(app);
require('./environment')(app);
require('./function')(app);
require('./project')(app);
require('./endpoint')(app);
require('./package')(app);
require('./dynamodb')(app);
require('./task')(app);

app.listen(process.env.PORT, () => console.log(`Listening on port: ${process.env.PORT}`));
