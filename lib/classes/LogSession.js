var util                  = require( 'util' ),
    Stream                = require( 'stream' ).Stream,
    EventEmitter          = require( 'events' ).EventEmitter,
    async                 = require( 'async' ),
    redisStoreSingelton   = require( '../redisStoreSingelton' ),
    LogMessage            = require( './LogMessage' )


var redisStore, eventEmitter



redisStore = redisStoreSingelton.getInstance()
eventEmitter = new EventEmitter()



function LogSession( sessionData ) {
  if( !sessionData )
    return new Error( "no sessiondata passed to LogSession constructor" )
  if( !sessionData.appName ) 
    return new Error( "no appname on sessionData" )
  if( !sessionData.userName ) 
    return new Error( "no username on sessionData" )

  Stream.call( this )

  this.writable = true
  this.readable = true

  this.appName = sessionData.appName
  this.userName = sessionData.userName
  this.logMessages = sessionData.logMessages || [ ]

  eventEmitter.on( this.getPubNamespace(), this.onWriteHandler.bind(this) )

}


util.inherits( LogSession, Stream )


LogSession.getAll = function( cb ) {
  var logSessions

  logSessions = []

  redisStore.client.keys("*", function( err, ids ) {
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

  redisStore.client.get(id, function( err, sessionData ) {
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
  this.write( logMessage )
}


LogSession.prototype.onWriteHandler = function( logMessage ) {
  this.emit( 'data', logMessage )
}


LogSession.prototype.getPubNamespace = function() {
  return this.appName + ":" + this.userName
}


LogSession.prototype.write = function( logMessage ) {
  eventEmitter.emit( this.getPubNamespace(), JSON.stringify(logMessage) )
}


LogSession.prototype.pipe = function( writableStream ) {
  var i, logMessage
  for( i = 0; i < this.logMessages.length; i++ ) {
    logMessage = this.logMessages[ i ]
    writableStream.write( JSON.stringify(logMessage) )
  }
  Stream.prototype.pipe.apply( this, arguments )
}


LogSession.prototype.end = function( logMessage ) {
  if( logMessage )
    this.write( logMessage )
  this.emit( "end" )
}

module.exports = LogSession