(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdAgGrid', AgGridDirective);

    /** @ngInject */
    function AgGridDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                tableHeight: '=',
                rowCount: '=',
                tableData: '=',
                tableColumns: '=',
                onItemDetail: '&',
                onSelectionChanged: '&',
                gridOptions: '='
            },
            link: function (scope, element, attrs) {

            },
            controller: "AgGridDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/aggrid/aggrid.html'
        };
    }
})();