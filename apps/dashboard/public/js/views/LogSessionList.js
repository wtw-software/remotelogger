var LogSessionCollection  = require( '../collections/LogSession' ),
    LogSessionsItemView   = require( './LogSessionItem' )


var LogSessionListView = Backbone.View.extend({

  initialize: function() {
    this.logSessionCollection = new LogSessionCollection()
    this.logSessionCollection.startSync()
  }

})

module.exports = LogSessionListView