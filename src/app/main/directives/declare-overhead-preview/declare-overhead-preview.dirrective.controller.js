(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('DeclareOverheadPreviewController', DeclareOverheadPreviewController);

    /** @ngInject */
    function DeclareOverheadPreviewController($scope, $state, PRIMARY_COLUMN_NAME, $rootScope, msbUtilService,
        msbCommonApiService, factoryDetailService) {


        var vm = this;
        vm.primaryColumnName = PRIMARY_COLUMN_NAME;

        init();

        function init() {

            vm.factoryId = $scope.factoryId;
            var param = [{ "key": "factoryId", "value": vm.factoryId }];
            getFactory(param);

        }

        function getFactory(param) {
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    vm.factory = data;
                    vm.overHeadSummary = data.overHeadSummary;

                    getDataDefinition();
                }
            }, "factoryDetailService", "getFactory", param);
        }

        function getDataDefinition() {

            if ($scope.declareOverHead) {

                vm.declareOverHead = $scope.declareOverHead;

                getOverHeadMonths();
            }

        }


        function getOverHeadMonths() {
            if (vm.overHeadSummary && vm.declareOverHead && vm.declareOverHead.monthlyOverHeadIds && vm.declareOverHead.monthlyOverHeadIds.length > 0) {
                vm.showOverheadSummary = [];
                for (var i = 0; i < vm.declareOverHead.monthlyOverHeadIds.length; i++) {
                    var overHeadIndex = msbUtilService.getIndex(vm.overHeadSummary, PRIMARY_COLUMN_NAME, vm.declareOverHead.monthlyOverHeadIds[i]);
                    if (overHeadIndex > -1) {
                        vm.showOverheadSummary.push(vm.overHeadSummary[overHeadIndex]);
                    }
                }
                vm.showOverheadSummary = msbUtilService.sortItems(vm.showOverheadSummary, "monthId").reverse();
            }
        }






    }
})();
