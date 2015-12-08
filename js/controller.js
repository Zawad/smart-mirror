(function(angular) {
    'use strict';

    function MirrorCtrl(AnnyangService, GeolocationService, WeatherService, MapService, StockService, NflService, NbaService, MlbService, $scope, $timeout) {
        var _this = this;
        $scope.listening = false;
        $scope.debug = false;
        $scope.complement = "Hi, buddy!"
        $scope.focus = "default";
        $scope.user = {};
        $scope.stock = {};
        $scope.reminders = [];

        $scope.colors=["#6ed3cf", "#9068be", "#e1e8f0", "#e62739"];

        //Update the time
        var tick = function() {
            $scope.date = new Date();
            $timeout(tick, 1000 * 60);
        };

        _this.init = function() {
            $scope.map = MapService.generateMap("Blacksburg,VA");
            _this.clearResults();
            tick();

            StockService.init("Alphabet").then(function(){
                $scope.stock = StockService.currentStock();
                console.log($scope.stock);
            });

            NflService.init("Redskins").then(function(){
                $scope.football = NflService.currentFootballMatchUp();
                console.log($scope.football);
            });

            NbaService.init("Wizards").then(function(){
                $scope.basketball = NbaService.currentSchedule();
                console.log($scope.basketball);
            });

            MlbService.init("Nationals").then(function(){
                $scope.baseball = MlbService.currentSchedule();
                console.log($scope.baseball);
            });


            //Get our location and then get the weather for our location
            GeolocationService.getLocation().then(function(geoposition){
                console.log("Geoposition", geoposition);
                WeatherService.init(geoposition).then(function(){
                    $scope.currentForcast = WeatherService.currentForcast();
                    $scope.weeklyForcast = WeatherService.weeklyForcast();
                    console.log("Current", $scope.currentForcast);
                    console.log("Weekly", $scope.weeklyForcast);
                    //refresh the weather every hour
                    //this doesn't acutually updat the UI yet
                    //$timeout(WeatherService.refreshWeather, 3600000);
                });
            })


            var defaultView = function() {
                console.debug("Ok, going to default view...");
                $scope.focus = "default";
            }

            // List commands
            AnnyangService.addCommand('What can I say', function() {
                console.debug("Here is a list of commands...");
                console.log(AnnyangService.commands);
                $scope.focus = "commands";
            });

            // Go back to default view
            AnnyangService.addCommand('Go home', defaultView);

            // Hide everything and "sleep"
            AnnyangService.addCommand('Go to sleep', function() {
                console.debug("Ok, going to sleep...");
                $scope.focus = "sleep";
                $scope.complement = "Ok, Goodbye :)";
            });

            // Go back to default view
            AnnyangService.addCommand('Wake up', defaultView);

            // Hide everything and "sleep"
            AnnyangService.addCommand('Show debug information', function() {
                console.debug("Boop Boop. Showing debug info...");
                $scope.debug = true;
                $scope.complement = "Ok, Showing debug info...";
            });

            // Hide everything and "sleep"
            AnnyangService.addCommand('Show map', function() {
                console.debug("Going on an adventure?");
                $scope.focus = "map";
                $scope.complement = "Going on an adventure?";
            });

            // Hide everything and "sleep"
            AnnyangService.addCommand('Show (me a) map of *location', function(location) {
                console.debug("Getting map of", location);
                $scope.map = MapService.generateMap(location);
                $scope.focus = "map";
                $scope.complement = "Getting map of " +location;

            });

            // Zoom in map
            AnnyangService.addCommand('Map zoom in', function() {
                console.debug("Zoooooooom!!!");
                $scope.map = MapService.zoomIn();
                $scope.complement = "Zoooooooom!!!";
                $scope.focus = "map";
            });

            AnnyangService.addCommand('Map zoom out', function() {
                console.debug("Moooooooooz!!!");
                $scope.map = MapService.zoomOut();
                $scope.focus = "map";
                $scope.complement = "Moooooooooz!!!";
            });

            AnnyangService.addCommand('Map reset zoom', function() {
                console.debug("Zoooommmmmzzz00000!!!");
                $scope.map = MapService.reset();
                $scope.complement = "Reset!!!";
                $scope.focus = "map";
            });

            // Search images
            /*AnnyangService.addCommand('Show me *term', function(term) {
                console.debug("Showing", term);
            });*/

            // Change name
            AnnyangService.addCommand('My (name is)(name\'s) *name', function(name) {
                console.debug("Hi", name, "nice to meet you");
                $scope.complement = "Hi "+name+" nice to meet you";
                $scope.user.name = name;
            });

            //Set Stock
            AnnyangService.addCommand('Set stock (to) *company', function(company) {
                console.debug("I'll fetch", company, "stock update");
                StockService.init(company).then(function(){
                    $scope.stock = StockService.currentStock();
                    console.log($scope.stock);
                    $scope.complement = "I'll fetch "+company+ "'s stock update";
                });
            });

            //Set NFL Team
            AnnyangService.addCommand('Set football (to the)(to) *team', function(team) {
                console.debug("I'll get the", team, "matchup");
                NflService.init(team).then(function(){
                    $scope.football = NflService.currentFootballMatchUp();
                    $scope.complement = "I'll get the "+team+" matchup";
                    console.log($scope.football);
                });
            });

            //Set NBA Team
            AnnyangService.addCommand('Set basketball (to the)(to) *team', function(team) {
                console.debug("I'll get the", team, "matchup");
                NbaService.init(team).then(function(){
                    $scope.basketball = NbaService.currentSchedule();
                    console.log($scope.basketball);
                });
            });

            //Set MLB Team
            AnnyangService.addCommand('Set baseball (to the)(to) *team', function(team) {
                console.debug("I'll get the", team, "matchup");
                MlbService.init(team).then(function(){
                    $scope.baseball = MlbService.currentSchedule();
                    console.log($scope.baseball);
                });
            });

            // Set a reminder
            AnnyangService.addCommand('Remind me to *task', function(task) {
                console.debug("I'll remind you to", task);
                $scope.reminders.push(task);
                console.log($scope.reminders);
            });

            // Remove reminders item
            AnnyangService.addCommand('Remove *task (from to do list)', function(task) {
                console.debug("I'll remove", task, "from the To-Do List");
                var i = $scope.reminders.indexOf(task);
                if(i != -1) {
                    $scope.reminders.splice(i,1);
                }
                console.log($scope.reminders);
            });

            // Clear reminders
            AnnyangService.addCommand('Clear reminders', function() {
                console.debug("Clearing reminders");
                $scope.reminders = [];
                console.log($scope.reminders);
            });

            // Clear log of commands
            AnnyangService.addCommand('Clear results', function(task) {
                 console.debug("Clearing results");
                 _this.clearResults()
            });

            // Check the time
            AnnyangService.addCommand('what time is it', function(task) {
                 console.debug("It is", moment().format('h:mm:ss a'));
                 _this.clearResults();
            });

            /*// Turn lights off
            AnnyangService.addCommand('(turn) (the) :state (the) light(s) *action', function(state, action) {
                HueService.performUpdate(state + " " + action);
            });*/

            // Fallback for all commands
            AnnyangService.addCommand('*allSpeech', function(allSpeech) {
                console.debug(allSpeech);
                _this.addResult(allSpeech);
            });
            
            //Track when the Annyang is listening to us
            AnnyangService.start(function(listening){
                $scope.listening = listening;
            });
        };
        
        _this.addResult = function(result) {
            _this.results.push({
                content: result,
                date: new Date()
            });
        };
        
        _this.clearResults = function() {
            _this.results = [];
        };

        _this.init();
    }

    angular.module('SmartMirror')
        .controller('MirrorCtrl', MirrorCtrl);

}(window.angular));


/*
'(show me) help':       help,
    'hello (there)':        hello,
    'stop listening':       stopListening,



    Commands:
        "What Can I Say?": give the user a list of availalbe commands

TODO:
- Set a timer for X

Both the init() and addCommands() methods receive a commands object.

annyang understands commands with named variables, splats, and optional words.

Use named variables for one word arguments in your command.
Use splats to capture multi-word text at the end of your command (greedy).
Use optional words or phrases to define a part of the command as optional.
Examples:

<script>
var commands = {
  // annyang will capture anything after a splat (*) and pass it to the function.
  // e.g. saying "Show me Batman and Robin" will call showFlickr('Batman and Robin');
  'show me *term': showFlickr,

  // A named variable is a one word variable, that can fit anywhere in your command.
  // e.g. saying "calculate October stats" will call calculateStats('October');
  'calculate :month stats': calculateStats,

  // By defining a part of the following command as optional, annyang will respond
  // to both: "say hello to my little friend" as well as "say hello friend"
  'say hello (to my little) friend': greeting
};

var showFlickr = function(term) {
  var url = 'http://api.flickr.com/services/rest/?tags='+tag;
  $.getJSON(url);
}

var calculateStats = function(month) {
  $('#stats').text('Statistics for '+month);
}

var greeting = function() {
  $('#greeting').text('Hello!');
}
</script>
*/ 
