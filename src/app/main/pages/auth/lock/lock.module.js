(function () {
    'use strict';

    angular
        .module('app.pages.auth.lock', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {
        // State
        $stateProvider.state('app.pages_auth_lock', {
            url: '/pages/auth/lock',
            views: {
                'main@': {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller: 'MainController as vm'
                },
                'content@app.pages_auth_lock': {
                    templateUrl: 'app/main/pages/auth/lock/lock.html',
                    controller: 'LockController as vm'
                }
            },
            bodyClass: 'lock'
        });


    }

})();