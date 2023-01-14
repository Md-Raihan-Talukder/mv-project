(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('SelectCostingHeadsDialogController', SelectCostingHeadsDialogController);

    function SelectCostingHeadsDialogController(msbCommonApiService, supplyDefinitionService, CostingHead, commonApiService, $mdDialog, utilService, PRIMARY_COLUMN_NAME) {

        var vm = this;
        vm.title = "Select Costing heads";
        vm.okCostingHeads = okCostingHeads;
        vm.selectCostingHead = selectCostingHead;
        vm.closeDialog = closeDialog;

        init();
        function init() {

            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    console.log(data);
                    vm.leafCostingHeads = data;
                }
            }, "supplyDefinitionService", "getLeafNodesOfCostingHeads", null);

            if (!CostingHead) {
                vm.selectedHeadId = "";
                vm.selectedCostingHead = null;
            }
            else {
                console.log(CostingHead);
                vm.selectedHeadId = angular.copy(CostingHead);
                var param = [{ "key": "headId", "value": vm.selectedHeadId }];
                msbCommonApiService.interfaceManager(function (data) {
                    if (data) {
                        vm.selectedCostingHead = data;
                        console.log(vm.selectedCostingHead);
                    }
                }, "supplyDefinitionService", "getCostingHeadById", param);
            }
        }


        function selectCostingHead(costingHead) {
            if (costingHead) {
                if (costingHead.TECHDISER_ID == vm.selectedHeadId) {
                    vm.selectedHeadId = null;
                    vm.selectedCostingHead = null;
                } else {
                    vm.selectedHeadId = costingHead.TECHDISER_ID;
                    vm.selectedCostingHead = costingHead;
                }
            }
        }


        function okCostingHeads() {
            $mdDialog.hide(vm.selectedHeadId);
        }

        function closeDialog() {
            $mdDialog.hide();
        }
    }

})();
