(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('tdFormItemDialogController', tdFormItemDialogController);

    /** @ngInject */
    function tdFormItemDialogController($mdDialog, commonApiService, PRIMARY_COLUMN_NAME, utilService, Column, DataSet) {
        var vm = this;
        vm.column = Column;
        vm.dataSet = DataSet;
        vm.singleSelection = vm.column.type !== "multiSelect";

        vm.closeDialog = closeDialog;
        vm.OK = OK;
        vm.onItemClick = onItemClick;
        vm.getSelected = getSelected;
        vm.getImageColumn = getImageColumn;

        init()


        function init() {
            loadSelects();
        }

        function getImageColumn() {
            var index = utilService.getIndex(vm.select.listColumns, "type", "iconPicture");
            if (index > -1) {
                return vm.select.listColumns[index].key;
            }
        }

        function loadSelects() {
            commonApiService.getItems(vm, "SELECT_DEF", "selects", false, function () {
                for (var i = 0; i < vm.selects.length; i++) {
                    if (vm.column.selectId === vm.selects[i].selectId) {
                        vm.select = vm.selects[i];
                        loadItems();
                        break;
                    }
                }
            });
        }

        function onItemClick(item) {

            if (vm.singleSelection) {
                for (var i = 0; i < vm.items.length; i++) {
                    if (vm.items[i][PRIMARY_COLUMN_NAME] === item[PRIMARY_COLUMN_NAME]) {
                        vm.items[i].selected = !item.selected;
                    } else {
                        vm.items[i].selected = false;
                    }
                }
            } else {
                item.selected = !item.selected;
            }
        }

        function loadItems() {
            if (!vm.select) {
                return;
            }
            vm.items = [];
            commonApiService.getItems(vm, vm.select.serviceKey, "itemList", false, function () {
                for (var i = 0; i < vm.itemList.length; i++) {
                    var newItem = angular.copy(vm.itemList[i]);
                    newItem.selected = isSelected(newItem);
                    vm.items.push(newItem);
                }
            });
        }

        function isSelected(newItem) {
            if (!vm.dataSet[vm.column.data]) {
                return;
            }

            if (vm.column.type === "multiSelect") {
                var index = vm.dataSet[vm.column.data].indexOf(newItem[PRIMARY_COLUMN_NAME]);
                return index > -1;
            } else {
                return vm.dataSet[vm.column.data] === newItem[PRIMARY_COLUMN_NAME];
            }
        }

        function getSelected() {

            if (!vm.items) { vm.items = []; }

            var selecteds = $.grep(vm.items, function (item) {
                return item.selected;
            });

            return selecteds;
        }

        function OK() {
            $mdDialog.hide({ items: getSelected() });
        }

        function closeDialog() {
            $mdDialog.hide();
        }


    }

})();