//modules
const express            = require('express');
const bodyParser         = require('body-parser');
const bearerToken        = require('express-bearer-token');
const enforceContentType = require('enforce-content-type')

const { auth_router } = require('./routes/auth_routes.js');
const { topic_router } = require('./routes/topic_routes.js');
const { comment_router } = require('./routes/comment_routes.js');

//module setup
const app = express();

app.use(enforceContentType({
    type: 'application/json'
}));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bearerToken({
    bodyKey: 'access_token',
    queryKey: 'access_token',
    headerKey: 'Bearer',
    reqKey: 'token'
}));

//routers
app.use('/api/auth/',    auth_router);
app.use('/api/topic/',   topic_router);
app.use('/api/comment/', comment_router);

//constants
const port = 3300;

//start server
app.listen(port, () => {
    console.log(`Listening on port ${port}!`)
});