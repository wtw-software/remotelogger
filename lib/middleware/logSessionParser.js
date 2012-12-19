var LogSession = require( '../classes/LogSession' )
    LogMessage = require( '../classes/LogMessage' )


module.exports = function( req, res, next ) {
  var logSessionData, currentLogSession, error

  currentLogSessionData = req.session.logSessionData

  if( currentLogSessionData ) {
    currentLogSessionData.logMessages = currentLogSessionData.logMessages.map(function( logMessageData ) {
      return new LogMessage( logMessageData )
    })
    req.logSession = new LogSession( currentLogSessionData )
    return next()
  }

  logSessionData = req.body.logSession

  if( !logSessionData ) {
    error = new Error( "No logsession data in request" )
    return res.generateError( 500, error )
  }

  currentLogSession = new LogSession( logSessionData )

  if( currentLogSession instanceof Error ) {
    error = currentLogSession
    return res.generateError( 500, error )
  }

  req.logSession = currentLogSession
  req.session.logSessionData = currentLogSession
  
  next()
}