var LogSession   = require( '../models/LogSession' ),
    LogMessage   = require( '../models/LogMessage' )


var LogSessionCollection = Backbone.Collection.extend({

  startSync: function() {
    this.eventSource = new EventSource( '/logsession/syncstream.sse' )
    this.eventSource.addEventListener( 'addLogSession', this.addLogSessionHandler.bind(this) )
    this.eventSource.addEventListener( 'pushLogMessage', this.pushLogMessageHandler.bind(this) )
    this.eventSource.addEventListener( 'removeLogSession', this.removeLogSessionHandler.bind(this) )
    this.eventSource.addEventListener( 'consoleLoad', this.consoleLoadHandler.bind(this) )
  },

  addLogSessionHandler: function( event ) {
    var eventData, logSession

    try {
      eventData = JSON.parse( event.data )
    } catch( error ) {
      console.log( error )
    }

    logSession = new LogSession( eventData.data, eventData.logSessionId )

    if( logSession instanceof Error ) {
      return console.log( error )
    }

    this.add( logSession )

  },

  pushLogMessageHandler: function( event ) {
    var eventData, logSession, logMessage

    try {
      eventData = JSON.parse( event.data )
    } catch( error ) {
      console.log( error )
    }

    logSession = this.get( eventData.logSessionId )

    logMessage = new LogMessage( eventData.data )
    logSession.addLogMessage( logMessage )

  },

  removeLogSessionHandler: function( event ) {
    var data
    try {
      data = JSON.parse( event.data )
    } catch( error ) {
      console.log( error )
    }
  },

  consoleLoadHandler: function( event ) {
    var data
    try {
      data = JSON.parse( event.data )
    } catch( error ) {
      console.log( error )
    }
  }

})

module.exports = LogSessionCollection