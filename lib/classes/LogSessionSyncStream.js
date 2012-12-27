var util                  = require( 'util' ),
    Stream                = require( 'stream' ).Stream,
    redis                 = require( 'redis' )


var redisSubscriber = redis.createClient()


function LogSessionSyncStream() {
  Stream.call( this )
  this.readable = true
  this.writable = true

  this.redisSubscriber = redis.createClient()

  this.redisSubscriber.on('psubscribe', this.emit.bind(this,'ready') )

  this.redisSubscriber.on( 'pmessage', this.onEventHandler.bind(this) )
  this.redisSubscriber.psubscribe( "logSession::*" )
}


util.inherits( LogSessionSyncStream, Stream )


LogSessionSyncStream.prototype.onEventHandler = function( pattern, channel, data ) {
  var split, eventName, message
  split = channel.split("::")
  eventName = split[ split.length - 1 ]
  if( this.__filterLogMessages && eventName === "pushLogMessage" )
    data = 1
  message = eventName + "|::|" + data
  this.emit( 'data', message )
}


LogSessionSyncStream.prototype.end = function() {
  this.redisSubscriber.quit()
  this.emit( 'end' )
}


LogSessionSyncStream.prototype.destroy = function() {
  this.redisSubscriber.quit()
  Stream.prototype.destroy.call( this )
}




module.exports = LogSessionSyncStream