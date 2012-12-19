var LogMessage = require( './LogMessage' )


function LogSession( sessionData ) {
  if( sessionData instanceof LogSession )
    sessionData = sessionData.sessionData
  if( !sessionData )
    return new Error( "no sessiondata passed to LogSession constructor" )
  if( !sessionData.appName ) 
    return new Error( "no appname on sessionData" )
  if( !sessionData.userName ) 
    return new Error( "no username on sessionData" )

  this.sessionData = sessionData
  this.logMessages = []

}

LogSession.prototype.pushLogMessage = function( logMessage ) {
  if( !(logMessage instanceof LogMessage) ) {
    throw new TypeError( 'logMessage not instance of LogMessage' )
  }
  this.logMessages.push( logMessage )
}

module.exports = LogSession