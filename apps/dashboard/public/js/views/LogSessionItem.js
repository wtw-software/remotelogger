
var LogSessionItemView = Backbone.View.extend({

  tagName: 'li',
  logMessageCount: 0,

  attributes: {
    class: 'logsession'
  },

  template: _.template( $('#logsession-item-view-template').html() ),

  initialize: function() {
    this.listenTo( this.model.get('logMessages'), 'add', this.updateLogMessageCount.bind(this) )
  },

  events: {
    'click': 'clickHandler'
  },

  render: function() {
    var html
    html = this.template( this.model.toJSON() )
    this.$el.html( html )
  },

  clickHandler: function() {
    this.model.select()
  },

  updateLogMessageCount: function() {
    this.logMessageCount++
    this.$el.find( '.logmessage-count' ).text( this.logMessageCount )
  }

})

module.exports = LogSessionItemView