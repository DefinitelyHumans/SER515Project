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
    async function CreateTopic(userID, topic_title, topic_type, topic_content, token) {        
        let topic_id = gen_topic_id();  // Generate topic ID.
        console.log("Trying to create topic:");
        console.log(topic_id);
        // TODO: Validate token & User ID
        let topic = {
            topic_id: topic_id,
            topic_title: topic_title,
            topic_type: topic_type,
            topic_content: topic_content,
            user_posted: userID
        };
        // Check for DB errors, otherwise return success.
        let { error } = await database.add_topic(topic);
        if (error == database.errors.INTERNAL_ERROR) {
            console.log("Failed to create because:");
            console.log(error);
            return { server_error: true };
        }
        return { success: true };
    }

/**
 * Using topic ID to query a delete request.
 * @returns error and success message.
 */
exports.DeleteTopic =
    async function DeleteTopic(userID, topic_id, token) {
        console.log("Trying to delete topic:");
        console.log(topic_id);
        // TODO: Validate Topic ID & User ID
        // TODO: Validate token
        let { error } = await database.remove_topic(topic_id, token);
        if (error == database.errors.INTERNAL_ERROR) {
            console.log(error); // Debug error.
            return {
                server_error: true,
                success: false,
            };
        }
        return { success: true };
    }

/**
 * Taking in Topic ID, and new content. 
 * Validate token, fire off query.
 * @returns the updated timestamp on success.
 */
exports.UpdateTopic =
    async function UpdateTopic(userID, topic_id, token, topic_content) {
        console.log("Trying to update topic:");
        console.log(topic_id);
        // TODO: Validate token, topic ID, User ID.
        let topic = {
            topic_id: topic_id,
            topic_content: topic_content,
            user_posted: userID
        };
        let queryUpdate = await database.update_topic(topic, token);
        if (queryUpdate.error == database.errors.NO_ERROR) {
            return queryUpdate.update_time;
        } else {    // Return error if query was unsucessfull.
            console.log(queryUpdate.error);
            return queryUpdate.error;
        }
    }

/**
 * Taking in Topic ID, and new content. 
 * Validate token, fire off query.
 * @returns the updated timestamp on success.
 */
exports.GetTopic =
    async function GetTopic(topic_id) {
        console.log("Trying to get topic:");
        console.log(topic_id);
        // TODO: Validate ID check.
        let topic = await database.get_topic(topic_id);
        if (topic.error == database.errors.NO_ERROR) {
            // If topic is retrieved, return it with all properties.
            return topic;
        } else {    // Return error if query was unsucessfull.
            console.log("Failed to get topic.");
            console.log(topic.error);
            return topic.error;
        }
    }