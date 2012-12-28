
var LogSessionModel = Backbone.Model.extend({

  idAttribute: 'logSessionId',

  initialize: function( logSessionData, logSessionId ) {
    this.set( 'logSessionId', logSessionId )
    this.set( 'logMessages', new Backbone.Collection() )
  },

  addLogMessage: function( logMessage ) {
    this.get( 'logMessages' ).add( logMessage )
  },

  select: function() {
    this.trigger( "logSession:selected", this )
  }

})


module.exports = LogSessionModel