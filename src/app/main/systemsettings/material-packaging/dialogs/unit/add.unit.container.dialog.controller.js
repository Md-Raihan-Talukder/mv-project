(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller("UnitContainerDialogController", UnitContainerDialogController);

    function UnitContainerDialogController(msbCommonApiService, msbUtilService, $mdDialog, PRIMARY_COLUMN_NAME,
        MaterialCategoryId, Supplies, IsUnitType, isContainerType, SelectedContainers) {
        var vm = this;
        vm.selectedContainers = angular.copy(SelectedContainers);
        vm.closeDialog = closeDialog;
        vm.addUnitContainer = addUnitContainer;
        vm.getContainerTitle = getContainerTitle;
        vm.selectContainer = selectContainer;
        vm.checkContainerExist = checkContainerExist;

        init();

        function init() {
            getMaterialContainers();
        }

        function getMaterialContainers() {
            if (isContainerType) {
                var param = { "categoryId": MaterialCategoryId, "isContainerType": true };
            }
            if (IsUnitType) {
                var param = { "categoryId": MaterialCategoryId, "isUnitType": true };
            }

            msbCommonApiService.interfaceManager(function (containerData) {
                if (containerData) {
                    vm.unitContainers = containerData;
                    console.log(containerData);
                }

            }, "supplyDefinitionService", "getMaterialContainers", param);
        }

        function getContainerTitle(categoryId) {
            var index = msbUtilService.getIndex(Supplies, PRIMARY_COLUMN_NAME, categoryId);
            if (index > -1) {
                return Supplies[index].title;
            }
        }

        function selectContainer(container) {
            var index = msbUtilService.getIndex(vm.selectedContainers, "containerId", container.containerId);
            if (index > -1) {
                vm.selectedContainers.splice(index, 1);
            } else {
                var containerObj = angular.copy(container);
                containerObj[PRIMARY_COLUMN_NAME] = msbUtilService.generateId();
                containerObj.containerId = container.containerId;
                containerObj.isdefault = false;
                vm.selectedContainers.push(containerObj);
            }
        }

        function checkContainerExist(containerId) {
            var index = msbUtilService.getIndex(vm.selectedContainers, "containerId", containerId);
            if (index > -1) {
                return true;
            } else {
                return false;
            }
        }

        function closeDialog() {
            $mdDialog.hide();
        }

        function addUnitContainer() {
            $mdDialog.hide(vm.selectedContainers);
        }
    }
})();
