
function LogMessage( type, messages ) {
  this.timeStamp = Date().toString()
  this.type = type || "message"
  this.messages = this.parseMessages( messages )
  this.remotelyLogged = false
}


LogMessage.prototype.parseMessages = function( messages ) {
  var out, i, message, type, value

  out = []

  for( i = 0; i < messages.length; i++ ) {

    message = messages[ length ]
    type = typeof message

    if( type == "function" ) {
      value = message.toString()
    }
      
    else if( typeof $ !== "undefined" && message instanceof $ ) {
      type = "jQuery"
      value = {
        html: message.html()
      }
    } else {
      value = message
    }
      
    out.push({
      type: type,
      value: value
    })
  }

  return out
}
  



module.exports = LogMessage