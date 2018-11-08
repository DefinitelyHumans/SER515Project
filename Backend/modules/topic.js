// MODULES

// LOCAL FILES
const database         = require('../lib/db.js')
const { gen_topic_id } = require('../lib/id_gen');

// MODULE SETUP

// CONSTANTS

// LOCAL FUNCTIONS

// EXPORTED FUNCTIONS

/**
 * Topic Created contains title, type, content, and user ID.
 * Topic ID is generated here. Timestamp is assigned in DB query depending on success of query.
 * @returns success/fail message.
 */
exports.CreateTopic =
async function CreateTopic(userID, topic_title, topic_type, topic_content) {
    let topic_id = gen_topic_id();  // Generate topic ID.
    console.log("Create topic:", topic_id);

    let topic = {
        topic_id: topic_id,
        topic_title: topic_title,
        topic_type: topic_type,
        topic_content: topic_content,
        user_posted: userID
    };

    // Check for DB errors,
    let { error } = await database.add_topic(topic);
    if (error) {
        console.log("Failed:", error);
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
            //time_posted: //TODO
        }
    };
}

/**
 * Using topic ID to query a delete request.
 * @returns error and success message.
 */
exports.DeleteTopic =
async function DeleteTopic(userID, topic_id) {
    console.log("Delete topic:", topic_id);

    // TODO: User ID Permissions
    let { error } = await database.remove_topic(topic_id);
    if (error) {
        console.log("Failed:", error); // Debug error.
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
    console.log("Update topic:", topic_id);
    // TODO: Validate token, topic ID, User ID.
    let topic = {
        topic_id: topic_id,
        topic_content: topic_content,
        user_posted: userID
    };
    let { error, update_time } = await database.update_topic(topic);
    if (error) {
        // Return error if query was unsucessfull.
        console.log("Failed:", error);
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
    console.log("Get topic:", topic_id);

    let {topic, error} = await database.get_topic(topic_id);
    if (error == database.errors.NO_RESPONSE) {
        return {
            success: false,
            not_found: true
        };
    } else if(error) {
        console.log("Failed", error);
        return {
            success: false,
            server_error: true
        };
    } else {
        return {
            success: true,
            topic: topic
        };
    }
}