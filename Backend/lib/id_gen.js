const rand_token = require('rand-token');

const rand = rand_token.generator({source : 'crypto'});

const userid_length  = 32;
const userid_style   = '0123456789abcdefghijklmnopqrstuvwxyz';

const topicid_length = 64;
const topicid_style  = '0123456789abcdefghijklmnopqrstuvwxyz';

exports.gen_user_id =
function gen_user_id() {
    return rand.generate(userid_length, userid_style);
}

exports.gen_topic_id =
function gen_topic_id() {
    return rand.generate(topicid_length, topicid_style);
}