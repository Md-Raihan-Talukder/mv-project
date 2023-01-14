(function () {
    'use strict';

    angular
        .module('app.common')
        .directive('msbList', msbList)
        .controller('msbListController', msbListController)
        .directive('msbListColumn', msbListColumn)
        .controller('msbListColumnController', msbListColumnController);

    /** @ngInject */
    function msbListColumn() {
        return {
            restrict: 'E',
            scope: {
                columnType: '=',
                listColumn: '=',
                stripColumn: '=',
                allColumns: '=',
                stripObject: '='
            },
            controller: "msbListColumnController",
            controllerAs: 'vm',
            templateUrl: 'app/common/directives/list/list-column.html'
        };
    }

    /** @ngInject */
    function msbList() {
        return {
            restrict: 'E',
            scope: {
                loadId: '=',
                noDefaultSelect: '=',
                listType: '=',
                groupBy: '=',
                selectedIds: '=',
                selectedId: '=',
                helperItems: '=',
                parameters: '=',
                serviceDef: '=',
                isStrip: '=',
                stripDef: '=',
                columns: '=',
                items: '=?',
                template: '=',
                selectable: '=',
                singleSelection: '=',
                selectedFilters: '=?',
                listButtonClicked: '&',
                onLoadComplete: '&',
                rowClicked: '&'
            },
            controller: "msbListController",
            controllerAs: 'vm',
            link: function (scope, element, attrs) {
                scope.getTemplateUrl = function () {
                    if (scope.listType === 'group') {
                        return 'app/common/directives/list/list-group.html';
                    } else {
                        return 'app/common/directives/list/list.html';
                    }
                }
            },
            template: '<ng-include src="getTemplateUrl()"/>'
        };
    }

    /** @ngInject */
    function msbListController(msbUtilService, msbCommonApiService, $scope, PRIMARY_COLUMN_NAME) {
        var vm = this;
        vm.rowClicked = rowClicked;
        vm.listButtonClick = listButtonClick;

        init();

        function init() {
            if ($scope.serviceDef) {
                setWatches();
                getListItems();

            } else {
                if ($scope.items && $scope.items.length) {
                    setSelectedItem();
                    if ($scope.listType === 'group') {
                        vm.gruopByItems = msbUtilService.gruopBy($scope.items, $scope.groupBy);
                    }

                    $scope.onLoadComplete({ "items": $scope.items, "helperItems": $scope.helperItems });
                } else {
                    $scope.$watch('items.length', function (newValue, oldValue) {
                        setSelectedItem();
                    });
                }

                getTemplate();
            }
        }

        function setSelectedItem() {
            if (!$scope.items || !$scope.items.length) {
                return;
            }

            if ($scope.singleSelection && $scope.selectedId) {
                var index = msbUtilService.getIndex($scope.items, PRIMARY_COLUMN_NAME, $scope.selectedId);
                if (index > -1) {
                    selectItem($scope.items[index]);
                    return;
                }
            } else if (!$scope.singleSelection && $scope.selectedIds) {
                for (var i = 0; i < $scope.selectedIds.length; i++) {
                    var index = msbUtilService.getIndex($scope.items, PRIMARY_COLUMN_NAME, $scope.selectedIds[i]);
                    if (index > -1) {
                        selectItem($scope.items[index]);
                        return;
                    }
                }
            }
            if (!$scope.noDefaultSelect) {
                selectItem($scope.items[0]);
            }

        }

        function setWatches() {
            $scope.$watch("parameters", function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    getListItems();
                }
            }, true);

            $scope.$watch("loadId", function (newValue, oldValue) {
                if (newValue && newValue !== oldValue) {
                    getListItems();
                }
            }, true);

            $scope.$watch("selectedFilters", function (newValue, oldValue) {
                if (newValue && newValue !== oldValue) {
                    filterItems();
                }
            }, true);
        }



        function filterItems() {
            var keys = Object.keys($scope.selectedFilters);
            var params = [];
            for (var i = 0; i < keys.length; i++) {
                var filter = $scope.selectedFilters[keys[i]];
                var items = filter.items;
                if (items.length) {
                    var param = { "key": filter.comparisonKey };
                    if (items.length > 1) {
                        var values = [];
                        for (var j = 0; j < items.length; j++) {
                            values.push(items[j].value);
                        }
                        param.value = values;
                    } else {
                        param.value = items[0].value;
                    }

                    params.push(param);
                }
            }

            $scope.items = msbUtilService.getItemsByProperties(vm.allItems, params);
            $scope.onLoadComplete({ "items": $scope.items, "helperItems": $scope.helperItems });
            if ($scope.listType === 'group') {
                vm.gruopByItems = msbUtilService.gruopBy($scope.items, $scope.groupBy);
            }

        }

        function getListItems() {
            if ($scope.serviceDef.service && $scope.serviceDef.task) {

                msbCommonApiService.getItems($scope.serviceDef.service, $scope.parameters, function (data) {
                    vm.allItems = data;
                    $scope.items = data;
                    $scope.onLoadComplete({ "items": $scope.items, "helperItems": $scope.helperItems });
                    if (data && data.length) {
                        setSelectedItem();
                    }
                    if ($scope.listType === 'group') {
                        vm.gruopByItems = msbUtilService.gruopBy($scope.items, $scope.groupBy);
                    }
                }, null, false, null, $scope.serviceDef.task, $scope.serviceDef.path, $scope.serviceDef.paramObj);

            } else if ($scope.serviceDef.serviceName && $scope.serviceDef.loadFunctionName) {

                msbCommonApiService.interfaceManager(function (data) {
                    vm.allItems = data;
                    $scope.items = data;
                    $scope.onLoadComplete({ "items": $scope.items, "helperItems": $scope.helperItems });
                    if (data && data.length) {
                        setSelectedItem();
                    }
                    if ($scope.listType === 'group') {
                        vm.gruopByItems = msbUtilService.gruopBy($scope.items, $scope.groupBy);
                    }
                    if (!vm.templateReady) {
                        getTemplate();
                    }

                }, $scope.serviceDef.serviceName, $scope.serviceDef.loadFunctionName, $scope.parameters);


            } else {
                console.log("load options not defined");
            }

        }

        function getTemplate() {
            if (!$scope.template) {
                console.log('Template not passed');
                vm.templateNotFound = true;
                return;
            }

            if ($scope.template.service) {

                msbCommonApiService.getItems($scope.template.service, null, function (data) {
                    if (!data || data.length < 1) {
                        console.log('Template not found');
                        return;
                    }

                    var template;
                    if ($scope.template.templateId) {
                        var index = msbUtilService.getIndex(data, PRIMARY_COLUMN_NAME, $scope.stripDef.template.templateId);
                        if (index > -1) {
                            template = data[index];
                        }
                    } else {
                        template = data[0];
                    }

                    setTemplate(template);

                }, null, false, null, $scope.template.task);

            } else {
                setTemplate($scope.template);
            }

        }

        function setTemplate(template) {
            if (!template) {
                console.log('Template not found');
                vm.templateNotFound = true;
                return;
            }

            vm.template = template;
            vm.listHeightClass = "h-" + vm.template.height;
            vm.listHeight = vm.template.height;

            vm.templateReady = true;
        }

        function listButtonClick(but, strip) {
            $scope.listButtonClicked({ "button": but, "item": strip, 'helperItems': $scope.helperItems });
        }

        function rowClicked(item) {
            if (!$scope.selectable) {
                return
            }

            if ($scope.singleSelection) {
                for (var i = 0; i < $scope.items.length; i++) {

                    if ($scope.items[i][PRIMARY_COLUMN_NAME] === item[PRIMARY_COLUMN_NAME]) {
                        item.TD_IS_SELECTED = !item.TD_IS_SELECTED;
                    } else {
                        $scope.items[i].TD_IS_SELECTED = false;
                    }
                }
            } else {
                item.TD_IS_SELECTED = !item.TD_IS_SELECTED;
            }

            $scope.rowClicked({ "item": item, 'helperItems': $scope.helperItems });
        }

        function selectItem(item) {
            if (!$scope.selectable) {
                return
            }

            if ($scope.selectedIds) {
                for (var i = 0; i < $scope.selectedIds.length; i++) {
                    var index = msbUtilService.getIndex($scope.items, PRIMARY_COLUMN_NAME, $scope.selectedIds[i]);
                    if (index > -1) {
                        $scope.items[index].TD_IS_SELECTED = true;
                    }
                }

            } else {

                if ($scope.singleSelection) {
                    for (var i = 0; i < $scope.items.length; i++) {

                        if ($scope.items[i][PRIMARY_COLUMN_NAME] === item[PRIMARY_COLUMN_NAME]) {
                            item.TD_IS_SELECTED = true;
                        } else {
                            $scope.items[i].TD_IS_SELECTED = false;
                        }
                    }
                } else {
                    item.TD_IS_SELECTED = true;
                }

            }



            $scope.rowClicked({ "item": item, 'helperItems': $scope.helperItems });
        }


    }

    /** @ngInject */
    function msbListColumnController(msbUtilService, msbCommonApiService, $scope, PRIMARY_COLUMN_NAME) {
        var vm = this;
        vm.isArray = angular.isArray;

        init();

        function init() {

        }

    }

})();