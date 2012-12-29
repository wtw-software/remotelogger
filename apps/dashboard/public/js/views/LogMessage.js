
var LogMessageView = Backbone.View.extend({

  tagName: 'li',

  attributes: {
    class: 'logmessage'
  },

  template: _.template( $("#logmessage-view-template").html() ),

  render: function() {
    var messages, objectHTML, i

    this.$el.addClass( this.model.get('type') )

    messages = this.model.get( 'messages' )
    objectHTML = ""

    messages.forEach(function( message, index ) {
      objectHTML += this.createObjectHTML( message.value )
      if( index + 1 < messages.length )
        objectHTML += ", "
    }, this)
    
    this.$el.html( objectHTML )
  },

  createObjectHTML: function( object ) {
    var html, type, key, val, i

    type = typeof object
    html = "<span class='value " + type + "'>"

    if( type === "object" ) {

      i = 0
      
      html += "{ "
      for( key in object ) {
        i++
        val = object[ key ]
        html += "<span class='key'>" +key + "</span> : "
        html += this.createObjectHTML( val )
        if( i < Object.keys(object).length )
          html += ", "
      }
      html += " }"

    } else if(type == "string" ) {
      
      html += '"' + object + '"'

    } else {
      
      html += object

    }

    html += "</span>"
    return html
  }

})

module.exports = LogMessageView