(function () {
    'use strict';

    angular
        .module('app.fbpoc', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider.state('app.fbpoc', {
            url: '/fbpoc',
            views: {
                'content@app': {
                    templateUrl: 'app/main/fbpoc/form.html',
                    controller: 'FbPoc as vm'
                }
            }
        });
        // Navigation
        msNavigationServiceProvider.saveItem('fbpoc', {
            title: 'Form Builder Poc',
            state: 'app.fbpoc',
            icon: 'icon-newspaper',
            weight: 0
        });
    }
})();
