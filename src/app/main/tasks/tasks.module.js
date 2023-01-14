(function () {
    'use strict';

    angular
        .module('app.tasks', ['app.tasks.todo',
            'app.tasks.events',
            'app.tasks.calendar'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider) {

        msNavigationServiceProvider.saveItem('tasks', {
            title: 'Tasks & Events',
            icon: 'icon-checkbox-marked',
            weight: 11
        });

    }
})();