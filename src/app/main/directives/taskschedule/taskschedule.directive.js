(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdTaskSchedule', TaskScheduleDirective);

    /** @ngInject */
    function TaskScheduleDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                schedule: '=',
                showAllDay: '=',
                showRepeat: '=',
                showDuePolicy: '=',
                showSchedule: '='
            },
            link: function (scope, element, attrs) {

            },
            controller: "TaskScheduleDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/taskschedule/taskschedule.html'

        };
    }
})();
