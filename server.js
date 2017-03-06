var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use(express.static('public'));

// start server
http.listen(3000, function(){
  console.log('Server up on *:3000');
});