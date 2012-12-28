
var LogSessionItemView = Backbone.View.extend({

  tagName: 'li',

  attributes: {
    class: 'logsession-item-view-template'
  },

  template: _.template( $('#logsession-item-view-template').html() ),

  initialize: function() {

  },

  render: function() {
    var html
    html = this.template( this.model.toJSON() )
    this.$el.html( html )
  }

})

module.exports = LogSessionItemView