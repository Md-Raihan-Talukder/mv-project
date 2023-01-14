(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('msbRowSpanTableStripDirectiveController', msbRowSpanTableStripDirectiveController);

    /** @ngInject */
    function msbRowSpanTableStripDirectiveController(msbUtilService, $scope, PRIMARY_COLUMN_NAME) {
        var vm = this;
        vm.getStrip = getStrip;

        function getStrip(row) {
            var index = msbUtilService.getIndex(row, "key", PRIMARY_COLUMN_NAME);
            if (index > -1) {
                var col = row[index];
                var indx = msbUtilService.getIndex(vm.strips, PRIMARY_COLUMN_NAME, col.text);
                if (indx > -1) {
                    return vm.strips[indx];
                }

            }

        }

        init();

        function init() {
            vm.tableDef = $scope.stripDef.rowspanTableDefinition;
            vm.columns = vm.tableDef.columns;
            vm.expandableColumn = vm.tableDef.expandableColumn;
            vm.headerDef = vm.tableDef.headerDef;
            vm.strips = $scope.strips;
            createItems();
        }

        function createItems() {
            var items = [];
            vm.tableItems = [];

            for (var i = 0; i < vm.strips.length; i++) {
                var strip = vm.strips[i];
                var item = {};
                for (var j = 0; j < vm.columns.length; j++) {
                    var col = vm.columns[j];
                    item[col] = strip[col]
                }
                item["PRIMARY_COLUMN_NAME"] = strip[PRIMARY_COLUMN_NAME];
                item[vm.expandableColumn] = strip[vm.expandableColumn];



                items.push(item);
            }

            console.log(items)

            var flat = msbUtilService.getFlattenedJsonArray(items);
            vm.tableItems = msbUtilService.createTableRows(flat, vm.headerDef);
            console.log(flat)
        }

    }

})();