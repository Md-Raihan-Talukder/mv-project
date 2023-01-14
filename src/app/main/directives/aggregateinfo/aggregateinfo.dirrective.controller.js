(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('AggregateInfoController', AggregateInfoController);

    /** @ngInject */
    function AggregateInfoController($scope, utilService, PRIMARY_COLUMN_NAME, CONSTANT_AGGREGATE_TYPES, CONSTANT_AGGREGATE_OPTIONS) {
        var vm = this;
        vm.primaryColumnName = PRIMARY_COLUMN_NAME;
        vm.aggregateTypes = CONSTANT_AGGREGATE_TYPES;
        vm.aggregateOptions = CONSTANT_AGGREGATE_OPTIONS;
        vm.addNewItem = addNewItem;
        vm.removeItem = removeItem;

        init();

        function init() {
            if (!$scope.info) {
                $scope.info = {
                    groupBy: [],
                    columnIds: [],
                    columns: []
                };
            }
        }

        function addNewItem() {
            var index = utilService.getIndex($scope.columns, vm.primaryColumnName, vm.columnId);
            if (index >= 0) {
                var column = $scope.columns[index];
                var item = { title: column.title, data: column.data, type: vm.aggregateType };
                $scope.info.columns.push(item);

                vm.columnId = null;
                vm.aggregateType = null;
            }
        }


        function removeItem(item) {
            var index = utilService.getIndex($scope.info.columns, 'data', item.data);
            if (index >= 0) {
                $scope.info.columns.splice(index, 1);
            }
        }

    }
})();