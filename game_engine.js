var library = require("nrtv-library")(require)


// I am not concerned with random passersby

// I am concerned with the powers that be

// not the powers that might



// tellTheStars("we are become ancients")



// findPeople(...



// tellAStory

// tellTheStars



//  -> it's already done! -> notifyTheAuthor
//  -> ok -> askWhenToCheckIn
//  -> i don't know how
//  -> i don't feel like it

// splitStory (if you had to do it, how would you start)

//  -> askThemToDoIt
//    -> ok -> askWhenToCheckIn
//    -> i don't feel like it ----> askWhenToAskAgain
//    -> i don't know how -> splitStory



// limit the number of miracles in series https://youtu.be/ab2VVp1GfmA?t=11m22s



library.using(
  ["nrtv-server", "nrtv-element", "nrtv-browser-bridge", "nrtv-library-bridge", "nrtv-single-use-socket", "nrtv-dispatcher"],
  function(Server, element, BrowserBridge, bridgeModule, SingleUseSocket, Dispatcher) {
  

    // Some styles we'll need later:

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
      element.style({
        "display": "inline-block",
        "width": "150px",
        "background": "white",
        "box-shadow": "0px 2px 7px rgba(0,0,0,0.2)",
        "margin-left": "5px",
        "padding": "11px 15px",
        "font-family": "sans",
        "font-family": "sans-serif",
        "font-size": "18px",
      }),
      function(message) {
        this.children.push(element(message))
      }
    )


    // Here's the central HR kind of stuff:

    var waitingForWork = []    
    var dispatcher = new Dispatcher()
    var waitingForPeople = []

    findPeople()

    withPerson(keepThemOnTrack)

    function withPerson(func) {
      dispatcher.addTask(
        func,
        function() {
          console.log("Done with person")
        }
      )
    }

    function keepThemOnTrack(person) {
      person.say(
        "are you coding?",
        thenWaitOrHelp
      )

      person.say(
        "is it night?",
        function(){})

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
        giveEmSomethingToDo
      )

      SingleUseSocket.installOn(server)

      function giveEmSomethingToDo(request, response) {

        var person = wrapRequestWithPerson(request, response, server)

        dispatcher.requestWork(
          function(task) {
            task.func(person)
          }
        )
      }

      server.start(5111)
    }

    function wrapRequestWithPerson(request, response, server) {

      var bridge = new BrowserBridge()

      var socket = new SingleUseSocket(
        server)

      var elementInBrowser = bridgeModule(library, "nrtv-element", bridge)

      var sayInBrowser = bridge.defineFunction(
        [bridge.collective({}), elementInBrowser],
        makeBubbles
      )

      bridge.asap(
        socket
        .defineListenInBrowser(bridge)
        .withArgs(sayInBrowser)
      )

      var ui = [element(".world", sam()), element.stylesheet(sam, speech)]

      bridge.sendPage(ui)(request, response)

      var person = {
        say: function(statement) {                
          socket.send(statement)
        }
      }

      return person
    }

    function makeBubbles(collective, element, message) {

      if (collective.bubble) {

        collective.bubble.innerHTML = collective.bubble.innerHTML + element(element.raw(message)).html()

      } else {
        var speechBubble = element(".speech", element(element.raw(message)))

        var id = speechBubble.assignId()

        var world = document.querySelector(".world")

        world.innerHTML = world.innerHTML + speechBubble.html()

        collective.bubble = document.querySelector("#"+id)
      }
      
    }

    // tada
  }
)

// you are become ancient




// narratives are just posted to /username/modulename/x.x.x There is no different create or put or whatever. It's just a statement of opinion by a user, it will be tagged at a time. you can just post again if you want to change it. any unposted modules are just assumed to not exist



// so you invented the universe

// wazzzuppppp

// we just did too!

// and everyone else is about to, we're watching it happen!






