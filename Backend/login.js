//modules
const rand_token = require('rand-token');
const bcrypt     = require('bcrypt')

//local files
const auth_db   = require('./db.js')

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
function check_password() {
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
async function register(email, password) {
    if(!check_password) return false;

    let salted_hash = await bcrypt.hash(password, salt_rounds);
    let userID = gen_user_id();

    await database.add_user(userID,email, salted_hash);

    return true; //TODO: should we return the userID?
}

exports.login =
async function login(email, password) {
    if(!check_password) return {};

    let token = gen_token();

    try {
        let user_info = await database.get_login(email);
    }
    catch(e) {
        return { server_failure: true };
    }

    if(user_info != null) {
        if(!(await bcrypt.compare(password, user_info.salted_hash))) return {}

        try {
            auth_db.add_token(ser_info.user_id, token)
        }
        catch(e) {
            return { server_failure: true };
        }

        return {
            token: token,
            user_id: user_info.user_id
        };
    }
    return false;
}