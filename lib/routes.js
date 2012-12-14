
var fs = require( 'fs' )

module.exports.serveTest = function( req, res ) {
  var html = fs.createReadStream( __dirname + "/../tests/index.html" )
  html.pipe( res )
}

module.exports.logMessage = function( req, res ) {
  res.send('')
}