var express       = require( 'express' ),
    RedisStore    = require( 'connect-redis' )( express )

var store = null

module.exports.getInstance = function() {
  if( !store ) {
    store = new RedisStore()
  }
  return store
}