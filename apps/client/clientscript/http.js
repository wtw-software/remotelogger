var XMLHTTPFactory = require( "./XMLHTTPFactory" )



function HTTP() {
  this.XMLHTTPFactory = new XMLHTTPFactory
}


HTTP.prototype.serializeObjectToForm = function( obj, prefix ) {
  var str, key, v

  str = []

  for( key in obj ) {
    if( !Object.hasOwnProperty.call(obj, key) )
      break
    v = obj[ key ]
    if( prefix )
      k = prefix + "[" + key + "]"
    else
      k = key
    if( typeof v === "object" )
      str.push( this.serializeObjectToForm(v, k) )
    else
      str.push( encodeURIComponent(k) + "=" + encodeURIComponent(v) )
  }
  
  return str.join( '&' )
}


HTTP.prototype.post = function( opts ) {
  var request
  request = this.XMLHTTPFactory.create()
  request.open( 'POST', opts.url )
  request.setRequestHeader( 'Content-type','application/x-www-form-urlencoded' )
  request.onreadystatechange = function() {
    if( request.readyState !== 4 )
      return null
    if( request.status !== 200 && request.status !== 304 )
      opts.error( "server error" )
    else
      opts.success( request )
  }
    
  if( request.readyState === 4 )
    return null

  try {
    POSTData = this.serializeObjectToForm( opts.data )
    request.send( POSTData )
  } catch( error ) {
    opts.error( "could not serialize request data" )
  }
}

HTTP.prototype.put = function( opts ) {
  var request
  request = this.XMLHTTPFactory.create()
  request.open( 'PUT', opts.url )
  request.setRequestHeader( 'Content-type','application/x-www-form-urlencoded' )
  request.onreadystatechange = function() {
    if( request.readyState !== 4 )
      return null
    if( request.status !== 200 && request.status !== 304 )
      opts.error( "server error" )
    else
      opts.success( request )
  }
    
  if( request.readyState === 4 )
    return null

  try {
    POSTData = this.serializeObjectToForm( opts.data )
    request.send( POSTData )
  } catch( error ) {
    opts.error( "could not serialize request data" )
  }
}



module.exports = new HTTP