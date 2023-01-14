(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdGroupColumn', groupColumnDirective);

    /** @ngInject */
    function groupColumnDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                item: '=',
                col: '=',
                columns: '='
            },
            controller: "GroupColumnController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/groupcolumn/groupcolumn.html'

        };
    }
})();