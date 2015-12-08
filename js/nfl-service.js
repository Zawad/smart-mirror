(function() {
    'use strict';

    function NflService($http) {
        var service = {};
        service.team = null;
        service.schedule = null;
        service.matchup = null;
        service.init = function(team) {
            service.team = team;
            var url = 'http://www.nfl.com/liveupdate/scorestrip/ss.json';
            return $http.get(url).
                then(function(response) {
                    service.schedule = response.data;
                });
        };

        service.currentFootballMatchUp = function() {
            if(service.schedule === null){
                return null;
            }
            var games = service.schedule.gms;
            for (var i = 0; i < games.length; i++) {
                if(games[i].hnn == service.team || games[i].vnn == service.team ) {
                    service.matchup = games[i];
                }
            };
            return service.matchup;
        }
        return service;
    }

    angular.module('SmartMirror')
        .factory('NflService', NflService);

}());