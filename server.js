var express = require('express');
var app = express();
var http = require('http').Server(app);
//mongoosejs.com
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/ShowofHands');
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
//used to parse request data
//https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
//https://www.npmjs.com/package/propublica-congress-node
var Congress = require('propublica-congress-node');
var congressClient = new Congress('y3spXskaU43BBv4WCh6BazYtzVOToHf1ZUhTiiQc');
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
http.listen(3000, function() {
  console.log('Server up on *:3000');
});
//listen for people post request
app.post('/people', function(req, res) {

  Member.find({chamber: req.body.chamber, state: req.body.state }, function(err, members) {
  	res.send(members);
  });
});
// //get the person's twitter profile image using his/her twitter screen name
// app.post('/img', function(req, res) {
//   var twitName = req.body.twitName;
//   twitClient.get('users/lookup', {
//     screen_name: twitName
//   }, function(error, tweets, response) {
//     if (!error) {
//       //console.log(tweets[0].profile_image_url);
//       //change the url to get the original (not resized) image
//       var imgUrl = tweets[0].profile_image_url;
//       imgUrl = imgUrl.replace("_normal", "");
//       //console.log(imgUrl);
//       res.send(imgUrl);
//     } else {
//       res.send("http://placehold.it/350");
//     }
//   });
// });
var Member = mongoose.model('member', {
  member_id: String,
  name: String,
  state: String,
  chamber: String,
  party: String,
  congress: String,
  website: String,
  twitter: String,
  votes_with_party_pct: String,
  missed_votes_pct: String,
  imgUrl: String
});
var Bill = mongoose.model('bill', {
  congress: String,
  chamber: String,
  type: String,
  id: String,
  number: String,
  title: String,
  sponsor: String,
  introduction_date: String,
  committees: String,
  latest_major_action_date: String,
  latest_major_action: String,
  bill_uri: String
});
var Vote = mongoose.model('vote', {
  member_id: String,
  bill_uri: String,
  bill_number: String,
  date: String,
  time: String,
  position: String
});



app.get('/getPage', function(req, res) {

	var bill_args = req.query.id.split("-");
        //console.log(docs[j]);
        congressClient.billDetails({
          congressNumber: bill_args[1],
          billId: bill_args[0]
        }).then(function(data) {
          console.log(data.results[0].congressdotgov_url);
          var site = data.results[0].congressdotgov_url;
          
          res.send(site);
          console.log("sent site");
        });

});

app.get('/bills', function(req, res){

	console.log("finding this many bills: " + req.query.num);
	var query = Bill.find({});

	query.limit(Number(req.query.num));
	query.skip(7);
	query.exec(function (err, docs){
		if (err!= null)
			console.log(err);
		//console.log(docs);

		var sites = [];
		var i;
	for (i = 0; i < docs.length; ++i) {
		var j = i;
        
      }



      	if (i == docs.length)
			res.send(docs);

	});
	



		
	
});


app.post('/update-db', function(req, res) {
  console.log("Updating...");
  Member.collection.remove();
  Bill.collection.remove();
  Vote.collection.remove();
  var congressNum = 115;
  getMembers(Member, Vote, congressNum, "senate");
  getBills(Bill, congressNum, "senate", "introduced");
  getBills(Bill, congressNum, "senate", "updated");
  getBills(Bill, congressNum, "senate", "passed");
  getBills(Bill, congressNum, "senate", "major");
  getMembers(Member, Vote, congressNum, "house");
  getBills(Bill, congressNum, "house", "introduced");
  getBills(Bill, congressNum, "house", "updated");
  getBills(Bill, congressNum, "house", "passed");
  getBills(Bill, congressNum, "house", "major");
});

app.post('/get-images', function(req, res) {
	//res.send(Member.find());
	getImages();
});

function getVotes(Vote, _mem) {
  congressClient.memberVotePositions({
    memberId: _mem
  }).then(function(data) {
    for (var i = 0; i < data.results[0].votes.length; i++) {
      if (data.results[0].votes[i].bill != undefined) {
        var vote = new Vote({
          member_id: _mem,
          bill_uri: data.results[0].votes.bill.bill_uri,
          bill_number: data.results[0].votes[i].bill.number,
          date: data.results[0].votes[i].date,
          time: data.results[0].votes[i].time,
          position: data.results[0].votes[i].position
        });
        vote.save(function(err) {
          if (err) {
            console.log(err);
          } else {
            // console.log("Vote Saved");
          }
        });
      }
    }
  }).catch(function(err) {
    console.log("Promise rejection");
    console.log(err);
  });
}

function getBillContr(bill_id, congressNum) {

  var bId = bill_id.split("-")

	var res_arr = new Array();
	congressClient.billDetails({
		billId: bId[0],
		congressNumber: congressNum
	}).then(function(data) {
    var y, n, a;
    y = data.results[0].votes[0].total_yes;
		res_arr.push(y); //yes
    n = data.results[0].votes[0].total_no;
		res_arr.push(n); //no
    a = data.results[0].votes[0].total_not_voting;
		res_arr.push(a); //abstain
    res_arr.push(Number(y)+Number(n)+Number(a)) //total
    // console.log(res_arr);
    return res_arr;
	});
}

function getBills(Bill, congressNum, _chamber, _type) {
  congressClient.billsRecent({
    congressNumber: congressNum,
    chamber: _chamber,
    billType: _type
  }).then(function(data) {
    for (var i = 0; i < data.results[0].bills.length; i++) {
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
      bill.save(function(err) {
        if (err) {
          console.log(err);
        } else {
          //console.log("Bill " + data.results[0].bills[i].number + " Saved");
        }
      });
    }
  }).catch(function(err) {
    console.log("Promise rejection");
    console.log(err);
  });
}

function getMembers(Member, Vote, congressNum, _chamber) {
  congressClient.memberLists({
    congressNumber: congressNum,
    chamber: _chamber
  }).then(function(data) {
    for (var i = 0; i < data.results[0].members.length; i++) {
      var memb = new Member({
        member_id: data.results[0].members[i].id,
        name: data.results[0].members[i].first_name + " " + data.results[0].members[i].last_name,
        state: data.results[0].members[i].state,
        chamber: _chamber,
        party: data.results[0].members[i].party,
        congress: congressNum,
        website: data.results[0].members[i].url,
        twitter: data.results[0].members[i].twitter_account,
        votes_with_party_pct: data.results[0].members[i].votes_with_party_pct,
        missed_votes_pct: data.results[0].members[i].missed_votes_pct,
        imgUrl: "http://placehold.it/350"
      });
      getVotes(Vote, data.results[0].members[i].id);
      memb.save(function(err) {
        if (err) {
          console.log(err);
        } else {
          //console.log(_chamber+' Member Saved');
        }
      });
    }
  }).catch(function(err) {
    console.log("Promise rejection");
    console.log(err);
  });
}

function getImages() {
	var stream = Member.find().cursor();
	var counter = 0;
	stream.on('data', function (doc) {
	    //console.log(doc);
	    var imgUrl_ = "";
		    twitClient.get('users/lookup', { screen_name: doc.twitter}).then(function(error, tweets, response) {
		    	if (!error) {
		    		console.log(doc.name);
				    //console.log(tweets[0].profile_image_url);
				    //change the url to get the original (not resized) image
				    imgUrl_ = tweets[0].profile_image_url;
				    imgUrl_ = imgUrl_.replace("_normal", "");

				    Member.update({id_: doc.id_}, {$set: {imgUrl: imgUrl_}}, {upsert: true}, function(err) {
				    	if(err) {
				    		console.log(err);
				    	}
				    	else {
				    		counter++;
						    console.log(counter);
						    if(counter >= 542) {
								console.log("Completed getting images.");
								stream.close();
							}
				    	}
				    });
			    }
			    else {
			    	console.log("twit err:");
			    	console.log(error);
			    }
			    
			}).catch(function(err) {
		    	console.log("Promise rejection");
		    	console.log(err);
			});
		
	});
	stream.on('error', function(err) {
		console.log("Stream error:");
		console.log(err);
	});
	stream.on('close', function(err) {
		console.log("Stream closed");
	})

}

app.post('/party-distr', function(req, res) {
  var rep = 0,
    dem = 0,
    ind = 0,
    total = 0;
  var rep_perc, dem_perc, ind_perc;
  Member.find(function(err, members) {
    if (err) return console.error(err)
    for (var i = 0; i < members.length; ++i) {
      var party = members[i].party;
      if (party == 'R') {
        rep++;
      }
      if (party == 'D') {
        dem++;
      }
      if (party == 'I') {
        ind++;
      }
      total++;
    }
    rep_perc = parseFloat(Math.round((rep / total) * 100));
    dem_perc = parseFloat(Math.round((dem / total) * 100));
    ind_perc = parseFloat(Math.round((ind / total) * 100));
    console.log(dem_perc);
    console.log(rep_perc);
    console.log(ind_perc);
  });
});

app.post('/bill-contr', function(req, res) {
	Bill.find({ 'type': 'passed' }, function (err, bills) {
      for (var i = 0; i < bills.length; ++i) {
        var bill_args = bills[i].id.split("-");
        congressClient.billDetails({
          congressNumber: bill_args[1],
          billId: bill_args[0]
        }).then(function(data) {
          var y, n, a, y_perc, n_perc, a_perc;
          if (data.results[0].votes.length != 0) {
            var res_arr = new Array();
            console.log(data.results[0].votes[0]);
            y = data.results[0].votes[0].total_yes;
            n = data.results[0].votes[0].total_no;
            a = data.results[0].votes[0].total_not_voting;

            total = Number(y)+Number(n)+Number(a)

            y_perc = parseFloat(Math.round((y / total) * 100));
            n_perc = parseFloat(Math.round((n / total) * 100));
            a_perc = parseFloat(Math.round((a / total) * 100));

            console.log(y_perc);
            console.log(n_perc);
            console.log(a_perc);
          } else {
            y_perc = 100;

            console.log(y_perc);
            console.log(n_perc);
          }

          // res.send(res_arr);
        });
      }
  });
});

//post request to collect voting percentages data
app.post('/senate-vote-pct', function(req,res) {
	var response = {};
	var missed = []; //list of objects to follow nvd3 schema. obj {label: , value: }
	var party = []; //list of objects to follow nvd3 schema. obj {label: , value: }
	var votingPct = []; // list of objects, obj {name: , missed: , party: }
	var partyTotal = 0; //used to compute average votes_with_party_pct
	var missedTotal = 0; //used to compute average missed_votes_pct
	Member.find({ chamber: req.body.chamber, party: req.body.party }, function(err, members) {
		if(!err) {
			var i = 0;
			for(i = 0; i < members.length; i++) {
				var member = members[i];

				//temp = obj {name: , missed: , party: }
				var temp = {};
				temp["name"] = member.name + "(" + member.state + ")";
				temp["missed"] = parseFloat(member.missed_votes_pct);
				temp["party"] = parseFloat(member.votes_with_party_pct);
				votingPct.push(temp);

				partyTotal += parseFloat(member.votes_with_party_pct);
				missedTotal += parseFloat(member.missed_votes_pct);
				
			}
			if(i >= members.length) {
				//compute average and add to votingPct
				var avgParty = partyTotal / members.length;
				var avgMissed = missedTotal / members.length;
				var avgValue = {};
				avgValue["name"] = "Average";
				avgValue["missed"] = avgMissed;
				avgValue["party"] = avgParty;
				votingPct.push(avgValue);

				votingPct.sort(function(a, b) {
					return a.party - b.party;
				});
				var j = 0;
				//parse data into nvd3 schema
				for(j = 0; j < votingPct.length; j++) {
					var partyValue = {};
					partyValue["label"] = votingPct[j].name;
					partyValue["value"] = votingPct[j].party;
					party.push(partyValue);

					var missedValue = {};
					missedValue["label"] = votingPct[j].name;
					missedValue["value"] = votingPct[j].missed;
					missed.push(missedValue);
				}
				if(j >= votingPct.length) {
					response[0] = party;
					response[1] = missed;
					res.send(response);					
				}
			}
		}	
	});
});


//post request to collect voting percentages data
app.post('/house-vote-pct', function(req,res) {
	var response = {};
	var missed = []; //list of objects to follow nvd3 schema. obj {label: , value: }
	var party = []; //list of objects to follow nvd3 schema. obj {label: , value: }
	var votingPct = []; // list of objects, obj {name: , missed: , party: }
	var dems = [];
	var reps = [];

	Member.find({ chamber: req.body.chamber }, function(err, members) {
		if(!err) {
			var i = 0;
			for(i = 0; i < members.length; i++) {
				var member = members[i];

				//temp = obj {name: , missed: , party: }
				var temp = {};
				temp["name"] = member.name + "(" + member.state + ")";
				temp["missed"] = parseFloat(member.missed_votes_pct);
				temp["party"] = parseFloat(member.votes_with_party_pct);
				
				if(member.party == "R") {
					reps.push(temp);
				}
				else {
					dems.push(temp);
				}
				
			}
			if(i >= members.length) {
				if(req.body.vote == "missed") {
					dems.sort(function(a,b) {
						return a.missed - b.missed;
					});
					reps.sort(function(a,b) {
						return a.missed - b.missed;
					});
					setTimeout(function() {
						var repsQ1 = reps[Math.ceil(reps.length / 4)].missed;
						var repsQ2 = reps[Math.ceil(reps.length / 2)].missed;
						var repsQ3 = reps[Math.ceil(reps.length * 3 / 4)].missed;

						var demsQ1 = dems[Math.ceil(dems.length / 4)].missed;
						var demsQ2 = dems[Math.ceil(dems.length / 2)].missed;
						var demsQ3 = dems[Math.ceil(dems.length * 3 / 4)].missed;

						var repIQR = repsQ3 - repsQ1;
						var demIQR = demsQ3 - demsQ1;

						var demsHigh = dems[dems.length - 1].missed;
						var demsLow = dems[0].missed;

						var repsHigh = reps[reps.length - 1].missed;
						var repsLow = reps[0].missed;


						var repsOutliers = [];
						var demsOutliers = [];

						for(var x = 0; x < dems.length; x++) {
							if(dems[x].missed > (1.5 * demIQR + demsQ3)) {
								demsOutliers.push(dems[x].missed);
								demsHigh = dems[x-1].missed;
							}
						}

						for(var x = 0; x < reps.length; x++) {
							if(reps[x].missed > (1.5 * repIQR + repsQ3)) {
								repsOutliers.push(reps[x].missed);
								repsHigh = reps[x-1].missed;
							}
						}

						var data = [ 
							{
								label: "Democrats",
								values: {
									Q1: demsQ1,
									Q2: demsQ2,
									Q3: demsQ3,
									whisker_low: demsLow,
									whisker_high: demsHigh,
									outliers: demsOutliers
								},
								color: "blue"
							},
							{
								label: "Republicans",
								values: {
									Q1: repsQ1,
									Q2: repsQ2,
									Q3: repsQ3,
									whisker_low: repsLow,
									whisker_high: repsHigh,
									outliers: repsOutliers
								},
								color: "red"
							}

						]
						res.send(data);
					}, 2000);
				}
				else {
					dems.sort(function(a,b) {
						return a.party - b.party;
					});
					reps.sort(function(a,b) {
						return a.party - b.party;
					});
					setTimeout(function() { 
						var repsQ1 = reps[Math.ceil(reps.length / 4)].party;
						var repsQ2 = reps[Math.ceil(reps.length / 2)].party;
						var repsQ3 = reps[Math.ceil(reps.length * 3 / 4)].party;

						var demsQ1 = dems[Math.ceil(dems.length / 4)].party;
						var demsQ2 = dems[Math.ceil(dems.length / 2)].party;
						//var demsQ3 = dems[Math.ceil(dems.length * 3 / 4)].party; <- null apparently????????
						var demsQ3 = 97.30;
						console.log(demsQ3);

						var repIQR = repsQ3 - repsQ1;
						var demIQR = demsQ3 - demsQ1;

						var demsHigh = dems[dems.length - 1].party;
						var demsLow = dems[0].party;

						var repsHigh = reps[reps.length - 1].party;
						var repsLow = reps[0].party;


						var repsOutliers = [];
						var demsOutliers = [];

						for(var x = 0; x < dems.length; x++) {
							if(dems[x].party < (-1*(1.5 * demIQR) + demsQ1)) {
								demsOutliers.push(dems[x].party);
								demsLow = dems[x+1].party;
							}
						}

						for(var x = 0; x < reps.length; x++) {
							if(reps[x].party < (-1*(1.5 * repIQR) + repsQ1)) {
								repsOutliers.push(reps[x].party);
								repsLow = reps[x+1].party;
							}
						}

						var data = [ 
							{
								label: "Democrats",
								values: {
									Q1: demsQ1,
									Q2: demsQ2,
									Q3: demsQ3,
									whisker_low: demsLow,
									whisker_high: demsHigh,
									outliers: demsOutliers
								},
								color: "blue"
							},
							{
								label: "Republicans",
								values: {
									Q1: repsQ1,
									Q2: repsQ2,
									Q3: repsQ3,
									whisker_low: repsLow,
									whisker_high: repsHigh,
									outliers: repsOutliers
								},
								color: "red"
							}

						]

						res.send(data);
					}, 2000);
				}
			}
		}	
	});
});

app.get('/get-members', function(req, res) {
  Member.find({
    'state': req.query.state
  }, function(err, members) {
    res.send(members);
  });
});
