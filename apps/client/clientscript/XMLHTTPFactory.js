
function XMLHTTPFactory() {
  this.factories = [
    function(){ return new XMLHttpRequest()  },
    function(){ return new ActiveXObject( "Msxml2.XMLHTTP" )  },
    function(){ return new ActiveXObject( "Msxml3.XMLHTTP" )  },
    function(){ return new ActiveXObject( "Microsoft.XMLHTTP" )  }
  ]
}


XMLHTTPFactory.prototype.create = function() {
  var requestObject, i, Factory

  requestObject = null

  for( i = 0; i < this.factories.length; i ++ ) {
    Factory = this.factories[ i ]
    try {
      requestObject = new Factory()
      break
    } catch( error ) {
      continue
    }
  }
    
  return requestObject
}
   


module.exports = XMLHTTPFactory