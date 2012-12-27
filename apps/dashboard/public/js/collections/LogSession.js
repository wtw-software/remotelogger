
var LogSessionCollection = Backbone.Collection.extend({

  startSync: function() {
    this.eventSource = new EventSource( '/logsession/syncstream.sse' )
    this.eventSource.addEventListener( 'addLogSession', this.addLogSessionHandler.bind(this) )
    this.eventSource.addEventListener( 'pushLogMessage', this.pushLogMessageHandler.bind(this) )
    this.eventSource.addEventListener( 'removeLogSession', this.removeLogSessionHandler.bind(this) )
  }

  addLogSessionHandler: function( event ) {

  },

  pushLogMessageHandler: function( event ) {

  },

  removeLogSessionHandler: function( event ) {

  }

})

module.exports = LogSessionCollection