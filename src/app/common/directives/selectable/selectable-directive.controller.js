(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('MsbSelectableController', MsbSelectableController);

    /** @ngInject */
    function MsbSelectableController($scope, msbUtilService, $mdDialog, $document) {
        var vm = this;
        vm.selectItem = selectItem;
        vm.getImageColumn = getImageColumn;



        init();

        function init() {

            vm.keyProperty = $scope.info.keyProperty;
            vm.valueProperty = $scope.info.valueProperty;

            if ($scope.info.listColumns) {
                vm.listColumns = $scope.info.listColumns;
            } else {
                vm.listColumns = [{ "key": vm.valueProperty }]
            }

            loadItems();

        }

        function loadItems() {
            vm.items = [];
            for (var i = 0; i < $scope.info.selectItems.length; i++) {
                if (!$scope.singleSelection) {
                    var index = !$scope.selectedItems ? -1 : $scope.selectedItems.indexOf($scope.info.selectItems[i][vm.keyProperty]);
                    if (index > -1) {
                        vm.items.push($scope.info.selectItems[i])
                    }
                } else {
                    if ($scope.selectedItems && $scope.selectedItems === $scope.info.selectItems[i][vm.keyProperty]) {
                        vm.items.push($scope.info.selectItems[i])
                    }
                }

            }
        }

        function getImageColumn() {
            if (!vm.select) {
                return;
            }
            var index = msbUtilService.getIndex(vm.select.listColumns, "type", "iconPicture");
            if (index > -1) {
                return vm.select.listColumns[index].key;
            }
        }

        function selectItem() {

            if ($scope.itemMode !== 'create') {
                return;
            }

            $mdDialog.show({
                controller: 'FormItemDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/common/directives/form/dialogs/select/form-item-dialog.html',
                parent: angular.element($document.body),
                clickOutsideToClose: false,
                preserveScope: true,
                multiple: true,
                skipHide: true,
                locals: {
                    Column: null,
                    DataSet: $scope.selectedItems,
                    SelectID: null,
                    SingleSelection: $scope.singleSelection,
                    SlectType: $scope.slectType,
                    Items: $scope.info.selectItems,
                    ListColumns: vm.listColumns,
                    KeyProperty: vm.keyProperty
                }
            }).then(function (answer) {
                if (!answer) {
                    return;
                }

                if (!$scope.singleSelection) {
                    $scope.selectedItems = [];
                    if (answer.items && answer.items.length) {
                        for (var i = 0; i < answer.items.length; i++) {
                            $scope.selectedItems.push(answer.items[i][vm.keyProperty]);
                        }
                    }
                } else {
                    if (answer.items) {
                        $scope.selectedItems = angular.copy(answer.items[vm.keyProperty]);
                    }
                }

                loadItems();
                $scope.onSelect({ info: { selectedItems: $scope.selectedItems, helperItems: $scope.helperItems } });
            });
        }

    }
})();