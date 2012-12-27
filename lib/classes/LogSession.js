var redis                 = require( 'redis' ),
    async                 = require( 'async' ),
    LogEventStream        = require( './LogEventStream' ),
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
  this.eventCache = sessionData.eventCache || [ ]

}


LogSession.parseObjectId = function( logSessionData ) {
  var id

  if( !logSessionData.appName )
    throw new TypeError( "no appName on object" )
  if( !logSessionData.userName )
    throw new TypeError( "no userName on object" )

  id = "logSession:" +
       logSessionData.appName +
       logSessionData.userName +
       ( logSessionData.sessionId ? logSessionData.sessionId : '' )

  return id
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

  redisStore.keys("*", function( err, ids ) { console.log("IDS", ids) })

  redisStore.get(id, function( err, sessionData ) {
    if( err )
      cb( err )
    
    try {

      sessionData = JSON.parse( sessionData )
      logSessionData = sessionData.logSessionData
      logSession = new LogSession( logSessionData )

      if( logSession instanceof Error )
        return cb( logSession )

    } catch( error ) {
      return cb( error )
    }

    cb( null, logSession )
  })
}


LogSession.findByData = function( logSessionData, cb ) {
  var id, logSession

  try {

    id = LogSession.parseObjectId( logSessionData )
    
  } catch( error ) {
    return cb( error )
  }

  redisStore.get(id, function( error, logSessionJSON ) {
    if( error ) {
      return cb( error )
    }

    try {

      logSessionData = JSON.parse( logSessionJSON )
      logSession = new LogSession( logSessionData )

      if( logSession instanceof Error ) {
        return cb( error )
      }

      cb( null, logSession)

    } catch( error ) {
      cb( error )
    }
  })
}


LogSession.prototype.save = function( cb ) {
  var id, logSessionJSON

  try {

    id = LogSession.parseObjectId( this )

  } catch( error ) {
    return cb( error )
  }

  try {

    logSessionJSON = JSON.stringify( this )

  } catch( error ) {
    return cb( error )
  }

  redisStore.set(id, logSessionJSON, function( error ) {
    if( error )
      return cb( error )

    cb( null )
  })
}


LogSession.prototype.publishEvent = function( eventName, data ) {
  var event, dataString
  try {

    event = this.getPubSubNamespace() + "::" + eventName
    dataString = JSON.stringify( data )

    redisPublisher.publish( event, dataString )
    this.eventCache.push({ event: event, dataString: dataString })

  } catch( error ) {
    redisPublisher.publish( this.getPubSubNamespace() + "::error", JSON.stringify({
      message: "LogSession.prototype.publishEvent, data not valid JSON"
    }))
  }
}


LogSession.prototype.emitEventCache = function() {
  var i, eventObj
  for( i = 0; i < this.eventCache.length; i++ ) {
    eventObj = this.eventCache[ i ]
    redisPublisher.publish( eventObj.event, eventObj.dataString )
  }
}


LogSession.prototype.pushLogMessage = function( logMessage ) {
  var message

  if( !(logMessage instanceof LogMessage) ) {
    throw new TypeError( 'logMessage not instance of LogMessage' )
  }

  this.logMessages.push( logMessage )
  this.publishEvent( "pushLogMessage", logMessage )
}


LogSession.prototype.getPubSubNamespace = function() {
  return this.appName + "." + this.userName
}

LogSession.prototype.publishLogMessages = function() {
  var logMessage
  for( i = 0; i < this.logMessages.length; i++ ) {
    logMessage = this.logMessages[ i ]
    this.publishEvent( "pushLogMessage", logMessage )
  }
}

LogSession.prototype.createLogEventStream = function() {
  return new LogEventStream( this.getPubSubNamespace() )
}


module.exports = LogSession