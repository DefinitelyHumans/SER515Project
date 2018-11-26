//modules

//local files
const database           = require('../lib/db.js');
const { gen_comment_id } = require('../lib/id_gen');

//module setup

//constants
const password_min_len = 8;
const password_max_len = 32;

const salt_rounds      = 10;

//local functions

//exported functions
exports.get_comment_by_id =
async function get_comment_by_id(comment_id) {

    if(!comment_id) return { not_found: true };

    let comment_info = await database.get_comment(comment_id);

    if(comment_info.error == database.errors.NO_RESPONSE) {
        return { not_found: true };
    }
    else if(comment_info.error == database.errors.INTERNAL_ERROR) {
        return { server_error: true };
    }

    return { comment: comment_info };
}

exports.get_comments_for_topic =
async function get_comments_for_topic(topic_id) {

    if(!topic_id) return { not_found: true };

    let comment_array = await database.get_comments_by_topic(topic_id);

    if(comment_array.error == database.errors.NO_RESPONSE) {
        return { not_found: true };
    }
    else if(comment_array.error == database.errors.INTERNAL_ERROR) {
        return { server_error: true };
    }

    return { comment_ids: comment_array.comment_ids };
}

exports.create_comment =
async function create_comment(topic_id, content, user_id) {
    if(!topic_id) return { request_error: true };
    if(!content) return { request_error: true };

    let comment_id = gen_comment_id();

    let comment_info = await database.add_comment(comment_id, topic_id, user_id, content);

    if(comment_info.error == database.errors.INTERNAL_ERROR) {
        return { server_error: true };
    } else {
        return {
            success: true,
            comment: {
                id:           comment_id,
                topic_id:     topic_id,
                user_id:      user_id,
                comment_body: content,
                time_posted:  comment_info.time_posted
            }
        };
    }
}