var LogSession = require( '../classes/LogSession' )


module.exports = function( req, res, next ) {
  var logSessionData, currentLogSession, error

  logSessionData = req.body.logSession
  currentLogSession = req.session.logSession

  if( currentLogSession ) {
    req.session.logSession = new LogSession( currentLogSession )    
    return next()
  }

  if( !logSessionData ) {
    error = new Error( "No logsession data in request" )
    return res.generateError( 500, error )
  }

  currentLogSession = new LogSession( logSessionData )

  if( currentLogSession instanceof Error ) {
    error = currentLogSession
    return res.generateError( 500, error )
  }

  req.session.logSession = currentLogSession
  
  next()
}