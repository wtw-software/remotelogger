var childProccess = require( 'child_process' )

function startClientProcess() {
  return childProccess.exec("node ./clientserver", function( err, stdout, stderr ) { })
}

function startAdminProcess() {
  return childProccess.exec("node ./adminserver", function() {})
}

startClientProcess()
startAdminProcess()