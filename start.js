// var childProcess = require( 'child_process' )
    

// // memory store for storing serverprocess by their pid
// var serverProcesses = {}


// // start a server process by forking current process
// function createServerProcess( serverPath ) {
//   var serverProcess

//   serverProcess = childProcess.fork( serverPath )
//   serverProcesses[ serverProcess.pid ] = serverProcess

//   serverProcess.on('exit', function() {
//     console.log( 'server [' + serverPath + '] exiting. restarting it..\n' )
//     delete serverProcesses[ serverProcess.pid ]

//     //give it some time to breathe
//     setTimeout(function() {
//       createServerProcess( serverPath )
//     }, 100)
//   })

//   return serverProcess
// }


// // exit all child processes properly when exiting this one
// process.on('SIGTERM',function(){
//   var pid, serverProcess

//   for( pid in serverProcesses ) {
//     serverProcess = serverProcesses[ pid ]
//     serverProcess.kill( 'SIGTERM' ) 
//   }
  
//   process.exit(1)
// })


// // start the servers
// createServerProcess( __dirname + '/apps/client/server' )
// createServerProcess( __dirname + '/apps/dashboard/server' )

var http            = require( "http" ),
    clientApp       = require( "./apps/client/app" ),
    dashboardApp    = require( "./apps/dashboard/app" )

http.createServer(clientApp).listen(clientApp.get('port'), function() {
  console.log( "client server server listening on port " + clientApp.get('port') )
})

http.createServer(dashboardApp).listen(dashboardApp.get('port'), function() {
  console.log( "client server server listening on port " + dashboardApp.get('port') )
})