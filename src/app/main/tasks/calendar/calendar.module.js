(function () {
    'use strict';

    angular
        .module('app.tasks.calendar', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider) {
        // State
        $stateProvider.state('app.calendar', {
            url: '/calendar',
            views: {
                'content@app': {
                    templateUrl: 'app/main/tasks/calendar/calendar.html',
                    controller: 'CalendarController as vm'
                }
            },
            bodyClass: 'calendar'
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/tasks/calendar');

        // Navigation
        msNavigationServiceProvider.saveItem('tasks.calendar', {
            title: 'Calendar',
            icon: 'icon-calendar-today',
            state: 'app.calendar',
            weight: 3
        });
    }
})();