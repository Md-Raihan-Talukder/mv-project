(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdDataTable', DataTableDirective);

    /** @ngInject */
    function DataTableDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                tableData: '=',
                tableColumns: '=',
                isInner: '=',
                showDetailIcon: '=',
                onItemDetail: '&',
                onItemDelete: '&',
                onItemDefinition: '&',
            },
            controller: "DataTableDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/datatable/datatable.directive.html'

        };
    }
})();