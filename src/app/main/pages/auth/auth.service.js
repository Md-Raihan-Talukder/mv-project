(function () {
    'use strict';

    angular
        .module('app.pages.auth')
        .factory('authService', authService);

    /** @ngInject */
    function authService($http, serverUrl) {
        var serviceName = 'auth/';

        var service = {
            login: login,
            registerUser: registerUser,
            sendResetCode: sendResetCode,
            resetPassword: resetPassword
        };


        function login(loginInfo) {
            return $http.get(serverUrl + serviceName + 'login.json');
        }

        function registerUser(registerInfo) {
            return $http.get(serverUrl + serviceName + 'login.json');
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