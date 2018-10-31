const rand_token = require('rand-token');

const rand = rand_token.generator({source : 'crypto'});

const userid_length     = 32;
const userid_style      = '0123456789abcdefghijklmnopqrstuvwxyz';

exports.gen_user_id =
function gen_user_id() {
    return rand.generate(userid_length, userid_style);
}