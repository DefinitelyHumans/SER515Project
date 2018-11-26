// MODULES
var express = require('express');

// LOCAL FILES
const token = require('../lib/token.js')
const comment = require('../modules/comment.js')

// MODULE SETUP
var router = express.Router()

// COMMENT ROUTES

//Get individual comment by ID
router.get('/:id', async function (req, res) {
    let id = req.params.id;

    let info = await comment.get_comment_by_id(id);
    if(info.not_found) {
        res.statusCode = 404;
        res.send("")
    } else if(info.server_error) {
        res.statusCode = 500;
        res.send("")
    } else {
        res.statusCode = 200;
        res.send({
            comment_id:   id,
            topic_id:     info.comment.topic_id,
            user_id:      info.comment.user_id,
            comment_body: info.comment.comment_body,
            time_posted:  info.comment.time_posted
        });
    }
});

// Get all comments for post
router.get('/by_topic/:id', async function (req, res) {
    let id = req.params.id;

    let info = await comment.get_comments_for_topic(id);
    if(info.not_found) {
        res.statusCode = 404;
        res.send("")
    } else if(info.server_error) {
        res.statusCode = 500;
        res.send("")
    } else {
        res.statusCode = 200;
        res.send(info);
    }
});


// Creating/Posting new Comment
router.post('/create', async function (req, res) {
    let body = req.body;

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

    let info = await comment.create_comment(body.topic_id, body.content, user_id);

    if(info.request_error) {
        res.statusCode = 400;
        res.send("")
    } else if(info.server_error) {
        res.statusCode = 500;
        res.send("")
    } else {
        res.statusCode = 200;
        res.send({
            comment_id:   info.comment.id,
            topic_id:     info.comment.topic_id,
            user_id:      info.comment.user_id,
            comment_body: info.comment.comment_body,
            time_posted:  info.comment.time_posted
        });
    }
});

exports.comment_router = router;