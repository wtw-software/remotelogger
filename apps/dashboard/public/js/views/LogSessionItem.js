
var LogSessionItemView = Backbone.View.extend({

  tagName: 'li',
  attributes: {
    class: 'logsession-item-view-template'
  },
  template: _.template( $('#logsession-item-view-template').html() ),

  render: function() {
    var html
    console.log(this.model.toJSON())
    html = this.template( this.model.toJSON() )
    this.$el.html( html )
  }

})

module.exports = LogSessionItemView