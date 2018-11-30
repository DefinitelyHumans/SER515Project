// MODULES

// LOCAL FILES
const database         = require('../lib/db.js')
const { gen_topic_id } = require('../lib/id_gen');

// MODULE SETUP

// CONSTANTS

// LOCAL FUNCTIONS

/**
 * Check topic title for being empty or greater than defined length.
 * Validate input values.
 * @param {String} topic_title 
 */
function check_title(topic_title) {
    if (!topic_title || (topic_title.length > 64)) return false;
    return true;
    // return /^[a-z0-9]+$/i.test(topic_title);
}

/**
 * Check topic title for being empty, or having valid characters,
 * additionally check that length isn't excessive (> 500).
 * @param {string} topic_content 
 */
function check_content(topic_content) {
    if (!topic_content || (topic_content.length > 500)) return false;
    return true;
    // return /^[a-z0-9]+$/i.test(topic_content);
}

// EXPORTED FUNCTIONS

/**
 * Topic Created contains title, type, content, and user ID.
 * Topic ID is generated here. Timestamp is assigned in DB query depending on success of query.
 * @returns success/fail message.
 */
exports.CreateTopic =
async function CreateTopic(userID, topic_title, topic_type, topic_content) {
    // Validate & Sanitize input.
    if (!check_title(topic_title) || !check_content(topic_content)) {
        return {
            success: false,
            server_error: false,
            invalid_input: true,
        };
    }

    // // Sanitize topic title and input.
    // topic_title = topic_title.replace(/[^a-zA-Z0-9\w\s]/gi, "");
    // topic_content = topic_content.replace(/[^a-zA-Z0-9\w\s]/gi, "");
    // Send DB query.
    let topic_id = gen_topic_id();  // Generate topic ID.
    let topic = {
        topic_id: topic_id,
        topic_title: topic_title,
        topic_type: topic_type,
        topic_content: topic_content,
        user_id: userID
    };
    // console.log("Topic object", topic);
    // Check for DB errors,
    let { error } = await database.add_topic(topic);
    if (error) {
        // console.log("Failed:", error);
        return {
            success: false,
            server_error: true
        };
    }
    //otherwise return success.
    return {
        success: true,
        topic: {
            topic_id: topic_id,
        }
    };
}

/**
 * Using topic ID to query a delete request.
 * @returns error and success message.
 */
exports.DeleteTopic =
async function DeleteTopic(topic_id) {
    // Validate topic id length.
    if (topic_id.length > 64) return {success:false, invalid_input: true};
    // console.log("Delete topic:", topic_id);
    let { error } = await database.remove_topic(topic_id);
    if (error) {
        // console.log("Failed:", error); // Debug error.
        return {
            success: false,
            server_error: true,
        };
    }
    return { success: true };
}

/**
 * Taking in Topic ID, and new content.
 * @returns the updated timestamp on success.
 */
exports.UpdateTopic =
async function UpdateTopic(userID, topic_id, topic_content) {
    // Validate topic id length.
    if (topic_id.length > 64) return {success:false, invalid_input: true};
    // Sanitize topic content input.
    // topic_content = topic_content.replace(/[^a-zA-Z0-9\w\s]/gi, "");
    if (!check_content(topic_content)) {
        return {
            success: false,
            server_error: false,
            invalid_input: true,
        };
    }
    // console.log("Update topic:", topic_id);
    let topic = {
        topic_id: topic_id,
        topic_content: topic_content,
        user_posted: userID
    };
    let { error, update_time } = await database.update_topic(topic);
    if (error) {    // Return error if query was unsucessfull.
        // console.log("Failed:", error);
        return {
            success: false,
            server_error: true
        };
    }
    return {
        success: true,
        topic: {
            topic_id: topic_id,
            update_time: update_time
        }
    };
}

exports.GetTopic =
async function GetTopic(topic_id) {
    if (topic_id.length > 64) return {success: false, invalid_input: true};
    // console.log("Get topic:", topic_id);
    let {topic, error} = await database.get_topic(topic_id);
    if (error == database.errors.NO_RESPONSE) {
        // console.log(topic);
        return {
            success: false,
            not_found: true
        };
    } else if(error) {
        // console.log("Failed", error);
        return {
            success: false,
            server_error: true
        };
    } else {
        // console.log("Topic retrieved",topic);
        return {
            success: true,
            topic: topic
        };
    }
}

exports.GetTopicByUserID =
async function GetTopicByUserID(user_id) {
    if (user_id.length > 32) return {success: false, invalid_input: true};
    // console.log("Get topic:", topic_id);
    let {topics, error} = await database.get_topics_by_user(user_id);
    // console.log("Topics retrieved", topics);
    if (error == database.errors.NO_RESPONSE) {
        // console.log(topic);
        return {
            success: false,
            not_found: true
        };
    } else if(error) {
        // console.log("Failed", error);
        return {
            success: false,
            server_error: true
        };
    } else {
        console.log("Topics retrieved",topics);
        return {
            success: true,
            topics: topics
        };
    }
}