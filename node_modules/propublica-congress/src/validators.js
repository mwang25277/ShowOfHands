/**
 * Exports validation utility functions used throughout this library. They're primarily intended
 * for minimizing unnecessary API calls so some aren't very strict
 */

const states = require('./states')
  , {CURRENT_CONGRESS} = require('./defaults');

/**
 * Whether the argument is a valid offset to send to the ProPublica API
 * @param {String|Number} offset
 * @return {Boolean}
 */
function isValidOffset(offset) {
  return (offset % 20) === 0 && offset !== '';
}

/**
 * Whether the given type is in the given types array
 * @param  {String}  type
 * @param  {Array}   [types=[]] An array of types to validate against
 * @return {Boolean}
 */
function isValidType(type, types = []) {
  return !!type
    && !!type.length
    && types.indexOf(type) > -1;
}

/**
 * Whether the given string is a valid chamber of congress
 * @param  {String}  chamber
 * @return {Boolean}
 */
function isValidChamber(chamber) {
  return isValidType(chamber, [
    'senate',
    'house'
  ]);
}


/**
 * Whether the given session of congress is valid
 * @param  {Number}  session
 * @param  {Number}  earliestSession Different endpoints support different
 *                                   lower limits
 * @return {Boolean}
 */
function isValidCongress(session, earliestSession) {
  if (parseInt(session) != session) return false;
  if (earliestSession && parseInt(earliestSession) != earliestSession) return false;
  return earliestSession
    ? session <= CURRENT_CONGRESS && session >= earliestSession
    : session <= CURRENT_CONGRESS;
}

/**
 * Whether the API key is valid (for trying to use)
 * @param  {String}  apiKey
 * @return {Boolean}
 */
function isValidApiKey(apiKey) {
  return !!apiKey && !!apiKey.length && apiKey.length > 0;
}

/**
 * Whether the given billId is appropriate for use with the API
 * @param {String} billId
 * @returns {Boolean}
 */
function isValidBillId(billId) {
  return /hres\d+/.test(billId);
}

/**
 * Whether the given memberId looks valid and could be used with the API
 *
 * @param {String} memberId
 * @returns {Boolean}
 */
function isValidMemberId(memberId) {
  let match;
  return !!(memberId && memberId.match)
    && !!(match = memberId.match(/[A-Z]\d{6}/)) && !!match && match[0] === memberId;
}

/**
 * Whether the given state is a US state with representation in congress and may be used with API
 * endpoints that accept a US state
 *
 * @param {String} state
 * @returns {Boolean}
 */
function isValidState(state) {
  return isValidType(state, states);
}

/**
 * Whether the argument is a valid district to use with the API
 *
 * @param {Number} district
 * @returns {Boolean}
 */
function isValidDistrict(district) {
  return !!district && parseInt(district) > 0;
}

/**
 * Whether the argument is a valid session of congress to use with the API
 *
 * @param {Number} sessionNumber
 * @returns {Boolean}
 */
function isValidSessionNumber(sessionNumber) {
  return parseInt(sessionNumber) === 1
    || parseInt(sessionNumber) === 2;
}

/**
 * Whether the argument is a valid roll call vote number to use with the API
 *
 * @param {Number} rollCallNumber
 * @returns {Boolean}
 */
function isValidRollCallNumber(rollCallNumber) {
  return !!rollCallNumber && parseInt(rollCallNumber) > 0;
}

/**
 * Whether the argument is a valid year for use with the API
 *
 * @param {String} year Year in 'YYYY' format
 * @returns {Boolean}
 */
function isValidYear(year) {
  return /(19|20)\d\d/.test(year);
}

/**
 * Whether the argument is a valid month for use with the API
 *
 * @param {String} month Month in 'MM' format
 * @returns {Boolean}
 */
function isValidMonth(month) {
  return /(0[1-9]|1[012])/.test(month);
}

/**
 * Whether the argument is a valid house or senate committee ID and appropriate for use with the API
 *
 * @param {String} committeeId
 * @returns {Boolean}
 */
function isValidCommitteeId(committeeId) {
  return /(SS|HS)[A-Z]{2}/.test(committeeId);
}

module.exports = {
  isValidCommitteeId,
  isValidMonth,
  isValidYear,
  isValidRollCallNumber,
  isValidSessionNumber,
  isValidDistrict,
  isValidState,
  isValidMemberId,
  isValidBillId,
  isValidCongress,
  isValidChamber,
  isValidType,
  isValidOffset,
  isValidApiKey
};
