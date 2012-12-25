var http     = require( 'http' ),
    cluster  = require( 'cluster' )
    

var servers = {
  client:     require( './apps/client/server' ),      
  dashboard:  require( './apps/dashboard/server')
}

function createServerProcess( serverName ) {
  var worker
  worker = cluster.fork({ server: serverName })
  worker.on('exit', function() {
    console.log( 'server ' + serverName + ' exiting. regenning it..\n' )
    createServerProcess( serverName )
  })
  return worker
}

if( cluster.isMaster ) {
  
  createServerProcess( 'client' )
  createServerProcess( 'dashboard' )

  process.on('SIGTERM',function(){
    clientProcess.kill( 'SIGTERM' )
    dashboardProcess.kill( 'SIGTERM' )
    process.exit(1)
  })

} else {

  var server = servers[ process.env.server ]

  http.createServer(server).listen(3000, function() {
    console.log( "Express server listening on port " + 3000 )
  })

}