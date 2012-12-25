var express               = require( 'express' ),
    namespaces            = require( 'express-namespace' ),
    http                  = require( 'http' ),
    net                   = require( 'net' ),
    repl                  = require( 'repl' ),
    path                  = require( 'path' ),
    browserify            = require( 'browserify' ),
    routes                = require( './routes' ),
    redisStoreSingelton   = require( '../../lib/redisStoreSingelton' ),
    allowAllOrigins       = require( '../../lib/middleware/allowAllOrigins' ),
    logSessionParser      = require( '../../lib/middleware/logSessionParser' )
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
  app.use( express.cookieParser('remotelogger client secret shit boii') )
  app.use( express.session({ secret: 'remotelogger client secret shit boii', store: redisStore }) )
  app.use( errorGenerator )
  app.use( app.router )
  app.use( express.static(path.join(__dirname, 'public')) )
  app.use( browserify({ 
    entry: __dirname + '/coffee/main.coffee',
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

app.get('/readstream/:id', allowAllOrigins, routes.readStream )

app.post( '/logmessage', allowAllOrigins, logSessionParser, routes.postLogMessage )

app.post( '/consoleload', allowAllOrigins, logSessionParser, routes.consoleLoad )


module.exports = app