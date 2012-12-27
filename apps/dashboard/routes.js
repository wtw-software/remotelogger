var LogSession  = require( '../../lib/classes/LogSession' ),
    Stream      = require( 'stream' ).Stream,
    SSEStream   = require( '../../lib/classes/SSEStream' ),
    async       = require( 'async' )



module.exports.index = function( req, res ) {
  res.render( 'index' )
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


module.exports.getSyncStream = function( req, res, next ) {
  var syncStream, logEventStream

  syncStream = new SSEStream()

  syncStream
    .pipe( res )

  res.on('close', function() {
    syncStream.end()
  })

  LogSession.getAll(function( error, logSessions ) {
    if( error )
      return res.generateError( 500, error )

    logSessions.forEach(function( logSession ) {
      
      logEventStream = logSession.createLogEventStream()

      logEventStream.on('ready', function() {
        logSession.emitAddLogSession()
      })

      logEventStream.pipe( syncStream )

    })
  })
}
