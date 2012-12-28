

class LogMessage
  timeStamp: null
  type: null
  messages: null
  remotelyLogged: false

  constructor: (type, messages) ->
    @timeStamp = Date().toString()
    @type = type or "message"
    @messages = @parseMessages messages

  parseMessages: (messages) ->
    out = []
    for message in messages
      if typeof $ isnt "undefined" && message instanceof $
        type = "jQuery"
        value =
          html: message.html()
      else
        type = typeof message
        value = message
      out.push
        type: type
        value: value
    out



module.exports = LogMessage