// MODULES
var express = require('express');

// LOCAL FILES
const token = require('../lib/token.js')
const auth  = require('../modules/login.js')

// MODULE SETUP
var router = express.Router()

router.post('/login', async function (req, res) {
    let body = req.body;
    console.log("logging in user from auth_route");
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
            // userID = login_info.user_id;
        } else {
            //if we make it here then something failed pretty hard
            res.statusCode = 500;
            res.send("")
        }
    }
});

/**
 * Post request for registration.
 */
router.post('/register', async function (req, res) {
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

exports.auth_router = router