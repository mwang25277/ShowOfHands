var express = require('express');
var app = express();
var http = require('http').Server(app);

//mongoosejs.com
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ShowofHands');
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

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
	}).catch(function() {
        console.log("Promise rejection");
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

var Member = mongoose.model('member', { member_id:String, name:String, state:String, chamber:String, party:String, congress:String, website:String, twitter:String });
var Bill = mongoose.model('bill', { congress: String, chamber: String,  type: String, id: String,   number: String, title: String, sponsor: String, introduction_date: String,  committees: String, latest_major_action_date: String, latest_major_action: String, bill_uri: String });
var Vote = mongoose.model('vote', { member_id: String, bill_number: String, date: String, time: String, position: String });



app.get('/bills', function(req, res){

	var query = Bill.find({});

	query.limit(20);
	query.skip(7);
	query.exec(function (err, docs){
		if (err!= null)
			console.log(err);

		res.send(docs);

	})
	



		
	
});





app.post('/update-db', function(req, res) {

  console.log("Updating...");

  Member.collection.remove();
  Bill.collection.remove();
  Vote.collection.remove();

  var congressNum = 115;

  getMembers(Member, Vote, congressNum, "senate");
	getBills(Bill, congressNum, "senate","introduced");
	getBills(Bill, congressNum, "senate","updated");
	getBills(Bill, congressNum, "senate","passed");
	getBills(Bill, congressNum, "senate","major");

	getMembers(Member, Vote, congressNum, "house");
	getBills(Bill, congressNum, "house","introduced");
	getBills(Bill, congressNum, "house","updated");
	getBills(Bill, congressNum, "house","passed");
	getBills(Bill, congressNum, "house","major");
});

function getVotes(Vote, _mem) {
	congressClient.memberVotePositions({
		memberId: _mem
	}).then(function(data) {

		for(var i = 0; i < data.results[0].votes.length; i++) {

			if(data.results[0].votes[i].bill != undefined) {
				var vote = new Vote({
					member_id: _mem,
					bill_number: data.results[0].votes[i].bill.number,
					date: data.results[0].votes[i].date,
					time: data.results[0].votes[i].time,
					position: data.results[0].votes[i].position
				});

				vote.save(function (err) {
					if (err) {
						console.log(err);
					} else {
						// console.log("Vote Saved");
					}
				});
			}
		}
	}).catch(function() {
        console.log("Promise rejection");
    });
}

function getBills(Bill, congressNum, _chamber, _type) {
	congressClient.billsRecent({
		congressNumber: congressNum,
		chamber: _chamber,
		billType: _type
	}).then(function(data) {

		for(var i = 0; i < data.results[0].bills.length; i++) {
			var bill = new Bill({
				congress: congressNum,
				chamber: _chamber,
				type: _type,
				id: data.results[0].bills[i].bill_id,
				number: data.results[0].bills[i].number,
				title: data.results[0].bills[i].title,
				sponsor: data.results[0].bills[i].sponser_uri,
				introduction_date: data.results[0].bills[i].introduced_date,
				committees: data.results[0].bills[i].committees,
				latest_major_action_date: data.results[0].bills[i].latest_major_action_date,
				latest_major_action: data.results[0].bills[i].latest_major_action,
				bill_uri: data.results[0].bills[i].bill_uri
			});

			bill.save(function (err) {
				if (err) {
					console.log(err);
				} else {
					//console.log("Bill " + data.results[0].bills[i].number + " Saved");
				}
			});
		}
	}).catch(function() {
        console.log("Promise rejection");
    });
}

function getMembers(Member, Vote, congressNum, _chamber) {
    congressClient.memberLists({
      congressNumber: congressNum,
      chamber: _chamber
    }).then(function(data) {

      for(var i = 0; i < data.results[0].members.length; i++) {
        var memb = new Member({
          member_id: data.results[0].members[i].id,
          name: data.results[0].members[i].first_name+" "+data.results[0].members[i].last_name,
          state: data.results[0].members[i].state,
          chamber: _chamber,
          party: data.results[0].members[i].party,
          congress: congressNum,
          website: data.results[0].members[i].url,
          twitter: data.results[0].members[i].twitter_account
        });

				getVotes(Vote, data.results[0].members[i].id);

        memb.save(function (err) {
          if (err) {
            console.log(err);
          } else {
            //console.log(_chamber+' Member Saved');
          }
        });
      }
    }).catch(function() {
        console.log("Promise rejection");
    });
  }
