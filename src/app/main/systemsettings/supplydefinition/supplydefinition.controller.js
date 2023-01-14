(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('SupplyDefinitionController', SupplyDefinitionController);

    /** @ngInject */
    function SupplyDefinitionController($mdDialog, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME, commonApiService, utilService, systemUtils) {

        var vm = this;
        vm.exists = systemUtils.exists;
        vm.isNumberKey = systemUtils.isNumberKey;

        vm.addSupplyCategory = addSupplyCategory;
        vm.updateSupplyCategory = updateSupplyCategory;
        vm.selectSupplyCategory = selectSupplyCategory;
        vm.toggleSelectSupplyCategory = toggleSelectSupplyCategory;
        vm.checkedAllSupplyCategories = checkedAllSupplyCategories;
        vm.clearCheckedSupplyCategories = clearCheckedSupplyCategories;
        vm.deleteCheckedSupplyCategories = deleteCheckedSupplyCategoriesDialog;

        vm.addSupplyType = addSupplyType;
        vm.deleteSupplyType = deleteSupplyType;
        vm.selectSupplyType = selectSupplyType;

        vm.findSuppliesWhere = findSuppliesWhere;
        vm.addSupply = addSupply;
        vm.deleteSupply = deleteSupply;
        vm.selectSupply = selectSupply;

        vm.clearAll = clearAll;

        init();

        function init() {

            commonApiService.getItems(vm, "SUPPLIES", "supplies", false);

            commonApiService.getItems(vm, "SUPPLYTYPES", "supplytypes", false);

            commonApiService.getItems(vm, "SUPPLYCATEGORIES", "supplycategories", false, function () {
                selectSupplyCategory(vm.supplycategories[0]);
            });

            clearAll(false, true);
            vm.checkedSupplyCategories = [];
        }

        function clearAll(param, isSupplyCategory) {
            if (isSupplyCategory) {
                vm.supplyCategory = {};
                vm.isNewSupplyCategory = true;
            }
            if (param) {
                vm.selectedTabIndex = param;
            } else {
                vm.selectedTabIndex = 0;
            }
            vm.supplyType = {};
            vm.isNewSupplyType = true;
            vm.selectedSupplyType = undefined;
            vm.supply = {};
            vm.isNewSupply = true;
            vm.selectedSupply = undefined;
        }

        function addSupplyCategory(supplyCategory) {
            if (!vm.supplycategories) {
                return;
            }
            var objectLength = Object.keys(supplyCategory).length;
            if (objectLength < 3) {
                return;
            }
            if (supplyCategory.title === "" || supplyCategory.code === "" || supplyCategory.weight === "") {
                return;
            }

            supplyCategory.weight = Number(supplyCategory.weight);

            if (supplyCategory.weight < 1) {
                return;
            }

            var supplyCategoryIndex = utilService.getIndex(vm.supplycategories, PRIMARY_COLUMN_NAME, supplyCategory[PRIMARY_COLUMN_NAME]);
            if (supplyCategoryIndex > -1) {
                vm.supplycategories[supplyCategoryIndex] = supplyCategory;
            } else {
                supplyCategory[PRIMARY_COLUMN_NAME] = utilService.generateId();
                supplyCategory[SERIAL_COLUMN_NAME] = vm.supplycategories.length + 1;
                supplyCategory.deleted = false;
                vm.supplycategories.push(supplyCategory);
            }
            commonApiService.saveItems("SUPPLYCATEGORIES", vm.supplycategories);
            clearAll(false, true);
            selectSupplyCategory(supplyCategory);
        }

        function updateSupplyCategory(supplyCategory) {
            vm.isNewSupplyCategory = false;
            vm.supplyCategory[PRIMARY_COLUMN_NAME] = supplyCategory[PRIMARY_COLUMN_NAME];
            vm.supplyCategory[SERIAL_COLUMN_NAME] = supplyCategory[SERIAL_COLUMN_NAME];
            vm.supplyCategory.title = supplyCategory.title;
            vm.supplyCategory.code = supplyCategory.code;
            vm.supplyCategory.weight = supplyCategory.weight;
            vm.supplyCategory.deleted = supplyCategory.deleted;
        }

        function deleteSupplyCategory(item) {
            var index = utilService.getIndex(vm.supplycategories, PRIMARY_COLUMN_NAME, item.id);
            if (index > -1) {
                var supplyTypes = findSupplyTypesWhere(item.id);
                if (supplyTypes.length) {
                    utilService.showToast(vm.supplycategories[index].title + " has few supply types", 'error-toast', 5000);
                    return;
                }
                vm.supplycategories[index].deleted = true;
                commonApiService.saveItems("SUPPLYCATEGORIES", vm.supplycategories);
            }
            var undeletedSupplyCategoryIndex = utilService.getIndex(vm.supplycategories, "deleted", false);
            selectSupplyCategory(vm.supplycategories[undeletedSupplyCategoryIndex]);
        }

        function selectSupplyCategory(supplyCategory) {
            if (!supplyCategory) {
                vm.selectedSupplyCategory = undefined;
                return;
            }
            vm.selectedSupplyCategory = supplyCategory;
            vm.supplyTypesBySupplyCategoryId = findSupplyTypesWhere(supplyCategory[PRIMARY_COLUMN_NAME]);
            clearAll();
        }

        function toggleSelectSupplyCategory(supplyCategory) {
            var index = utilService.getIndex(vm.checkedSupplyCategories, "id", supplyCategory[PRIMARY_COLUMN_NAME]);
            if (index > -1) {
                vm.checkedSupplyCategories.splice(index, 1);
            } else {
                var item = {
                    id: supplyCategory[PRIMARY_COLUMN_NAME],
                    title: supplyCategory.title
                };
                vm.checkedSupplyCategories.push(item);
                item = undefined;
            }
        }

        function checkedAllSupplyCategories() {
            clearCheckedSupplyCategories();
            var undeletedSupplyCategories = systemUtils.getIndexes(vm.supplycategories, "deleted", false);
            for (var i = 0; i < undeletedSupplyCategories.length; i++) {
                var item = {
                    id: vm.supplycategories[undeletedSupplyCategories[i]][PRIMARY_COLUMN_NAME],
                    title: vm.supplycategories[undeletedSupplyCategories[i]].title
                };
                vm.checkedSupplyCategories.push(item);
                item = undefined;
            }
        }

        function clearCheckedSupplyCategories() {
            vm.checkedSupplyCategories = [];
        }

        function deleteCheckedSupplyCategoriesDialog(event, checkedSupplyCategories) {
            $mdDialog.show({
                controller: 'CommonDeleteDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/main/systemsettings/dialogs/commonDelete.dialog.html',
                clickOutsideToClose: true,
                locals: {
                    SelectedItems: checkedSupplyCategories,
                    OnDelete: deleteSupplyCategory,
                    ClearSelectedItems: clearCheckedSupplyCategories,
                    ItemType: vm.checkedSupplyCategories.length == 1 ? "Supply Category" : "Supply Categories",
                    event: event
                }
            });
        }

        function findSupplyTypesWhere(supplyCategoryId) {
            if (!vm.supplytypes) {
                return;
            }
            var supplyTypes = [];
            for (var i = 0; i < vm.supplytypes.length; i++) {
                if (vm.supplytypes[i].supplyCategoryId === supplyCategoryId && !vm.supplytypes[i].deleted) {
                    supplyTypes.push(vm.supplytypes[i]);
                }
            }
            return supplyTypes;
        }

        function addSupplyType(supplyType) {
            var objectLength = Object.keys(supplyType).length;
            if (objectLength < 3) {
                return;
            }
            if (supplyType.title === "" || supplyType.code === "" || supplyType.supplyCategoryId === "") {
                return;
            }

            var supplyTypeIndex = utilService.getIndex(vm.supplytypes, PRIMARY_COLUMN_NAME, supplyType[PRIMARY_COLUMN_NAME]);
            if (supplyTypeIndex > -1) {
                vm.supplytypes[supplyTypeIndex] = supplyType;
            } else {
                supplyType[PRIMARY_COLUMN_NAME] = utilService.generateId();
                supplyType.deleted = false;
                vm.supplytypes.push(supplyType);
            }
            commonApiService.saveItems("SUPPLYTYPES", vm.supplytypes);
            selectSupplyCategory(vm.selectedSupplyCategory);
        }

        function updateSupplyType(supplyType) {
            vm.isNewSupplyType = false;
            vm.supplyType[PRIMARY_COLUMN_NAME] = supplyType[PRIMARY_COLUMN_NAME];
            vm.supplyType.title = supplyType.title;
            vm.supplyType.code = supplyType.code;
            vm.supplyType.supplyCategoryId = supplyType.supplyCategoryId;
            vm.supplyType.deleted = supplyType.deleted;
        }

        function deleteSupplyType(supplyType) {
            if (supplyType.title === "" || supplyType.supplyCategoryId === "") {
                return;
            }

            commonApiService.confirmAndDelete(supplyType.title + " will be deleted", function () {
                var deletedSupplyTypeIndex = utilService.getIndex(vm.supplytypes, PRIMARY_COLUMN_NAME, supplyType[PRIMARY_COLUMN_NAME]);
                if (deletedSupplyTypeIndex > -1) {
                    vm.supplytypes[deletedSupplyTypeIndex].deleted = true;
                    clearAll();
                    var supplyCategoryId = vm.selectedSupplyCategory ? vm.selectedSupplyCategory[PRIMARY_COLUMN_NAME] : undefined;
                    vm.supplyTypesBySupplyCategoryId = findSupplyTypesWhere(supplyCategoryId);

                    commonApiService.saveItems("SUPPLYTYPES", vm.supplytypes);
                }
            });
        }

        function selectSupplyType(supplyType) {
            if (!supplyType) {
                vm.selectedSupplyType = undefined;
                return;
            }
            vm.selectedSupplyType = supplyType;
            updateSupplyType(supplyType);
            vm.selectedTabIndex = 0;
            vm.supply = {};
            vm.isNewSupply = true;
            vm.selectedSupply = undefined;
        }

        function findSuppliesWhere(supplyTypeId) {
            if (!vm.supplies) {
                return;
            }
            var supplies = [];
            for (var i = 0; i < vm.supplies.length; i++) {
                if (vm.supplies[i].supplyTypeId === supplyTypeId && !vm.supplies[i].deleted) {
                    supplies.push(vm.supplies[i]);
                }
            }
            return supplies;
        }

        function addSupply(supply) {
            var objectLength = Object.keys(supply).length;
            if (objectLength < 2) {
                return;
            }
            if (supply.title === "" || supply.code === "" || supply.supplyTypeId === "") {
                return;
            }

            var supplyIndex = utilService.getIndex(vm.supplies, PRIMARY_COLUMN_NAME, supply[PRIMARY_COLUMN_NAME]);
            if (supplyIndex > -1) {
                vm.supplies[supplyIndex] = supply;
            } else {
                supply[PRIMARY_COLUMN_NAME] = utilService.generateId();
                supply.supplyCategoryId = getSupplyTypeWhere(supply.supplyTypeId).supplyCategoryId;
                supply.deleted = false;
                vm.supplies.push(supply);
            }
            commonApiService.saveItems("SUPPLIES", vm.supplies);
            selectSupplyCategory(vm.selectedSupplyCategory);
        }

        function updateSupply(supply) {
            vm.isNewSupply = false;
            vm.supply[PRIMARY_COLUMN_NAME] = supply[PRIMARY_COLUMN_NAME];
            vm.supply.title = supply.title;
            vm.supply.code = supply.code;
            vm.supply.supplyTypeId = supply.supplyTypeId;
            vm.supply.supplyCategoryId = getSupplyTypeWhere(vm.supply.supplyTypeId).supplyCategoryId;
            vm.supply.deleted = supply.deleted;
        }

        function getSupplyTypeWhere(supplyTypeId) {
            var supplyTypeIndex = utilService.getIndex(vm.supplytypes, PRIMARY_COLUMN_NAME, supplyTypeId);
            return supplyTypeIndex > -1 ? vm.supplytypes[supplyTypeIndex] : undefined;
        }

        function deleteSupply(supply) {
            if (supply.title === "" || supply.supplyTypeId === "") {
                return;
            }

            commonApiService.confirmAndDelete(supply.title + " will be deleted", function () {
                var deletedSupplyIndex = utilService.getIndex(vm.supplies, PRIMARY_COLUMN_NAME, supply[PRIMARY_COLUMN_NAME]);
                if (deletedSupplyIndex > -1) {
                    vm.supplies[deletedSupplyIndex].deleted = true;
                    clearAll();
                    var supplyCategoryId = vm.selectedSupplyCategory ? vm.selectedSupplyCategory[PRIMARY_COLUMN_NAME] : undefined;
                    vm.supplyTypesBySupplyCategoryId = findSupplyTypesWhere(supplyCategoryId);
                    commonApiService.saveItems("SUPPLIES", vm.supplies);
                }
            });
        }

        function selectSupply(supply) {
            if (!supply) {
                vm.selectedSupply = undefined;
                return;
            }
            vm.selectedTabIndex = 1;
            vm.selectedSupply = supply;
            updateSupply(supply);
            var supplyTypeIndex = utilService.getIndex(vm.supplytypes, PRIMARY_COLUMN_NAME, supply.supplyTypeId);
            if (supplyTypeIndex > -1) {
                vm.selectedSupplyType = vm.supplytypes[supplyTypeIndex];
                updateSupplyType(vm.selectedSupplyType);
                vm.isNewSupplyType = false;
            }
        }
    }
})();
