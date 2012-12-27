
module.exports = function( req, res, next ) {
  res.set('content-Type',   'text/event-stream')
  res.set('cache-Control',  'no-cache')
  res.set('connection',     'keep-alive')

  next()
}