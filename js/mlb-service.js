(function() {
    'use strict';

    function MlbService($http) {
        var service = {};
        service.team = null;
        service.teamid = null;
        service.schedule = null;
        service.init = function(team) {
            service.team = team;
            var url = 'https://erikberg.com/mlb/teams.json?access_token='+ERIKBERG_ACCESS_TOKEN;
            
            return $http.get(url).
                then(function(response) {
                    var teams = response.data;
                    service.schedule = response.data;
                    for (var i = 0; i < teams.length; i++) {
                        if (teams[i].last_name.toLowerCase() == service.team.toLowerCase()) {
                            service.teamid = teams[i].team_id;
                        }
                    };
                    console.log(service.teamid);
                    url = 'https://erikberg.com/mlb/results/'+service.teamid+'.json?access_token='+ERIKBERG_ACCESS_TOKEN;
                    return $http.get(url).
                        then(function(response) {
                            // console.log("MLB");
                            service.schedule = response.data;
                        });
                });            
        };
        service.currentSchedule = function() {
            for (var i = 0; i < service.schedule.length; i++) {
                if(service.schedule[i].event_season_type == "regular") {
                    return service.schedule[i];
                }
            };
            return null;
        }
        return service;
    }

    angular.module('SmartMirror')
        .factory('MlbService', MlbService);

}());