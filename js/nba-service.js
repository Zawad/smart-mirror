(function() {
    'use strict';

    function NbaService($http) {
        var service = {};
        service.team = null;
        service.teamid = null;
        service.schedule = null;

        service.today = new Date();
        var scores = null;
        //var ACCESS_TOKEN = '10499906-996c-4bbc-9bb1-de73e2b32a41';
        var formatTime;
        service.init = function(team) {
            service.team = team;
            
            var url = 'https://erikberg.com/nba/teams.json?access_token='+ERIKBERG_ACCESS_TOKEN;
            
            return $http.get(url).
                then(function(response) {
                    var teams = response.data;
                    for (var i = 0; i < teams.length; i++) {
                        if (teams[i].last_name == service.team) {
                            service.teamid = teams[i].team_id;
                        }
                    };
                });            
        };
        service.currentSchedule = function() {
            var untilmonth = service.today.getMonth()+1;
            var sincemonth = untilmonth;
            var untilday = service.today.getDate()+4;
            var sinceday = service.today.getDate()-3;
            if (sinceday < 0) {
                sinceday = sinceday + 30;
                sincemonth = sincemonth-1;
                if (sincemonth<0){
                    sincemonth = sincemonth+12;
                }
            }
            
            untilmonth = ("0" + untilmonth).slice(-2);
            untilday = ("0"+untilday).slice(-2);
            sincemonth = ("0"+sincemonth).slice(-2);
            sinceday = ("0"+sinceday).slice(-2);

            var url = 'https://erikberg.com/nba/results/'+service.teamid+'.json?access_token='+ERIKBERG_ACCESS_TOKEN;
            return $http.get(url,{
                    params: {
                        'season':'2016',
                        'since':'2015'+sincemonth+sinceday,
                        'until':'2015'+untilmonth+untilday
                    }
                }).
                    then(function(response) {
                        console.log("NBA");
                        service.schedule = response.data;
                        formatTime(service.schedule);
                        return service.schedule;
                    });
        }

        formatTime = function(schedule) {
            var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
            for (var i = 0; i < schedule.length; i++) {
                var d = new Date(schedule[i].event_start_date_time);
                var minutes  = ("0"+d.getMinutes()).slice(-2);
                var hours = d.getHours() % 12 || 12;
                schedule[i].event_start_date_time = days[d.getDay()] + ' ' + hours + ':' + minutes;
               
            };
        };
        return service;
    }

    angular.module('SmartMirror')
        .factory('NbaService', NbaService);

}());