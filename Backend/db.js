//modules
const {Client, Pool}  = require('pg');
const pg_errors       = require('pg-error-constants');

//local files
const { db_cred }     = require('./priv/cred.js');

//module setup

//constants
const pool = new Pool({
    user:     db_cred.user_name,
    host:     db_cred.host,
    database: db_cred.database,
    password: db_cred.password,
    port:     db_cred.port,
});

const schema_name = 'public';

const user_table     = `${schema_name}.users`;
const token_table    = `${schema_name}.login_tokens`;
const topic_table    = `${schema_name}.topics`;
const comments_table = `${schema_name}.comments`;

//local functions

//export
exports.errors =
db_errors = {
    NO_ERROR: 0,
    NO_RESPONSE: 1,
    INTERNAL_ERROR: 2,
    USER_ALREADY_REGISTERED: 3,
    TOKEN_EXISTS: 4
}

exports.add_user =
async function add_user(user_id, email, password_hash) {
    return await pool.query(
            `INSERT INTO ${user_table} (user_id, email, password_hash) VALUES ($1,$2,$3);`,
            [user_id, email, password_hash])
        .then( () => {
            return { error: db_errors.NO_ERROR };
        })
        .catch((err) => {
            if(err.code == pg_errors.UNIQUE_VIOLATION ) {
                return { error: db_errors.USER_ALREADY_REGISTERED };
            } else {
                return { error: db_errors.INTERNAL_ERROR };
            }
        });
};

exports.get_login =
async function get_login(email) {
    return await pool.query(
            `SELECT user_id, password_hash FROM ${user_table} WHERE email=$1;`,
            [email])
        .then((res)=> {
            //check how many results we got
            if(res.rowCount == 0) {
                //if none, return empty
                return { error: db_errors.NO_RESPONSE };
            } else if(res.rowCount == 1) {
                //if one, parse out info and return it
                return {
                    error: db_errors.NO_ERROR,
                    user_id: res.rows[0].user_id,
                    salted_hash: res.rows[0].password_hash,
                };
            } else {
                //if more than one, we've got issues
                return { error: db_errors.INTERNAL_ERROR }
            }
        })
        .catch((err) => {
            return { error: db_errors.INTERNAL_ERROR }
        });
};

exports.get_token =
async function get_token(user_id) {
    //expiration time is an integer representing GMT epoch time
    return await pool.query(
            `SELECT token_id, extract(epoch FROM expiration_time) AS expiration_time FROM ${token_table} WHERE user_id=$1;`,
            [user_id])
        .then((res)=> {
            //check how many results we got
            if(res.rowCount == 0) {
                //if none, return empty
                return { error: db_errors.NO_RESPONSE };
            } else if(res.rowCount == 1) {
                //if one, pull out the info and return it
                return {
                    error: db_errors.NO_ERROR,
                    token: res.rows[0].token_id,
                    expiration: res.rows[0].expiration_time,
                };
            } else {
                //if more than one, we've got issues
                return { error: db_errors.INTERNAL_ERROR };
            }
        })
        .catch((err) => {
            return { error: db_errors.INTERNAL_ERROR };
        });
};

exports.add_token =
async function add_token(user_id, token_id, expiration_time) {
    //expiration time is an integer representing GMT epoch time
    return await pool.query(
            `INSERT INTO ${token_table} VALUES ($1,$2, to_timestamp($3));`,
            [user_id, token_id, expiration_time])
        .then((res)=> {
            return {
                error: db_errors.NO_ERROR,
            }
        })
        .catch((err) => {
            if(err.code == pg_errors.UNIQUE_VIOLATION ) {
                //user already has a token
                return { error: db_errors.TOKEN_EXISTS };
            } else {
                return { error: db_errors.INTERNAL_ERROR };
            }
        });
};

exports.remove_token =
async function remove_token(user_id, token_id) {
    return await pool.query(
            `DELETE FROM ${token_table} WHERE user_id=$1 AND token_id=$2;`,
            [user_id, token_id])
        .then((res)=> {
            // res.rowCount is # of deleted rows
            return {
                error: db_errors.NO_ERROR,
            };
        })
        .catch((err) => {
            return { error: db_errors.INTERNAL_ERROR };
        });
};