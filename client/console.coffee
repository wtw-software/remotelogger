LogMessage = require "./LogMessage"
argsToArray = require "./argsToArray"
http = require "./http"


class Console
  logMessages: []
  remoteLogging:
    session:
      appname: null
      username: null
      sid: null
    on: false
    url: "http://localhost:3000"
  parentConsole: window.console

  log: ->
    logMessage = new LogMessage "log", argsToArray arguments
    @logMessages.push logMessage
    if @remoteLogging.on
      @logMessageToRemote logMessage

  info: ->
    logMessage = new LogMessage "info", argsToArray arguments
    @logMessages.push logMessage
    if @remoteLogging.on
      @logMessageToRemote logMessage

  warn: ->
    logMessage = new LogMessage "warn", argsToArray arguments
    @logMessages.push logMessage
    if @remoteLogging.on
      @logMessageToRemote logMessage

  error: ->
    logMessage = new LogMessage "error", argsToArray arguments
    @logMessages.push logMessage
    if @remoteLogging.on
      @logMessageToRemote logMessage

  invokeSuperMethod: (logMessage) ->
    logType = logMessage.type
    messages = logMessage.messages
    if parentConsole and parentConsole[logType]
      parentConsole[logType].apply parentConsole, messages

  turnOnRemoteLogging: ->
    http.post
      url: "#{@remoteLogging.url}/log/startsession"
      data: @remoteLogging.session
      error: =>
        @parentConsole.error "could not start logging"
      success: =>
        @remoteLogging.on = true
        for logMessage in @logMessages
          @logMessageToRemote logMessage

  turnOffRemoteLogging: ->
    @remoteLogging.on = false
    http.post
      url: "#{@remoteLogging.url}/log/stopsession"
      data: @remoteLogging.session
      error: =>
        @parentConsole.error "could not stop logging to remote"
      success: =>
        @parentConsole.log "stopped logging to remote"

  logMessageToRemote: (logMessage) ->
    http.post
      url: "#{@remoteLogging.url}/log"
      data: 
        logmessage: logMessage
        logsession: @remoteLogging.session
      error: (error) =>
        @parentConsole.log error
      success: =>
        logMessage.remotelyLogged = true
        @parentConsole.log "success"




module.exports = Console
