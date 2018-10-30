//modules
const express            = require('express');
const bodyParser         = require('body-parser');
const bearerToken        = require('express-bearer-token');
const enforceContentType = require('enforce-content-type')

//local files
const auth  = require('./login.js')
const token = require('./lib/token.js')

//module setup
const app = express();

app.use(enforceContentType({
    type: 'application/json'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bearerToken({
    bodyKey: 'access_token',
    queryKey: 'access_token',
    headerKey: 'Bearer',
    reqKey: 'token'
}));

//constants
const port = 3300;

//start server
app.listen(port, () => {
    console.log(`Listening on port ${port}!`)
});

//path listeners
app.get('/', function (req, res) {
    res.sendFile("login.html", { root: __dirname });
});

app.post('/api/auth/login', async function (req, res) {
    let body = req.body;

    let login_info = await auth.login(body.email, body.password);
    if(login_info.invalid_login) {
        res.statusCode = 401;
        res.send("")
    } else if(login_info.server_error) {
        res.statusCode = 500;
        res.send("")
    } else {
        if(login_info.success && login_info.user_id) {
            token.get_token(login_info.user_id)
            .then((token) => {
                res.statusCode = 200;
                res.send({
                    auth_token: token,
                });
            })
            .catch((error) => {
                res.statusCode = 500;
                res.send("");
            })
        } else {
            //if we make it here then something failed pretty hard
            res.statusCode = 500;
            res.send("")
        }
    }
});

app.post('/api/auth/register', async function (req, res) {
    // invalid_login
    // recaptcha_fail
    // server_error
    // user_already_registered
    // success
    let body = req.body;

    let register_info = await auth.register(body.email, body.password, body["g-recaptcha-response"]);

    if(register_info.invalid_login) {
        res.statusCode = 401;
        res.send({error: "Invalid Credentials"});
    } else if(register_info.recaptcha_fail) {
        res.statusCode = 412;
        res.send({error: "Invalid Recaptcha Token"});
    } else if(register_info.user_already_registered) {
        res.statusCode = 400;
        res.send({error: "User Already Registered"});
    } else if(register_info.server_error) {
        res.statusCode = 500;
        res.send({error: "Server Error"});
    } else {
        if(register_info.success) {
            res.statusCode = 200;
            res.send("");
        } else {
            //if we make it here then something failed pretty hard
            res.statusCode = 500;
            res.send({error: "Server Error"});
        }
    }
});