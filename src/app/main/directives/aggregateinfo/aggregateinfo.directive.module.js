(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdAggregateInfo', AggregateInfoDirective);

    /** @ngInject */
    function AggregateInfoDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                columns: '=',
                info: '='
            },
            link: function (scope, element, attrs) {

            },
            controller: "AggregateInfoController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/aggregateinfo/aggregateinfo.html'
        };
    }
})();