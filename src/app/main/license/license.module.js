(function () {
    'use strict';

    angular
        .module('app.license', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider.state('app.license', {
            url: '/license',
            views: {
                'content@app': {
                    templateUrl: 'app/main/license/license.html',
                    controller: 'LicenseController as vm'
                }
            }
        });
        // Navigation
        msNavigationServiceProvider.saveItem('license', {
            title: 'License',
            state: 'app.license',
            icon: 'icon-receipt',
            weight: 1
        });
    }
})();
