(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('FormLayoutDirectiveController', FormLayoutDirectiveController);

    /** @ngInject */
    function FormLayoutDirectiveController($rootScope, $scope, utilService, commonApiService, $mdDialog, PRIMARY_COLUMN_NAME) {
        var vm = this;
        vm.preventDefault = preventDefault;

        vm.addNewRow = addNewRow;
        vm.removeRow = removeRow;
        vm.addNewColumn = addNewColumn;
        vm.addNewHeaderRow = addNewHeaderRow;
        vm.removeHeaderRow = removeHeaderRow;
        vm.addMenu = addMenu;
        vm.removeMenu = removeMenu;
        vm.selectMenu = selectMenu;
        vm.leftMenuRowFilter = leftMenuRowFilter;
        vm.flatMenuRowFilter = flatMenuRowFilter;
        vm.topMenuRowFilter = topMenuRowFilter;
        vm.leftTopMenuRowFilter = leftTopMenuRowFilter;
        vm.onLayoutTypeChange = onLayoutTypeChange;


        init();

        function onLayoutTypeChange() {
            vm.selectedTopMenu = null;
            vm.selectedLeftMenu = null;
            $scope.registerItem.detailTemplate.header = [];
            $scope.registerItem.detailTemplate.topMenus = [];
            $scope.registerItem.detailTemplate.leftMenus = [];
            $scope.registerItem.detailTemplate.rows = [];

            $rootScope.unSaveState = true;
        }

        function topMenuRowFilter(row) {
            if (!vm.selectedTopMenu) { return false };
            if (!row.leftMenuId && row.topMenuId === vm.selectedTopMenu[PRIMARY_COLUMN_NAME]) {
                return true;
            }
            return false;
        };

        function leftMenuRowFilter(row) {
            if (!vm.selectedLeftMenu) { return false };
            if (!row.topMenuId && row.leftMenuId === vm.selectedLeftMenu[PRIMARY_COLUMN_NAME]) {
                return true;
            }
            return false;
        };

        function flatMenuRowFilter(row) {
            if (!row.leftMenuId && !row.righttMenuId) {
                return true;
            }
            return false;
        };

        function leftTopMenuRowFilter(row) {
            if (!vm.selectedTopMenu || !vm.selectedLeftMenu) { return false };
            if (row.topMenuId === vm.selectedTopMenu[PRIMARY_COLUMN_NAME] && row.leftMenuId === vm.selectedLeftMenu[PRIMARY_COLUMN_NAME]) {
                return true;
            }
            return false;
        };


        function selectMenu(ev, menu, menuType) {
            if (!menuType) {
                menuType = $scope.registerItem.detailTemplate.layoutType;
            }

            if (menuType === 'left-menu') {
                if (!menu) {
                    menu = $scope.registerItem.detailTemplate.leftMenus[0];
                } else if (menu.topMenus && menu.topMenus.length) {
                    vm.selectedTopMenu = menu.topMenus[0];
                }

                vm.selectedLeftMenu = menu;

            } else if (menuType === 'top-menu') {
                if (!menu) {
                    menu = $scope.registerItem.detailTemplate.topMenus[0];
                }

                vm.selectedTopMenu = menu;
            } else if (menuType === 'left-top-menu') {

                if (!vm.selectedLeftMenu) {
                    vm.selectedLeftMenu = $scope.registerItem.detailTemplate.leftMenus[0];
                }

                if (!menu) {
                    var index = utilService.getIndex($scope.registerItem.detailTemplate.leftMenus, PRIMARY_COLUMN_NAME, vm.selectedLeftMenu[PRIMARY_COLUMN_NAME]);
                    menu = $scope.registerItem.detailTemplate.leftMenus[index].topMenus[0];
                }

                vm.selectedTopMenu = menu;
            }

        }

        function removeMenu(ev, menu, menuType) {
            commonApiService.confirmAndDelete(null, function () {
                $rootScope.unSaveState = true;
                if (menuType === 'left-menu') {
                    var index = utilService.getIndex($scope.registerItem.detailTemplate.leftMenus, PRIMARY_COLUMN_NAME, menu[PRIMARY_COLUMN_NAME]);
                    $scope.registerItem.detailTemplate.leftMenus.splice(index, 1);

                    if ($scope.registerItem.detailTemplate.leftMenus.length) {
                        vm.selectedLeftMenu = $scope.registerItem.detailTemplate.leftMenus[0];
                    } else {
                        vm.selectedLeftMenu = null;
                    }

                    if (vm.selectedLeftMenu && vm.selectedLeftMenu.topMenus && vm.selectedLeftMenu.topMenus.length) {
                        vm.selectedTopMenu = vm.selectedLeftMenu.topMenus[0];
                    } else {
                        vm.selectedTopMenu = null;
                    }

                } else if (menuType === 'top-menu') {
                    var index = utilService.getIndex($scope.registerItem.detailTemplate.topMenus, PRIMARY_COLUMN_NAME, menu[PRIMARY_COLUMN_NAME]);
                    $scope.registerItem.detailTemplate.topMenus.splice(index, 1);

                    if ($scope.registerItem.detailTemplate.topMenus.length) {
                        vm.selectedTopMenu = $scope.registerItem.detailTemplate.topMenus[0];
                    } else {
                        vm.selectedTopMenu = null;
                    }

                } else if (menuType === 'left-top-menu') {

                    if (!vm.selectedLeftMenu) {
                        return;
                    }

                    var lMenuIndex = utilService.getIndex($scope.registerItem.detailTemplate.leftMenus, PRIMARY_COLUMN_NAME, vm.selectedLeftMenu[PRIMARY_COLUMN_NAME]);


                    var index = utilService.getIndex($scope.registerItem.detailTemplate.leftMenus[lMenuIndex].topMenus, PRIMARY_COLUMN_NAME, menu[PRIMARY_COLUMN_NAME]);
                    $scope.registerItem.detailTemplate.leftMenus[lMenuIndex].topMenus.splice(index, 1);

                    if ($scope.registerItem.detailTemplate.leftMenus[lMenuIndex].topMenus.length) {
                        vm.selectedTopMenu = $scope.registerItem.detailTemplate.leftMenus[lMenuIndex].topMenus[0];
                    } else {
                        vm.selectedTopMenu = null;
                    }

                }
            });
        }


        function addMenu(ev, menu, menuType, hasTopMenu) {
            openMenuDialog(ev, menu, menuType, function (result) {

                if (!result) { return };

                $rootScope.unSaveState = true;

                var newMenu = {
                    title: result
                }

                newMenu[PRIMARY_COLUMN_NAME] = utilService.generateId();

                if (menuType === 'left-menu') {
                    if (!menu) {
                        if (hasTopMenu) {
                            newMenu.topMenus = [];
                        }

                        $scope.registerItem.detailTemplate.leftMenus.push(newMenu);
                        var index = utilService.getIndex($scope.registerItem.detailTemplate.leftMenus, PRIMARY_COLUMN_NAME, newMenu[PRIMARY_COLUMN_NAME]);
                        vm.selectedLeftMenu = $scope.registerItem.detailTemplate.leftMenus[index];
                    } else {
                        var index = utilService.getIndex($scope.registerItem.detailTemplate.leftMenus, PRIMARY_COLUMN_NAME, menu[PRIMARY_COLUMN_NAME]);
                        $scope.registerItem.detailTemplate.leftMenus[index].title = result;
                    }

                } else if (menuType === 'top-menu') {

                    if (!menu) {
                        $scope.registerItem.detailTemplate.topMenus.push(newMenu);
                        var index = utilService.getIndex($scope.registerItem.detailTemplate.topMenus, PRIMARY_COLUMN_NAME, newMenu[PRIMARY_COLUMN_NAME]);
                        vm.selectedTopMenu = $scope.registerItem.detailTemplate.topMenus[index];
                    } else {
                        var index = utilService.getIndex($scope.registerItem.detailTemplate.topMenus, PRIMARY_COLUMN_NAME, menu[PRIMARY_COLUMN_NAME]);
                        $scope.registerItem.detailTemplate.topMenus[index].title = result;
                    }

                } else if (menuType === 'left-top-menu') {
                    if (!vm.selectedLeftMenu) {
                        return;
                    }

                    var lMenuIndex = utilService.getIndex($scope.registerItem.detailTemplate.leftMenus, PRIMARY_COLUMN_NAME, vm.selectedLeftMenu[PRIMARY_COLUMN_NAME]);

                    if (!menu) {
                        $scope.registerItem.detailTemplate.leftMenus[lMenuIndex].topMenus.push(newMenu);
                        var index = utilService.getIndex($scope.registerItem.detailTemplate.leftMenus[lMenuIndex].topMenus, PRIMARY_COLUMN_NAME, newMenu[PRIMARY_COLUMN_NAME]);
                        vm.selectedTopMenu = $scope.registerItem.detailTemplate.leftMenus[lMenuIndex].topMenus[index];
                    } else {
                        var index = utilService.getIndex($scope.registerItem.detailTemplate.leftMenus[lMenuIndex].topMenus, PRIMARY_COLUMN_NAME, menu[PRIMARY_COLUMN_NAME]);
                        $scope.registerItem.detailTemplate.leftMenus[lMenuIndex].topMenus[index].title = result;
                    }

                }

            });
        }


        function openMenuDialog(ev, menu, menuType, callBack) {
            var initialValue = menu ? menu.title : '';
            var title = menu ? 'Update menu: ' + menu.title : 'Add new menu';
            var prompt = $mdDialog.prompt()
                .title(title)
                .textContent('Please provide the title of the menu.')
                .placeholder('Menu title')
                .ariaLabel('Menu title')
                .initialValue(initialValue)
                .targetEvent(ev)
                .ok('Ok')
                .cancel('Cancel');

            $mdDialog.show(prompt).then(function (result) {
                callBack(result);
            }, function () {

            });
        }

        function removeRow(item) {
            commonApiService.confirmAndDelete(null, function () {
                $rootScope.unSaveState = true;
                if ($scope.viewType === 'landing') {
                    var index = utilService.getIndex($scope.registerItem.landingTemplate.rows, PRIMARY_COLUMN_NAME, item[PRIMARY_COLUMN_NAME]);
                    if (index >= 0) {
                        $scope.registerItem.landingTemplate.rows.splice(index, 1);
                    }
                } else {
                    var index = utilService.getIndex($scope.registerItem.detailTemplate.rows, PRIMARY_COLUMN_NAME, item[PRIMARY_COLUMN_NAME]);
                    if (index >= 0) {
                        $scope.registerItem.detailTemplate.rows.splice(index, 1);
                    }

                }
            });
        }

        function removeHeaderRow(item) {
            commonApiService.confirmAndDelete(null, function () {
                $rootScope.unSaveState = true;
                var index = utilService.getIndex($scope.registerItem.detailTemplate.header, PRIMARY_COLUMN_NAME, item[PRIMARY_COLUMN_NAME]);
                if (index >= 0) {
                    $scope.registerItem.detailTemplate.header.splice(index, 1);
                }
            });
        }


        function addNewHeaderRow() {
            $rootScope.unSaveState = true;
            $scope.registerItem.detailTemplate.header.push(createNewRow());
        }

        function addNewRow() {
            $rootScope.unSaveState = true;
            if ($scope.viewType === 'landing') {
                $scope.registerItem.landingTemplate.rows.push(createNewRow());
            } else {
                if ($scope.registerItem.detailTemplate.layoutType === 'flat') {
                    $scope.registerItem.detailTemplate.rows.push(createNewRow());
                } else if ($scope.registerItem.detailTemplate.layoutType === 'left-menu') {
                    var row = createNewRow();
                    row.leftMenuId = vm.selectedLeftMenu[PRIMARY_COLUMN_NAME];
                    $scope.registerItem.detailTemplate.rows.push(row);

                } else if ($scope.registerItem.detailTemplate.layoutType === 'top-menu') {
                    var row = createNewRow();
                    row.topMenuId = vm.selectedTopMenu[PRIMARY_COLUMN_NAME];
                    $scope.registerItem.detailTemplate.rows.push(row);

                } else if ($scope.registerItem.detailTemplate.layoutType === 'left-top-menu') {
                    var row = createNewRow();
                    row.leftMenuId = vm.selectedLeftMenu[PRIMARY_COLUMN_NAME];
                    row.topMenuId = vm.selectedTopMenu[PRIMARY_COLUMN_NAME];
                    $scope.registerItem.detailTemplate.rows.push(row);
                }

            }
        }

        function createNewRow() {

            var row = {
                columns: [createNewColumn()]
            }
            row[PRIMARY_COLUMN_NAME] = utilService.generateId();

            return row;
        }

        function addNewColumn(row) {
            $rootScope.unSaveState = true;
            row.columns.push(createNewColumn());
        }

        function createNewColumn() {
            var vSegment = {
                type: 'text',
                dataSource: 'static',
                dataValue: 'New segment'
            };
            vSegment[PRIMARY_COLUMN_NAME] = utilService.generateId();

            var hSegment = {
                vSegments: [vSegment]
            }
            hSegment[PRIMARY_COLUMN_NAME] = utilService.generateId();

            var column = {
                hSegments: [hSegment]
            }
            column[PRIMARY_COLUMN_NAME] = utilService.generateId();

            return column;
        }




        function preventDefault(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        function init() {

            initSortableOptions();

            if (!$scope.registerItem.landingTemplate) {
                $scope.registerItem.landingTemplate = { rows: [] };
            }

            if (!$scope.registerItem.detailTemplate) {
                $scope.registerItem.detailTemplate = {
                    layoutType: 'flat',
                    leftMenus: [],
                    topMenus: [],
                    header: [],
                    rows: []
                };
            }

            selectMenu();
        }

        function initSortableOptions() {
            vm.sortableOptions = {
                handle: '.handle',
                forceFallback: true,
                ghostClass: 'todo-item-placeholder',
                fallbackClass: 'todo-item-ghost',
                fallbackOnBody: true,
                sort: true,
                onEnd: function (ev) {

                    if (ev.newIndex > ev.oldIndex) {
                        for (var i = ev.oldIndex; i < ev.newIndex; i++) {
                            updateIndex(i, i + 1);
                        }
                    } else {
                        for (var i = ev.oldIndex - 1; i >= ev.newIndex; i--) {
                            updateIndex(i + 1, i);
                        }
                    }

                    updateIndex(ev.newIndex, ev.oldIndex);
                }
            };

        }


        function updateIndex(newIndex, oldIndex) {
            // var newSl = vm.columns[newIndex][SERIAL_COLUMN_NAME];
            // var item = angular.copy(vm.columns[oldIndex]);              
            // item[SERIAL_COLUMN_NAME] = newSl;
            // var temp={};
            // commonApiService.saveItem(temp, item, false, "COLUMNDEF", "columns", false);  
        }


    }
})();