propublica-congress-node
=================
[![NPM](https://nodei.co/npm/propublica-congress-node.png?compact=true)](https://nodei.co/npm/propublica-congress-node/)

[![Build Status](https://travis-ci.org/notioncollective/propublica-congress-node.svg?branch=master)](https://travis-ci.org/notioncollective/propublica-congress-node)

> Big ups to Nick Bottomley (http://github.com/nickb1080), who wrote most of this code. We've just updated it to hit the updated ProPublica endpoints, as the API is now maintained there.

Node wrapper for ProPublica Congress API (formerly NYT). [REST API Docs](https://propublica.github.io/congress-api-docs).

## Usage

```javascript

  var Congress = require( 'propublica-congress-node' );
  var client = new Congress( API_KEY );

  client.memberLists({
    congressNumber: '114',
    chamber: 'house'
  }).then(function(res) {
    console.log(res);
  });

```

This package works in the browser. To generate a version that will provide a `Congress` browser global, go to the project root and run (assuming you have `browserify` installed globally):

```sh
browserify -s Congress ./ > congress-browser.js
```

Fair warning: the standalone, browserified pacakage is pretty darn big.

`propublica-congress-node` is a straight-forward wrapper around the ProPublica Congress API (formerly maintained by the NYT). The ProPublica site has [comprehensive documentation](https://propublica.github.io/congress-api-docs) as well as example results for each query.

Internally, `propublica-congress-node` uses string interpolation on the API endpoints detailed in the [API documentation](https://propublica.github.io/congress-api-docs). For example, the bill details endpoint has a url structure as follows

```
https://api.propublica.org/congress/{version}/{congress-number}/{chamber}/members.{response-format}
```

A valid request needs to fill in this URL with the following parameters: `version`, `congress-number`, `chamber`, and a `response-format`.

Of these, only `chamber` is required. The `version` defaults to 'v1' (the only version, currently), `congress-number` defaults to 114 (the current congress, in 2017), and `response-format` defaults to JSON (also the only offering, currently).

Each method takes a parameters object, which it "dasherizes" (turns the keys from `camelCase` to `dash-case`), then interpolates these values into the string.

The API key (request one from ProPublica) must be passed to the constructor and is automatically added to every request in the `X-API-Key` header.

The example at the top

```javascript
  var Congress = require( 'propublica-congress-node' );
  var client = new Congress( 'API_KEY' );

  client.memberLists({
    chamber: 'house'
  }).then(function(res) {
    console.log(res);
  });
```
will dispatch a request to the following URL:

```
https://api.propublica.org/congress/v0/114/house/members.json
```

**Every method returns a ES6 Promise.**

# API
- [Bills](#bills)
  - [billDetails](#billDetails)
  - [billSubjects](#billSubjects)
  - [billAmendments](#billAmendments)
  - [billRelatedBills](#billRelatedBills)
  - [billCosponsors](#billCosponsors)

- [Members](#members)
  - [memberLists](#memberLists)
  - [memberBioAndRoles](#memberBioAndRoles)
  - [membersNew](#membersNew)
  - [membersCurrentByStateOrDistrict](#membersCurrentByStateOrDistrict)
  - [membersLeavingOffice](#membersLeavingOffice)
  - [memberVotePositions](#memberVotePositions)
  - [memberVoteComparison](#memberVoteComparison)
  - [memberCosponsoredBills](#memberCosponsoredBills)
  - [memberSponsorshipComparison](#memberSponsorshipComparison)
  - [memberFloorAppearances](#memberFloorAppearances)

- [Nominees](#nominees)
  - [nomineeLists](#nomineeLists)
  - [nomineeDetails](#nomineeDetails)
  - [nomineesByState](#nomineesByState)

- [Other](#other)
  - [statePartyCounts](#statePartyCounts)
  - [committeeList](#committeeList)
  - [committeeRoster](#committeeRoster)
  - [chamberSchedule](#chamberSchedule)

- [Votes](#votes)
  - [votesRollCall](#votesRollCall)
  - [votesByType](#votesByType)
  - [votesByDate](#votesByDate)
  - [votesNominations](#votesNominations)

## Bills

### `.billsRecent()`
**Endpoint documentation**: [Recent bills](https://propublica.github.io/congress-api-docs/#get-recent-bills)

**Parameters:**
```
- congressNumber
- chamber
- billType
```

### `.billsByMember()`
**Endpoint documentation**: [Bills by member](https://propublica.github.io/congress-api-docs/#get-recent-bills-by-a-specific-member)

**Parameters:**
```
- memberId
- billType
```

### `billDetails()`
**Endpoint documentation**: [Bill details](https://propublica.github.io/congress-api-docs/#get-a-specific-bill)

**Parameters:**
```
- congressNumber
- billId
```

### `billSubjects()`
**Endpoint documentation**: [Bill subjects, amendments, and related bills](https://propublica.github.io/congress-api-docs/#get-a-subjects-amendments-and-related-bills-for-a-specific-bill) _with type set to "subjects"_

**Parameters:**
```
- congressNumber
- billId
```

### `billAmendments()`
**Endpoint documentation**: [Bill subjects, amendments, and related bills](https://propublica.github.io/congress-api-docs/#get-a-subjects-amendments-and-related-bills-for-a-specific-bill) _with type set to "amendment"_

**Parameters:**
```
- congressNumber
- billId
```

### `billRelatedBills()`
**Endpoint documentation**: [Bill subjects, amendments, and related bills](https://propublica.github.io/congress-api-docs/#get-a-subjects-amendments-and-related-bills-for-a-specific-bill) _with type set to "related"_

**Parameters:**
```
- congressNumber
- billId
```

### `billCosponsors()`
**Endpoint documentation**: [Bill cosponsors](https://propublica.github.io/congress-api-docs/#get-cosponsors-for-a-specific-bill)

**Parameters:**
```
- congressNumber
- billId
```

## Members

### `memberLists()`
**Endpoint documentation**: [Member lists](https://propublica.github.io/congress-api-docs/#lists-of-members)

**Parameters:**
```
- congressNumber
- chamber
```

### `memberBioAndRoles()`
**Endpoint documentation**: [Member detail, bio and roles](https://propublica.github.io/congress-api-docs/#get-a-specific-member)

**Parameters:**
```
- memberId
```

### `membersNew()`
**Endpoint documentation**: [New members](https://propublica.github.io/congress-api-docs/#get-new-members)

**Parameters:**
```
- _None_
```

### `membersCurrentByStateOrDistrict()`
**Endpoint documentation**: [Current members by state/district](https://propublica.github.io/congress-api-docs/#get-current-members-by-state-district)

**Parameters:**
```
- chamber
- state
- district (for house only)
```

### `membersLeavingOffice()`
**Endpoint documentation**: [Members leaving office](https://propublica.github.io/congress-api-docs/#get-members-leaving-office)

**Parameters:**
```
- congressNumber
- chamber
```

### `memberVotePositions()`
**Endpoint documentation**: [Member vote positions](https://propublica.github.io/congress-api-docs/#get-a-specific-member-39-s-vote-positions)

**Parameters:**
```
- memberId
```

### `memberVoteComparison()`
**Endpoint documentation**: [Member vote comparison](https://propublica.github.io/congress-api-docs/#compare-two-members-vote-positions)

**Parameters:**
```
- memberId1
- memberId2
- congressNumber
- chamber
```

### `memberSponsorshipComparison()`
**Endpoint documentation**: [Member cosponsorship comparison](https://propublica.github.io/congress-api-docs/#compare-two-members-39-bill-sponsorships)

**Parameters:**
```
- memberId1
- memberId2
- congressNumber
- chamber
```

### `memberCosponsoredBills()`
**Endpoint documentation**: [Bills cosponsored by a member](https://propublica.github.io/congress-api-docs/#get-bills-cosponsored-by-a-specific-member)

**Parameters:**
```
- memberId
- type ('cosponsored' or 'withdrawn')
```

### ~~`memberFloorAppearances()`~~
**Endpoint documentation**: ~~Member floor appearances~~ Not yet implemented in ProPublica API, but maybe coming soon.

**Parameters:**
```
- memberId
```

## Nominees

### `nomineeLists()`
**Endpoint documentation**: [Nominee lists](https://propublica.github.io/congress-api-docs/#nominations)

**Parameters:**
```
- congressNumber
- type ('received', 'updated', 'confirmed', 'withdrawn')
```

### `nomineeDetails()`
**Endpoint documentation**: [Nominee details](https://propublica.github.io/congress-api-docs/#get-a-specific-nomination)

**Parameters:**
```
- congressNumber
- nomineeId
```

### `nomineesByState()`
**Endpoint documentation**: [Nominees by state](https://propublica.github.io/congress-api-docs/#get-nominees-by-state)

**Parameters:**
```
- congressNumber
- state
```

## Other

### `statePartyCounts()`
**Endpoint documentation**: [State party counts](https://propublica.github.io/congress-api-docs/#get-state-party-counts)

**Parameters:**
```
- _NONE_
```

### `committeeList()`
**Endpoint documentation**: [Committees and committee members](https://propublica.github.io/congress-api-docs/#get-committees-and-committee-memberships) _but doesn't accept a committee id_

**Parameters:**
```
- congressNumber
- chamber
```

### `committeeRoster()`
**Endpoint documentation**: [Committees and committee members](https://propublica.github.io/congress-api-docs/#get-committees-and-committee-memberships) _but requires a committee id_

**Parameters:**
```
- congressNumber
- chamber
- committeeId
```

## Votes

### `votesRollCall()`
**Endpoint documentation**: [Roll-call votes](https://propublica.github.io/congress-api-docs/#get-a-specific-roll-call-vote)

**Parameters:**
```
- congressNumber
- chamber
- sessionNumber
- rollCallNumber
```

### `votesByType()`
**Endpoint documentation**: [Votes by type](https://propublica.github.io/congress-api-docs/#get-votes-by-type)

**Parameters:**
```
- congressNumber
- chamber
- voteType
```

### `votesByDate()`
**Endpoint documentation**: [Votes by date](https://propublica.github.io/congress-api-docs/#get-votes-by-date)

**Parameters:**
```
- chamber
- year
- month
```

### `votesNominations()`
**Endpoint documentation**: [nominationVotes](https://propublica.github.io/congress-api-docs/#get-senate-nomination-votes)

**Parameters:**
```
- congressNumber
```

# Parameter Validation
`propublica-congress-node` validates all parameters passed to methods. Generally, parameter strings are checked with `contains`, `alphanumeric`, `numeric`, and `date`. Contains checks if a value is in a pre-set list. Each parameter will also accept the camelCased version of it's key.

```
'bill-id': alphanumeric
'bill-type': contains // => ['introduced', 'updated', 'passed', 'major']
'chamber': contains // => ['house', 'senate']
'committee-id': alphanumeric,
'congress-number': contains // => [105, 106, 107, 108, 109, 110, 111, 112, 113]
'cosponsor-type': contains // => ['cosponsored', 'withdrawn']
'district': numeric
'end-date': date
'member-id': alphanumeric
'member-id-2': alphanumeric
'member-id-1': alphanumeric
'nomination-category': contains // => ['received', 'updated', 'confirmed', 'withdrawn']
'nominee-id': alphanumeric
'resource': contains // => ['subjects', 'amendments', 'related'] ),
'response-format': contains // => ['.json', '.xml']
'roll-call-number': numeric
'session-number': numeric
'start-date': date
'state': contains // => ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']
'vote-type': contains // => ['missed_votes', 'party_votes', 'loneno', 'perfect'] ),
'version': // => must be v3
'year': numeric
'month': numeric
```
