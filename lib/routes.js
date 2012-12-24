var fs          = require( 'fs' ),
    through     = require( 'through' ),
    LogSession  = require( './classes/LogSession' )
    LogMessage  = require( './classes/LogMessage' ),
    SSEStream   = require( './classes/SSEStream' )




module.exports.index = function( req, res ) {
  var html = fs.createReadStream( __dirname + "/../views/index.html" )
  html.pipe( res )
}


module.exports.readStream = function( req, res ) {

  res.set('Content-Type', 'text/event-stream')
  res.set('Cache-Control', 'no-cache')
  res.set('Connection', 'keep-alive')

  LogSession.getById(req.params.id, function( err, logSession ) {
    var logStream, sseStream

    logStream = logSession.createLogEventStream()
    sseStream = new SSEStream()

    res.on("close", function() {
      logStream.end()
    })

    logStream
      .pipe( sseStream )
      .pipe( res )

    logStream.on('ready', function() {
      logSession.emitEventCache()
    })
      
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
    res.end()

  } catch( error ) {
    return res.generateError( 500, error )
  }
}


module.exports.consoleLoad = function( req, res ) {
  req.logSession.publishEvent( 'consoleload', 1 )
  res.send()
}
