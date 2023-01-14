(function () {
    'use strict';

    angular
        .module('app.pages.nopermission', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {
        // State
        $stateProvider.state('app.pages_nopermission', {
            url: '/pages/notpermitted',
            views: {
                'main@': {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller: 'MainController as vm'
                },
                'content@app.pages_nopermission': {
                    templateUrl: 'app/main/pages/nopermission/nopermission.html',
                    controller: 'NoPermissionController as vm'
                }
            },
            bodyClass: 'maintenance'
        });
    }

})();