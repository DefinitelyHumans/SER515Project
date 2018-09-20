//plugins
const express = require('express')

//definitions
const app = express()
const port = 3300

//start server
app.listen(port, () => {
    console.log(`Listening on port ${port}!`)
});

//path listeners
app.get('/', function (req, res) {
  res.send('<p style="color: red;">Welcome to Cork\'d! Coming Soon!</p>')
})

