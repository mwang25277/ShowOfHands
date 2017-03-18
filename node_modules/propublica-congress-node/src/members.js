module.exports = {
  memberLists: "https://api.propublica.org/congress/v1/{congress-number}/{chamber}/members{response-format}",
  memberBioAndRoles: "https://api.propublica.org/congress/v1/members/{member-id}{response-format}",
  membersNew: "https://api.propublica.org/congress/v1/members/new{response-format}",
  membersCurrentByStateOrDistrict: "https://api.propublica.org/congress/v1/members/{chamber}/{state}/{district}/current{response-format}",
  membersLeavingOffice: "https://api.propublica.org/congress/v1/{congress-number}/{chamber}/members/leaving{response-format}",
  memberVotePositions: "https://api.propublica.org/congress/v1/members/{member-id}/votes{response-format}",
  memberVoteComparison: "https://api.propublica.org/congress/v1/members/{member-id-1}/votes/{member-id-2}/{congress-number}/{chamber}{response-format}",
  memberCosponsoredBills: "https://api.propublica.org/congress/v1/members/{member-id}/bills/{cosponsor-type}{response-format}",
  memberSponsorshipComparison: "https://api.propublica.org/congress/v1/members/{member-id-1}/bills/{member-id-2}/{congress-number}/{chamber}{response-format}",
  memberFloorAppearances: "https://api.propublica.org/congress/v1/members/{member-id}/floor_appearances{response-format}",
};
