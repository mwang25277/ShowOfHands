var request = require( 'request' );

var params = require( './params' );
var urlParams = params.urlParams
var qsParams = params.qsParams

var util = require( './util' );
var interpolate = util.interpolate;
var dasherize = util.dasherize;
var mapKeys = util.mapKeys;

var dasherizeKeys = mapKeys.bind( null, dasherize );

var endpoints = Object.assign( {},
  require( './bills' ),
  require( './members' ),
  require( './votes' ),
  require( './nominees' ),
  require( './other' )
);

var defaults = {
  'version': 'v1',
  'response-format': '.json',
  'congress-number': 114 // current congress
};

var getAsPromise = function ( opt ) {
  return new Promise( function ( resolve, reject ) {
    request( opt, function ( err, resp, body ) {
      if ( err ) {
        reject( err );
      } else {
        resolve( body );
      }
    });
  });
};

// confirms that a parameter hash is valid against params.js
var validateParams = function ( params ) {
  var validity = Object.keys( params ).every( function ( key ) {
    var ok = urlParams[key]( params[key] );
    if ( !ok ) {
      console.log( params[key] + " is an invalid value for " + key );
    }
    return ok;
  });
};

var validateUrl = function ( url ) {
  var matches = url.match( /{([^{}]*)}/g );
  if ( matches ) {
    matches = matches.map( function ( match, i ) {
      return match.replace( "}", "\"" ).replace( "{", "\"" );
    });
    console.log( 'No value for parameters: ' + matches.join( ', ' ) );
  }
};

// separates URI paramaters and querystring parameters into discrete objects.
var generateOpts = function ( opt ) {
  var qs = {};
  var params = {};
  Object.keys( opt ).forEach( function ( key ) {
    if ( urlParams[key] ) {
      params[key] = opt[key];
    } else if ( qsParams[key] ) {
      qs[key] = opt[key];
    }
  });
  return {
    params: params,
    qs: qs
  };
};

var apiRequest = function ( endpoint, key, opt ) {

  var dashedOpt = dasherizeKeys( Object.assign( {}, defaults, opt ) );
  var opts = generateOpts( dashedOpt );
  var params = opts.params;
  var qs = opts.qs;
  var headers = {
    'X-API-Key': key
  };

  // will throw informative errors if invalid
  validateParams( params );

  var url = interpolate( endpoint, params );

  // will throw informative error if some params aren't satisfied
  validateUrl( url );

  return getAsPromise({
    url: url,
    qs: qs,
    headers: headers,
    withCredentials: false
  }).then( function ( response ) {
    var res;
    try {
      res = JSON.parse( response );
    } catch ( err ) {
      res = response;
    }
    return res;
  });

};

var Congress = ( function () {

  function Congress( apiKey ) {
    this._apiKey = apiKey;
  }

  // build a method for each endpoint.
  Object.keys( endpoints ).forEach( function ( name ) {
    Congress.prototype[name] = function ( opt ) {
      return apiRequest( endpoints[name], this._apiKey, opt );
    };
  });

  return Congress;

})();

module.exports = Congress;
