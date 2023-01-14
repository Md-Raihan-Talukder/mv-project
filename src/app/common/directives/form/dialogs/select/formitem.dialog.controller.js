(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('FormItemDialogController', FormItemDialogController);

    /** @ngInject */
    function FormItemDialogController($mdDialog, msbCommonApiService, PRIMARY_COLUMN_NAME, msbUtilService,
        Column, DataSet, SelectID, SingleSelection, SlectType, Items, ListColumns, KeyProperty) {
        var vm = this;
        vm.column = Column;
        vm.dataSet = DataSet;
        vm.selectId = SelectID;
        vm.type = SlectType;


        vm.closeDialog = closeDialog;
        vm.OK = OK;
        vm.onItemClick = onItemClick;
        vm.getSelected = getSelected;
        vm.getImageColumn = getImageColumn;
        vm.keyProperty = KeyProperty ? KeyProperty : PRIMARY_COLUMN_NAME;

        init();

        function init() {
            if (vm.column) {
                vm.type = vm.column.title;
                vm.singleSelection = vm.column.type !== "multiSelect";
                vm.selectId = vm.column.selectId;
            } else {
                vm.singleSelection = SingleSelection;
            }

            if (vm.selectId) {
                loadSelects();
            } else {
                vm.items = [];
                vm.listColumns = ListColumns;
                for (var i = 0; i < Items.length; i++) {
                    var newItem = angular.copy(Items[i]);
                    newItem.selected = isSelected(newItem);
                    vm.items.push(newItem);
                }

            }

        }

        function getImageColumn() {
            var index = msbUtilService.getIndex(vm.listColumns, "type", "iconPicture");
            if (index > -1) {
                return vm.listColumns[index].key;
            }
        }

        function loadSelects() {
            msbCommonApiService.getItem("SELECT_DEF", vm.selectId, "selectId", function (value) {
                vm.select = value;
                vm.listColumns = vm.select.listColumns;
                loadItems();
            });
        }

        function onItemClick(item) {

            if (vm.singleSelection) {
                for (var i = 0; i < vm.items.length; i++) {
                    if (vm.items[i][vm.keyProperty] === item[vm.keyProperty]) {
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
            msbCommonApiService.getItems(vm.select.serviceKey, false, function (itemList) {
                for (var i = 0; i < itemList.length; i++) {
                    var newItem = angular.copy(itemList[i]);
                    if (newItem.basicInfo) {
                        newItem.poNo = newItem.basicInfo.poNo;
                        newItem.quantity = newItem.basicInfo.quantity;
                        newItem.itemDescription = newItem.basicInfo.itemDescription;
                        newItem.buyerName = "Reymond Murphy";
                        newItem.styleNo = "ST-ABC";

                    }
                    newItem.selected = isSelected(newItem);
                    vm.items.push(newItem);
                }
            });
        }

        function isSelected(newItem) {
            if (!vm.column) {
                return checkFromDataSet(newItem);
            }

            if (!vm.dataSet[vm.column.data]) {
                return;
            }

            if (vm.column.type === "multiSelect") {
                var index = vm.dataSet[vm.column.data].indexOf(newItem[vm.keyProperty]);
                return index > -1;
            } else {
                return vm.dataSet[vm.column.data] === newItem[vm.keyProperty];
            }
        }

        function checkFromDataSet(newItem) {

            if (!vm.dataSet) {
                return;
            }



            if (!vm.singleSelection) {
                // var index = msbUtilService.getIndex(vm.dataSet, vm.keyProperty, newItem[vm.keyProperty]);                             
                var index = vm.dataSet.indexOf(newItem[vm.keyProperty]);
                return index > -1;
            } else {
                return vm.dataSet === newItem[vm.keyProperty];
            }
        }


        function getSelected() {

            if (!vm.items) { vm.items = []; }

            var selecteds = $.grep(vm.items, function (item) {
                return item.selected;
            });

            if (!selecteds.length) {
                return;
            }

            if (vm.singleSelection) {
                return selecteds[0]
            }

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