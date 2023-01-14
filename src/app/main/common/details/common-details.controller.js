(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('CmmonDetailController', CmmonDetailController);

    /** @ngInject */
    function CmmonDetailController($rootScope, cmmonDetailService, $injector, emptyImageService, msbUtilService, msbCommonApiService, $scope, $mdSidenav, $state) {
        // debugger
        var vm = this;
        vm.toggleSidenav = toggleSidenav;
        vm.goToPage = goToPage;
        vm.isSelected = isSelected;
        vm.checkIfActive = checkIfActive;

        function isSelected(state, url) {
            if (!state || !url) return;
            var selected = cmmonDetailService.getSelected();

            if (selected.state === state && selected.url === url) {
                return true;
            }

            return false;
        }

        init();

        function init() {
            vm.stateName = $state.params.stateName;
            $rootScope.stateName = vm.stateName;
            vm.service = $state.params.service;
            vm.header = $state.params.header;
            vm.itemId = $state.params.id;
            vm.menuFunction = $state.params.menuFunction;
            vm.itemFunction = $state.params.itemFunction;
            getMenu();
            getItem();

        }

        function getMenu() {
            msbCommonApiService.interfaceManager(function (menus) {
                vm.leftNavPined = true;
                // vm.menuList = menus;
                vm.menuList = cmmonDetailService.makeMenuByCard($state.params, menus)
                cmmonDetailService.setMenuList(menus, vm.stateName);

                if (vm.menuList && vm.menuList.length) {
                    if ($state.current.name === vm.stateName) {
                        if (vm.menuList[0] && vm.menuList[0].type == 'family' && vm.menuList[0].members && vm.menuList[0].members.length > 0) {
                            goToPage(vm.menuList[0].members[0].state, vm.menuList[0].members[0].url);
                        }
                        else {
                            goToPage(vm.menuList[0].state, vm.menuList[0].url);
                        }

                    } else {
                        var splitedState = $state.current.name.split(".");


                        var sParams = [
                            { "key": "state", "value": splitedState[splitedState.length - 1] },
                            { "key": "url", "value": $state.params.url }
                        ];

                        var index = -1;

                        if ($state.params.url) {
                            index = msbUtilService.getIndexByValues(vm.menuList, sParams);
                        } else {
                            index = msbUtilService.getIndex(vm.menuList, "state", splitedState[splitedState.length - 1]);
                        }

                        if (index > -1) {
                            cmmonDetailService.updateSelected(vm.menuList[index].state, vm.menuList[index].url);
                        }
                    }
                }

            }, vm.service, vm.menuFunction);
        }

        function getItem() {
            if (vm.itemId === 'new-item') {
                vm.isNew = true
                vm.isReady = true;
                vm.keyValues = [];
                vm.headerTitle = $state.params.newTitle;
            } else {
                msbCommonApiService.interfaceManager(function (item) {
                    vm.item = item;
                    vm.isReady = true;
                    vm.keyValues = [];
                    fillHeaderValue();
                }, vm.service, vm.itemFunction, vm.itemId);
            }

        }

        function fillHeaderValue() {
            vm.headerTitle = $state.params.editTitle;
            var otherHeaders = [];
            for (var i = 0; i < vm.header.length; i++) {
                if (vm.header[i].id === "item") {
                    fillKeyValues(vm.header[i], vm.item);
                } else {
                    otherHeaders.push(vm.header[i]);
                }
            }

            getOtherHeaderItem(otherHeaders, 0);
        }

        function getOtherHeaderItem(otherHeaders, index) {
            if (index >= otherHeaders.length) {
                return;
            }

            var searchParams = [],
                def = otherHeaders[index],
                idRef = otherHeaders[index].idRef;

            var getParams = [
                { "key": "id", "value": idRef.from },
                { "key": "key", "value": idRef.key }
            ];

            var valIndex = msbUtilService.getIndexByValues(vm.keyValues, getParams);
            var pathParams = def.pathParams ? def.pathParams : [];

            msbCommonApiService.getItem(def.service, vm.keyValues[valIndex].value, null, function (data) {
                fillKeyValues(def, data);
                if (index < otherHeaders.length) {
                    index++;
                    getOtherHeaderItem(otherHeaders, index);
                }
            }, function (err) {
                if (index < otherHeaders.length) {
                    index++;
                    getOtherHeaderItem(otherHeaders, index);
                }
            }, null, def.task, def.path, pathParams);
        }

        function fillKeyValues(headerDef, item) {

            for (var i = 0; i < headerDef.info.length; i++) {
                var source = item;
                if (headerDef.info[i].path) {
                    if (!headerDef.info[i].params) {
                        headerDef.info[i].params = [];
                    }

                    source = msbUtilService.jsonManipulator(item, headerDef.info[i].params, headerDef.info[i].path);
                }

                var value = source[headerDef.info[i].key];

                var keyValue = {
                    "id": headerDef.id,
                    "key": headerDef.info[i].key,
                    "label": headerDef.info[i].label,
                    "value": value,
                    "show": headerDef.info[i].show,
                }

                if (value) {
                    vm.keyValues.push(keyValue);
                }
            }

        }


        function goToPage(s, url) {
            if (s && url) {
                cmmonDetailService.updateSelected(s, url);
                var state = vm.stateName + "." + s;
                $state.go(state, { "url": url }, { "location": "replace" });

            }
        }
        function checkIfActive(members) {
            if (!vm.activeState) {
                return 'display: none';
            }
            if (members) {
                var actObj = msbUtilService.getObjectByParams(members, 'state', vm.activeState);
                if (!actObj) {
                    return 'display: none';
                }
            }
            return 'display: none';
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
