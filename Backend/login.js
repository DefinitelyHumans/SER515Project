//modules
const rand_token = require('rand-token');
const bcrypt     = require('bcrypt')
const request    = require('request-promise')
const dateTime   = require('node-datetime');

//local files
const auth_db   = require('./db.js')
const { g_cred }= require('./priv/cred.js')

//module setup
const rand = rand_token.generator({source : 'crypto'}); //TODO: check for entropy exceptions
const db_error = auth_db.pg_errors;

//constants
const password_min_len = 8;
const password_max_len = 32;

const salt_rounds      = 10;

const token_length     = 32;
const token_style      = 'default';

const userid_length     = 16;
const userid_style      = '0123456789abcdefghijklmnopqrstuvwxy';

//local functions
async function check_recaptcha(response_token, remote_ip) {
    return await request({
        method: 'POST',
        url: 'https://www.google.com/recaptcha/api/siteverify',
        body: {
            'secret': g_cred.secret,
            'response': response_token,
            'remoteip': remote_ip,
        },
        json: true,
    })
    .then((body) => {
        if(body["success"]) {
            console.log("Confirmed human");
            return { success: true };
        } else {
            return { success: false };
        }
    })
    .catch((err) => {
       return { error: true }; //TODO: maybe just 500?
    });
}

function get_expiration_time() {
    dateTime.setOffsetInHourss(4);

    let timestamp = dateTime.create().epoch();
    dateTime.setOffsetInHourss(0);
    return timestamp;
}

function check_password(password) {
    if(password.length < password_min_len) return false;
    if(password.length > password_max_len) return false;
    return true;
}

function gen_user_id() {
    return rand.generate(userid_length, userid_style);
}

function gen_token() {
    return rand.generate(token_length, token_style);
}

//exported functions
exports.register =
async function register(email, password, recaptcha_code) {
    //return fields:
    // invalid_password
    // recaptcha_fail
    // server_error
    // user_already_registered
    // success

    if(!check_password(password)) return { invalid_password: true };

    //check the recaptcha field
    let {success, error} = check_recaptcha(recaptcha_code)) 

    if(success == false)
        return { recaptcha_fail: true };
    else if(error)
        return { server_error: true };

    let salted_hash = await bcrypt.hash(password, salt_rounds);
    let userID = gen_user_id();

    let {error} = await database.add_user(userID,email, salted_hash);

    if(error == database.errors.USER_ALREADY_REGISTERED) {
        return { user_already_registered: true };
    }
    else if(error == database.errors.INTERNAL_ERROR) {
        return { server_error: true };
    }

    return {success: true};
}

exports.login =
async function login(email, password) {
    //return fields:
    // invalid_password
    // server_error
    // token, user_id
    if(!check_password) return { invalid_password: true };

    let token = gen_token();
    let expire_time = get_expiration_time();

    let { error, user_id, salted_hash } = await database.get_login(email);

    if(error == database.errors.NO_ERROR) {
        //compare the password to the hash using a specialized comparison function
        if(!(await bcrypt.compare(password, salted_hash))) {
            //if it fails the password is wrong
            return { invalid_password: true };
        }
        else {
            //add the login token the user db entry
            let { error } = auth_db.add_token(user_id, token);

            if(error == database.errors.NO_ERROR) {
                return {
                    token: token,
                    user_id: user_id
                };
            }
        }
    }
    //for all remaining un-successful flows, return a server_failure
    return { server_error: true };
}