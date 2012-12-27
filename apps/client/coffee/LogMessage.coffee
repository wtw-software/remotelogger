

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
      type = typeof message
      value = message
      out.push
        type: type
        value: value
    out



module.exports = LogMessage