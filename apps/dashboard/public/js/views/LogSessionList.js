
var LogSessionCollection  = require( '../collections/LogSession' ),
    LogSessionsItemView   = require( './LogSessionItem' )


var LogSessionListView = Backbone.View.extend({

  initialize: function() {

    this.logSessionItemViews = {}

    this.listenTo( app.logSessionCollection, 'add', this.onAddLogSessionHandler.bind(this) )
    this.listenTo( app.logSessionCollection, 'remove', this.onRemoveLogSessionHandler.bind(this) )
  },

  onAddLogSessionHandler: function( logSession ) {
    var logSessionItemView

    logSessionItemView = new LogSessionsItemView({ model: logSession })
    this.logSessionItemViews[ logSession.id ] = logSessionItemView

    logSessionItemView.render()

    this.$el.append( logSessionItemView.$el )
  },

  onRemoveLogSessionHandler: function( logSession ) {
    var logSessionItemView

    logSessionItemView = this.logSessionItemViews[ logSession.id ]

    if( logSessionItemView ) {
      logSessionItemView.remove()  
      delete this.logSessionItemViews[ logSession.id ]
    }
  }

})

module.exports = LogSessionListView