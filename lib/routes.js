var fs          = require( 'fs' ),
    LogSession  = require( './classes/LogSession' )
    LogMessage  = require( './classes/LogMessage' )




module.exports.index = function( req, res ) {
  var html = fs.createReadStream( __dirname + "/../views/index.html" )
  html.pipe( res )
}


module.exports.readStream = function( req, res ) {
  LogSession.getById(req.params.id, function( err, logSession ) {

    var readStream = logSession.createDuplexStream()

    res.on("close", function() {
      readStream.end()
    })

    readStream.pipe( res )
  })
}


module.exports.postLogMessage = function( req, res ) {
  var logMessageData, logMessage, error

  logMessageData = req.body.logMessage
  logMessage = new LogMessage( logMessageData )

  if( logMessage instanceof Error ) {
    error = logMessage
    return res.generateError( 400, error )
  }

  try {
    req.logSession.pushLogMessage( logMessage )
  } catch( error ) {
    return res.generateError( 500, error )
  }
  
  res.send()
}
