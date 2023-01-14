(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('MsbFormController', MsbFormController)
        .controller('MsbFormColumnRendererController', MsbFormColumnRendererController)
        .controller('MsbFormColumnRefRendererController', MsbFormColumnRefRendererController)
        .controller('MsbFormColumnChildRefRendererController', MsbFormColumnChildRefRendererController);

    /** @ngInject */
    function MsbFormColumnChildRefRendererController($scope, msbUtilService, msbCommonApiService, PRIMARY_COLUMN_NAME) {
        var vm = this;
        vm.getImageColumn = getImageColumn;

        function getImageColumn(col) {
            var index = msbUtilService.getIndex(col.refferenceColumns, "type", "iconPicture");
            if (index > -1) {
                return col.refferenceColumns[index].key;
            }
        }


        init();

        function init() {
            loadList();
        }


        function loadList() {
            if (!$scope.item) {
                return;
            }

            vm.data = [];

            if ($scope.multiSelect) {
                if (!$scope.item.length) {
                    return;
                }

                msbCommonApiService.getItemsByKeys($scope.col.serviceKey, PRIMARY_COLUMN_NAME, $scope.item, function (value) {
                    vm.data = value;
                });
            } else {
                msbCommonApiService.getItem($scope.col.serviceKey, $scope.item, PRIMARY_COLUMN_NAME, function (value) {
                    vm.data.push(value);
                });
            }
        }


    }

    /** @ngInject */
    function MsbFormColumnRefRendererController($scope, msbUtilService, msbCommonApiService, PRIMARY_COLUMN_NAME) {
        var vm = this;
        vm.getImageColumn = getImageColumn;
        vm.removeItem = removeItem;
        vm.onItemClick = onItemClick;


        init();

        function onItemClick(col, item, listItem) {
            $scope.onItemClick({ col: col, item: item, listItem: listItem });
        }

        function removeItem(item, col, listItem) {
            if (col.type === "multiSelect") {
                var index = item[col.data].indexOf(listItem[PRIMARY_COLUMN_NAME]);
                if (index > -1) {
                    item[col.data].splice(index, 1);
                }
            } else if (col.type === "multiObject") {
                var index = msbUtilService.getIndex(item[col.data], PRIMARY_COLUMN_NAME, listItem[PRIMARY_COLUMN_NAME]);
                if (index > -1) {
                    item[col.data].splice(index, 1);
                }
            } else {
                item[col.data] = null;
                vm.data = [];
            }

            loadList();

        }

        function init() {
            loadList();
        }

        function loadList() {
            vm.data = [];
            if ($scope.col.type === "select" || $scope.col.type === "multiSelect") {
                getReffItems();
            } else {
                loadFromScope();
            }
        }

        function loadFromScope() {
            if (!$scope.item[$scope.col.data] || $.isEmptyObject($scope.item[$scope.col.data])) {
                return;
            }
            if ($scope.col.type === "singleObject") {
                vm.data.push($scope.item[$scope.col.data]);

            } else {
                for (var i = 0; i < $scope.item[$scope.col.data].length; i++) {
                    vm.data.push($scope.item[$scope.col.data][i]);
                }
            }
        }

        function getReffItems() {
            if (!$scope.item[$scope.col.data]) {
                return;
            }

            vm.data = [];

            if ($scope.col.type === "multiSelect") {
                if (!$scope.item[$scope.col.data].length) {
                    return;
                }

                msbCommonApiService.getItemsByKeys($scope.col.serviceKey, PRIMARY_COLUMN_NAME, $scope.item[$scope.col.data], function (value) {
                    vm.data = value;
                });
            } else {
                msbCommonApiService.getItem($scope.col.serviceKey, $scope.item[$scope.col.data], PRIMARY_COLUMN_NAME, function (value) {
                    vm.data.push(value);
                });
            }
        }

        function getImageColumn(col) {
            var index = msbUtilService.getIndex(col.refferenceColumns, "type", "iconPicture");
            if (index > -1) {
                return col.refferenceColumns[index].key;
            }
        }



    }

    /** @ngInject */
    function MsbFormController($scope, $timeout, dynamicFormService, msbCommonApiService, msbUtilService) {
        var vm = this;
        vm.columnFilter = columnFilter;
        vm.getFlex = getFlex;

        init();

        function init() {
            if (!$scope.objectProperty) {
                $scope.objectProperty = {};
            }

            $timeout(function () {
                getForm();
            }, 450);
        }

        function getForm() {
            if (!$scope.formId) {
                if (!$scope.columnDefs || !$scope.columnDefs.length) {
                    return;
                }
                return;
            }
            msbCommonApiService.getItem("DATA_ENTRY_FORM", $scope.formId, "formId", function (value) {
                vm.form = value;
                $scope.columnDefs = vm.form.columns;
            });
        }

        function getFlex(col) {
            if (col.flex) {
                return col.flex;
            }

            return dynamicFormService.isFullPage(col) ? 100 : 50;
        }

        function columnFilter(item) {
            return dynamicFormService.columnFilter(item, $scope.columns);
        }

    }

    /** @ngInject */
    function MsbFormColumnRendererController($scope, $timeout, msbCommonApiService, msbUtilService, dynamicFormService, PRIMARY_COLUMN_NAME,
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
        vm.onAddItem = onAddItem;
        vm.setFns = setFns;
        vm.addFromGrid = addFromGrid;
        vm.editFromGrid = editFromGrid;
        vm.removeFromGrid = removeFromGrid;
        vm.onSelectedClick = onSelectedClick;
        vm.onItemClick = onItemClick;


        init();

        function init() {
            vm.refDirReady = true;
            vm.taToolbar = [
                ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote', 'bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
                ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent', 'html', 'insertImage', 'insertLink', 'insertVideo', 'wordcount', 'charcount']
            ];
        }


        function updateColumnMode(col) {
            col.editMode = !col.editMode;
        }

        function getDatePickerTitle(title) {
            title = title.replace('Date', '').replace('date', '');
            return title;
        }

        function isNumberKey(evt) {
            return msbUtilService.isNumberKey(evt);
        }

        function getCategory(col) {
            return dynamicFormService.getCategory(col);
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

        function onAddItem(col, item, data) {
            if (col.isList) {
                addItem(col, item, data)
            } else {
                vm.callAddFunction();
            }
        }

        function setFns(addFn, selectedFn) {
            vm.callAddFunction = addFn;
            vm.callSelectedFunction = selectedFn;
        }

        function addFromGrid(helperItems, callBack) {
            addItem(helperItems[0], helperItems[1], null, callBack);
        }

        function editFromGrid(helperItems, gridItem, callBack) {
            addItem(helperItems[0], helperItems[1], gridItem, callBack);
        }

        function removeFromGrid(helperItems, gridItem, callBack) {
            var col = helperItems[0];
            var item = helperItems[1];

            msbUtilService.confirmAndDelete(col.title, [gridItem], function () {
                var index = msbUtilService.getIndex(item[col.data], PRIMARY_COLUMN_NAME, gridItem[PRIMARY_COLUMN_NAME]);
                if (index > -1) {
                    item[col.data].splice(index, 1);
                }
                if (callBack) {
                    callBack(gridItem);
                }
            });
        }

        function onSelectedClick(helperItems, selectedItems, callBack) {

        }

        function onItemClick(col, item, listItem) {
            //addItem(col, item, listItem);
        }

        function addItem(col, item, data, callBack) {

            $mdDialog.show({
                controller: 'DataEntryDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/common/dialogs/data-entry/data-entry.html',
                parent: angular.element($document.body),
                clickOutsideToClose: false,
                preserveScope: true,
                multiple: true,
                locals: {
                    Item: data,
                    Type: col.title,
                    FormId: col.formId,
                    ServiceKey: col.serviceKey,
                    ColumnDefs: null
                }
            }).then(function (answer) {
                if (!answer) {
                    return;
                }
                addObjectToItem(angular.copy(answer), col, item, callBack);
            });
        }

        function addObjectToItem(answer, col, item, callBack) {
            item = initProperty(item, col);

            if (col.type === "multiObject") {
                var index = msbUtilService.getIndex(item[col.data], PRIMARY_COLUMN_NAME, answer[PRIMARY_COLUMN_NAME]);
                if (index === -1) {
                    item[col.data].push(answer);
                } else {
                    item[col.data][index] = answer;
                }
            } else {
                item[col.data] = answer;
            }

            if (callBack) {
                callBack(answer);
            } else {
                reloadReffDirective();
            }
        }


        function selectItem(col, item) {

            $mdDialog.show({
                controller: 'FormItemDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/common/directives/form/dialogs/select/form-item-dialog.html',
                parent: angular.element($document.body),
                clickOutsideToClose: false,
                preserveScope: true,
                multiple: true,
                locals: {
                    Column: col,
                    DataSet: item,
                    SelectID: null,
                    SingleSelection: null,
                    SlectType: null,
                    Items: null,
                    ListColumns: null,
                    KeyProperty: null
                }
            }).then(function (answer) {
                if (!answer) {
                    return;
                }

                addToObject(answer.items, col, item);

            });
        }

        function initProperty(item, col) {
            if (!item[col.data]) {
                if (col.type === "multiSelect" || col.type === "multiObject") {
                    item[col.data] = [];
                } else {
                    item[col.data] = {};
                }
            }

            return item;
        }

        function addToObject(items, col, item) {
            item = initProperty(item, col);

            if (col.type === "multiSelect") {
                for (var i = 0; i < items.length; i++) {
                    var index = item[col.data].indexOf(items[i][PRIMARY_COLUMN_NAME]);
                    if (index === -1) {
                        item[col.data].push(items[i][PRIMARY_COLUMN_NAME]);
                    }
                }
            } else {
                item[col.data] = angular.copy(items[PRIMARY_COLUMN_NAME]);
            }

            reloadReffDirective();
        }

        function reloadReffDirective() {
            vm.refDirReady = false;
            $timeout(function () {
                vm.refDirReady = true;
            }, 450);
        }



    }

})();