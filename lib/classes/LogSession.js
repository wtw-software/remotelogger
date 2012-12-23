var LogStream             = require( './LogStream' )
    redis                 = require( 'redis' ),
    async                 = require( 'async' ),
    LogMessage            = require( './LogMessage' )



var redisStore, redisPublisher

redisStore = redis.createClient()
redisPublisher = redis.createClient()


function LogSession( sessionData ) {
  if( !sessionData )
    return new Error( "no sessiondata passed to LogSession constructor" )
  if( !sessionData.appName ) 
    return new Error( "no appname on sessionData" )
  if( !sessionData.userName ) 
    return new Error( "no username on sessionData" )

  this.appName = sessionData.appName
  this.userName = sessionData.userName
  this.logMessages = sessionData.logMessages || [ ]  

}

LogSession.getAll = function( cb ) {
  var logSessions

  logSessions = []

  redisStore.keys("*", function( err, ids ) {
    if( err )
      return cb( err )
    
    async.map(ids, LogSession.getById, function( err, logSessions ) {
      if( err )
        cb( err )

      cb( null, logSessions )
    })
  })
}


LogSession.getById = function( id, cb ) {
  var logSessionData, logSession

  redisStore.get(id, function( err, sessionData ) {
    if( err )
      cb( err )
    
    try {
      sessionData = JSON.parse( sessionData )
      logSessionData = sessionData.logSessionData
      logSession = new LogSession( logSessionData )
    } catch( error ) {
      return cb( error )
    }

    cb( null, logSession )
  })
}


LogSession.prototype.pushLogMessage = function( logMessage ) {
  if( !(logMessage instanceof LogMessage) ) {
    throw new TypeError( 'logMessage not instance of LogMessage' )
  }

  this.logMessages.push( logMessage )
  redisPublisher.publish( this.getPubSubNamespace(), JSON.stringify(logMessage) )
}


LogSession.prototype.getPubSubNamespace = function() {
  return this.appName + ":" + this.userName
}

LogSession.prototype.writeBuffer = function() {
  var logMessage
  for( i = 0; i < this.logMessages.length; i++ ) {
    logMessage = this.logMessages[ i ]
    redisPublisher.publish( this.getPubSubNamespace(), JSON.stringify(logMessage) )
  }
}

LogSession.prototype.createDuplexStream = function() {
  this.openLogStream = new LogStream( this.getPubSubNamespace() )
  this.writeBuffer()
  return this.openLogStream
}


module.exports = LogSession