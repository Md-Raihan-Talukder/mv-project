(function () {
    'use strict';

    angular
        .module('app.common')
        .directive('msbGrid', MsbGridDirective);

    /** @ngInject */
    function MsbGridDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                columnDefs: '=?',
                gridDefId: '=',
                helperItems: '=',
                onEditClick: '&',
                onDeleteClick: '&',
                onSelectedClick: '&',
                gridData: '=',
                onAddClick: '&',
                setFns: '&',
                rowHeight: '=',
                enableGridMenu: '=',
                showColumnFooter: '=',
                enablePinning: '=',
                enableSorting: '=',
                enableColumnMenus: '=',
                enableRowHeaderSelection: '=',
                enableFullRowSelection: '=',
                enableRowSelection: '=',
                multiSelect: '=',
                showGridFooter: '=',
                enableEdit: '=',
                enableDelete: '=',
                gridWidth: '=',
                gridHeight: '=',
            },
            link: function (scope, element, attrs) {

                scope.addFn = function () {
                    scope.onAddClick({ helperItems: scope.helperItems, callBack: scope.addCallback });
                }

                scope.selectedFn = function () {
                    var rows = scope.gridApi.selection.getSelectedRows();
                    scope.onSelectedClick({ helperItems: scope.helperItems, selectedItems: rows, callBack: scope.selectCallback });
                }

                scope.setFns({ addFn: scope.addFn, selectedFn: scope.selectedFn });
            },
            controller: "MsbGridController",
            controllerAs: 'vm',
            templateUrl: 'app/common/directives/grid/dynamic-grid.html'

        };
    }

})();