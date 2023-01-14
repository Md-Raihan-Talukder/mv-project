(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('TdFormController', TdFormController)
        .controller('TdFormColumnRendererController', TdFormColumnRendererController);

    /** @ngInject */
    function TdFormController($scope, $timeout, dataCaptureService, commonApiService, utilService) {
        var vm = this;
        vm.columnFilter = columnFilter;
        vm.isFullPage = isFullPage;

        init();

        function init() {
            $timeout(function () {
                getForm();
            }, 450);
        }

        function getForm() {

            commonApiService.getItem(vm, "DATA_ENTRY_FORM", $scope.formId, 'form', function (value) {

            }, "formId", function () {
                console.log('Failed to get for with formId: ' + $scope.formId);
            });
        }

        function isFullPage(col) {
            return dataCaptureService.isFullPage(col);
        }

        function columnFilter(item) {
            return dataCaptureService.columnFilter(item, $scope.columns);
        }

    }

    /** @ngInject */
    function TdFormColumnRendererController($scope, commonApiService, utilService, dataCaptureService, PRIMARY_COLUMN_NAME,
        $mdDialog, $document) {
        var vm = this;
        vm.primaryColumnName = PRIMARY_COLUMN_NAME;
        vm.getCategory = getCategory;
        vm.isNumberKey = isNumberKey;
        vm.getDatePickerTitle = getDatePickerTitle;
        vm.updateColumnMode = updateColumnMode;
        vm.multyCheckExists = multyCheckExists;
        vm.multyCheckToggle = multyCheckToggle;
        vm.selectItem = selectItem;
        vm.removeItem = removeItem;
        vm.getImageColumn = getImageColumn;


        init();

        function init() {
            vm.taToolbar = [
                ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote', 'bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
                ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent', 'html', 'insertImage', 'insertLink', 'insertVideo', 'wordcount', 'charcount']
            ];

            if ($scope.col.type === "select" || $scope.col.type === "multiSelect") {
                getReffItems();
            }
        }

        function getReffItems() {
            if (!$scope.item[$scope.col.data]) {
                return;
            }

            if ($scope.col.type === "multiSelect") {
                if (!$scope.item[$scope.col.data].length) {
                    vm[$scope.col.data] = [];
                    return;
                }

                commonApiService.getItemsByKeys(vm, $scope.col.serviceKey, PRIMARY_COLUMN_NAME, $scope.item[$scope.col.data], $scope.col.data, function (value) {

                }, function () {

                });
            } else {
                commonApiService.getItem(vm, $scope.col.serviceKey, $scope.item[$scope.col.data], $scope.col.data, function (value) {

                }, null, function () {
                    console.log('Failed to get for with formId: ' + $scope.item[$scope.col.data]);
                });
            }


        }

        function getImageColumn(col) {
            var index = utilService.getIndex(col.refferenceColumns, "type", "iconPicture");
            if (index > -1) {
                return col.refferenceColumns[index].key;
            }
        }

        function updateColumnMode(col) {
            col.editMode = !col.editMode;
        }

        function getDatePickerTitle(title) {
            title = title.replace('Date', '').replace('date', '');
            return title;
        }

        function isNumberKey(evt) {
            return dataCaptureService.isNumberKey(evt);
        }

        function getCategory(col) {
            return dataCaptureService.getCategory(col);
        }

        function multyCheckExists(chkItem, item, col) {
            if (!item[col.data] || !angular.isArray(item[col.data])) {
                item[col.data] = [];
            }

            return item[col.data].indexOf(chkItem) > -1;

        }

        function multyCheckToggle(chkItem, item, col) {
            if (!item[col.data] || !angular.isArray(item[col.data])) {
                item[col.data] = [];
            }

            var idx = item[col.data].indexOf(chkItem);
            if (idx > -1) {
                item[col.data].splice(idx, 1);
            }
            else {
                item[col.data].push(chkItem);
            }
        }

        function selectItem(col, item) {
            $mdDialog.show({
                controller: 'tdFormItemDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/main/directives/form/dialogs/form-item-dialog.html',
                parent: angular.element($document.body),
                clickOutsideToClose: true,
                locals: {
                    Column: col,
                    DataSet: item
                }
            }).then(function (answer) {
                if (!answer || !answer.items.length) {
                    return;
                }

                addToObject(answer.items, col, item);
                getReffItems();
            });
        }

        function addToObject(items, col, item) {
            if (!item[col.data]) {
                if (col.type === "multiSelect") {
                    item[col.data] = [];
                } else {
                    item[col.data] = {};
                }
            }

            if (col.type === "multiSelect") {
                for (var i = 0; i < items.length; i++) {
                    var index = item[col.data].indexOf(items[i][PRIMARY_COLUMN_NAME]);
                    if (index === -1) {
                        item[col.data].push(items[i][PRIMARY_COLUMN_NAME]);
                    }
                }
            } else {
                item[col.data] = angular.copy(items[0][PRIMARY_COLUMN_NAME]);
            }
        }


        function removeItem(item, col, listItem) {
            if (col.type === "multiSelect") {
                var index = item[col.data].indexOf(listItem[PRIMARY_COLUMN_NAME]);
                if (index > -1) {
                    item[col.data].splice(index, 1);
                }
            } else {
                item[col.data] = null;
                vm[$scope.col.data] = null;
            }

            getReffItems();
        }

    }

})();