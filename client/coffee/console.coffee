LogMessage    = require "./LogMessage"
argsToArray   = require "./argsToArray"
http          = require "./http"


class Console
  logMessages: []
  remoteLogging:
    session:
      appName: "remote-logger"
      userName: "dev"
      sid: null
    on: false
    url: "http://localhost:3000"
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
    messages = logMessage.messages
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

  postLogMessage: (logMessage, cb) ->
    http.post
      url: "#{@remoteLogging.url}/logmessage"
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
