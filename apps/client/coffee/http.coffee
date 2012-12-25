
XMLHTTPFactory = require "./XMLHTTPFactory"
        

class HTTP
  XMLHTTPFactory: new XMLHTTPFactory

  serializeObjectToForm: (obj, prefix) ->
    str = []
    for key, v of obj
      if prefix 
        k = prefix + "[" + key + "]"
      else
        k = key
      if typeof v is "object" 
        str.push @serializeObjectToForm(v, k)
      else
        str.push encodeURIComponent(k) + "=" + encodeURIComponent(v)
    str.join '&'

  post: (opts) ->
    request = @XMLHTTPFactory.create()
    request.open 'POST', opts.url
    request.setRequestHeader 'Content-type','application/x-www-form-urlencoded'
    request.onreadystatechange = =>
      if request.readyState isnt 4 then return null
      if request.status isnt 200 && request.status isnt 304
        opts.error "server error"
      else
        opts.success request
    if request.readyState is 4 then return null
    try
      POSTData = @serializeObjectToForm opts.data
      request.send POSTData
    catch error
      opts.error "could not serialize request data"

  put: (opts) ->
    request = @XMLHTTPFactory.create()
    request.open 'PUT', opts.url
    request.setRequestHeader 'Content-type','application/x-www-form-urlencoded'
    request.onreadystatechange = =>
      if request.readyState isnt 4 then return null
      if request.status isnt 200 && request.status isnt 304
        opts.error "server error"
      else
        opts.success request
    if request.readyState is 4 then return null
    try
      POSTData = @serializeObjectToForm opts.data
      request.send POSTData
    catch error
      opts.error "could not serialize request data"




module.exports = new HTTP