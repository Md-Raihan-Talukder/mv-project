(function () {
    'use strict';

    angular
        .module('app.landing')
        .controller('LandingController', LandingController);

    /** @ngInject */
    function LandingController($injector, $timeout, emptyImageService, msbUtilService, msbCommonApiService, $scope, $mdSidenav, $state, PRIMARY_COLUMN_NAME) {
        var vm = this;
        vm.primaryColumnName = PRIMARY_COLUMN_NAME;

        vm.toggleSidenav = toggleSidenav;
        vm.tabClick = onTabClick;
        vm.getComponentWidth = getComponentWidth;
        vm.getComponentFlex = getComponentFlex;
        vm.stripLoadComplete = stripLoadComplete;
        vm.setExternalFns = setExternalFns;
        vm.stripSelected = stripSelected;
        vm.addNewListItem = addNewListItem;
        vm.listItemClicked = listItemClicked;
        vm.listButtonClicked = listButtonClicked;
        vm.listLoadComplete = listLoadComplete;
        vm.selectSubMenu = selectSubMenu;
        vm.otherCreateButtonClick = otherCreateButtonClick;


        init();

        function init() {
            vm.menuId = $state.params.menuId;
            vm.taskId = $state.params.taskId ? $state.params.taskId : "clientUrl";
            loadPageDefinition();
        }

        function otherCreateButtonClick() {
            var addService = vm.mainListDef.otherCreateButton.serviceName,
                addFunction = vm.mainListDef.otherCreateButton.functionName;
            var params;

            callService(addService, addFunction, params, function (data) {
                if (data) {
                    updateReloadId(vm.mainListDef.id);
                }
            });
        }

        function selectSubMenu(menu) {
            vm.selectedMenu = menu;
            vm.selectedMenuId = menu.id;
            vm.listTitle = menu.listTitle;
            updateMenuParameter(menu);
        }

        function addNewListItem() {
            var addService = vm.mainListDef.addOption.serviceName,
                addFunction = vm.mainListDef.addOption.functionName;
            var params;
            if (vm.selectedMenu) {
                params = {
                    "menu": vm.selectedMenu
                };
            }

            callService(addService, addFunction, params, function (data) {
                if (data) {
                    updateReloadId(vm.mainListDef.id);
                }
            });
        }

        function updateReloadId(helperItems) {
            if (!vm.reloadIds) {
                vm.reloadIds = {};
            }

            vm.reloadIds[helperItems] = msbUtilService.generateNumericId();
        }

        function callService(serviceName, functionName, params, callBack) {
            msbCommonApiService.interfaceManager(function (data) {
                if (callBack) {
                    callBack(data);
                }
            }, serviceName, functionName, params);
        }

        function listButtonClicked(but, item, helperItems) {
            var params;
            if (vm.selectedMenu) {
                params = {
                    "menu": vm.selectedMenu,
                    "item": item
                };
            } else {
                params = item;
            }

            callService(but.service, but.function, params, function (data) {
                if (but.reloadListId && data) {
                    updateReloadId(but.reloadListId);
                }
            });
        }

        function listItemClicked(item, helperItems) {
            updateDependentParams(helperItems, item);
            updateDirectiveParams(item, helperItems);
        }

        function updateDirectiveParams(item, helperItems) {

            for (var i = 0; i < vm.pageDefinition.componentTabs.length; i++) {
                var tab = vm.pageDefinition.componentTabs[i];

                for (var j = 0; j < tab.components.length; j++) {

                    if (tab.components[j].type === 'directive') {
                        if (!vm.directiveInfo) {
                            vm.directiveInfo = {};
                        }

                        vm.directiveInfo[tab.components[j].directiveDef.id] = {};

                        var dirData = {};
                        for (var d = 0; d < tab.components[j].directiveDef.parameters.length; d++) {
                            dirData[tab.components[j].directiveDef.parameters[d].key] = tab.components[j].directiveDef.parameters[d].value;
                        }

                        dirData.helperItems = tab.components[j].directiveDef.helperItems;
                        dirData.onUpdate = onDirectiveUpdate;

                        var directiveInfo = {
                            "html": tab.components[j].directiveDef.html,
                            "data": dirData
                        };

                        vm.directiveInfo[tab.components[j].directiveDef.id].info = directiveInfo;

                    }
                }
            }

            if (!vm.directiveInfo) {
                return;
            }

            for (var key in vm.directiveInfo) {
                if (vm.directiveInfo.hasOwnProperty(key)) {
                    vm.directiveInfo[key].ready = false;
                }
            }

            $timeout(function () {

                if (vm.directiveInfo.hasOwnProperty(key)) {
                    vm.directiveInfo[key].ready = true;
                }

            }, 500);

        }

        function onDirectiveUpdate(helperItems, parentId) {
            if (parentId) {
                vm.mainListDef.selectedId = parentId;
                updateReloadId(vm.mainListDef.id);
            }
        }

        function stripSelected(strip, helperItems) {
            updateDependentParams(helperItems, strip);
        }

        function updateDependentParams(id, item) {
            item = angular.copy(item);
            if (!item.TD_IS_SELECTED) {
                item = {};
            }

            for (var i = 0; i < vm.pageDefinition.componentTabs.length; i++) {
                var tab = vm.pageDefinition.componentTabs[i];

                for (var j = 0; j < tab.components.length; j++) {
                    var defAttr = "stripDef";

                    if (tab.components[j].type === 'list') {
                        defAttr = "listDef";
                    }

                    if (tab.components[j].type === 'directive') {
                        defAttr = "directiveDef";
                    }

                    if (tab.components[j][defAttr] && tab.components[j][defAttr].dependsOn) {

                        var dependentId = msbUtilService.getIndex(tab.components[j][defAttr].dependsOn, "stripId", id);
                        if (dependentId > -1) {
                            var dependentParams = tab.components[j][defAttr].dependsOn[dependentId].keys;

                            for (var k = 0; k < dependentParams.length; k++) {

                                var index = msbUtilService.getIndex(tab.components[j][defAttr].parameters, "key", dependentParams[k].key);
                                var newParam = { "key": dependentParams[k].key, "value": item ? item[dependentParams[k].value] : null };
                                if (index > -1) {
                                    tab.components[j][defAttr].parameters.splice(index, 1, newParam);
                                }

                            }
                        }

                    }

                }
            }

        }

        function listLoadComplete(items, helperItems) {
            if (!vm.strips) {
                vm.strips = {};
            }

            vm.strips[helperItems] = items;

        }

        function stripLoadComplete(stripCode, strips, helperItems, allStrips) {
            if (!vm.strips) {
                vm.strips = {};
            }

            // if(!vm.allStrips){
            //     vm.allStrips = {};                
            // }        

            // var validStrips  = $.grep(allStrips, function (st) {
            //     return !st["TD_IS_DELETED"];
            // });

            vm.strips[helperItems] = strips;
            if (vm.strips[helperItems] && vm.strips[helperItems].length) {
                stripSelected(vm.strips[helperItems][0], helperItems)
            }

        }

        function setExternalFns(addFn, helperItems) {
            var strip = getStripById(helperItems);
            if (strip && strip.addButton) {
                if (!vm.addNewStripFunctions) {
                    vm.addNewStripFunctions = {};
                }

                vm.addNewStripFunctions[helperItems] = addFn;
            }
        }


        function getStripById(id) {
            if (vm.pageDefinition.mainList.type === 'strip') {
                if (vm.pageDefinition.mainList.stripDef.id === id) {
                    return vm.pageDefinition.mainList.stripDef;
                }
            }

            for (var i = 0; i < vm.pageDefinition.componentTabs.length; i++) {
                var tab = vm.pageDefinition.componentTabs[i];
                for (var j = 0; j < tab.components.length; j++) {
                    if (tab.components[j].stripDef && tab.components[j].stripDef.id === id) {
                        return tab.components[j].stripDef;
                    }
                }
            }

        }

        function updateMenuParameter(menu) {
            if (vm.pageDefinition.mainList.type === 'list') {
                if (!vm.mainListDef.parameters) {
                    vm.mainListDef.parameters = [{ "key": menu.key, "value": menu.value }];
                } else {
                    vm.mainListDef.parameters[0].value = menu.value;
                }

            } else if (vm.pageDefinition.mainList.type === 'strip') {

            }
        }

        function loadPageDefinition() {
            msbCommonApiService.getItem("LANDING_PAGE_DEFINITION", vm.menuId, "menuId", function (data) {
                vm.pageDefinition = data;
                vm.leftNavPined = true;
                vm.leftSlider = vm.pageDefinition.leftSlider;
                if (vm.leftSlider) {
                    vm.subMenus = vm.pageDefinition.leftSlider.menus;
                }

                vm.selectedTab = vm.pageDefinition.componentTabs[0].title;

                selectTab(vm.pageDefinition.componentTabs[0]);
                vm.componentsWidth = vm.pageDefinition.componentsWidth ? vm.pageDefinition.componentsWidth * 1 : 1000;
                vm.listMinWidth = vm.pageDefinition.mainList.minWidth;

                if (vm.pageDefinition.mainList.type === 'list') {
                    vm.mainListDef = vm.pageDefinition.mainList.listDef;
                    var listDef = vm.pageDefinition.mainList.listDef;
                    vm.listMinWidth = listDef.minWidth ? listDef.minWidth : "600px";

                } else if (vm.pageDefinition.mainList.type === 'strip') {
                    vm.mainListStripDef = vm.pageDefinition.mainList.stripDef;
                }

                vm.pageTitle = vm.pageDefinition.pageTitle;
                vm.listTitle = vm.mainListDef ? vm.mainListDef.listTitle : vm.mainListStripDef.listTitle;

                if (vm.subMenus && vm.subMenus.length) {
                    selectSubMenu(vm.subMenus[0]);
                }

                vm.isReady = true;

            }, null, null, vm.taskId);
        }

        function selectTab(newTab) {
            vm.components = newTab.components;
        }

        function onTabClick(newTab) {
            if (newTab.title === vm.selectedTab) { return; }
            vm.components = newTab.components;

            selectTab(newTab);
        }

        function getComponentWidth(component, index) {

            if (component.width) {
                return "w-" + component.width;
            } else if (!component.flex) {
                return "w-440";
            }

        }

        function getComponentFlex(component, index) {
            if (!component.flex) {
                return component.flex;
            }

            return "none"
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
