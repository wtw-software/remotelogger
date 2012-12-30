
var LogMessageView = Backbone.View.extend({

  tagName: 'li',

  attributes: {
    class: 'logmessage'
  },

  render: function() {
    var messages, objectHTML, fnPattern

    this.$el.addClass( this.model.get('type') )

    messages = this.model.get( 'messages' )
    objectHTML = ""

    messages.forEach(function( message, index ) {
      if( message.type === 'function' ) {
        objectHTML += this.createFunctionHTML( message.value )
      } else {
        objectHTML += this.createObjectHTML( message.value )
      }
        
      if( index + 1 < messages.length )
        objectHTML += ", "
    }, this)
    
    this.$el.html( objectHTML )
  },

  createFunctionHTML: function( fnString, cb ) {
    return "<span class='value function'>" + fnString + "</span>"
  },

  createObjectHTML: function( object ) {
    var html, type, key, val, i

    type = typeof object
    html = "<span class='value " + type + "'>"
      
    if( type === "object" && !(object instanceof Array) && object !== null ) {

      i = 0

      html += "{ "
      html += "<span class='object-contents'>"
      for( key in object ) {
        i++
        val = object[ key ]
        html += "<span class='key'>" +key + "</span> : "
        html += this.createObjectHTML( val )
        if( i < Object.keys(object).length )
          html += ", "
      }
      html += "</span>"
      html += " }"

    } else if( object instanceof Array ) {

      i = 0

      html += "[ "
      for( i = 0; i < object.length; i++ ) {
        val = object[ i ]
        html += this.createObjectHTML( val )
        if( i + 1 < object.length )
          html += ", "
      }
      html += " ]"

    } else if( type == "string" ) {
      
      html += '"' + object + '"'

    } else {

      html += object

    }

    html += "</span>"
    return html
  }

})

module.exports = LogMessageView