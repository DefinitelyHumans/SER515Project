//modules
const express    = require('express');
const bodyParser = require('body-parser');

//localfiles
const auth       = require('./login.js')
const topic      = require('./topic.js')

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
        if(login_info.token && login_info.user_id) {
            res.statusCode = 200;
            res.send({
                auth_token: login_info.token,
                user_id: login_info.user_id,
            })
        } else {
            //if we make it here then something failed pretty hard
            res.statusCode = 500;
            res.send("")
        }
    }
});

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
        res.send({error: "Invalid Password"});
    } else if(register_info.recaptcha_fail ||
              register_info.user_already_registered) {
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

//path listeners for topic.js

app.get('/api/topic/:id', (req, res) => {
  let id = req.topic_id;

  if (!ObjectID.isValid(id)) {  //ObjectID from postgres module
    return res.status(404).send();
  }

  topic.findOne(id).then((topic) => {
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
    res.status(400).send();
  });
});

app.delete('/api/topic/:id', (req, res) => {
  let id = req.params.id,
  let token = req.params.token;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  topic.findOneAndRemove({
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

app.post('/api/topic/:id', (req,res) => {
	let body = _.pick(req.body,['title','type','content','token']);
	let top = new topic(body);
	topic.save().then(()=>{
		return topic.generateAuthToken();
	}).then((token) => {
		res.header('x-auth',token).send({
			topic_id: topic.id,
	        topic_timePosted: topic.timePosted
		});
	}).catch((e)=>{
		res.status(400).send(e);
	});
});