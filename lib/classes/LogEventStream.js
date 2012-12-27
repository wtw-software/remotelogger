var util                  = require( 'util' ),
    Stream                = require( 'stream' ).Stream,
    redis                 = require( 'redis' ),
    LogMessage            = require( './LogMessage' )



function LogEventStream( logSessionNamespace ) {
  if( !logSessionNamespace ) 
    throw new Error( 'LogEventStream instantiated whitout a given logSessionNamespace' )

  Stream.call(this)

  this.readable = true
  this.writable = true

  this.logSessionNamespace = logSessionNamespace

  this.redisPublisher = redis.createClient()
  this.redisSubscriber = redis.createClient()

  this.redisSubscriber.on('psubscribe', this.emit.bind(this,'ready') )

  this.redisSubscriber.on( 'pmessage', this.onEventHandler.bind(this) )
  this.redisSubscriber.psubscribe( "logSession::" + this.logSessionNamespace + "::*" )
}


util.inherits( LogEventStream, Stream )


LogEventStream.prototype.onEventHandler = function( pattern, channel, data ) {
  var split, eventName, message
  split = channel.split("::")
  eventName = split[ split.length - 1 ]
  if( this.__filterLogMessages && eventName === "pushLogMessage" )
    data = 1
  message = eventName + "|::|" + data
  this.emit( 'data', message )
}


LogEventStream.prototype.end = function() {
  this.redisPublisher.quit()
  this.redisSubscriber.quit()
  this.emit( 'end' )
}

LogEventStream.prototype.destroy = function() {
  this.redisPublisher.quit()
  this.redisSubscriber.quit()
  Stream.prototype.destroy.call( this )
}

LogEventStream.prototype.filterLogMessages = function() {
  this.__filterLogMessages = true
}


module.exports = LogEventStream