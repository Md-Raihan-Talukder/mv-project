(function () {
    'use strict';

    angular
        .module('app.licenses', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider.state('app.licenses', {
            url: '/licenses',
            views: {
                'content@app': {
                    templateUrl: 'app/main/licenses/licenses.html',
                    controller: 'LicensesController as vm'
                }
            }
        }).state('app.licenses.add', {
            url: '/add/:id',
            views: {
                'content@app': {
                    templateUrl: 'app/main/licenses/add/add-new-license.html',
                    controller: 'NewLicenseController as vm'
                }
            }
        })
            .state('app.licenses.detail', {
                url: '/detail/:id',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/licenses/add/detail-license.html',
                        controller: 'NewLicenseController as vm'
                    }
                }
            });
        // Navigation
        msNavigationServiceProvider.saveItem('licenses', {
            title: 'License Issue',
            state: 'app.licenses',
            icon: 'icon-newspaper',
            weight: 1
        });
    }
})();
