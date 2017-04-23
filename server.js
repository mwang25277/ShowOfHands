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
	//console.log("Chamber: " + req.body.chamber);
	// console.log("State: " + req.body.state);
	//get list of all members in specified chamber
	// congressClient.memberLists({
	//   congressNumber: 115,
	//   chamber: req.body.chamber
	// }).then(function(data) {
	//   //console.log(data);
	//   //iterate through members and add the members of the specified state to ppl
	//   var ppl = [];
	//   var i;
	//   for (i = 0; i < data.results[0].members.length; i++) {
	//     if (data.results[0].members[i].state == req.body.state) {
	//       ppl.push(data.results[0].members[i]);
	//     }
	//   }
	//   res.send(ppl);
	// }).catch(function(err) {
	//   console.log("Promise rejection");
	//   console.log(err);
	// });
	Member.find({
		chamber: req.body.chamber,
		state: req.body.state
	}, function(err, members) {
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

app.get('/bills', function(req, res) {
	console.log("finding this many bills: " + req.query.num);
	var query = Bill.find({});
	query.limit(Number(req.query.num));
	query.skip(7);
	query.exec(function(err, docs) {
		if (err != null) console.log(err);
		//console.log(docs);
		var sites = [];
		var i;
		for (i = 0; i < docs.length; ++i) {
			var j = i;
		}
		if (i == docs.length) res.send(docs);
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
		res_arr.push(Number(y) + Number(n) + Number(a)) //total
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
				name: data.results[0].members[i].first_name + " " + data.results[0].members[
					i].last_name,
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
	stream.on('data', function(doc) {
		//console.log(doc);
		var imgUrl_ = "";
		if (doc.twitter != null && doc.twitter != "" && doc.twitter != undefined) {
			twitClient.get('users/show', {
				screen_name: doc.twitter
			}).then(function(error, tweets, response) {
				if (!error) {
					console.log(doc.name);
					//console.log(tweets[0].profile_image_url);
					//change the url to get the original (not resized) image
					imgUrl_ = tweets[0].profile_image_url;
					imgUrl_ = imgUrl_.replace("_normal", "");
					Member.update({
						id_: doc.id_
					}, {
						$set: {
							imgUrl: imgUrl_
						}
					}, {
						upsert: true
					}, function(err) {
						if (err) {
							console.log(err);
						} else {
							counter++;
							console.log(counter);
							if (counter >= 542) {
								console.log("Completed getting images.");
								stream.close();
							}
						}
					});
				}
			}).catch(function(err) {
				console.log("Promise rejection");
				console.log(err);
			});
		}
	});
	stream.on('close', function(err) {
		stream.destroy();
	});
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
	Bill.find({
		'type': 'passed'
	}, function(err, bills) {
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
					total = Number(y) + Number(n) + Number(a)
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

app.post('/party-vote-pct', function(req, res) {
	var response = {};
	var missed = [];
	var party = [];
	Member.find({
		chamber: req.body.chamber,
		party: req.body.party
	}, function(err, members) {
		if (!err) {
			var i = 0;
			for (i = 0; i < members.length; i++) {
				var member = members[i];
				var partyValue = {};
				partyValue["label"] = member.name + "(" + member.state + ")";
				partyValue["value"] = parseFloat(member.votes_with_party_pct);
				party.push(partyValue);
				var missedValue = {};
				missedValue["label"] = member.name + "(" + member.state + ")";
				missedValue["value"] = parseFloat(member.missed_votes_pct);
				missed.push(missedValue);
			}
			if (i >= members.length) {
				response[0] = party;
				response[1] = missed;
				res.send(response);
			}
		}
	});
});

app.post('/missed-vote-pct', function(req, res) {
	var response = {};
	Member.find({
		chamber: req.body.chamber,
		party: req.body.party
	}, function(err, members) {
		if (!err) {
			var i = 0;
			for (i = 0; i < members.length; i++) {
				var member = members[i];
				response[member.name + "(" + member.state + ")"] = member.missed_votes_pct;
			}
			if (i >= members.length) {
				res.send(response);
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