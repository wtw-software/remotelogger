var util                  = require( 'util' ),
    Stream                = require( 'stream' ).Stream,
    redis                 = require( 'redis' ),
    LogMessage            = require( './LogMessage' )



function LogStream( pubSubNamespace ) {
  if( !pubSubNamespace ) 
    throw new Error( 'LogStream instantiated whitout a given pubSubNamespace' )

  Stream.call(this)

  this.readable = true
  this.writable = true
  this.pubSubNamespace = pubSubNamespace
  this.redisPublisher = redis.createClient()
  this.redisSubscriber = redis.createClient()

  this.redisSubscriber.on( 'message', this.onMessageHandler.bind(this) )
  this.redisSubscriber.subscribe( this.getPubSubNamespace() )
}


util.inherits( LogStream, Stream )


LogStream.prototype.onMessageHandler = function( channel, logMessage ) {
  this.emit( 'data', logMessage )
}


LogStream.prototype.getPubSubNamespace = function() {
  return this.pubSubNamespace
}


LogStream.prototype.write = function( logMessage ) {
  this.redisPublisher.publish( this.getPubSubNamespace(), JSON.stringify(logMessage) )
}


LogStream.prototype.end = function( logMessage ) {
  if( logMessage )
    this.write( logMessage )
  this.redisPublisher.quit()
  this.redisSubscriber.quit()
  this.emit( 'end' )
}

LogStream.prototype.destroy = function() {
  this.redisPublisher.quit()
  this.redisSubscriber.quit()
  Stream.prototype.destroy.call( this )
}


module.exports = LogStream