(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('DataTableDirectiveController', DataTableDirectiveController);

    /** @ngInject */
    function DataTableDirectiveController(PRIMARY_COLUMN_NAME, $scope, $sce, utilService,
        referenceGroups, $mdDialog, commonApiService, linqService, SERIAL_COLUMN_NAME,
        registerDataService) {
        var vm = this;
        vm.primaryColumnName = PRIMARY_COLUMN_NAME;

        vm.preventDefault = preventDefault;
        vm.getValue = getValue;
        vm.onRowClick = onRowClick;
        vm.itemFilter = itemFilter;
        vm.showRegister = showRegister;
        vm.onDetail = onDetail;
        vm.onDelete = onDelete;
        vm.columnFilter = columnFilter;
        vm.columnFilterInData = columnFilterInData;

        init();

        function onDelete(item) {
            $scope.onItemDelete({ item: item });
        }

        function onDetail(item) {
            $scope.onItemDefinition({ item: item });
        }

        function preventDefault(e) {
            e.preventDefault();
            e.stopPropagation();
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

        function itemFilter(item) {
            if (item.deleted) {
                return false;
            }
            return true
        };

        function columnFilter(item) {
            if (item.deleted || hasColumnInGroup(item)) {
                return false;
            }
            return true
        };

        function hasColumnInGroup(columns, column) {
            for (var i = 0; i < columns.length; i++) {
                if (columns[i].type === 'group' && columns[i].columns && columns[i].columns.length) {
                    return columns[i].columns.indexOf(column.data) > -1;
                }
            }

        }

        function columnFilterInData(item) {
            if (item.deleted || item.type === 'group') {
                return false;
            }
            return true
        };

        function onRowClick(item) {
            $scope.onItemDetail({ item: item });
        }

        function init() {

            vm.allColumns = angular.copy($scope.tableColumns);

            var tempCol = {
                title: 'SL#',
                data: 'slNo',
                type: 'index'
            }

            tempCol[vm.primaryColumnName] = "tempCol1";
            vm.allColumns.unshift(tempCol);



            if ($scope.showDetailIcon) {
                var tempCol1 = {
                    title: '',
                    data: 'btn',
                    type: 'button'
                }

                tempCol1[vm.primaryColumnName] = "tempCol2";
                vm.allColumns.push(tempCol1);
            }

            vm.columns = [];

            for (var i = 0; i < vm.allColumns.length; i++) {
                if (!hasColumnInGroup(vm.allColumns, vm.allColumns[i])) {
                    vm.columns.push(vm.allColumns[i]);
                }
            }

            vm.dtOptions = {
                //dom         : '<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',                    
                dom: 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
                initComplete: function () {
                    var api = this.api(),
                        searchBox = angular.element('body').find('#register-items-search');

                    if (searchBox.length > 0) {
                        searchBox.on('keyup', function (event) {
                            api.search(event.target.value).draw();
                        });
                    }
                },
                autoWidth: false,
                order: [[0, "asc"]],
                bSort: false,
                columnDefs: [
                    // { responsivePriority: 1, targets: 0 },
                    // { responsivePriority: 2, targets: -1 }
                ],
                pagingType: 'simple',
                lengthMenu: [10, 20, 30, 50, 100],
                pageLength: 20,
                //scrollY     : 'auto',                      
                responsive: true
            };

            initColumnDef();

            var cols = $.grep(vm.columns, function (col) {
                return !col.deleted && col.type === 'register';
            });

            if (cols.length > 0) {
                vm.innerRegisterData = [];
                getInnerRegisterData(cols, 0);
            } else {
                vm.dataReady = true;
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
                vm.innerRegisterData.push(dt);
                index += 1;

                if (cols.length === index) {
                    vm.dataReady = true;
                } else {
                    getInnerRegisterData(cols, index);
                }

            });

        }

        function initColumnDef(index) {
            if (!$scope.tableData) {
                return;
            }

            for (var i = 0; i < vm.columns.length; i++) {
                var opt = {
                    // Target the actions column
                    targets: i,
                    filterable: isSearchable(vm.columns[i]),
                    sortable: isSortableable(vm.columns[i])
                }

                vm.dtOptions.columnDefs.push(opt);
            }
        }

        function isSearchable(column) {

        }

        function isSortableable(column) {
            if (column.type === 'button') {
                return false;
            }
            return true;
        }

        function getValue(row, column, rowIndex, rows) {
            var val = registerDataService.getCalculatedValue(row, column, rowIndex, rows, vm.innerRegisterData);

            if (column.type === 'register' && !val) {
                val = column.title;
            }

            return val;
        }

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