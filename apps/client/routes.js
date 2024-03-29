var fs          = require( 'fs' ),
    LogMessage  = require( '../../lib/classes/LogMessage' )




module.exports.index = function( req, res ) {
  var html = fs.createReadStream( __dirname + "/../views/index.html" )
  html.pipe( res )
}


module.exports.postLogMessage = function( req, res ) {
  var logMessageData, logMessage, error

  try {
    logMessageData = JSON.parse(req.body.logMessage)  
  } catch( error ) {
    return res.generateError( 500, error )
  }
  
  logMessage = new LogMessage( logMessageData )

  if( logMessage instanceof Error ) {
    error = logMessage
    return res.generateError( 400, error )
  }

  try {

    req.logSession.emitPushLogMessage( logMessage )
    res.end()

  } catch( error ) {
    return res.generateError( 500, error )
  }
}


module.exports.consoleLoad = function( req, res ) {
  req.logSession.emitConsoleLoad()
  res.send()
}
