// MODULES
var express = require('express');

// LOCAL FILES
const token = require('./lib/token.js')
const topic = require('./modules/topic.js')

// MODULE SETUP
var router = express.Router()

// TOPIC ROUTES
router.get('/:id', (req, res) => {
    let id = req.params.id;

    topic.GetTopic(id)
        .then((topic) => {
            if (!topic) {
                return res.status(404).send();
            }

            res.send({
                topic_title: topic.title,
                topic_type: topic.type,
                topic_timePosted: topic.timePosted,
                topic_timeUpdated: topic.timeUpdated
            });
        })
        .catch((e) => {
            res.status(500).send();
        });
});

router.delete('/:id', (req, res) => {
    let id = req.params.id;
    let user_id;
    if(req.token) user_id = token.check_token(req.token);
    else res.status(401).send("Authentication token required");

    if(!user_id) res.status(401).send("Invalid authentication token");

    topic.DeleteTopic(userID, id, token)
        .then((topic) => {
            if (!topic) {
                res.status(404).send();
            }
            res.status(200).send();
        })
        .catch((e) => {
            res.status(500).send();
        });
});

// Updating existing topic
router.put('/:id',(req,res)=>{
    let body = req.body;
    let id = req.params.id;
    let user_id;
    if(req.token) user_id = token.check_token(req.token);
    else res.status(401).send("Authentication token required");

    if(!user_id) res.status(401).send("Invalid authentication token");

    topic.UpdateTopic(user_id, id, token, content)
        .then((topic)=>{
            res.send({
                topic_time_posted : topic.update_time,
            });
        })
        .catch((e)=>{
            res.status(500).send(e);
        });
});

router.delete('/:id', (req, res) => {s
    let id = req.params.id;
    let user_id;
    if(req.token) user_id = token.check_token(req.token);
    else res.status(401).send("Authentication token required");

    if(!user_id) res.status(401).send("Invalid authentication token");

    topic.DeleteTopic({
        _id: id,
        _token: token
    })
        .then((topic) => {
            if (!topic) {
                return res.status(404).send();
            }
            return res.status(200).send();
        })
        .catch((e) => {
            res.status(400).send();
        });
});

// Creating/Posting new topic
router.post('/create', (req,res) => {
    let user_id;
    if(req.token) user_id = token.check_token(req.token);
    else res.status(401).send("Authentication token required");

    if(!user_id) res.status(401).send("Invalid authentication token");

    let title = req.body.title;
    let type = req.body.type;
    let content = req.body.content;

    topic.CreateTopic(user_id, title, type, content, token)
        .then((topic)=>{
            res.send({
                topic_id : topic.topic_id,
                topic_time_posted : topic.topic_time_posted
            });
        })
        .catch((e)=>{
            res.status(500).send(e);
        });
});

exports.topic_router = router;