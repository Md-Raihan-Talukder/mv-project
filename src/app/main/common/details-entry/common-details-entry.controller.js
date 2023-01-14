(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('CmmonDetailEntryController', CmmonDetailEntryController);

    /** @ngInject */
    function CmmonDetailEntryController(PRIMARY_COLUMN_NAME, $timeout, cmmonDetailEntryService, $window, cmmonDetailService, $injector, emptyImageService, msbUtilService, msbCommonApiService, $scope, $mdSidenav, $state) {
        var vm = this;

        vm.selectMenu = selectMenu;
        vm.onUpdate = onUpdate;
        vm.toggleSidenav = toggleSidenav;
        vm.onSave = onSave;

        function onSave() {
            var service = vm.serviceInfo.serviceName;
            var functionName = vm.serviceInfo.saveFunction;
            var useDefault = vm.serviceInfo.useDefault;

            if (useDefault && useDefault.item) {
                service = "cmmonDetailEntryService";
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


            }, service, functionName, { item: margeItem(), isNew: vm.isNew, param: vm.param });

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

        init();

        function init() {

            vm.itemId = $state.params.id;
            vm.headerInfo = $state.params.headerInfo;
            vm.param = $state.params.param;
            vm.serviceInfo = $state.params.serviceInfo;

            if (!vm.serviceInfo) {
                $window.history.back();
                return;
            }

            if (!vm.itemId) {
                vm.isNew = true;
            }

            loadHeaderInfo();

        }

        function loadHeaderInfo() {

            var service = vm.serviceInfo.serviceName;
            var functionName = vm.serviceInfo.itemFunction;
            var useDefault = vm.serviceInfo.useDefault;

            if (useDefault && useDefault.item) {
                service = "cmmonDetailEntryService";
                functionName = "itemFunction";
            }

            msbCommonApiService.interfaceManager(function (data) {
                vm.item = data;

                vm.keyValues = [];
                if (vm.isNew) {
                    vm.headerTitle = vm.headerInfo.newTitle;
                } else {
                    vm.headerTitle = vm.headerInfo.editTitle;
                    cmmonDetailEntryService.fillHeaderValue(vm.item, vm.headerInfo.header, vm.keyValues, function () {
                        // console.log('header info loaded', vm.keyValues);
                    });
                }

                loadMenuInfo();
                vm.isReady = true;

            }, service, functionName, { id: vm.itemId, param: vm.param });
        }

        function loadMenuInfo() {
            var service = vm.serviceInfo.serviceName;
            var functionName = vm.serviceInfo.menuFungtion;
            var useDefault = vm.serviceInfo.useDefault;

            if (useDefault && useDefault.item) {
                service = "cmmonDetailEntryService";
                functionName = "getMenuList";
            }

            msbCommonApiService.interfaceManager(function (data) {
                vm.leftNavPined = true;
                vm.menus = data;
                if (vm.menus && vm.menus.length) {

                    vm.itemObject = {};
                    vm.itemObject[vm.menus[0].state] = vm.item;
                    selectMenu(vm.menus[0]);
                }
            }, service, functionName);
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

            var service = vm.serviceInfo.serviceName;
            var functionName = vm.serviceInfo.directiveFunction;
            var useDefault = vm.serviceInfo.useDefault;

            if (useDefault && useDefault.item) {
                service = "cmmonDetailEntryService";
                functionName = "directiveFunction";
            }


            var params = {
                menu: vm.selectedMenu,
                id: vm.itemId,
                menuItem: vm.itemObject[vm.selectedMenu.state],
                item: vm.item,
                param: vm.param,
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
                }, vm.serviceInfo.serviceName, vm.selectedMenu.header.functionName, { menu: vm.selectedMenu, id: vm.itemId, menuItem: vm.itemObject[vm.selectedMenu.state], item: vm.item, param: vm.param });
            } else {
                vm.menuheader = vm.selectedMenu.header;
            }
        }

        function onUpdate(item, paramItem) {

            if (paramItem) {
                vm.param[paramItem.key] = paramItem.value;
            }

            vm.itemObject[vm.selectedMenu.state] = angular.copy(item);
        }

        function toggleSidenav(sidenavId) {

            if (sidenavId === "right-sidenav") {
                $mdSidenav(sidenavId).toggle();
                return;
            }

            if ($mdSidenav(sidenavId).isLockedOpen()) {
                vm.leftNavPined = false;
                $mdSidenav(sidenavId).close();
            } else {
                vm.leftNavPined = true;
                $mdSidenav(sidenavId).toggle();
            }
        }

    }

})();
