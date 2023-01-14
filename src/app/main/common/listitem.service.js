(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('listItemService', listItemService);

    /** @ngInject */
    function listItemService($http, serverUrl) {

        var service = {
            getListItems: getListItems
        };


        function getListItems(serviceName, methodName) {
            return $http.get(serverUrl + serviceName + "/" + methodName);
        }

        return service;
    }
})();