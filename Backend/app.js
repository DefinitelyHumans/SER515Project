//modules
const express    = require('express');
const bodyParser = require('body-parser');

//localfiles
const auth       = require('./login.js')

//module setup
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//constants
const port = 3300;

//start server
app.listen(port, () => {
    console.log(`Listening on port ${port}!`)
});

//path listeners
app.get('/', function (req, res) {
    res.sendFile("login.html", { root: __dirname });
});

app.post('/api/login', function (req, res) {
    let body = req.body;

    let login_info = auth.login(body.email, body.password);

    if(login_info != null) {
        res.send(login_info); //TODO: does more info need to be sent?
    }

    res.statusCode = 401
    res.send("")
});

app.post('/api/register', function (req, res) {
    let body = req.body;

    if(auth.register(body.email, body.password)) {
        res.statusCode = 200;
    }

    res.statusCode = 401;
    res.send("")
});