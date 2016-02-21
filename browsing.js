
function offer(option, callback) {
  
  var offerBridge = new BrowserBridge()

  server.addRoute(
    "get",
    "/offers/whatever/accept",
    function() {
      callback()
      var person = ...
      findSomethingToDo(person)
    }
  )

  var accept = offerBridge.defineFunction(function() {
    window.location = "/offers/whatever/accept"
  })

  var button = element(
    ".button",
    element.raw(option),
    {onclick: accept.evalable()}
  )

  server.addRoute(
    "get",
    "/offers/whatever",
    offerBridge.sendPage(button)
  )

}