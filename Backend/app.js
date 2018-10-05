//modules
const express    = require('express');
const bodyParser = require('body-parser');

//localfiles
const auth       = require('./login.js')

//module setup
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
    if(login_info.invalid_password) {
        res.statusCode = 401;
        res.send("")
    } else if(login_info.server_error) {
        res.statusCode = 500;
        res.send("")
    } else {
        if(login_info.token && login_info.user_id) {
            res.statusCode = 200;
            res.send({
                auth_token: login_info.token,
                user_id: login_info.user_id,
            })
        } else {
            //if we make it here then something failed pretty hard
            res.statusCode = 500;
            res.send("")
        }
    }
});

app.post('/api/auth/register', async function (req, res) {
    // invalid_password
    // recaptcha_fail
    // server_error
    // user_already_registered
    // success
    let body = req.body;

    let register_info = await auth.register(body.email, body.password, body["g-recaptcha-response"]);

    if(register_info.invalid_password) {
        res.statusCode = 401;
        res.send("");
    } else if(register_info.recaptcha_fail ||
              register_info.user_already_registered) {
        res.statusCode = 400;
        res.send("");
    } else if(register_info.server_error) {
        res.statusCode = 500;
        res.send("");
    } else {
        if(register_info.success) {
            res.statusCode = 200;
            res.send("");
        } else {
            //if we make it here then something failed pretty hard
            res.statusCode = 500;
            res.send("");
        }
    }
});