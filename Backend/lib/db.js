//modules
const {Client, Pool}  = require('pg');
const pg_errors       = require('pg-error-constants');
const dateTime        = require('node-datetime');

//local files
const { db_cred }     = require('../priv/cred.js');

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


/**
 * Topic ID is expected parameter for distinctive topic retrieval.
 * @return Topic Object with populated properties.
 */
exports.get_topic =
async function get_topic(topic_id) {
    return await pool.query(
            `SELECT topic_title, topic_time_posted, topic_type, topic_content, user_posted FROM ${topic_table} WHERE topic_id=$1;`,
            [topic_id])
        .then((res)=> {
            //check how many results we got
            if(res.rowCount == 0) { // If none, return error
                return { error: db_errors.NO_RESPONSE };
            } else if(res.rowCount == 1) { // If found, parse out info & return.
                return {    // Parsing data for pertinent information.
                    topic: {
                        topic_title:       res.rows[0].topic_title,
                        topic_time_posted: res.rows[0].topic_time_posted,
                        topic_type:        res.rows[0].topic_type,
                        topic_content:     res.rows[0].topic_content,
                        user_posted:       res.rows[0].user_posted,
                    },
                    error: db_errors.NO_ERROR,
                };
            } else {    // If more than one, internal error.
                return { error: db_errors.INTERNAL_ERROR }
            }
        })
        .catch((err) => {
            return { error: db_errors.INTERNAL_ERROR }
        });
};


/**
 * User ID is expected parameter for retrieving a list of topics created by specific user.
 * @returns List of topic objects containing all respective visual info.
 */
exports.get_topics_by_user =
async function get_topics_by_user(user_id) {
    return await pool.query(
            `SELECT topic_title, topic_time_posted, topic_type, topic_content, user_posted FROM ${topic_table} WHERE user_posted=$1;`,
            [user_id])
        .then((res)=> {
            //check how many results we got
            if(res.rowCount == 0) {
                //if none, return empty
                return { error: db_errors.NO_RESPONSE };
            } else if(res.rowCount >= 1) {   // If list found, return list.
                // Result list is stripped in query for necessary information.
                // console.log("GOTTEM", res.rows);
                return { topics: res.rows, error: db_errors.NO_ERROR };
            } else {    // If more than one, internal error.
                return { error: db_errors.INTERNAL_ERROR }
            }
        })
        .catch((err) => {
            return { error: db_errors.INTERNAL_ERROR }
        });
};

/**
 * Expected parameters for a topic object passed:
 *  topic_id
 *  topic_title
 *  topic_type
 *  topic_content
 *  user_posted
 * @returns a topic object with all properties assigned (date & ID)
 * */
exports.add_topic =
async function add_topic(topic) {
    // console.log("DB Topic", topic);
    // Grab timestamp for when topic is created.
    let timestamp = dateTime.create().epoch();    // Insert timestamp twice for posted & update.
    return await pool.query(
        `INSERT INTO ${topic_table} (topic_id, topic_title, topic_time_posted, update_time, topic_type, topic_content, user_posted) VALUES ($1,$2,to_timestamp($3),to_timestamp($3),$4,$5,$6);`,
        [topic.topic_id, topic.topic_title, timestamp, topic.topic_type, topic.topic_content, topic.user_id])
    .then((res) => {  // Return no error, topic ID, and topic time posted.
        // console.log(res);
        return {
            error: db_errors.NO_ERROR,
            topic_id : topic.topic_id,
            topic_time_posted : timestamp,

    }})
    .catch((err) => {
        // console.log(err);
        return { error: db_errors.INTERNAL_ERROR };
    });
};

/**
 * Topic ID and content to change is expected in parameter.
 * @returns The post time updated.
 */
exports.update_topic =
async function update_topic(topic) {
    // Update Topic time posted
    let timestamp = dateTime.create().epoch();
    return await pool.query(
            `UPDATE ${topic_table} SET topic_content=$1, update_time=to_timestamp($2) WHERE topic_id=$3;`,
            [topic.topic_content, timestamp, topic.topic_id])
        .then((res)=> { // Return no error message and updated time from success request.
            return {
                error: db_errors.NO_ERROR,
                update_time: timestamp,
            };
        })
        .catch((err) => {
            // console.log(err);
            return { error: db_errors.INTERNAL_ERROR };
        });
};


/**
 * Expected parameter is the topic ID.
 */
exports.remove_topic =
async function remove_topic(topic_id) {
    return await pool.query(
        `DELETE FROM ${topic_table} WHERE topic_id=$1;`,
        [topic_id])
    .then( (res) => {
        return { error: db_errors.NO_ERROR };
    })
    .catch((err) => {
        return { error: db_errors.INTERNAL_ERROR };
    });
};