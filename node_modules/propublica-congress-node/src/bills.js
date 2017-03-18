module.exports = {
  billsRecent: "https://api.propublica.org/congress/v1/{congress-number}/{chamber}/bills/{bill-type}{response-format}",
  billsByMember: "https://api.propublica.org/congress/v1/members/{member-id}/bills/{bill-type}{response-format}",
  billDetails: "https://api.propublica.org/congress/v1/{congress-number}/bills/{bill-id}{response-format}",
  billSubjects: "https://api.propublica.org/congress/v1/{congress-number}/bills/{bill-id}/subjects{response-format}",
  billAmendments: "https://api.propublica.org/congress/v1/{congress-number}/bills/{bill-id}/amendments{response-format}",
  billRelatedBills: "https://api.propublica.org/congress/v1/{congress-number}/bills/{bill-id}/related{response-format}",
  billCosponsors: "https://api.propublica.org/congress/v1/{congress-number}/bills/{bill-id}/cosponsors{response-format}"
};
