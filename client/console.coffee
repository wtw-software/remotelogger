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

  resetLogSession: ->
    http.put
      url: "#{@remoteLogging.url}/log/reset"
      data: 
        logSession: @remoteLogging.session
      error: (error) =>
        @nativeConsole.log error
      success: =>
        @nativeConsole.log "remote log session reset"

  postLogMessage: (logMessage) ->
    http.post
      url: "#{@remoteLogging.url}/log"
      data: 
        logMessage: logMessage
        logSession: @remoteLogging.session
      error: (error) =>
        @nativeConsole.log error
      success: =>
        logMessage.remotelyLogged = true



module.exports = Console
