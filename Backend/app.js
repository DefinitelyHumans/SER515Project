//modules
const express            = require('express');
const bodyParser         = require('body-parser');
const bearerToken        = require('express-bearer-token');
const enforceContentType = require('enforce-content-type')

const token = require('./lib/token.js')
const auth  = require('./modules/login.js')
const topic = require('./topic.js')

//module setup
const app = express();

app.use(enforceContentType({
    type: 'application/json'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bearerToken({
    bodyKey: 'access_token',
    queryKey: 'access_token',
    headerKey: 'Bearer',
    reqKey: 'token'
}));
let userID = 0;

//constants
const port = 3300;

//start server
app.listen(port, () => {
    console.log(`Listening on port ${port}!`)
});

/** PATH LISTENERS */
app.get('/', function (req, res) {
    res.sendFile("login.html", { root: __dirname });
});

// PATHS FOR LOGIN/AUTHENTICATION

/**
 * Post request for logging in.
 */
app.post('/api/auth/login', async function (req, res) {
    let body = req.body;

    let login_info = await auth.login(body.email, body.password);
    if(login_info.invalid_login) {
        res.statusCode = 401;
        res.send("")
    } else if(login_info.server_error) {
        res.statusCode = 500;
        res.send("")
    } else {
        if(login_info.success && login_info.user_id) {
            token.get_token(login_info.user_id)
            .then((token) => {
                res.statusCode = 200;
                res.send({
                    auth_token: token,
                });
            })
            .catch((error) => {
                res.statusCode = 500;
                res.send("");
            })
            userID = login_info.user_id;
        } else {
            //if we make it here then something failed pretty hard
            res.statusCode = 500;
            res.send("")
        }
    }
});

/**
 * Post request for registration.
 */
app.post('/api/auth/register', async function (req, res) {
    // invalid_login
    // recaptcha_fail
    // server_error
    // user_already_registered
    // success
    let body = req.body;

    let register_info = await auth.register(body.email, body.password, body["g-recaptcha-response"]);

    if(register_info.invalid_login) {
        res.statusCode = 401;
        res.send({error: "Invalid Credentials"});
    } else if(register_info.recaptcha_fail) {
        res.statusCode = 412;
        res.send({error: "Invalid Recaptcha Token"});
    } else if(register_info.user_already_registered) {
        res.statusCode = 400;
        res.send({error: "User Already Registered"});
    } else if(register_info.server_error) {
        res.statusCode = 500;
        res.send({error: "Server Error"});
    } else {
        if(register_info.success) {
            res.statusCode = 200;
            res.send("");
        } else {
            //if we make it here then something failed pretty hard
            res.statusCode = 500;
            res.send({error: "Server Error"});
        }
    }
});

// PATH LISTENERS FOR TOPICS

/**
 * Getting single topic by it's ID.
 */
app.get('/api/topic/:id', (req, res) => {
  let id = req.topic_id;

  topic.GetTopic(id).then((topic) => {
    if (!topic) {
      return res.status(404).send();
    }

    res.send({
        topic_title: topic.title,
        topic_type: topic.type,
        topic_timePosted: topic.timePosted,
        topic_timeUpdated: topic.timeUpdated
    });
  }).catch((e) => {
    res.status(500).send();
  });
});

/**
 * Deleting an existing topic based on its ID.
 */
app.delete('/api/topic/:id', (req, res) => {
    if (req.body.user_id == undefined) {res.status(400).send("Invalid User ID.");}
  let id = req.params.id;
  let token = req.body.token;
  let userID = req.body.user_id;
  
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  topic.DeleteTopic(userID, id, token).then((topic) => {
    if (!topic) {
      return res.status(404).send();
    }
     return res.status(200).send();
  }).catch((e) => {
    res.status(500).send();
  });
});

// Creating/Posting new topic
app.post('/api/topic/create', (req,res) => {
    if (req.body.user_id == undefined) {res.status(400).send("Invalid User ID.");}

	let title = req.body.title;
	let type = req.body.type;
	let content = req.body.content;
    let token = req.body.token;
    let userID = req.body.user_id;
	
	topic.CreateTopic(userID, title,type,content,token).then((topic)=>{
		res.send({
			topic_id : topic.topic_id,
			topic_time_posted : topic.topic_time_posted
		});
	}).catch((e)=>{
		res.status(500).send(e);
	});
});

// Updating existing topic
app.put('/api/topic/:id',(req,res)=>{
    if (req.body.user_id == undefined) {res.status(400).send("Invalid User ID.");}
	let id = req.params.id;
	let token = req.body.token;
    let content = req.body.content;
    let userID = req.body.user_id;

  	topic.UpdateTopic(userID, id,token,content).then((topic)=>{
  		res.send({
  			topic_time_posted : topic.update_time,
  		});
  	}).catch((e)=>{
  		res.status(500).send(e);
  	});
});app.delete('/api/topic/:id', (req, res) => {
  let id = req.params.id,
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
  }).then((topic) => {
    if (!topic) {
      return res.status(404).send();
    }
     return res.status(200).send();
  }).catch((e) => {
    res.status(400).send();
  });
});