var LogSession  = require( '../../lib/classes/LogSession' ),
    SSEStream   = require( '../../lib/classes/SSEStream' )



module.exports.index = function( req, res ) {
  res.send("index")
}


module.exports.readStream = function( req, res ) {

  res.set('Content-Type',   'text/event-stream')
  res.set('Cache-Control',  'no-cache')
  res.set('Connection',     'keep-alive')

  LogSession.getById(req.params.id, function( err, logSession ) {
    var logEventStream, sseStream

    if( err ) 
      return res.generateError( 500, new Error("could not find logSession") )

    logEventStream = logSession.createLogEventStream()
    sseStream = new SSEStream()

    res.on('close', function() {
      logEventStream.end()
    })

    logEventStream
      .pipe( sseStream )
      .pipe( res )
      
  })
}