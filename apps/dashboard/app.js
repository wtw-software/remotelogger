var express               = require( 'express' ),
    namespaces            = require( 'express-namespace' ),
    http                  = require( 'http' ),
    net                   = require( 'net' ),
    repl                  = require( 'repl' ),
    path                  = require( 'path' ),
    browserify            = require( 'browserify' ),
    routes                = require( './routes' ),
    redisStoreSingelton   = require( '../../lib/redisStoreSingelton' ),
    findLogSessionById    = require( '../../lib/middleware/findLogSessionById' ),
    errorGenerator        = require( '../../lib/middleware/errorGenerator' ),
    addEventStreamHeaders = require( '../../lib/middleware/addEventStreamHeaders' )
    


var app, reddisStore

app = express()
redisStore = redisStoreSingelton.getInstance()



/*
 * Config
*/

app.configure(function() {
  app.set( 'port', process.env.PORT || 3001 )
  app.use( express.favicon() )
  app.use( express.logger('dev') )
  app.set( 'views', __dirname + '/views' )
  app.set( 'view engine', 'jade' )
  app.use( express.bodyParser() )
  app.use( express.methodOverride() )
  app.use( express.cookieParser('remotelogger dashboard secret shit boii') )
  app.use( express.session({ secret: 'remotelogger dashboard secret shit boii', store: redisStore }) )
  app.use( errorGenerator )
  app.use( app.router )
  app.use( express.static(path.join(__dirname, 'public')) )
  app.use( browserify({ 
    entry: __dirname + '/public/js/main.js',
    mount: "/main.js",
    watch: true,
    debug: true
  }))
})

app.configure('development', function() {
  app.use(express.errorHandler())
})



/*
 * Routes
*/

app.get( '/', routes.index )

app.namespace('/logsession', function() {

  app.get( '/', routes.getAllLogSessions )

  app.get( '/syncstream.:format?', addEventStreamHeaders, routes.getLogSessionSyncStream )
  
  app.get( '/:id', findLogSessionById, routes.getLogSession )

  app.get( '/:id/stream.:format?', findLogSessionById, addEventStreamHeaders, routes.getStream )

})


module.exports = app
