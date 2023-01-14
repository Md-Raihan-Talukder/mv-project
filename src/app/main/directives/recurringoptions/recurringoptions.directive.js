(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdRecurringOptions', RecurringOptionsDirective);

    /** @ngInject */
    function RecurringOptionsDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                schedule: '=',
                options: '='
            },
            link: function (scope, element, attrs) {

            },
            controller: "RecurringOptionsDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/recurringoptions/recurringoptions.directive.html'
        };
    }
})();
