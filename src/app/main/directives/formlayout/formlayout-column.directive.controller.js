(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('FormLayoutColumnDirectiveController', FormLayoutColumnDirectiveController);

    /** @ngInject */
    function FormLayoutColumnDirectiveController($rootScope, $scope, utilService, commonApiService, $mdDialog, PRIMARY_COLUMN_NAME) {
        var vm = this;
        vm.preventDefault = preventDefault;
        vm.addNewHSegment = addNewHSegment;
        vm.addNewVSegment = addNewVSegment;
        vm.removeHSegment = removeHSegment;
        vm.removeVSegment = removeVSegment;
        vm.removeColumn = removeColumn;
        vm.editSegment = editSegment;

        init();

        function preventDefault(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        function init() {

        }

        function editSegment(ev, vSegment, hSegment) {
            $mdDialog.show({
                controller: "FormLayoutColumnDialogController",
                controllerAs: 'vm',
                locals: {
                    VSegment: vSegment,
                    HSegment: hSegment,
                    Columns: $scope.registerColumns
                },
                templateUrl: 'app/main/directives/formlayout/formlayout-column.dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            })
                .then(function (answer) {
                    if (answer) {
                        $rootScope.unSaveState = true;
                        var index = utilService.getIndex($scope.columnData.hSegments, PRIMARY_COLUMN_NAME, answer.hSegment[PRIMARY_COLUMN_NAME]);
                        if (index >= 0) {
                            var vIndex = utilService.getIndex($scope.columnData.hSegments[index].vSegments, PRIMARY_COLUMN_NAME, answer.vSegment[PRIMARY_COLUMN_NAME]);
                            if (vIndex >= 0) {
                                $scope.columnData.hSegments[index].vSegments[vIndex] = angular.copy(answer.vSegment);
                            }
                        }
                    }
                }, function () {
                    //$scope.status = 'You cancelled the dialog.';
                });

        }

        function removeColumn(ev, item) {
            commonApiService.confirmAndDelete(null, function () {
                $rootScope.unSaveState = true;
                var index = utilService.getIndex($scope.rowData.columns, PRIMARY_COLUMN_NAME, item[PRIMARY_COLUMN_NAME]);
                $scope.rowData.columns.splice(index, 1);
            });

        }

        function removeVSegment(ev, vSegment, hSegment) {
            commonApiService.confirmAndDelete(null, function () {
                $rootScope.unSaveState = true;
                var vIndex = utilService.getIndex(hSegment.vSegments, PRIMARY_COLUMN_NAME, vSegment[PRIMARY_COLUMN_NAME]);
                hSegment.vSegments.splice(vIndex, 1);
            });

        }

        function removeHSegment(ev, hSegment) {
            commonApiService.confirmAndDelete(null, function () {
                $rootScope.unSaveState = true;
                var index = utilService.getIndex($scope.columnData.hSegments, PRIMARY_COLUMN_NAME, hSegment[PRIMARY_COLUMN_NAME]);
                $scope.columnData.hSegments.splice(index, 1);
            });

        }


        function addNewVSegment(hSegment) {
            $rootScope.unSaveState = true;
            hSegment.vSegments.push(createVSegment());
        }

        function createVSegment() {
            var vSegment = {
                type: 'text',
                dataSource: 'static',
                dataValue: 'New segment'
            };
            vSegment[PRIMARY_COLUMN_NAME] = utilService.generateId();

            return vSegment;
        }

        function addNewHSegment(col) {
            $rootScope.unSaveState = true;
            col.hSegments.push(createHSegment());
        }

        function createHSegment() {
            var hSegment = {
                vSegments: [createVSegment()]
            };
            hSegment[PRIMARY_COLUMN_NAME] = utilService.generateId();
            return hSegment;

        }



    }
})();