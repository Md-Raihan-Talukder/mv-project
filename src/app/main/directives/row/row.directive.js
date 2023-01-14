(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('rowDirective', RowDirective);

    /** @ngInject */
    function RowDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                accordion: '=',
                oninfochange: '&',
            },
            link: function (scope, element, attrs) {

            },
            templateUrl: 'app/main/directives/row/row.directive.html'
        };
    }
})();