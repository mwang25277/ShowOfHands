module.exports = {
  votesRollCall: "https://api.propublica.org/congress/v1/{congress-number}/{chamber}/sessions/{session-number}/votes/{roll-call-number}{response-format}",
  votesByType: "https://api.propublica.org/congress/v1/{congress-number}/{chamber}/votes/{vote-type}{response-format}",
  votesByDate: "https://api.propublica.org/congress/v1/{chamber}/votes/{year}/{month}{response-format}",
  votesNominations: "https://api.propublica.org/congress/v1/{congress-number}/nominations{response-format}"
};
