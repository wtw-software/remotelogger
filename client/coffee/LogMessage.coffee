

class LogMessage
  timeStamp: null
  type: null
  messages: null
  remotelyLogged: false

  constructor: (type, messages) ->
    @timeStamp = Date().toString()
    @type = type or "message"
    @messages = messages or []



module.exports = LogMessage