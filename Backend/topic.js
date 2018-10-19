//modules
const rand_token = require('rand-token');
const bcrypt     = require('bcrypt')
const request    = require('request-promise')
const dateTime   = require('node-datetime');

//local files
const database   = require('./db.js')
const { g_cred } = require('./priv/cred.js')


//constants
let userID = 1;     // TODO: Need to add User ID
//local functions




//exported functions
exports.CreateTopic =
async function CreateTopic(topic_title, topic_type, topic_content, token) {
    let timestamp = dateTime.create().epoch();  // Add datetimestamp
    let post = {
        topic_title: "",
        topic_type: "",
        topic_content: "",
        topic_time_post: timestamp,
        token: token,
        user_posted: userID
    };
    
    // TOOD: Change topic type to swtich-case
    // and use it for specifying the content type
    // for database query.
    if (TopicType == "Text") {
        // call database for creating topic
        let {error} = await database.add_post(userID,post);
        if(error == database.errors.INTERNAL_ERROR) {
            return { server_error: true };
        }
        return {success: true};
    }
}

exports.DeleteTopic =
async function DeleteTopic(ID, token) {

}

exports.UpdateTopic =
async function UpdateTopic(ID, token, content) {

}

