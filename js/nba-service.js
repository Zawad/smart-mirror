(function() {
    'use strict';

    function NbaService($http) {
        var service = {};
        service.team = null;
        service.schedule = null;
        service.init = function(team) {
            service.team = team;
            var url = 'http://www.erikberg.com/events.json?sport=nba&date=20151205?api_key=10499906-996c-4bbc-9bb1-de73e2b32a41';
            var ACCESS_TOKEN = '10499906-996c-4bbc-9bb1-de73e2b32a41';
            
            return $http.get(url).
                then(function(response) {
                    service.schedule = response.data;
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