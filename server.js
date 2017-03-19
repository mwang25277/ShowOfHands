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
var congressClient = new Congress( 'y3spXskaU43BBv4WCh6BazYtzVOToHf1ZUhTiiQc' );

//https://www.npmjs.com/package/twitter
var Twitter = require('twitter');
var twitClient = new Twitter({
	consumer_key: 'phZb3wdglG0hGTL6HVBiOq6JJ',
	consumer_secret: 'M1AdQ83jODtgcdZoOB5WuNXK66Z6DD2UMVBKntmEoS0KOkGfeT',
  	access_token_key: '308847496-0nbJ35KiHNjMrK76NIBVZQWdtOQ3TGT4p3RS08bz',
 	access_token_secret: '8FUrTIhSoRHkPaMOYin7SrMKYRYGqnn7HZyEf8QtGqKOu'
});

app.use(express.static('public'));

// start server
http.listen(3000, function(){
  console.log('Server up on *:3000');
});

//listen for people post request
app.post('/people', function(req, res){

	//console.log("Chamber: " + req.body.chamber);
	// console.log("State: " + req.body.state);

	//get list of all members in specified chamber
	congressClient.memberLists({
		congressNumber: 115,
    	chamber: req.body.chamber
	}).then(function(data) {
		//console.log(data);
		//iterate through members and add the members of the specified state to ppl
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

//get the person's twitter profile image using his/her twitter screen name
app.post('/img', function(req, res) {
	var twitName = req.body.twitName;

	twitClient.get('users/lookup', { screen_name: twitName }, function(error, tweets, response) {
	  if (!error) {
	    //console.log(tweets[0].profile_image_url);
	    //change the url to get the original (not resized) image
	    var imgUrl = tweets[0].profile_image_url;
	    imgUrl = imgUrl.replace("_normal", "");
	    //console.log(imgUrl);
	    res.send(imgUrl);
	  }
	  else {
	  	res.send("http://placehold.it/350");
	  	
	  }
	});
});