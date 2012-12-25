
class XMLHTTPFactory
  factories: [
    -> new XMLHttpRequest 
    -> new ActiveXObject "Msxml2.XMLHTTP" 
    -> new ActiveXObject "Msxml3.XMLHTTP" 
    -> new ActiveXObject "Microsoft.XMLHTTP" 
  ]

  create: ->
    requestObject = null
    for Factory in @factories
      try
        requestObject = new Factory
      catch error
        continue
      break
    requestObject


module.exports = XMLHTTPFactory