(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('verticalscheduleDirective', VertialScheduleDirective);

    /** @ngInject */
    function VertialScheduleDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                accordion: '=',
                oninfochange: '&',
            },
            link: function (scope, element, attrs) {

            },
            controller: "VerticalscheduleController",
            templateUrl: 'app/main/directives/verticalschedule/verticalschedule.directive.html'
        };
    }
})();