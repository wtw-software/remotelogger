var http     = require( 'http' ),
    cluster  = require( 'cluster' )
    

var servers = {
  client:     require( './apps/client/server' ),      
  dashboard:  require( './apps/dashboard/server')
}


if( cluster.isMaster ) {
  var clientProcess, dashboardProcess

  clientProcess = cluster.fork({ server: 'client' })
  dashboardProcess = cluster.fork({ server: 'dashboard' })

  clientProcess.on('exit', function() {
    console.log( 'clientProcess exited. restarting...' )
    clientProcess = cluster.fork({ server: 'client' })
  })

  dashboardProcess.on('exit', function() {
    console.log( 'dashboardProcess exited. restarting...' )
    dashboardProcess = cluster.fork({ server: 'client' })
  })

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