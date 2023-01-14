(function () {
    'use strict';

    angular
        .module('app.mail')
        .factory('mailService', mailService);

    /** @ngInject */
    function mailService($http, serverUrl) {

        var serviceName = 'mail/';

        var service = {
            getFolders: getFolders,
            getLabels: getLabels,
            getMails: getMails,
            resetPassword: resetPassword
        };


        function getFolders() {
            return $http.get(serverUrl + serviceName + 'folders.json');
        }

        function getLabels() {
            return $http.get(serverUrl + serviceName + 'labels.json');
        }

        function getMails() {
            return $http.get(serverUrl + serviceName + 'mails.json');
        }

        function sendResetCode(resetInfo) {
            return $http.get(serverUrl + serviceName + 'login.json');
        }

        function resetPassword(resetInfo) {
            return $http.get(serverUrl + serviceName + 'login.json');
        }

        return service;
    }
})();