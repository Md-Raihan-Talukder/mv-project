(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('MsbGridController', MsbGridController);

    /** @ngInject */
    function MsbGridController(msbCommonApiService, $interval, $scope, msbUtilService,
        uiGridConstants, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME) {
        var vm = this;


        init();

        function init() {
            vm.gridId = "grid-" + msbUtilService.generateNumericId();
            vm.data = [];
            // console.log(uiGridConstants.DESC);
            loadColumnDefs();
        }

        function loadColumnDefs() {
            if (!$scope.gridDefId) {
                if (!$scope.columnDefs || !$scope.columnDefs.length) {
                    return;
                }
                return;
            }
            msbCommonApiService.getItem("DATA_GRID_DEF", $scope.gridDefId, "gridDefId", function (value) {
                $scope.columnDefs = value.columns;
                if ($scope.columnDefs && $scope.columnDefs.length) {
                    createColumnDefs();
                    loadData();
                    initGridOptions();
                    vm.gridDef = true;
                } else {
                    console.log('Grid definition not found!');
                }
            });
        }

        function createColumnDefs() {
            var columnDefs = [];

            for (var i = 0; i < $scope.columnDefs.length; i++) {
                var colDef = $scope.columnDefs[i],
                    gridColDef = {};

                gridColDef.name = colDef.data;
                if (colDef.width) {
                    gridColDef.width = colDef.width * 1;
                }


                if (colDef.type === 'trueFalse') {
                    gridColDef.cellTemplate = '<md-checkbox disabled name="checkbox" style="margin:3px 10px 0px 10px; padding: 0;"  aria-label="checkbox" ng-model="row.entity.isActive"></md-checkbox>';
                }

                gridColDef.enableColumnMenu = colDef.enableColumnMenu ? true : false;
                gridColDef.enableFiltering = colDef.enableFiltering ? true : false;
                gridColDef.pinnedLeft = colDef.pinnedLeft ? true : false;
                gridColDef.pinnedRight = colDef.pinnedRight ? true : false;

                columnDefs.push(gridColDef);
            }

            if ($scope.enableEdit) {
                columnDefs.push({
                    name: 'Edit', width: 60, pinnedRight: true, enableFiltering: false, enableColumnMenu: false,
                    cellTemplate: '<md-icon md-font-icon="icon-pencil" aria-label="Close dialog" class="ml-5 p-5 cursor-pointer" ng-click="grid.appScope.editMe(row, $event)"></md-icon>'
                });
            }

            if ($scope.enableDelete) {
                columnDefs.push({
                    name: 'Delete', width: 65, pinnedRight: true, enableFiltering: false, enableColumnMenu: false,
                    cellTemplate: '<md-icon md-font-icon="icon-trash" aria-label="Close dialog" class="ml-5 p-5 cursor-pointer" ng-click="grid.appScope.deleteMe(row, $event)"></md-icon>'
                });
            }

            return columnDefs;
        }


        function loadData() {
            if (!$scope.gridData) {
                $scope.gridData = [];
            }

            for (var i = 0; i < $scope.gridData.length; i++) {
                vm.data.push(createDataDef($scope.gridData[i]));
            }
        }

        $scope.addCallback = function (data) {
            vm.data.push(createDataDef(data));
        }

        $scope.editCallback = function (data) {
            var index = msbUtilService.getIndex(vm.data, PRIMARY_COLUMN_NAME, data[PRIMARY_COLUMN_NAME]);
            if (index > -1) {
                vm.data[index] = angular.copy(data);
            }
        }

        $scope.deleteCallback = function (data) {
            var index = msbUtilService.getIndex(vm.data, PRIMARY_COLUMN_NAME, data[PRIMARY_COLUMN_NAME]);
            if (index > -1) {
                vm.data.splice(index, 1);
            }
        }

        $scope.selectCallback = function (data) {

        }

        function createDataDef(data) {
            var gridData = {};
            for (var i = 0; i < $scope.columnDefs.length; i++) {
                gridData[$scope.columnDefs[i].data] = data[$scope.columnDefs[i].data];
            }
            gridData[PRIMARY_COLUMN_NAME] = data[PRIMARY_COLUMN_NAME];
            gridData[SERIAL_COLUMN_NAME] = data[SERIAL_COLUMN_NAME];

            return gridData;
        }

        function initGridOptions() {
            vm.gridOptions = {
                data: vm.data,
                enableGridMenu: $scope.enableGridMenu ? true : false,
                exporterMenuPdf: false,
                rowHeight: $scope.rowHeight,
                showColumnFooter: $scope.showColumnFooter ? true : false,
                enablePinning: $scope.enablePinning ? true : false,
                enableSorting: $scope.enableSorting ? true : false,
                enableColumnMenus: $scope.enableColumnMenus ? true : false,
                enableFiltering: true,
                enableRowHeaderSelection: $scope.enableRowHeaderSelection ? true : false,
                enableFullRowSelection: $scope.enableFullRowSelection ? true : false,
                enableRowSelection: $scope.enableRowSelection ? true : false,
                multiSelect: $scope.multiSelect ? true : false,
                showGridFooter: $scope.showGridFooter ? true : false,
                enableColumnResizing: true,
                columnDefs: createColumnDefs(),
                onRegisterApi: function (gridApi) {
                    vm.gridApi = gridApi;
                    $scope.gridApi = gridApi;
                }
            };

            selectForm(0);
        }


        $scope.editMe = function (row) {

            var data = row.entity;
            var index = msbUtilService.getIndex($scope.gridData, PRIMARY_COLUMN_NAME, data[PRIMARY_COLUMN_NAME]);
            if (index > -1) {
                var gridItem = $scope.gridData[index];
                $scope.onEditClick({ helperItems: $scope.helperItems, gridItem: angular.copy(gridItem), callBack: $scope.editCallback });
            }
        };

        $scope.deleteMe = function (row) {
            $scope.onDeleteClick({ helperItems: $scope.helperItems, gridItem: angular.copy(row.entity), callBack: $scope.deleteCallback });
        };

        function selectForm(index) {
            if (!vm.data.length) {
                return;
            }

            $interval(function () { vm.gridApi.selection.selectRow(vm.gridOptions.data[index]); }, 500, 1);
        }

    }
})();