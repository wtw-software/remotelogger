var LogSession = require( '../classes/LogSession' ),
    LogMessage = require( '../classes/LogMessage' )


module.exports = function( opts ) {
  return function( req, res, next ) {
    
    var logSessionData

    logSessionData = req.body.logSession
    

    LogSession.findByData(logSessionData, function( error, logSession ) {

      if( error )
        return res.generateError( 500, error )

      if( logSession ) {

        req.logSession = logSession
        logSession.expireAfter( opts.maxAge )

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

        logSession.expireAfter( opts.maxAge )

        logSession.emitAddLogSession()
        
        req.logSession = logSession
        next()
      })

    })
  }
}