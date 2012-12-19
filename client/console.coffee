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
      @logMessageToRemote logMessage

  info: ->
    logMessage = new LogMessage "info", argsToArray arguments
    @logMessages.push logMessage
    @invokeSuperMethod logMessage
    if @remoteLogging.on
      @logMessageToRemote logMessage

  warn: ->
    logMessage = new LogMessage "warn", argsToArray arguments
    @logMessages.push logMessage
    @invokeSuperMethod logMessage
    if @remoteLogging.on
      @logMessageToRemote logMessage

  error: ->
    logMessage = new LogMessage "error", argsToArray arguments
    @logMessages.push logMessage
    @invokeSuperMethod logMessage
    if @remoteLogging.on
      @logMessageToRemote logMessage

  invokeSuperMethod: (logMessage) ->
    logType = logMessage.type
    messages = logMessage.messages
    if @nativeConsole and @nativeConsole[logType]
      @nativeConsole[logType].apply @nativeConsole, messages

  turnOnRemoteLogging: ->
    @remoteLogging.on = true

  turnOffRemoteLogging: ->
    @remoteLogging.on = false

  logMessageToRemote: (logMessage) ->
    http.post
      url: "#{@remoteLogging.url}/log"
      data: 
        logMessage: logMessage
        logSession: @remoteLogging.session
      error: (error) =>
        @nativeConsole.log error
      success: =>
        logMessage.remotelyLogged = true
        @nativeConsole.log "success"



module.exports = Console
