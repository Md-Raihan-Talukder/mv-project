(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdHolidayCaledar', HolidayCaledar);

    /** @ngInject */
    function HolidayCaledar() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                holiDays: '=',
            },
            link: function (scope, element, attrs) {

            },
            controller: "HolidayCaledarDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/holidaycalendar/holidaycaledar.html'

        };
    }
})();