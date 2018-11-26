// MODULES
var express = require('express');

// LOCAL FILES
const token = require('../lib/token.js')
const topic = require('../modules/topic.js')

// MODULE SETUP
var router = express.Router()

// TOPIC ROUTES
router.get('/:id', async function (req, res) {
    let id = req.params.id;

    let get_info = await topic.GetTopic(id);

    if(get_info.success) {
        let topic = get_info.topic;
        // console.log("Route ret", topic);
        res.status(200).send({
            topic_title: topic.topic_title,
            topic_type: topic.topic_type,
            topic_content: topic.topic_content,
            topic_timePosted: topic.topic_time_posted,
            topic_timeUpdated: topic.update_time
        });
    } else {
        if(get_info.not_found) {
            res.status(404).send("not found");
        } else if(get_info.server_error) {
            res.status(500).send("Internal Error");
        }
    }
});


router.get('/user/:id', async function (req, res) {
    let id = req.params.id;

    let get_info = await topic.GetTopicByUserID(id);

    if(get_info.success) {
        // console.log("Object returned", get_info);
        let topics = get_info.topics;
        res.status(200).send(topics);   // Return array of topics by user.
    } else {
        if(get_info.not_found) {
            res.status(404).send("not found");
        } else if(get_info.server_error) {
            res.status(500).send("Internal Error");
        }
    }
});



router.delete('/:id', async function (req, res) {
    let id = req.params.id; // Grab topic ID from request parameters.

    let user_id;
    if(req.token) user_id = await token.check_token(req.token).catch( () => { return false; })
    else {
        res.status(401).send("Authentication token required");
        return;
    }

    if(!user_id) {
        res.status(401).send("Invalid authentication token");
        return;
    }

    let del_info = await topic.DeleteTopic(id)

    if(del_info.success) {
        res.status(200).send();
    } else {
        res.status(500).send("Internal Error");
    }
});

// Updating existing topic
router.put('/:id', async function (req, res) {
    let body = req.body;
    let id = req.params.id;

    let user_id;
    if(req.token) user_id = await token.check_token(req.token).catch( () => { return false; })
    else {
        res.status(401).send("Authentication token required");
        return;
    }

    if(!user_id) {
        res.status(401).send("Invalid authentication token");
        return;
    }

    let upd_info = await topic.UpdateTopic(user_id, id, body.topic_content);

    if(upd_info.success) {
        res.status(200).send(upd_info.topic);
    } else {
        res.status(500).send("Internal Error");
    }
});

// Creating/Posting new topic
router.post('/create', async function (req, res) {
    let user_id;

    if(req.token) user_id = await token.check_token(req.token).catch( () => { return false; })
    else {
        res.status(401).send("Authentication token required");
        return;
    }

    if(!user_id) {
        res.status(401).send("Invalid authentication token");
        return;
    }

    let title = req.body.topic_title;
    let type = req.body.topic_type;
    let content = req.body.topic_content;
    let crt_info = await topic.CreateTopic(user_id, title, type, content)

    if(crt_info.success) {
        res.status(200).send(crt_info.topic);
    } else {
        res.status(500).send("Internal Error");
    }
});

exports.topic_router = router;