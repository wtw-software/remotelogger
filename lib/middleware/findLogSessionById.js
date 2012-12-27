var LogSession = require( '../../lib/classes/LogSession' )


module.exports = function( req, res, next ) {
  LogSession.findById(req.params.id, function( error, logSession ) {
    if( error )
      return res.generateError( 500, error )

    if( !logSession )
      return res.generateError( 400, new Error("could not find LogSession with id "+ req.params.id +"") )

    req.logSession = logSession

    next()

  })
}