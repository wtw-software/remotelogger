var http                  = require( 'http' ),
    express               = require( 'express' ),
    namespaces            = require( 'express-namespace' ),
    net                   = require( 'net' ),
    repl                  = require( 'repl' ),
    path                  = require( 'path' ),
    browserify            = require( 'browserify' ),
    routes                = require( './routes' ),
    redisStoreSingelton   = require( '../../lib/redisStoreSingelton' ),
    allowAllOrigins       = require( '../../lib/middleware/allowAllOrigins' ),
    logSessionParser      = require( '../../lib/middleware/logSessionParser' ),
    errorGenerator        = require( '../../lib/middleware/errorGenerator' )
    


var app, reddisStore

app = express()
redisStore = redisStoreSingelton.getInstance()



/*
 * Config
*/

app.configure(function() {
  app.set( 'port', process.env.PORT || 3000 )
  app.use( express.favicon() )
  app.use( express.logger('dev') )
  app.use( express.bodyParser() )
  app.use( express.methodOverride() )
  app.use( errorGenerator )
  app.use( app.router )
  app.use( express.static(path.join(__dirname, 'public')) )
  app.use( browserify({ 
    entry: __dirname + '/clientscript/main.js',
    mount: "/remotelogger.js",
    watch: true,
    debug: true
  }))
})

app.configure('development', function() {
  app.use( express.errorHandler() )
})



/*
 * Routes
*/

app.namespace('/log', function() {
  
  app.all( '*', allowAllOrigins, logSessionParser({ maxAge: 60 * 60 }) )

  app.post( '/message', routes.postLogMessage )

  app.post( '/consoleload', routes.consoleLoad )

})


http.createServer(app).listen(app.get('port'), function() {
  console.log( "client server server listening on port " + app.get('port') )
})