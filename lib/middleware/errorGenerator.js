

module.exports = function( req, res, next ) {

  function generateError( statusCode, error ) {
    res.status( statusCode || 500 )
    res.send({
      error: {
        code: error.code,
        message: error.message
      }
    })
  }

  res.generateError = generateError
  next()
}