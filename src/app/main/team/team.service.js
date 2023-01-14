(function () {
    'use strict';

    angular
        .module('app.team')
        .factory('teamService', teamService);

    /** @ngInject */
    function teamService($http, serverUrl) {
        var serviceName = 'contacts/';

        var service = {
            getPo: getPo,
            getContacts: getContacts
        };


        function getPo() {
            return $http.get(serverUrl + serviceName + 'po.json');
        }

        function getContacts() {
            return $http.get(serverUrl + serviceName + 'contacts.json');
        }


        return service;
    }
})();