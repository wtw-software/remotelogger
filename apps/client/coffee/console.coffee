LogMessage    = require "./LogMessage"
argsToArray   = require "./argsToArray"
http          = require "./http"


class Console
  logMessages: []
  remoteLogging:
    session:
      appName: null
      userName: null
      sessionId: null
    on: false
    url: "http://jsloggerclient.wtw.no:3000"
  nativeConsole: window.console

  log: ->
    logMessage = new LogMessage "log", argsToArray arguments
    @logMessages.push logMessage
    @invokeSuperMethod logMessage
    if @remoteLogging.on
      @postLogMessage logMessage

  info: ->
    logMessage = new LogMessage "info", argsToArray arguments
    @logMessages.push logMessage
    @invokeSuperMethod logMessage
    if @remoteLogging.on
      @postLogMessage logMessage

  warn: ->
    logMessage = new LogMessage "warn", argsToArray arguments
    @logMessages.push logMessage
    @invokeSuperMethod logMessage
    if @remoteLogging.on
      @postLogMessage logMessage

  error: ->
    logMessage = new LogMessage "error", argsToArray arguments
    @logMessages.push logMessage
    @invokeSuperMethod logMessage
    if @remoteLogging.on
      @postLogMessage logMessage

  invokeSuperMethod: (logMessage) ->
    logType = logMessage.type
    messages = []
    for message in logMessage.messages
      messages.push message.value
    if @nativeConsole and @nativeConsole[logType]
      @nativeConsole[logType].apply @nativeConsole, messages

  turnOnRemoteLogging: ->
    @remoteLogging.on = true

  turnOffRemoteLogging: ->
    @remoteLogging.on = false

  startRemoteLogSession: ->
    do @turnOnRemoteLogging
    do @logUnloggedLogMessagesToRemote

  continueRemoteLogSession: ->
    do @turnOnRemoteLogging
    do @logUnloggedLogMessagesToRemote

  logUnloggedLogMessagesToRemote: ->
    for logMessage in @logMessages
      if not logMessage.remotelyLogged
        @postLogMessage logMessage

  emitLoad: () ->
    http.post
      url: "#{@remoteLogging.url}/log/consoleload"
      data:
        logSession: @remoteLogging.session
      error: (error) =>
      success: =>

  postLogMessage: (logMessage, cb) ->
    http.post
      url: "#{@remoteLogging.url}/log/message"
      data: 
        logMessage: logMessage
        logSession: @remoteLogging.session
      error: (error) =>
        @nativeConsole.log error
        if cb then cb error
      success: =>
        logMessage.remotelyLogged = true
        if cb then cb null



module.exports = Console
