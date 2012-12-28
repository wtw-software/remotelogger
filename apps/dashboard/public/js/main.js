var SideBarView           = require( './views/SideBar' ),
    ConsoleView           = require( './views/Console' )
    LogSessionCollection  = require( './collections/LogSession' )


window.app = {}

app.logSessionCollection = new LogSessionCollection()

$(document).ready(function() {

  app.sideBarView = new SideBarView({ el: '#sidebar' })
  app.consoleView = new ConsoleView({ el: '#console' })

  setTimeout(function() {
    app.logSessionCollection.startSync()
  }, 100)
  
})

