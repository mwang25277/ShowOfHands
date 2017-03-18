/**
 * Extremely thin wrapper around got
 */

const got = require('got');

function get(url, {headers = {}, body = {}, json = false} = {}) {
  return got.get(url, {
    headers,
    body,
    json
  });
}

module.exports = {
  get
};
