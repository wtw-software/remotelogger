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
    args = argsToArray arguments
    logMessage = new LogMessage "log", args
    @logMessages.push logMessage
    @invokeSuperMethod "log", args
    if @remoteLogging.on
      @postLogMessage logMessage

  info: ->
    args = argsToArray arguments
    logMessage = new LogMessage "info", args
    @logMessages.push logMessage
    @invokeSuperMethod "info", args
    if @remoteLogging.on
      @postLogMessage logMessage

  warn: ->
    args = argsToArray arguments
    logMessage = new LogMessage "warn", args
    @logMessages.push logMessage
    @invokeSuperMethod "warn", args
    if @remoteLogging.on
      @postLogMessage logMessage

  error: ->
    args = argsToArray arguments
    logMessage = new LogMessage "error", args
    @logMessages.push logMessage
    @invokeSuperMethod "error", args
    if @remoteLogging.on
      @postLogMessage logMessage

  invokeSuperMethod: (type, logMessages) ->
    if @nativeConsole and @nativeConsole[type]
      @nativeConsole[type].apply @nativeConsole, logMessages

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
    try
      logMessage = JSON.stringify logMessage
    catch error
      cb error
      return null
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
