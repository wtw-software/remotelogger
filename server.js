var express             = require('express'),
    http                = require('http'),
    path                = require('path'),
    browserify          = require('browserify'),
    allowAllOrigins     = require('./lib/allowAllOrigins'),
    routes              = require('./lib/routes')



var app = express();

app.configure(function(){
  app.set( 'port', process.env.PORT || 3000 )
  app.use( express.favicon() )
  app.use( express.logger('dev') )
  app.use( express.bodyParser() )
  app.use( express.methodOverride() )
  app.use( app.router )
  app.use( express.static(path.join(__dirname, 'public')) )
  app.use( browserify({ 
    entry: __dirname + '/client/main.coffee',
    mount: "/logger.js",
    watch: true,
    debug: true
  }))
})

app.configure('development', function(){
  app.use(express.errorHandler())
})



app.get(  '/', routes.serveTest )
app.post( '/log/startsession', allowAllOrigins, routes.startLogSession )
app.post( '/log/stopsession', allowAllOrigins, routes.stopLogSession )
app.post( '/log', allowAllOrigins, routes.logMessage )



http.createServer(app).listen(app.get('port'), function(){
  console.log( "Express server listening on port " + app.get('port') )
})