var LogMessageView = require( './LogMessage' )


var ConsoleView = Backbone.View.extend({

  logMessageViews: [],
  logMessageViewLimit: 100,

  initialize: function() {
    this.listenTo( app.logSessionCollection, 'logSession:selected', this.logSessionSelectedHandler.bind(this) )
  },

  logSessionSelectedHandler: function( logSession ) {
    this.clearActiveLogSession()
    this.setActiveLogSession( logSession )
  },

  clearActiveLogSession: function() {
    this.logMessageViews.forEach(function( logMessageView ) {
      logMessageView.remove()
    })
    if( this.activeLogSession ) {
      this.stopListening( this.activeLogSession.get( 'logMessages' ) )
      delete this.activeLogSession
    }
  },

  setActiveLogSession: function( logSession ) {
    var logMessages, i, len, logMessage
    
    this.activeLogSession = logSession

    logMessages = this.activeLogSession.get( 'logMessages' ).models

    if( logMessages.length > this.logMessageViewLimit )
      logMessages = logMessages.slice( logMessages.length - this.logMessageViewLimit )

    len = logMessages.length

    for( i = 0; i < len; i++ ) {
      logMessage = logMessages[ i ]
      this.addLogMessageView( logMessage )
    }

    this.listenTo( this.activeLogSession.get( 'logMessages' ), 'add', this.addLogMessageView.bind(this) )
  },

  addLogMessageView: function( logMessageModel ) {
    var logMessageView = new LogMessageView({ model: logMessageModel })

    logMessageView.render()

    this.removeLogMessageViewsOverLimit()

    this.$el.find( '#log ul.messages' ).append( logMessageView.$el )
    this.logMessageViews.push( logMessageView )

    this.scrollToBottom()
  },

  removeLogMessageViewsOverLimit: function() {
    var nr, logMessageViews

    if( this.logMessageViews.length < this.logMessageViewLimit )
      return null

    nr = this.logMessageViews.length - this.logMessageViewLimit
    logMessageViews = this.logMessageViews.splice( 0, nr )

    logMessageViews.forEach(function( logMessageView ) {
      logMessageView.remove()
    })
  },

  scrollToBottom: function() {
    var logHeight = this.$el.find( '#log' ).outerHeight()
    this.$el.scrollTop( logHeight )
  }

})

module.exports = ConsoleView