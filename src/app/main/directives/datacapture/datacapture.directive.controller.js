(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('DataCaptureController', DataCaptureController);

    /** @ngInject */
    function DataCaptureController($scope, utilService, CONSTANT_DATE_TIME_FORMATS, commonApiService,
        PRIMARY_COLUMN_NAME, dataCaptureService) {
        var vm = this;
        vm.primaryColumnName = PRIMARY_COLUMN_NAME;

        vm.backToRegister = backToRegister;
        vm.saveItem = saveItem;
        vm.deleteItem = deleteItem;
        vm.innerItems = [];
        vm.topMenus = [];
        vm.selectMenu = selectMenu;
        vm.addInnerItem = addInnerItem;

        init();

        function addInnerItem(innerItem, isNew) {
            var index = getInnerItemIndex(innerItem[PRIMARY_COLUMN_NAME]);
            if (index >= 0) {
                vm.innerItems[index] = { item: innerItem, isNew: isNew };
            } else {
                vm.innerItems.push({ item: innerItem, isNew: isNew })
            }
        }

        function getInnerItemIndex(itemId) {
            for (var i = 0; i < vm.innerItems.length; i++) {
                if (vm.innerItems[i].item[PRIMARY_COLUMN_NAME] === itemId) {
                    return i;
                }
            }
        }

        function selectMenu(ev, menu, menuType) {
            if (vm.innerItems.length) {
                commonApiService.confirmAndDelete('You have unsaved data. Data will be lost.', function (argument) {
                    vm.innerItems = [];
                    updateMenuSelection(ev, menu, menuType);
                });
            } else {
                updateMenuSelection(ev, menu, menuType);
            }
        }

        function updateMenuSelection(ev, menu, menuType) {

            if (!menuType) {
                menuType = $scope.template.layoutType;
            }

            if (menuType === 'left-menu') {
                if (!menu) {
                    menu = $scope.template.leftMenus[0];
                } else if (menu.topMenus && menu.topMenus.length) {
                    vm.selectedTopMenu = menu.topMenus[0];
                }

                vm.selectedLeftMenu = menu;

            } else if (menuType === 'top-menu') {
                if (!menu) {
                    menu = $scope.template.topMenus[0];
                }

                vm.selectedTopMenu = menu;
            } else if (menuType === 'left-top-menu') {

                if (!vm.selectedLeftMenu) {
                    vm.selectedLeftMenu = $scope.template.leftMenus[0];
                }

                if (!menu) {
                    var index = utilService.getIndex($scope.template.leftMenus, PRIMARY_COLUMN_NAME, vm.selectedLeftMenu[PRIMARY_COLUMN_NAME]);
                    menu = $scope.template.leftMenus[index].topMenus[0];
                }

                vm.selectedTopMenu = menu;
            }

            setTopMenu();
            setColumnToVSegment();

        }

        function backToRegister(item) {
            $scope.onBack();
        }

        function saveItem() {
            convertToNumeric();
            $scope.onSave({
                item: vm.item, isNew: vm.isNew, innerItems: vm.innerItems, callBack: function () {
                    vm.innerItems = [];
                }
            });
        }

        function convertToNumeric() {
            for (var i = 0; i < vm.columns.length; i++) {
                if (vm.columns[i].type === 'numeric' && !vm.columns[i].formula) {
                    var val = parseFloat(vm.item[vm.columns[i].data], 10);
                    if (val) {
                        vm.item[vm.columns[i].data] = val;
                    }
                }
            }
        }


        function deleteItem(ev) {
            $scope.onDelete({ item: vm.item });
        }


        function init() {
            vm.selectedTopMenu = null;
            vm.selectedLeftMenu = null;

            vm.item = $scope.item;
            vm.columns = $scope.columns;
            vm.template = $scope.template;
            selectMenu();
            setColumnToVSegment();
            initColumns();
        }

        function setTopMenu() {
            vm.topMenus = [];
            var menuType = $scope.template.layoutType;
            if (menuType === 'top-menu') {
                vm.topMenus = $scope.template.topMenus;
            } else if (menuType === 'left-top-menu') {
                if (vm.selectedLeftMenu) {
                    var index = utilService.getIndex($scope.template.leftMenus, PRIMARY_COLUMN_NAME, vm.selectedLeftMenu[PRIMARY_COLUMN_NAME]);
                    vm.topMenus = $scope.template.leftMenus[index].topMenus;
                }
            }
        }

        function filterRows() {
            var menuType = $scope.template.layoutType;
            vm.rows = vm.template.rows;

            if (menuType === 'left-menu') {
                vm.rows = $.grep(vm.template.rows, function (row) {
                    if (!row.topMenuId && row.leftMenuId === vm.selectedLeftMenu[PRIMARY_COLUMN_NAME]) {
                        return true;
                    }
                });

            } else if (menuType === 'top-menu') {
                vm.rows = $.grep(vm.template.rows, function (row) {
                    if (!row.leftMenuId && row.topMenuId === vm.selectedTopMenu[PRIMARY_COLUMN_NAME]) {
                        return true;
                    }
                });
            } else if (menuType === 'left-top-menu') {
                vm.rows = $.grep(vm.template.rows, function (row) {
                    if (row.topMenuId === vm.selectedTopMenu.id && row.leftMenuId === vm.selectedLeftMenu[PRIMARY_COLUMN_NAME]) {
                        return true;
                    }
                });
            }
        }

        function setColumnToVSegment() {
            filterRows();
            dataCaptureService.setColumnToVSegment(vm.rows, vm.columns);
            vm.showTemplate = true;
        }

        function initColumns() {
            dataCaptureService.initItem(vm.item, vm.columns);
        }

    }
})();