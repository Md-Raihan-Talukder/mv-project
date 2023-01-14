(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('CostingHeadsTreeController', CostingHeadsTreeController);

    /** @ngInject */
    function CostingHeadsTreeController(costingHeadsService, msbCommonApiService,
        supplyDefinitionService, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME,
        commonApiService, utilService, msbUtilService, $mdDialog) {

        var vm = this;
        vm.isNewCategory = false;
        vm.isParentCategory = false;
        vm.addCategory = true;
        vm.isCategoryFormReady = false;
        vm.supplyServiceColumns = [
            {
                "TECHDISER_ID": "SupplyServiceColumn1",
                "title": "Title",
                "data": "title",
                "type": "text",
                "flex": "100"
            },
            {
                "TECHDISER_ID": "SupplyServiceColumn2",
                "title": "Code",
                "data": "code",
                "type": "text",
                "flex": "100"
            },
            {
                "TECHDISER_ID": "SupplyServiceColumn3",
                "title": "Description",
                "data": "description",
                "type": "text",
                "flex": "100"
            }
        ];
        vm.supplyServiceTypeColumns = [
            {
                "TECHDISER_ID": "SupplyDefTypeColumn1",
                "title": "Title",
                "data": "title",
                "type": "text",
                "flex": "50"
            },
            {
                "TECHDISER_ID": "SupplyDefTypeColumn2",
                "title": "Code",
                "data": "code",
                "type": "text",
                "flex": "50"
            },
            {
                "TECHDISER_ID": "SupplyDefTypeColumn3",
                "title": "Description",
                "data": "description",
                "type": "text",
                "flex": "100"
            }
        ];
        vm.supplyServiceDataSheetColumns = [
            {
                "TECHDISER_ID": "supplyDefCatDataSheetColumn1",
                "title": "Title",
                "data": "title",
                "type": "text",
                "flex": "100"
            }
        ];
        vm.addNewCategory = addNewCategory;
        vm.saveCategory = saveCategory;
        vm.selectCategory = selectCategory;
        vm.deleteCategory = deleteCategory;
        vm.getPiHeadTitle = getPiHeadTitle;
        vm.selectPiHeadsDialog = selectPiHeadsDialog;


        init();

        function init() {

            getCostingHeads();


            vm.costingHeadsTreeOptions = {
                showUserBtn: false,
                showAddBtn: true,
                showRemoveBtn: true,
                maxLevel: 3
            };

            // service for pi heads along with costing heads
            getPiHeadsCostingHeadsByPiId();
        }

        function getCostingHeads() {

            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    vm.costingHeads = data;
                    getPIHeads();
                }
            }, "costingHeadsService", "getAllCostingHeads", null);
        }

        function getPIHeads() {

            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    vm.piHeads = data;
                }
            }, "costingHeadsService", "getAllPIHeads", null);
        }

        function getPiHeadsCostingHeadsByPiId() {

            msbCommonApiService.interfaceManager(function (costingPiData) {
                if (costingPiData) {
                    console.log(costingPiData);
                }
            }, "costingHeadsService", "getPiHeadsCostingHeadsByPiId", null);
        }

        // START SUPPLY SERVICE CATEGORY AND ITS TYPE

        function addNewCategory(item, event, callBack) {
            vm.hasCategory = item;
            vm.callBack = callBack;
            vm.isSelectedCategory = false;
            vm.updateCategory = false;
            vm.addCategory = true;
            vm.isCategoryFormReady = true;
            vm.isNewCategory = true;
            if (!item) {
                vm.isParentCategory = false;
                commonApiService.getIdFromServer('COSTING_HEADS', function (data) {
                    if (data) {
                        vm.category = {
                            "TECHDISER_ID": data.id,
                            "TECHDISER_SERIAL_NO": data.slNo,
                            "level": 1,
                            "piHeadId": null
                        }
                    }
                });
            }
            else {
                vm.isParentCategory = true;
                vm.selectedItemCategory = angular.copy(item);
                commonApiService.getIdFromServer('COSTING_HEADS', function (data) {
                    if (data) {
                        vm.category = {
                            "TECHDISER_ID": data.id,
                            "TECHDISER_SERIAL_NO": data.slNo,
                            "level": vm.selectedItemCategory.level + 1,
                            "parentId": vm.selectedItemCategory.TECHDISER_ID,
                            "piHeadId": vm.category.piHeadId
                        }
                    }
                });
            }
        }

        // function cardFormFocus() {
        //     angular.element("#card-input").focus();
        // }

        function saveCategory(category, isNew) {
            console.log(category);
            if (category.title) {
                commonApiService.saveItem(vm, category, isNew, "COSTING_HEADS", "costingHeads", false, function () {
                    vm.callBack(category);
                });
                vm.isCategoryFormReady = false;
            }
            saveCostingHead(isNew);
            console.log(vm.costingHeads);
        }

        function selectCategory(item, event, callBack) {
            vm.callBack = callBack;
            vm.isSelectedCategory = true;
            vm.item = item;
            var index = utilService.getIndex(vm.costingHeads, PRIMARY_COLUMN_NAME, item[PRIMARY_COLUMN_NAME]);
            vm.category = angular.copy(vm.costingHeads[index]);
            vm.addCategory = false;
            vm.updateCategory = true;
            vm.isNewCategory = false;
            vm.isCategoryFormReady = true;
        }

        function deleteCategory(category, event, callBack) {
            vm.callBack = callBack;
            if (category.nodes.length > 0 && category.level == 1) {
                utilService.showToast(
                    'This Costing Head has a Child.',
                    'error-toast',
                    5000
                );
            }
            else if (category.nodes.length > 0 && category.level == 2) {
                utilService.showToast(
                    'This Costing Head has a Child.',
                    'error-toast',
                    5000
                );
            }
            else {
                var index = utilService.getIndex(vm.costingHeads, PRIMARY_COLUMN_NAME, category[PRIMARY_COLUMN_NAME]);
                if (index < 0) {
                    return;
                }

                commonApiService.confirmAndDelete(null, function () {
                    category.deleted = !category.deleted;
                    commonApiService.saveItem(vm, category, false, "COSTING_HEADS", "costingHeads", false, function () {
                        vm.callBack(category);
                    });
                });
            }
        }
        // END SUPPLY SERVICE CATEGORY AND ITS TYPE

        function getPiHeadTitle(piHeadId) {
            if (piHeadId && vm.piHeads && vm.piHeads.length > 0) {
                var piIndex = msbUtilService.getIndex(vm.piHeads, PRIMARY_COLUMN_NAME, piHeadId);
                if (piIndex > -1) {
                    return vm.piHeads[piIndex].title;
                }
            }
        }

        function selectPiHeadsDialog(category) {
            if (vm.costingHeads && category) {
                $mdDialog
                    .show({
                        controller: "SelectPiHeadsDialogController",
                        controllerAs: "vm",
                        clickOutsideToClose: false,
                        preserveScope: true,
                        templateUrl: "app/main/systemsettings/costing-heads/dialog/select-pi-heads-dialog.html",
                        locals: {
                            PiHead: category.piHeadId
                        }
                    })
                    .then(function (answer) {
                        if (answer) {
                            category.piHeadId = answer;
                        }
                    });
            }
        }

        function saveCostingHead(isNew) {
            var param = {
                "costingHeadData": vm.category,
                "isNew": isNew
            };
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    console.log(data);
                }
            }, "testSetupService", "saveCostingHead", param);
        }


    }
})();
