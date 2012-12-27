var LogSession  = require( '../../lib/classes/LogSession' ),
    Stream      = require( 'stream' ).Stream,
    SSEStream   = require( '../../lib/classes/SSEStream' ),
    async       = require( 'async' )



module.exports.index = function( req, res ) {
  res.send("index")
}


module.exports.getAllLogSessions = function( req, res, next ) {
  LogSession.getAll(function( error, logSessions ) {
    if( error )
      return res.generateError( 500, error )

    res.send( logSessions || [] )

  })
}


module.exports.getLogSession = function( req, res, next ) {
  res.send( req.logSession )
}


module.exports.getStream = function( req, res, next ) {
  var logSession, logEventStream, streamFormatter

  res.set('Content-Type',   'text/event-stream')
  res.set('Cache-Control',  'no-cache')
  res.set('Connection',     'keep-alive')

  logSession = req.logSession

  logEventStream = logSession.createLogEventStream()

  switch( req.params.format ) {
  case 'sse':
    streamFormatter = new SSEStream()
    break
  }

  res.on('close', function() {
    logEventStream.end()
  })

  if( streamFormatter ) {

    logEventStream
      .pipe( streamFormatter )  
      .pipe( res )

  } else {

    logEventStream.pipe( res )

  }
      
}
