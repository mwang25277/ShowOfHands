var sinon = require( 'sinon' );
var chai = require( 'chai' );
var expect = require( 'chai' ).expect;
var sinonChai = require( 'sinon-chai' );
var expect = chai.expect;

var validations = require( '../src/params.js' );
var url = validations.urlParams;

var alphanumericTest = function ( methodName ) {
  describe( methodName, function () {
    it( 'Should validate alphanumeric strings', function () {
      expect( url[methodName]( 'abc123') ).to.equal( true );
    });

    it( 'Should\'t validate non-alphanumeric strings', function () {
      var chars = '`~!@#$%^&*()_+-={}[];:|\\\'<>,./?'.split( "" );
      expect( chars.some( url[methodName] ) ).to.equal( false );
    });
  });
};

var numericTest = function ( methodName ) {
  describe( methodName, function () {
    it( 'Should validate numbers and numeric strings', function () {
      expect( url[methodName]( '123') ).to.equal( true );
      expect( url[methodName]( 123 ) ).to.equal( true );
    });

    it( 'Should\'t validate non-numeric strings', function () {
      var chars = 'abcdefghijklmnopqrstuvwxyz`~!@#$%^&*()_+-={}[];:|\\\'<>,./?'.split( "" );
      expect( chars.some( url[methodName] ) ).to.equal( false );
    });
  });
};

var alphanumericMethods = [
  'bill-id',
  'committee-id',
  'member-id',
  'member-id-1',
  'member-id-2',
  'nominee-id',
];

var numericMethods = [
  'district',
  'roll-call-number',
  'session-number'
];

var containsMethods = [

];

describe( 'URL parameter validations', function () {

  alphanumericMethods.forEach( alphanumericTest );

  numericMethods.forEach( numericTest );

});

/*
module.exports = {
  urlParams: Object.freeze({
    'bill-id': alphanumeric,
    'bill-type': contains.bind( null, ['introduced', 'updated', 'passed', 'major'] ),
    'chamber': contains.bind( null, ['house', 'senate'] ),
    'committee-id': alphanumeric,
    'congress-number': function ( num ) {
      return contains( [105, 106, 107, 108, 109, 110, 111, 112, 113], Number( num ) );
    },
    'cosponsor-type': contains.bind( null, ['cosponsored', 'withdrawn'] ),
    'district': function ( str ) {
      return !isNan( Number( str ) ) // TODO: add real validation
    },
    'end-date': function () {
      return (
        // should match YYYY-MM-DD or YYYY-MM
        /^\d{4}-\d{1,2}-\d{1,2}$/.test( str ) ||
        /^\d{4}-\d{1,2}$/.test( str )
      );
    },
    'member-id': alphanumeric,
    'member-id-2': alphanumeric,
    'member-id-1': alphanumeric,
    'nomination-category': contains.bind( null, ['received', 'updated', 'confirmed', 'withdrawn'] ),
    'nominee-id': alphanumeric,
    'resource': contains.bind( null, ['subjects', 'amendments', 'related'] ),
    'response-format': contains.bind( null, ['.json', '.xml'] ),
    'roll-call-number': function ( str ) {
      return !isNaN( Number( str ) );
    },
    'session-number': function ( str ) {
      return !isNaN( Number( str ) );
    },
    'start-date': function ( str ) {
      return (
        // should match YYYY-MM-DD or YYYY-MM
        /^\d{4}-\d{1,2}-\d{1,2}$/.test( str ) ||
        /^\d{4}-\d{1,2}$/.test( str )
      );
    },
    'state': contains.bind( null, ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'] ),
    'vote-type': contains.bind( null, ['missed_votes', 'party_votes', 'loneno', 'perfect'] ),
    'version': function ( str ) {
      return str === 'v3';
    }
  }),

  queryStringParams: Object.freeze({
    'state': contains.bind( null, ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'] ),
    'district': function ( num ) {
      var num = Number( num );
      return ( num >= 0 && num < 53 );
    }
  })
};
*/
