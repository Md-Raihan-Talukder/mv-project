(function () {
    'use strict';

    angular
        .module('app.tasks.events', [])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider) {
        msNavigationServiceProvider.saveItem('tasks.events', {
            title: 'Events',
            icon: 'icon-theater',
            weight: 2,
            state: 'app.to-do',
            stateParams: {
                type: 'event'
            }
        });

        msNavigationServiceProvider.saveItem('tasks.meetings', {
            title: 'Meetings',
            icon: 'icon-people',
            weight: 3,
            state: 'app.to-do',
            stateParams: {
                type: 'meeting'
            }
        });

    }
})();