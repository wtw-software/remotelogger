var util                  = require( 'util' ),
    Stream                = require( 'stream' ).Stream



function SSEStream() {
  Stream.call( this )

  this.currentId = 1

  this.writable = true
  this.readable = true

}


util.inherits( SSEStream, Stream )


SSEStream.prototype.createEventMessage = function( data ) {
  var splitData, logSessionId, eventName, data, string
  
  splitData = data.split( "|::|" )

  eventName = splitData[ 0 ] || ""
  data      = splitData[ 1 ] || ""

  string = ""
  string +=  "event: " + eventName + "\n"
  string +=  "id: " + this.currentId + "\n"
  string +=  "data: " + data + "\n\n"

  this.currentId++

  return string
}


SSEStream.prototype.write = function( data ) {
  var event
  event = this.createEventMessage( data )
  this.emit( 'data', event )
}

SSEStream.prototype.end = function( data ) {
  if( data )
    this.write( data )
  this.emit( 'end' )
}


module.exports = SSEStream