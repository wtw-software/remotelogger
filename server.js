var express             = require( 'express' ),
    http                = require( 'http' ),
    RedisStore          = require( 'connect-redis' )( express )
    path                = require( 'path' ),
    browserify          = require( 'browserify' ),
    routes              = require( './lib/routes' ),
    allowAllOrigins     = require( './lib/middleware/allowAllOrigins' ),
    logSessionParser    = require( './lib/middleware/logSessionParser' )
    errorGenerator      = require( './lib/middleware/errorGenerator' )


var app, reddisStore

app = express()
redisStore = new RedisStore()



/*
 * Config
*/
app.configure(function() {
  app.set( 'port', process.env.PORT || 3000 )
  app.use( express.favicon() )
  app.use( express.logger('dev') )
  app.use( express.bodyParser() )
  app.use( express.methodOverride() )
  app.use( express.cookieParser('remotelogger secret shit boii') )
  app.use( express.session({ secret: 'remotelogger secret shit boii', store: redisStore }) )
  app.use( errorGenerator )
  app.use( app.router )
  app.use( express.static(path.join(__dirname, 'public')) )
  app.use( browserify({ 
    entry: __dirname + '/client/main.coffee',
    mount: "/remotelogger.js",
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
app.all( '/log', logSessionParser )
app.post( '/log', allowAllOrigins, logSessionParser, routes.postLogMessage )



/*
 * Start server
*/
http.createServer(app).listen(app.get('port'), function() {
  console.log( "Express server listening on port " + app.get('port') )
})