
function LogMessage( logMessageData ) {
  if( !logMessageData.timeStamp )
    return new Error( 'no timeStamp on logMessageData' )
  if( !logMessageData.type )
    return new Error( 'no type on logMessageData' )
  if( !logMessageData.messages )
    return new Error( 'no messages on logMessageData' )
  
  this.timeStamp = logMessageData.timeStamp
  this.type = logMessageData.type
  this.messages = logMessageData.messages
  this.remotelyLogged = logMessageData.remotelyLogged
}

module.exports = LogMessage