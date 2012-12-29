var LogMessage    = require( "./LogMessage" ),
    argsToArray   = require( "./argsToArray" ),
    http          = require( "./http" ),
    TraceKit      = require( "./TraceKit" )



var nativeConsole = window.console


function Console() {

  this.logMessages = []

  this.remoteLogging = {
    session: {
      appName: null,
      userName: null,
      sessionId: null
    },
    on: false,
    url: "http://jsloggerclient.wtw.no:3000"  
  }

  this.nativeConsole = nativeConsole

}


Console.prototype.remoteLog = function() {
  var args
  args = argsToArray( arguments ) 
  logMessage = new LogMessage( "log", args )
  this.logMessages.push( logMessage )
  this.postLogMessage( logMessage )
}


Console.prototype.log = function() {
  var args
  args = argsToArray( arguments ) 
  logMessage = new LogMessage( "log", args )
  this.logMessages.push( logMessage )
  this.invokeSuperMethod( "log", args )
  if( this.remoteLogging.on )
    this.postLogMessage( logMessage )
}
  

Console.prototype.info = function() {
  var args
  args = argsToArray( arguments) 
  logMessage = new LogMessage( "log", args )
  this.logMessages.push( logMessage )
  this.invokeSuperMethod( "log", args )
  if( this.remoteLogging.on )
    this.postLogMessage( logMessage )
}
  

Console.prototype.warn = function() {
  var args
  args = argsToArray( arguments) 
  logMessage = new LogMessage( "log", args )
  this.logMessages.push( logMessage )
  this.invokeSuperMethod( "log", args )
  if( this.remoteLogging.on )
    this.postLogMessage( logMessage )
}
  

Console.prototype.error = function() {
  var args
  args = argsToArray( arguments) 
  logMessage = new LogMessage( "log", args )
  this.logMessages.push( logMessage )
  this.invokeSuperMethod( "log", args )
  if( this.remoteLogging.on )
    this.postLogMessage( logMessage )
}

Console.prototype.invokeSuperMethod = function( type, logMessages ) {
  if( this.nativeConsole && this.nativeConsole[type] )
    this.nativeConsole[type].apply( this.nativeConsole, logMessages )
}
  

Console.prototype.turnOnRemoteLogging = function() {
  this.remoteLogging.on = true
}
  

Console.prototype.turnOffRemoteLogging = function() {
  this.remoteLogging.on = false
}
  

Console.prototype.startRemoteLogSession = function() {
  this.turnOnRemoteLogging()
  this.logUnloggedLogMessagesToRemote()
}
  

Console.prototype.continueRemoteLogSession = function() {
  this.turnOnRemoteLogging()
  this.logUnloggedLogMessagesToRemote()
}
  

Console.prototype.logUnloggedLogMessagesToRemote = function() {
  var i, logMessage
  for( i = 0; i < this.logMessages.length; i++ ) {
    logMessage = this.logMessages[ i ]
    if( !logMessage.remotelyLogged )
      this.postLogMessage( logMessage )
  }
}
  

Console.prototype.emitLoad = function() {
  http.post({
    url: this.remoteLogging.url + "/log/consoleload",
    data: {
      logSession: this.remoteLogging.session
    },
    error: function( error ){ },
    success: function( ){ }
  })
}
  

Console.prototype.postLogMessage = function(logMessage, cb) {
  
  try {
    logMessage = JSON.stringify( logMessage )
  } catch( error ) {
    return cb( error )
  }
  
  http.post({
    url: this.remoteLogging.url + "/log/message",
    data: {
      logMessage: logMessage,
      logSession: this.remoteLogging.session
    },
    error: function( error ) {
      this.nativeConsole.log( error )
      if( cb )
        cb( error )
    },
    success: function() {
      logMessage.remotelyLogged = true
      if( cb )
        cb( null )
    }
      
  })
    
}
    



module.exports = Console
