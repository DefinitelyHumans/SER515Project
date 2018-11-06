// MODULES
var express = require('express');

// LOCAL FILES
const token = require('./lib/token.js')
const topic = require('./modules/topic.js')

// MODULE SETUP
var router = express.Router()

// TOPIC ROUTES
router.get('/:id', (req, res) => {
    let id = req.topic_id;

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
    if (req.body.user_id == undefined) {res.status(400).send("Invalid User ID.");}

    let id = req.params.id;
    let token = req.body.token;
    let userID = req.body.user_id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    topic.DeleteTopic(userID, id, token)
        .then((topic) => {
            if (!topic) {
                return res.status(404).send();
            }
            return res.status(200).send();
        })
        .catch((e) => {
            res.status(500).send();
        });
});

// Updating existing topic
router.put('/:id',(req,res)=>{
    if (req.body.user_id == undefined) {res.status(400).send("Invalid User ID.");}

    let id = req.params.id;
    let token = req.body.token;
    let content = req.body.content;
    let userID = req.body.user_id;

    topic.UpdateTopic(userID, id,token,content)
        .then((topic)=>{
            res.send({
                topic_time_posted : topic.update_time,
            });
        })
        .catch((e)=>{
            res.status(500).send(e);
        });
});

router.delete('/:id', (req, res) => {
    let id = req.params.id;
    let token = req.params.token;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (!ObjectID.isValid(id)) {  //ObjectID from postgres module
        return res.status(404).send();
    }

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
    if (req.body.user_id == undefined) {res.status(400).send("Invalid User ID.");}

    let title = req.body.title;
    let type = req.body.type;
    let content = req.body.content;
    let token = req.body.token;
    let userID = req.body.user_id;

    topic.CreateTopic(userID, title,type,content,token)
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