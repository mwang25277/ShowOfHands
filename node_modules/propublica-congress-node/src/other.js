module.exports = {
  statePartyCounts: "https://api.propublica.org/congress/v1/states/members/party{response-format}",
  committeeList: "https://api.propublica.org/congress/v1/{congress-number}/{chamber}/committees{response-format}",
  committeeRoster: "https://api.propublica.org/congress/v1/{congress-number}/{chamber}/committees{committee-id}{response-format}",
  chamberSchedule: "https://api.propublica.org/congress/v1/{chamber}/schedule{response-format}"
};
