(function () {
    'use strict';

    angular
        .module('app.pages.auth.forgot-password', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {
        // State
        $stateProvider.state('app.pages_auth_forgot-password', {
            url: '/pages/auth/forgot-password',
            views: {
                'main@': {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller: 'MainController as vm'
                },
                'content@app.pages_auth_forgot-password': {
                    templateUrl: 'app/main/pages/auth/forgot-password/forgot-password.html',
                    controller: 'ForgotPasswordController as vm'
                }
            },
            bodyClass: 'forgot-password'
        });
    }

})();