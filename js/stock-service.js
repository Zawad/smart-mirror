(function() {
    'use strict';

    function StockService($http) {
        var service = {};
        service.ticker = null;
        service.val = null;

        service.init = function(company) {
            return $http.jsonp('http://dev.markitondemand.com/MODApis/Api/v2/Lookup/jsonp?input='+company+'&callback=JSON_CALLBACK').
                then(function(response) {
                    service.ticker = response.data[0].Symbol;
                    return $http.jsonp('http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol='+service.ticker+'&callback=JSON_CALLBACK').
                        then(function(response){
                            return service.val = response.data;
                    });
                });
        };

        service.currentStock = function() {
            return service.val;
        }
        return service;
    }

    angular.module('SmartMirror')
        .factory('StockService', StockService);

}());