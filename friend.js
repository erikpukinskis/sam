var library = require("nrtv-library")(require)

library.using(
  ["nrtv-server", "nrtv-element", "nrtv-browser-bridge", "nrtv-single-use-socket", "nrtv-dispatcher"],
  function(Server, element, BrowserBridge, SingleUseSocket, Dispatcher) {
  

    var dispatcher = new Dispatcher()
    var waitingForPeople = []

    function withPerson(func) {
      dispatcher.addTask(function() {
        var person
        func(person)
      }, function() {
        console.log("Done with person")
      })
    }

    function keepThemOnTrack(person) {
      ask(
        person,
        "are you coding?",
        thenWaitOrHelp
      )

      function thenWaitOrHelp(isCoding) {
        if (isCoding) {
          wait(
            60,
            "seconds",
            function() {
              keepThemOnTrack(person)
            }
          )
        } else {
          say("Please update me so I can be helpful in this scenario")
        }
      }
    }

    function findPeople() {
      var server = new Server()

      server.addRoute(
        "get",
        "/",
        letPeopleOfferThemselves
      )

      console.log("BANG FAN!")
      SingleUseSocket.installOn(server)

      server.start(5111)

      function letPeopleOfferThemselves(request, response) {

        var bridge = new BrowserBridge()

        var socket = new SingleUseSocket(
          server, findSomethingToDo)

        var waitForWork = socket
        .defineListenInBrowser(bridge)
        .withArgs(doWork)

        bridge.asap(waitForWork)

        var ui = [sam(), speech(), element.stylesheet(sam, speech)]

        bridge.sendPage(ui)(request, response)
      }
    }

    function doWork(message) {
      console.log("WORK NOW BRO!", message)
    }

    var sam = element.template(
      ".sam",
      "◕‿◕",
      element.style({
        "width": "25px",
        "height": "25px",
        "background": "#823567",
        "color": "#ddacb8",
        "font-size": "10px",
        "text-align": "right",
        "font-family": "Helvetica",
        "display": "inline-block"
      })
    )

    var speech = element.template(
      ".speech",
      "say you, say me",
      element.style({
        "display": "inline-block",
        "width": "150px",
        "background": "white",
        "border": "1px solid #FFFBFC",
        "border-width": "1px 2px 3px 2px",
        "margin-left": "5px",
        "padding": "11px 15px",
        "border-radius": "8px 8px 9px 8px",
        "font-family": "sans",
        "border-color": "#FBF5F7 #EBEAFB #EBEAFB #FFFBFC",
        "font-family": "sans-serif",
        "color": "#823567",
        "font-size": "18px",
        "font-weight": "lighter"
      })
    )

    var waitingForWork = []

    function findSomethingToDo() {
      console.log("OK, we're looking for some shiz to diz")

      dispatcher.requestWork(
        function(task) {
          task.func()
        }
      )

      var job = waitingForPeople.shift()
      var person = {}
      if (job) {
        job(person)
      } else {
        waitingForWork.push(person)
      }
    }

    findPeople()
    withPerson(keepThemOnTrack)

  }
)

// you are become ancient




// narratives are just posted to /username/modulename/x.x.x There is no different create or put or whatever. It's just a statement of opinion by a user, it will be tagged at a time. you can just post again if you want to change it. any unposted modules are just assumed to not exist



// so you invented the universe

// wazzzuppppp

// we just did too!

// and everyone else is about to, we're watching it happen!






