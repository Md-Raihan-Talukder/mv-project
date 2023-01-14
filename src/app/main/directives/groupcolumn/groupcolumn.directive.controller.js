(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('GroupColumnController', GroupColumnController);

    /** @ngInject */
    function GroupColumnController($scope, PRIMARY_COLUMN_NAME, dataCaptureService, utilService) {
        var vm = this;
        vm.primaryColumnName = PRIMARY_COLUMN_NAME;
        vm.columnFilter = columnFilter;
        vm.isFullPage = isFullPage

        init();

        function init() {
            vm.columns = getColumnsOfGroup($scope.col);
            vm.ready = true;
        }

        function getColumnsOfGroup(col) {
            //if()
            var columns = [];
            for (var i = 0; i < col.columns.length; i++) {
                var index = utilService.getIndex($scope.columns, 'data', col.columns[i]);
                if (index >= 0) {
                    columns.push($scope.columns[index]);
                }
            }

            return columns;
        }

        function isFullPage(col) {
            return dataCaptureService.isFullPage(col);
        }

        function columnFilter(item) {
            return dataCaptureService.columnFilter(item);
        }



    }
})();
