module.exports = {
  dasherize: function ( str ) {
    return str.trim()
      .replace(/([A-Z])/g, '-$1')
      .replace(/[-_\s]+/g, '-')
      .toLowerCase();
  },
  camelize: function ( str ) {
    return str.trim().replace( /[-_\s]+(.)?/g, function ( match, c ){
      return c ? c.toUpperCase() : "";
    });
  },
  interpolate: function ( str, obj ) {
    return str.replace( /{([^{}]*)}/g, function ( a, b ) {
      var r = obj[b];
      return typeof r === 'string' || typeof r === 'number' ? r : a;
    });
  },
  mapKeys: function ( cb, obj ) {
    var ret = {};
    Object.keys( obj ).forEach( function ( key ) {
      var newKey = cb( key );
      ret[newKey] = obj[key];
    });
    return ret;
  }
}
