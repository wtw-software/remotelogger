
var LogSessionCollection = Backbone.Collection.extend({

  startSync: function() {
    this.eventSource = new EventSource( '/logsession/syncstream.sse' )
    this.eventSource.addEventListener( 'addLogSession', this.addLogSessionHandler.bind(this) )
    this.eventSource.addEventListener( 'pushLogMessage', this.pushLogMessageHandler.bind(this) )
    this.eventSource.addEventListener( 'removeLogSession', this.removeLogSessionHandler.bind(this) )
    this.eventSource.addEventListener( 'consoleLoad', this.consoleLoadHandler.bind(this) )
  },

  addLogSessionHandler: function( event ) {
    console.log( "addLogSessionHandler" )
  },

  pushLogMessageHandler: function( event ) {
    console.log( "pushLogMessageHandler" )
  },

  removeLogSessionHandler: function( event ) {
    console.log( "removeLogSessionHandler" )
  },

  consoleLoadHandler: function( event ) {
    console.log( "consoleLoadHandler" )
  }

})

module.exports = LogSessionCollection