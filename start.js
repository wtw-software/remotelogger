var childProcess = require( 'child_process' )
    

// memory store for storing serverprocess by their pid
var serverProcesses = {}


// start a server process by forking current process
function createServerProcess( serverPath ) {
  var serverProcess

  serverProcess = childProcess.fork( serverPath )
  serverProcesses[ serverProcess.pid ] = serverProcess

  serverProcess.on('exit', function() {
    console.log( 'server [' + serverPath + '] exiting. restarting it..\n' )
    delete serverProcesses[ serverProcess.pid ]
    createServerProcess( serverPath )
  })

  return serverProcess
}


// exit all child processes properly when exiting this one
process.on('SIGTERM',function(){
  var pid, serverProcess

  for( pid in serverProcesses ) {
    serverProcess = serverProcesses[ pid ]
    serverProcess.kill( 'SIGTERM' ) 
  }
  
  process.exit(1)
})


// start the servers
createServerProcess( __dirname + '/apps/client/server' )
createServerProcess( __dirname + '/apps/dashboard/server' )