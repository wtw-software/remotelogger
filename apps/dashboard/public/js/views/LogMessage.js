
var LogMessageView = Backbone.View.extend({

  tagName: 'li',

  attributes: {
    class: 'logmessage'
  },

  template: _.template( $("#logmessage-view-template").html() ),

  render: function() {
    this.$el.addClass( this.model.get('type') )
    this.$el.html( this.template(this.model.toJSON()) )
  }

})

module.exports = LogMessageView