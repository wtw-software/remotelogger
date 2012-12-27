var LogSession = require( '../classes/LogSession' ),
    LogMessage = require( '../classes/LogMessage' )


module.exports = function( req, res, next ) {
  var logSessionData

  logSessionData = req.body.logSession
  

  LogSession.findByData(logSessionData, function( error, logSession ) {

    if( error )
      return res.generateError( 500, error )

    if( logSession ) {
      req.logSession = logSession
      return next()
    }

    logSession = new LogSession( logSessionData )

    if( logSession instanceof Error ) {
      error = logSession
      return res.generateError( 400, error )
    }

    logSession.save(function( error ) {
      if( error )
        return res.generateError( 500, error )

      req.logSession = logSession
      next()
    })

  })
}