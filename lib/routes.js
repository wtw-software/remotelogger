
var fs                  = require( 'fs' ),
    logSessionStore     = require('./logSessionStore')

module.exports.serveTest = function( req, res ) {
  var html = fs.createReadStream( __dirname + "/../tests/index.html" )
  html.pipe( res )
}

module.exports.startLogSession = function( req, res ) {
  res.send('')
}

module.exports.stopLogSession = function( req, res ) {
  res.send('')
}

module.exports.logMessage = function( req, res ) {
  res.send('')
}