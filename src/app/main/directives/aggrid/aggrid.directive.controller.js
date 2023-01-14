(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('AgGridDirectiveController', AgGridDirectiveController);

    /** @ngInject */
    function AgGridDirectiveController($scope, $state, utilService, PRIMARY_COLUMN_NAME,
        registerDataService, commonApiService, $mdDialog) {
        var vm = this;

        init();


        function init() {

            vm.height = $scope.tableHeight + 'px';
            vm.columns = angular.copy($scope.tableColumns);

            var cols = $.grep(vm.columns, function (col) {
                return !col.deleted && col.type === 'register';
            });

            if (cols.length > 0) {
                $scope.innerRegisterData = [];
                getInnerRegisterData(cols, 0);
            } else {
                initOptions();
            }

        }

        function getInnerRegisterData(cols, index) {

            var params = [{ "key": "registerId", "value": cols[index].registerId }];

            var temp = {};
            commonApiService.getItems(temp, "REGISTER-DATA", "data", params, function (value) {
                var dt = {
                    "key": cols[index].registerId,
                    "value": value
                };
                $scope.innerRegisterData.push(dt);
                index += 1;

                if (cols.length === index) {
                    initOptions();
                    vm.ready = true;
                } else {
                    getInnerRegisterData(cols, index);
                }

            });

        }

        function showRegister(row, column) {

            $mdDialog.show({
                controller: RegisterViewerDialogController,
                controllerAs: 'vm',
                locals: {
                    RowId: row[PRIMARY_COLUMN_NAME],
                    Register: row[column.data],
                    Title: column.displayTitle
                },
                templateUrl: 'app/main/directives/datatable/register-viewer-dialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true
            })
                .then(function (answer) {

                }, function () {
                    //$scope.status = 'You cancelled the dialog.';
                });

        }

        function initOptions() {
            $scope.gridOptions.columnDefs = createColumnDef();
            $scope.gridOptions.rowData = createRowData();
            $scope.gridOptions.rowSelection = 'multiple';
            $scope.gridOptions.enableColResize = true;
            $scope.gridOptions.enableSorting = true;
            $scope.gridOptions.enableFilter = true;
            $scope.gridOptions.rowHeight = 30;
            $scope.gridOptions.onModelUpdated = onModelUpdated;
            $scope.gridOptions.suppressRowClickSelection = true;
            $scope.gridOptions.angularCompileRows = true;
            $scope.gridOptions.context = { scope: $scope };


            $scope.gridOptions.onRowClicked = function (params) {
                if (vm.stopRowClick) {
                    vm.stopRowClick = false;
                    return
                }
                $scope.onItemDetail({ event: null, item: params.data });
                $scope.$apply();
            };

            $scope.gridOptions.onCellClicked = function (params) {
                if (params.colDef.column.type === 'register') {
                    vm.stopRowClick = true;
                    showRegister(params.data, params.colDef.column);
                }
            };

            $scope.gridOptions.onSelectionChanged = function (params) {
                var selectedRows = $scope.gridOptions.api.getSelectedRows();

                $scope.onSelectionChanged({ selectedRows: selectedRows });
                $scope.$apply();
            };

            $scope.gridOptions.onGridReady = function (event) {
                setTimeout(function () {
                    event.api.sizeColumnsToFit();
                }, 1000);
            };

        }

        function onModelUpdated() {
            var model = $scope.gridOptions.api.getModel();
            var totalRows = $scope.gridOptions.rowData.length;
            var processedRows = model.getRowCount();
            $scope.rowCount = "Showing " + processedRows.toLocaleString() + ' of ' + totalRows.toLocaleString();
        }

        function getColumnOfGroup(dataProp) {
            var index = utilService.getIndex(vm.columns, 'data', dataProp);
            if (index >= 0) {
                return vm.columns[index];
            }
        }

        function hasColumnInGroup(column) {
            for (var i = 0; i < vm.columns.length; i++) {
                if (vm.columns[i].type === 'group' && vm.columns[i].columns && vm.columns[i].columns.length) {
                    return vm.columns[i].columns.indexOf(column.data) > -1;
                }
            }

        }

        function createColumnDef() {
            var colDefs = [];

            colDefs.push({
                headerName: '', width: 25, checkboxSelection: true, suppressSorting: true,
                suppressMenu: true, pinned: false
            });

            for (var i = 0; i < vm.columns.length; i++) {

                var newCol = {}, columnOfGroup;

                if (vm.columns[i].type === 'group') {

                    var groupColsDatas = vm.columns[i].columns;
                    if (!groupColsDatas || !groupColsDatas.length) {
                        continue;
                    }

                    var groupCol = {
                        headerName: vm.columns[i].title,
                        children: []
                    };

                    for (var j = 0; j < groupColsDatas.length; j++) {
                        columnOfGroup = getColumnOfGroup(groupColsDatas[j]);
                        if (columnOfGroup) {
                            newCol = {};

                            newCol.headerName = columnOfGroup.title;
                            newCol.field = columnOfGroup.data;
                            newCol.suppressMenu = true;
                            newCol.suppressMovable = true;
                            newCol.cellRenderer = cellRenderer;
                            newCol.column = angular.copy(columnOfGroup);

                            groupCol.children.push(newCol);

                        }
                    }

                    colDefs.push(groupCol);

                } else {
                    if (!hasColumnInGroup(vm.columns[i])) {
                        newCol = {};

                        newCol.headerName = vm.columns[i].title;
                        newCol.field = vm.columns[i].data;
                        newCol.suppressMenu = true;
                        newCol.suppressMovable = true;
                        newCol.cellRenderer = cellRenderer;
                        newCol.column = angular.copy(vm.columns[i]);

                        colDefs.push(newCol);
                    }

                }

            }

            return colDefs;
        }

        function cellRenderer(params) {
            var row = params.data, column = params.colDef.column;
            var rows = params.context.scope.gridOptions.rowData;
            var innerRegisterData = params.context.scope.innerRegisterData;
            var rowIndex = utilService.getIndex(rows, PRIMARY_COLUMN_NAME, row[PRIMARY_COLUMN_NAME]);

            var val = registerDataService.getCalculatedValue(row, column, rowIndex, rows, innerRegisterData);


            if (column.type === 'register') {
                if (!val) {
                    val = column.title;
                }
                return '<span class="link-div"> ' + val + ' </span> '
            }

            return val;
        }

        $scope.registerClicked = function (data, colDef, cc) {
            alert(data, colDef);
        }

        function createRowData() {
            var rowData = [];
            for (var i = 0; i < $scope.tableData.length; i++) {
                if (!$scope.tableData[i].deleted) {
                    rowData.push($scope.tableData[i]);
                }
            }

            return rowData;
        }

        /*****************/

        /** @ngInject */
        function RegisterViewerDialogController($scope, $mdDialog, RowId, Register,
            PRIMARY_COLUMN_NAME, commonApiService, Title) {
            var vm = this;
            vm.register = Register;
            vm.rowId = RowId;
            vm.title = Title;

            vm.closeDialog = closeDialog;

            init()


            function init() {

                vm.columns = vm.register.columns;

                var params = [{ "key": "parentId", "value": vm.rowId },
                { "key": "registerId", "value": vm.register[PRIMARY_COLUMN_NAME] }];

                commonApiService.getItems(vm, "REGISTER-DATA", "data", params);

            }

            function closeDialog() {
                $mdDialog.hide();
            }

        }



    }

})();