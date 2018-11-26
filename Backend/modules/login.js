//modules
const bcrypt     = require('bcrypt');
const request    = require('request-promise');

//local files
const database        = require('../lib/db.js');
const { g_cred }      = require('../priv/cred.js');
const { gen_user_id } = require('../lib/id_gen');

//module setup

//constants
const password_min_len = 8;
const password_max_len = 32;

const salt_rounds      = 10;

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

//exported functions
exports.register =
async function register(email, password, recaptcha_code) {
    //return fields:
    // invalid_login
    // server_error
    // user_already_registered
    // success

    if(!check_password(password) || !check_email(email)) return { invalid_login: true };

    let salted_hash = await bcrypt.hash(password, salt_rounds);
    let userID = gen_user_id();

    let { error } = await database.add_user(userID,email, salted_hash);

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