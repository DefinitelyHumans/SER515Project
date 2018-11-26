//modules
const jwt          = require('jsonwebtoken');

//local files
const { jwt_cred } = require('../priv/cred.js');

//local functions
(function () {
    if(jwt_cred.secret.length != 32)
        console.log("!! - JWT Secret is an incorrect size. Please make sure it is exactly 32 characters in length.\n");
})();

//exported functions
exports.get_token =
async function get_token(user_id) {
    return new Promise((resolve, reject) => {
        jwt.sign({ user_id: user_id }, jwt_cred.secret, { expiresIn: '4h' }, (err, token) => {
            if(err) {
                reject(err["name"]);
            } else {
                resolve(token);
            }
        });
    });
}

exports.check_token =
async function check_token(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, jwt_cred.secret, (err, decoded) => {
            console.log(err, decoded);
            if(err) {
                reject(err["name"]);
            } else {
                resolve(decoded["user_id"]);
            }
        });
    });
}