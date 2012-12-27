var LogSessionListView = require( './LogSessionList' )


var SideBarView = Backbone.View.extend({

  initialize: function() {
    this.logSessionListView = new LogSessionListView({ el: '#logsessions' })
  }

})

module.exports = SideBarView