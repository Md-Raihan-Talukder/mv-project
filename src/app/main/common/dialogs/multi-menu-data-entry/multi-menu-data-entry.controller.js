(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('MultiMenuDataEntryDialogController', MultiMenuDataEntryDialogController);

    /** @ngInject */
    function MultiMenuDataEntryDialogController(multiMenuDialogService, msbUtilService, msbCommonApiService, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME, $mdDialog, $timeout,
        itemId, useDefault, serviceName, menuFungtion, directiveFunction, saveFunction, itemFunction, headerInfo, saveCallback, widthDef, heightDef, param) {
        var vm = this;
        vm.itemId = itemId;
        vm.headerInfo = headerInfo;
        vm.selectMenu = selectMenu;
        vm.param = param;
        vm.isViewMode = vm.headerInfo.isViewMode;

        vm.closeDialog = closeDialog;
        vm.onOk = OK;
        vm.onUpdate = onUpdate;

        init()

        function init() {
            vm.showMenu = true;
            if (widthDef) {
                vm.widthType = widthDef.type;
                vm.width = widthDef.width;
            }

            if (heightDef) {
                vm.height = heightDef.height;
                vm.heightType = heightDef.type;
            } else {
                vm.height = "600";
                vm.heightType = "px";
            }

            if (!vm.itemId) {
                vm.isNew = true;
            }


            loadHeaderInfo();

        }

        function loadMenuInfo() {
            var service = serviceName;
            var functionName = menuFungtion;

            if (useDefault && useDefault.menu) {
                service = "multiMenuDialogService";
                functionName = "getMenuList";
            }

            msbCommonApiService.interfaceManager(function (data) {
                vm.menus = data;
                if (vm.menus && vm.menus.length) {

                    vm.itemObject = {};
                    vm.itemObject[vm.menus[0].state] = vm.item;
                    selectMenu(vm.menus[0]);
                }
            }, service, functionName);
        }

        function loadHeaderInfo() {

            var service = serviceName;
            var functionName = itemFunction;

            if (useDefault && useDefault.item) {
                service = "multiMenuDialogService";
                functionName = "itemFunction";
            }

            msbCommonApiService.interfaceManager(function (data) {
                vm.item = data;

                vm.keyValues = [];
                if (vm.isNew) {
                    vm.headerTitle = vm.headerInfo.newTitle;
                } else {
                    vm.headerTitle = vm.isViewMode ? vm.headerInfo.viewTitle : vm.headerInfo.editTitle;
                    multiMenuDialogService.fillHeaderValue(vm.item, vm.headerInfo.header, vm.keyValues, function () {
                        // console.log('header info loaded', vm.keyValues);
                    });
                }

                loadMenuInfo();

            }, service, functionName, { id: vm.itemId, param: param });
        }


        function selectMenu(menu) {
            vm.selectedMenu = menu;
            vm.directiveInfo = null;

            if (!vm.itemObject[vm.selectedMenu.state]) {
                onUpdate(vm.item);
            }

            if (!vm.selectedMenu.noMerge) {
                var directiveCallback = vm.onUpdate;
            }

            var service = serviceName;
            var functionName = directiveFunction;

            if (useDefault && useDefault.directive) {
                service = "multiMenuDialogService";
                functionName = "directiveFunction";
            }

            var params = {
                menu: vm.selectedMenu,
                id: vm.itemId,
                menuItem: vm.itemObject[vm.selectedMenu.state],
                item: vm.item,
                param: param,
                onUpdate: directiveCallback,
            };

            $timeout(function () {
                msbCommonApiService.interfaceManager(function (data) {
                    vm.directiveInfo = data;
                }, service, functionName, params);
            }, 500);

            getMenuHeader();

        }

        function getMenuHeader() {
            if (vm.selectedMenu.header && vm.selectedMenu.header.type === 'service') {

                msbCommonApiService.interfaceManager(function (data) {
                    vm.menuheader = data;
                }, serviceName, vm.selectedMenu.header.functionName, { menu: vm.selectedMenu, id: vm.itemId, menuItem: vm.itemObject[vm.selectedMenu.state], item: vm.item, param: vm.param });
            } else {
                vm.menuheader = vm.selectedMenu.header;
            }
        }

        function onUpdate(item, paramItem) {

            if (paramItem) {
                param[paramItem.key] = paramItem.value;
            }

            vm.itemObject[vm.selectedMenu.state] = angular.copy(item);
        }

        function margeItem() {
            var oldItem = vm.itemObject[vm.menus[0].state];
            for (var i = 1; i < vm.menus.length; i++) {
                var newItem = vm.itemObject[vm.menus[i].state];
                if (newItem) {
                    // oldItem = angular.merge(oldItem, newItem);
                    oldItem = _.merge(oldItem, newItem);
                }
            }



            return oldItem;
        }

        function OK() {

            var service = serviceName;
            var functionName = saveFunction;

            if (useDefault && useDefault.save) {
                service = "multiMenuDialogService";
                functionName = "saveFunction";
            }

            msbCommonApiService.interfaceManager(function (data, purpose) {
                msbUtilService.showToast(
                    'Data saved successfully.',
                    'success-toast',
                    5000
                );

                vm.itemId = data[PRIMARY_COLUMN_NAME];
                vm.item = data;
                vm.isNew = false;

                selectMenu(vm.selectedMenu);
                if (saveCallback) {
                    saveCallback(data);
                }



            }, service, functionName, { item: margeItem(), isNew: vm.isNew, param: param });
        }

        function closeDialog() {
            $mdDialog.hide();
        }

    }

})();