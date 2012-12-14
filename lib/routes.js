
var fs = require( 'fs' )

module.exports.index = function( req, res ) {
  var html = fs.createReadStream( __dirname + "/../views/index.html" )
  html.pipe( res )
}

module.exports.logMessage = function( req, res ) {
  res.send('')
}