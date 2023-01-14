(function () {
    'use strict';

    // agGrid.initialiseAgGridWithAngular1(angular);

    angular
        .module('tech-diser')
        .config(config);

    /** @ngInject */
    function config($httpProvider, CONSTANT_APP_MODE, commonApiProvider, treeConfig) {
        treeConfig.defaultCollapsed = true;

        $httpProvider.interceptors.push(function ($q) {
            return {
                // optional method
                'request': function (config) {

                    // var rtime = new Date();
                    // var securitytoken = sessionStorage.getItem(USERTOKENKEY) == null ? '' : sessionStorage.getItem(USERTOKENKEY);
                    // var requesttime = '/Date(' + rtime.getTime() + (rtime.getTimezoneOffset() * 60000).toString() + ')/';

                    // config.headers['x-session-token'] = uuid;
                    // config.headers['RequestTime'] = requesttime;
                    // config.headers['Authorization'] = securitytoken != null ? "basic " + securitytoken : null;
                    // config.headers['Cache-Control'] = 'no-cache';
                    // config.cache = false;

                    // console.log('called');
                    return config;
                },

                // optional method
                'requestError': function (rejection) {
                    return $q.reject(rejection);
                },

                // optional method
                'response': function (response) {
                    // do something on success
                    return $q.resolve(response);
                },

                // optional method
                'responseError': function (rejection) {
                    return $q.reject(rejection);
                }
            };
        });
    }

})();