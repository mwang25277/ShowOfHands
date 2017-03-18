const {create, assign, keys} = Object
  , {stringify} = JSON
  , api = require('./api')
  , validators = require('./validators')
  , {CURRENT_CONGRESS} = require('./defaults');

/**
 * Creates a new object with promise-based versions of the validator functions
 * which take the same arguments (with the exception of the corresponding function
 * to isValidType, which takes an additional descriptor argument). These functions
 * resolve if the validator passes. They will otherwise reject with an Error
 * message composed from the name of the function or the descriptor for 'isType'
 * functions.
 *
 * eg. validators.isValidCommitteeId gets mapped to validate.committeeId which rejects
 * with an error 'Received invalid committee id: ...'
 *
 * There were previously explicit definitions for these functions.
 */
const validate =
  // take all function names
  keys(validators)
    .reduce((validate, validatorName) => {
      let validateName = validatorName.replace('isValid', '');
      validateName = `${validateName[0].toLowerCase()}${validateName.slice(1)}`;
      return assign(validate, {
        [validateName](...args) {
          const descriptor = validateName === 'type'
            // isValidType is meant for different scenarios so validators.type takes accepts
            // an extra arg meant to be a more specific descriptor
            ? args[args.length -1]
            : validateName.replace(/[A-Z]/g, letter => ` ${letter.toLowerCase()}`).trim();

          args = validateName === 'type'
            // omit the last argument passed for isValidType calls which is expected to be a
            // descriptor
            ? args.slice(0, -1)
            : args;

          return new Promise((resolve, reject) => validators[validatorName](...args)
            ? resolve()
            : reject(new Error(`Received invalid ${descriptor}: ${stringify(args[0])}`))
          );
        }
      });
    }, {});

function all(...args) {
  return Promise.all(args);
}

const recentBillTypes = [
  'introduced',
  'updated',
  'passed',
  'major'
];

const additionalBillDetailTypes = [
  'subjects',
  'amendments',
  'related',
  'cosponsors'
];

const memberComparisonTypes = [
  'bills',
  'votes'
];

const nomineeTypes = [
  'received',
  'updated',
  'confirmed',
  'withdrawn'
];

const voteTypes = [
  'missed',
  'party',
  'loneno',
  'perfect'
];

const memberBillTypes = [
  'introduced',
  'updated'
];

const proto = {
  /**
   * Resolves to biographical and Congressional role information for a particular member of Congress
   *
   * @param {String} memberId
   * @returns {Promise}
   */
  getMember(memberId) {
    return validate.memberId(memberId)
      .then(() => this.api.get(`members/${memberId}`));
  },
  /**
   * Resolves to the members of a particular committee
   *
   * @see https://propublica.github.io/congress-api-docs/#get-committees-and-committee-memberships
   * @param {String} chamber
   * @param {String} committeeId
   * @param {Object} [{congress = this.congress, offset = 0}={}]
   * @returns {Promise}
   */
  getCommitteeMembers(chamber, committeeId, {congress = this.congress, offset = 0} = {}) {
    return all(
      validate.chamber(chamber),
      validate.congress(congress, 110),
      validate.committeeId(committeeId)
    ).then(() => this.api.get(`${congress}/${chamber}/committees/${committeeId}`, offset));
  },
  /**
   * Resolves to a list of presidential civilian nominations of individuals from a specific state.
   *
   * @see https://propublica.github.io/congress-api-docs/#get-nominees-by-state
   * @param {String} state
   * @param {Object} [{congress = this.congress}={}]
   * @returns {Promise}
   */
  getNomineesByState(state, {congress = this.congress} = {}) {
    return all(
      validate.state(state),
      validate.congress(congress, 107)
    ).then(() => this.api.get(`${congress}/nominees/state/${state}`));
  },
  /**
   * Resolves to all votes in a particular month.
   *
   * @see https://propublica.github.io/congress-api-docs/#get-votes-by-date
   * @param {String} chamber
   * @param {String} year
   * @param {String} month
   * @returns {Promise}
   */
  getVotesByDate(chamber, year, month) {
    return all(
      validate.chamber(chamber),
      validate.year(year),
      validate.month(month)
    ).then(() => this.api.get(`${chamber}/votes/${year}/${month}`));
  },
  /**
   * Resolves to a specific roll-call vote, including a complete list of member positions.
   *
   * @see https://propublica.github.io/congress-api-docs/#get-a-specific-roll-call-vote
   * @param {String} chamber 'senate' or 'house'
   * @param {Number} sessionNumber 1 or 2
   * @param {Number} rollCallNumber
   * @param {Object} [{congress = this.congress}={}]
   * @returns {Promise}
   */
  getRollCallVotes(chamber, sessionNumber, rollCallNumber, {congress = this.congress} = {}) {
    return all(
      validate.rollCallNumber(rollCallNumber),
      validate.sessionNumber(sessionNumber),
      validate.chamber(chamber).then(() => validate.congress(congress, {house: 102, senate: 101}[chamber]))
    ).then(() => this.api.get(`${congress}/${chamber}/sessions/${sessionNumber}/votes/${rollCallNumber}`));
  },
  /**
   * Resolves to the 20 bills most recently introduced or updated by a particular member. Results
   * can include more than one Congress.
   *
   * @see https://propublica.github.io/congress-api-docs/#get-recent-bills-by-a-specific-member
   * @param {String} memberId
   * @param {String} memberBillType 'introduced' or 'updated'
   * @param {Object} [{offset = 0}={}]
   * @returns {Promise}
   */
  getBillsByMember(memberId, memberBillType, {offset = 0} = {}) {
    return all(
      validate.memberId(memberId),
      validate.type(memberBillType, memberBillTypes, 'member bill type')
    ).then(() => this.api.get(`members/${memberId}/bills/${memberBillType}`, offset));
  },
  /**
   * Resolves to the current members of the house of representatives for the given state and
   * district
   *
   * @see https://propublica.github.io/congress-api-docs/#get-current-members-by-state-district
   * @param {String} state
   * @param {Number} district
   * @returns {Promise}
   */
  getCurrentRepresentatives(state, district) {
    return all(
      validate.state(state),
      validate.district(district)
    ).then(() => this.api.get(`members/house/${state}/${district}/current`));
  },
  /**
   * Resolves to the current members of the senate for the given state
   *
   * @see https://propublica.github.io/congress-api-docs/#get-current-members-by-state-district
   * @param {any} state
   * @returns {Promise}
   */
  getCurrentSenators(state) {
    return validate.state(state)
      .then(() => this.api.get(`members/senate/${state}/current`));
  },
  /**
   * Resolves to a list of members who have left the Senate or House or have announced plans to do
   * so.
   *
   * @see https://propublica.github.io/congress-api-docs/#get-members-leaving-office
   * @param {String} chamber
   * @param {Object} [{congress = this.congress, offset = 0}={}]
   * @returns {Promise}
   */
  getLeavingMembers(chamber, {congress = this.congress, offset = 0} = {}) {
    return all(
      validate.congress(congress, 111),
      validate.chamber(chamber)
    ).then(() => this.api.get(`${congress}/${chamber}/members/leaving`, offset));
  },
  /**
   * You can get vote information in four categories: missed votes, party votes, lone no votes and
   * perfect votes. Missed votes provides information about the voting attendance of each member of
   * a specific chamber and congress. Party votes provides information about how often each member
   * of a specific chamber and congress votes with a majority of his or her party. Lone no votes
   * provides information lists members in a specific chamber and congress who were the only members
   * to vote No on a roll call vote, and how often that happened. Perfect votes lists members in a
   * specific chamber and congress who voted Yes or No on every vote for which he or she was
   * eligible.
   *
   * @see https://propublica.github.io/congress-api-docs/#get-votes-by-type
   * @param {String} chamber
   * @param {String} voteType
   * @param {Object} [{congress = this.congress, offset = 0}={}]
   * @returns {Promise}
   */
  getVotes(chamber, voteType, {congress = this.congress, offset = 0} = {}) {
    return all(
      validate.type(voteType, voteTypes, 'vote type'),
      validate.chamber(chamber).then(() => validate.congress(congress, {senate: 101, house: 102}[chamber]))
    ).then(() => this.api.get(`${congress}/${chamber}/votes/${voteType}`, offset));
  },
  /**
   * Resolves to Senate votes on presidential nominations
   *
   * @see https://propublica.github.io/congress-api-docs/#get-senate-nomination-votes
   * @param {Object} [{congress = this.congress, offset = 0}={}]
   * @returns {Promise}
   */
  getSenateNominationVotes({congress = this.congress, offset = 0} = {}) {
    return validate.congress(congress, 101)
      .then(() => this.api.get(`${congress}/nominations`, offset));
  },
  /**
   * Resolves to lists of presidential nominations for civilian positions
   *
   * @see https://propublica.github.io/congress-api-docs/#get-recent-nominations-by-category
   * @param {String} nomineeType
   * @param {Object} [{congress = this.congress}={}]
   * @returns {Promise}
   */
  getNominees(nomineeType, {congress = this.congress} = {}) {
    return all(
      validate.congress(congress, 107),
      validate.type(nomineeType, nomineeTypes, 'nominee type')
    ).then(() => this.api.get(`${congress}/nominees/${nomineeType}`));
  },
  /**
   * Resolves to party membership counts for all states (current Congress only)
   *
   * @see https://propublica.github.io/congress-api-docs/#get-state-party-counts
   * @returns {Promise}
   */
  getPartyCounts() {
    return this.api.get('states/members/party');
  },
  /**
   * Resolves to a list of Senate or House committees.
   *
   * @see https://propublica.github.io/congress-api-docs/#get-committees-and-committee-memberships
   * @param {String} chamber
   * @param {Object} [{congress = this.congress, offset = 0}={}]
   * @returns {Promise}
   */
  getCommittees(chamber, {congress = this.congress, offset = 0} = {}) {
    return all(
      validate.congress(congress, 110),
      validate.chamber(chamber)
    ).then(() => this.api.get(`${congress}/${chamber}/committees`, offset));
  },
  /**
   * Resolves to a comparison of bill sponsorship or vote positions between two members who served
   * in the same Congress and chamber.
   *
   * @see https://propublica.github.io/congress-api-docs/#compare-two-members-vote-positions
   * @see https://propublica.github.io/congress-api-docs/#compare-two-members-39-bill-sponsorships
   * @param {String} firstMemberId
   * @param {String} secondMemberId
   * @param {String} chamber 'house' or 'senate'
   * @param {String} memberComparisonType 'bills' or 'votes'
   * @param {Object} [{congress = this.congress, offset = 0}={}]
   * @returns {Promise}
   */
  getMemberComparison(firstMemberId, secondMemberId, chamber, memberComparisonType, {congress = this.congress, offset = 0} = {}) {
    return all(
      validate.memberId(firstMemberId),
      validate.memberId(secondMemberId),
      validate.type(memberComparisonType, memberComparisonTypes, 'member comparison type'),
      validate.chamber(chamber).then(() => validate.congress(congress, {senate: 101, house: 102}[chamber]))
    ).then(() => {
      const endpoint = `members/${firstMemberId}/${memberComparisonType}/${secondMemberId}/${congress}/${chamber}`;
      return this.api.get(endpoint, offset);
    });
  },
  /**
   * Resolves to the most recent vote positions for a specific member of the House of
   * Representatives or Senate
   *
   * @see https://propublica.github.io/congress-api-docs/#get-a-specific-member-39-s-vote-positions
   * @param {String} memberId
   * @param {Object} [{offset = 0}={}]
   * @returns {Promise}
   */
  getVotesByMember(memberId, {offset = 0} = {}) {
    return validate.memberId(memberId)
      .then(() => this.api.get(`members/${memberId}/votes`, offset));
  },
  /**
   * Resolves to a list of the most recent new members of the current Congress.
   *
   * @see https://propublica.github.io/congress-api-docs/#get-new-members
   * @param {Object} [{offset = 0}={}]
   * @returns {Promise}
   */
  getNewMembers({offset = 0} = {}) {
    return this.api.get('members/new', offset);
  },
  /**
   * Resolves to a list of members of a particular chamber in a particular Congress.
   *
   * @see https://propublica.github.io/congress-api-docs/#lists-of-members
   * @param {String} chamber 'senate' or 'house'
   * @param {Object} [{congress = this.congress, offset = 0}={}]
   * @returns {Promise}
   */
  getMemberList(chamber, {congress = this.congress, offset = 0} = {}) {
    return validate.chamber(chamber)
      .then(() => validate.congress(congress, {senate: 80, house: 102}[chamber]))
      .then(() => this.api.get(`${congress}/${chamber}/members`, offset));
  },
  /**
   * Resolves to additional details about a particular bill of the given type.
   *
   * @see https://propublica.github.io/congress-api-docs/#get-a-subjects-amendments-and-related-bills-for-a-specific-bill
   * @see https://propublica.github.io/congress-api-docs/#get-cosponsors-for-a-specific-bill
   * @param {String} billId
   * @param {String} additionalBillDetailType 'subjects', 'amendments', 'related', or 'cosponsors'
   * @param {Object} [{congress = this.congress, offset = 0}={}]
   * @returns {Promise}
   */
  getAdditionalBillDetails(billId, additionalBillDetailType, {congress = this.congress, offset = 0} = {}) {
    return all(
      validate.congress(congress, 105),
      validate.billId(billId),
      validate.type(additionalBillDetailType, additionalBillDetailTypes, 'additional bill detail type')
    ).then(() => this.api.get(`${congress}/bills/${billId}/${additionalBillDetailType}`, offset));
  },
  /**
   * Resolves to details about a particular bill, including actions taken and votes.
   *
   * @see https://propublica.github.io/congress-api-docs/#get-a-specific-bill
   * @param {String} billId
   * @param {Object} [{congress = this.congress}={}]
   * @returns {Promise}
   */
  getBill(billId, {congress = this.congress} = {}) {
    return all(
      validate.congress(congress, 105),
      validate.billId(billId)
    ).then(() => this.api.get(`${congress}/bills/${billId}`));
  },
  /**
   * Resolves to summaries of the 20 most recent bills by type. For the current Congress,
   * “recent bills” can be one of four types. For previous Congresses, “recent bills” means the last
   * 20 bills of that Congress.
   *
   * @see https://propublica.github.io/congress-api-docs/#get-recent-bills
   * @param {String} chamber 'senate' or 'house'
   * @param {String} recentBillType
   * @param {Object} [{congress = this.congress, offset = 0}={}]
   * @returns {Promise}
   */
  getRecentBills(chamber, recentBillType, {congress = this.congress, offset = 0} = {}) {
    return all(
      validate.chamber(chamber),
      validate.congress(congress, 105),
      validate.type(recentBillType, recentBillTypes, 'recent bill type')
    ).then(() => this.api.get(`${congress}/${chamber}/bills/${recentBillType}`, offset));
  }
};

module.exports = {
  /**
   * Factory for ProPublica Congress API wrapper object
   *
   * @param {String} key ProPublica API key
   * @param {Number} [congress=CURRENT_CONGRESS] Reference congress to be used as the default
   *                                             congress for any methods that take a congress
   * @returns {Object}
   */
  create(key, congress = CURRENT_CONGRESS) {
    if (congress && !validators.isValidCongress(congress)) {
      throw new Error(`Received invalid congress: ${stringify(congress)}`);
    }
    return assign(create(proto), {
      congress,
      api: api.create(key)
    });
  }
};
