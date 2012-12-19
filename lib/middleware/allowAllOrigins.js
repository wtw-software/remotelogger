
module.exports = function( req, res, next ) {
  res.set( 'Access-Control-Allow-Origin', '*' )
  res.set( 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS' )
  res.set( 'Access-Control-Max-Age', '604800' )
  next()
}