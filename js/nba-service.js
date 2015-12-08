(function() {
    'use strict';

    function NbaService($http) {
        var service = {};
        service.team = null;
        service.teamid = null;
        service.schedule = [];
        service.today = new Date();
        var scores = null;
        var formatTime;
        var findRecentGames;
        service.init = function(team) {
            service.team = team;
            
            var url = 'https://erikberg.com/nba/teams.json?access_token='+ERIKBERG_ACCESS_TOKEN;
            
            return $http.get(url).
                then(function(response) {
                    var teams = response.data;
                    for (var i = 0; i < teams.length; i++) {
                        if (teams[i].last_name.toLowerCase() == service.team.toLowerCase()) {
                            service.teamid = teams[i].team_id;
                        }
                    };
                });            
        };
        service.currentSchedule = function() {
            if(service.teamid === null){
                return null;
            }
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
                        findRecentGames(response);
=======                 formatTime(service.schedule);
                        return service.schedule;
                    });
        }

        findRecentGames = function(response) {
            for (var i = 0; i < response.data.length; i++) {
                var curday = response.data[i].event_start_date_time.split("T")[0];
                var m = service.today.getMonth()+1
                var d = ("0"+service.today.getDate()).slice(-2);
                var day = '2015-'+m+'-'+d;
                if (curday < day) {
                    service.schedule.push(response.data[i]);
                    service.schedule.push(response.data[i-1]);
                    break;
                }
            };
        };

        formatTime = function(schedule) {
            if(schedule === null){
                return null;
            }
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