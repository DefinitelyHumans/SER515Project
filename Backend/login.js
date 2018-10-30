//modules
const rand_token = require('rand-token');
const bcrypt     = require('bcrypt')
const request    = require('request-promise')
const dateTime   = require('node-datetime');

//local files
const database   = require('./db.js')
const { g_cred } = require('./priv/cred.js')

//module setup
const rand = rand_token.generator({source : 'crypto'});

//constants
const password_min_len = 8;
const password_max_len = 32;

const salt_rounds      = 10;

const userid_length     = 32;
const userid_style      = '0123456789abcdefghijklmnopqrstuvwxyz';

//local functions
async function check_recaptcha(response_token, remote_ip) {
    if(!response_token) return { success: false };
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
            return { success: true };
        } else {
            return { success: false };
        }
    })
    .catch((err) => {
       return { error: true };
    });
}

function check_password(password) {
    if(!password) return false
    //check min and max lengths
    if(password.length < password_min_len) return false;
    if(password.length > password_max_len) return false;
    //make sure password is ascii only
    return /^[\x00-\x7F]*$/.test(password);
}

function check_email(email) {
    if(!email) return false;
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
}

function gen_user_id() {
    return rand.generate(userid_length, userid_style);
}

//exported functions
exports.register =
async function register(email, password, recaptcha_code) {
    //return fields:
    // invalid_login
    // recaptcha_fail
    // server_error
    // user_already_registered
    // success

    if(!check_password(password) || !check_email(email)) return { invalid_login: true };

    //check the recaptcha field
    let recaptcha_check = await check_recaptcha(recaptcha_code);
    if(!recaptcha_check.success)
        return { recaptcha_fail: true };
    else if(recaptcha_check.error)
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
    // invalid_login
    // server_error
    // token, user_id
    if(!check_password(password) || !check_email(email)) return { invalid_login: true };

    console.log("get login");
    let login_info = await database.get_login(email);
    if(login_info.error == database.errors.NO_RESPONSE) {
        return { invalid_login: true };
    } else if (login_info.error == database.errors.INTERNAL_ERROR) {
        return { server_error: true };
    } else {
        //compare the password to the hash using a specialized comparison function
        let password_compare = bcrypt.compare(password, login_info.salted_hash).catch(() => {return false;});
        if(!(await password_compare)) {
            //if it fails the password is wrong
            return { invalid_login: true };
        }
        else {
            return { success: true, user_id: login_info.user_id };
        }
    }
}