(function() {
    'use strict';

    function NbaService($http) {
        var service = {};
        service.team = null;
        service.teamid = null;
        service.schedule = null;
        service.init = function(team) {
            service.team = team;
            var url = 'https://erikberg.com/nba/teams.json?access_token=10499906-996c-4bbc-9bb1-de73e2b32a41';
            var ACCESS_TOKEN = '10499906-996c-4bbc-9bb1-de73e2b32a41';
            
            return $http.get(url).
                then(function(response) {
                    var teams = response.data;
                    service.schedule = response.data;
                    for (var i = 0; i < teams.length; i++) {
                        if (teams[i].last_name == service.team) {
                            service.teamid = teams[i].team_id;
                        }
                    };
                    console.log(service.teamid)
                });

            
        };
        service.currentSchedule = function() {
           return service.schedule;
        }
        return service;
    }

    angular.module('SmartMirror')
        .factory('NbaService', NbaService);

}());