(function () {
    'use strict';

    angular
        .module('app.common')
        .directive('msbInlineSelect', msbInlineSelectDirective)
        .controller('msbInlineSelectController', msbInlineSelectController);

    /** @ngInject */
    function msbInlineSelectDirective() {
        return {
            restrict: 'E',
            scope: {
                stripDef: '=?',
                items: '=?',
                selectedIds: '=?',
                singleSelection: '=',
                selectId: '=',
                serviceInfo: '=',
                listColumns: '=?',
                valueProperty: '=',
                keyProperty: '=',
                helperItems: '=',
                mode: '=',
                onSelect: '&'
            },
            controller: "msbInlineSelectController",
            templateUrl: 'app/common/directives/inline-select/inline-select.html',
            controllerAs: 'vm'

        };
    }

    /** @ngInject */
    function msbInlineSelectController($scope, msbCommonApiService, PRIMARY_COLUMN_NAME, msbUtilService) {
        var vm = this;


        vm.onItemClick = onItemClick;
        vm.getImageColumn = getImageColumn;
        vm.stripSelected = stripSelected;

        function stripSelected(strip, helperItems, selectedIds) {
            if ($scope.mode === 'view') {
                return;
            }

            if ($scope.onSelect) {
                $scope.onSelect({ items: selectedIds, helperItems: $scope.helperItems });
            }
        }


        init();

        function init() {

            vm.items = [];
            vm.singleSelection = $scope.singleSelection;
            setSelected();

            if ($scope.stripDef) {
                setWatches();
                vm.ready = true;
            } else {
                vm.listColumns = $scope.listColumns ? $scope.listColumns : [];
                vm.keyProperty = $scope.keyProperty ? $scope.keyProperty : PRIMARY_COLUMN_NAME;

                if ($scope.valueProperty) {
                    vm.listColumns = [{ "key": $scope.valueProperty }];
                }


                if ($scope.selectId) {
                    loadSelects($scope.selectId);
                } else if ($scope.items) {
                    for (var i = 0; i < $scope.items.length; i++) {
                        var newItem = angular.copy($scope.items[i]);
                        newItem.selected = isSelected(newItem);
                        vm.items.push(newItem);
                    }

                } else if ($scope.serviceInfo) {
                    loadItems($scope.serviceInfo.serviceKey, $scope.serviceInfo.taskKey, $scope.serviceInfo.params);
                }
            }

        }

        function setWatches() {

            $scope.$watch("selectedIds", function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    setSelected();
                }
            }, true);
        }

        function setSelected() {
            vm.selectedIds = $scope.selectedIds;

            if (!vm.selectedIds) {
                if (!vm.singleSelection) {
                    vm.selectedIds = [];
                } else {
                    vm.selectedIds = {};
                }
            }
        }

        function getImageColumn() {
            var index = msbUtilService.getIndex(vm.listColumns, "type", "iconPicture");
            if (index > -1) {
                return vm.listColumns[index].key;
            }
        }

        function loadSelects(selectId) {
            msbCommonApiService.getItem("SELECT_DEF", selectId, "selectId", function (value) {
                vm.select = value;
                vm.listColumns = vm.select.listColumns;
                loadItems(vm.select.serviceKey, vm.select.taskKey, vm.select.serviceKey.params);
            });
        }

        function onItemClick(item) {

            if ($scope.mode === 'view') {
                return;
            }

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

            if ($scope.onSelect) {
                $scope.onSelect({ items: getSelected(), helperItems: $scope.helperItems });
            }

        }

        function loadItems(serviceKey, taskKey, params) {
            vm.items = [];

            if (!serviceKey) {
                return;
            }

            msbCommonApiService.getItems(serviceKey, params, function (itemList) {
                for (var i = 0; i < itemList.length; i++) {
                    var newItem = angular.copy(itemList[i]);
                    newItem.selected = isSelected(newItem);
                    vm.items.push(newItem);
                }
            }, null, false, null, taskKey);
        }

        function isSelected(newItem) {
            if (!vm.singleSelection) {
                var index = vm.selectedIds.indexOf(newItem[vm.keyProperty]);
                return index > -1;
            } else {
                return vm.selectedIds === newItem[vm.keyProperty];
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
                return selecteds[0][vm.keyProperty];
            }

            var selectedIds = [];

            for (var i = 0; i < selecteds.length; i++) {
                selectedIds.push(selecteds[i][vm.keyProperty]);
            }

            return selectedIds;
        }


    }

})();