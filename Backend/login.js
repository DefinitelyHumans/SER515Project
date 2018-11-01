//modules
const rand_token = require('rand-token');
const bcrypt     = require('bcrypt')
const request    = require('request-promise')
const dateTime   = require('node-datetime');

//local files
const database   = require('./db.js')
const { g_cred } = require('./priv/cred.js')

//module setup
const rand = rand_token.generator({source : 'crypto'}); //TODO: check for entropy exceptions

//constants
const password_min_len = 8;
const password_max_len = 32;

const salt_rounds      = 10;

const token_length     = 32;
const token_style      = 'default';

const userid_length     = 32;
const userid_style      = '0123456789abcdefghijklmnopqrstuvwxyz';

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
    dateTime.setOffsetInHours(4);

    let timestamp = dateTime.create().epoch();
    dateTime.setOffsetInHours(0);
    return timestamp;
}

function is_expired(expiration_time) {
    dateTime.setOffsetInHours(0); //just in case
    return (expiration_time >= dateTime.create().epoch())
}

function check_password(password) {
    //check min and max lengths
    if(password.length < password_min_len) return false;
    if(password.length > password_max_len) return false;
    //make sure password is ascii only
    return /^[\x00-\x7F]*$/.test(password);
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
    // invalid_login
    // recaptcha_fail
    // server_error
    // user_already_registered
    // success

    if(!check_password(password)) return { invalid_login: true };

    //check the recaptcha field
    let verify_return = check_recaptcha(recaptcha_code)

    if(verify_return.success == false)
        return { recaptcha_fail: true };
    else if(verify_return.error)
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
    if(!check_password) return { invalid_login: true };

    console.log("get login");
    let login_info = await database.get_login(email);

    if(login_info.error == database.errors.NO_RESPONSE) {
        return { invalid_login: true };
    } else if (login_info.error = database.errors.INTERNAL_ERROR) {
        return { server_error: true };
    } else {
        //compare the password to the hash using a specialized comparison function
        if(!(await bcrypt.compare(password, salted_hash))) {
            //if it fails the password is wrong
            return { invalid_login: true };
        }
        else {
            console.log("get token");
            let old_token = await database.get_token(user_id);
            console.log(old_token);
            if(old_token.error != database.errors.NO_ERROR) {
                return { server_error: true }
            }

            let token = gen_token();
            let expire_time = get_expiration_time();

            if(old_token.token) {
                if(!is_expired(old_token.expiration)) {
                    //if they already have a token and it isn't expired
                    // just return the token
                    return {
                        token: old_token.token,
                        user_id: user_id
                    };
                } else {
                    //if it is expired, update it.
                    console.log("update token");
                    let { error } = await database.update_token(user_id, token, expire_time);
                    console.log(error);
                    if(error == database.errors.NO_ERROR) {
                        return {
                            token: token,
                            user_id: user_id
                        };
                    }
                }
            } else {
                //add the login token the user db entry
                console.log("add token");
                let { error } = await database.add_token(user_id, token, expire_time);
                console.log(error);
                if(error == database.errors.NO_ERROR) {
                    return {
                        token: token,
                        user_id: user_id
                    };
                }
            }
        }
    }
    //for all remaining un-successful flows, return a server_failure
    return { server_error: true };
}