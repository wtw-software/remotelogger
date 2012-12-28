var SideBarView           = require( './views/SideBar' ),
    LogSessionCollection  = require( './collections/LogSession' )


window.app = {}

app.logSessionCollection = new LogSessionCollection()

$(document).ready(function() {

  app.sideBarView = new SideBarView({ el: '#sidebar'})

  setTimeout(function() {
    app.logSessionCollection.startSync()
  }, 100)
  
})

