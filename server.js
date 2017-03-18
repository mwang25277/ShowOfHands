var express = require('express');
var app = express();
var http = require('http').Server(app);

//used to parse request data
//https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//https://www.npmjs.com/package/propublica-congress-node
var Congress = require( 'propublica-congress-node' );
var client = new Congress( 'y3spXskaU43BBv4WCh6BazYtzVOToHf1ZUhTiiQc' );

app.use(express.static('public'));

// start server
http.listen(3000, function(){
  console.log('Server up on *:3000');
});

//listen for people post request
app.post('/people', function(req, res){

	console.log("Chamber: " + req.body.chamber);
	// console.log("State: " + req.body.state);
	client.memberLists({
		congressNumber: 115,
    	chamber: req.body.chamber
	}).then(function(data) {
		//console.log(data);
		var ppl = [];
		var i;
		for(i = 0; i < data.results[0].members.length; i++) {
			if(data.results[0].members[i].state == req.body.state) {
				ppl.push(data.results[0].members[i]);
			}
		}
		res.send(ppl);
	});
});