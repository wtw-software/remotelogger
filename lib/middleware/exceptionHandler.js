
module.exports = function( req, res, next ) {
  try {

    next()

  } catch( exception ) {
    console.log("LOOOOL")
    res.errorGenerator( 500, exception )
  }
}