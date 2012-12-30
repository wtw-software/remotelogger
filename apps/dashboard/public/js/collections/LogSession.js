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


  stopSync: function() {
    if( this.eventSource ) {

      this.eventSource.removeEventListener()
      this.eventSource.close()
      delete this.eventSource

    }
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

    if( !logSession )
      return null

    logMessage = new LogMessage( eventData.data )

    if( logMessage instanceof Error ) {
      return console.log( error )
    }

    logSession.addLogMessage( logMessage )

  },

  removeLogSessionHandler: function( event ) {
    var eventData, logSession, logMessage

    try {
      eventData = JSON.parse( event.data )
    } catch( error ) {
      console.log( error )
    }

    logSession = this.get( eventData.logSessionId )

    if( !logSession )
      return null

    this.remove( logSession )
  },

  consoleLoadHandler: function( event ) {
    var eventData, logSession, logMessage

    try {
      eventData = JSON.parse( event.data )
    } catch( error ) {
      console.log( error )
    }

    logSession = this.get( eventData.logSessionId )

    if( !logSession )
      return null
    
    logSession.trigger( 'consoleLoad' )
  }

})

module.exports = LogSessionCollection