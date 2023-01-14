(function () {
    'use strict';

    angular
        .module('app.landing', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.landing', {
                url: '/list/:menuId/:taskId',
                params: {
                    taskId: {
                        value: null,
                        squash: true
                    }
                },
                views: {
                    'content@app': {
                        templateUrl: 'app/main/landing/landing.html',
                        controller: 'LandingController as vm'
                    }
                },
                bodyClass: 'printable'
            });

        msNavigationServiceProvider.saveItem('landing', {
            title: 'Activity 1',
            icon: 'icon-tile-four',
            state: 'app.landing',
            stateParams: { 'menuId': "activity1", 'taskId': null },
            weight: 1
        });
        msNavigationServiceProvider.saveItem('polist', {
            title: 'Po list',
            icon: 'icon-tile-four',
            state: 'app.landing',
            stateParams: { 'menuId': "po", 'taskId': null },
            weight: 1
        });

    }
})();
