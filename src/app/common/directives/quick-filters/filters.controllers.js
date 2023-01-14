(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('msbQuickFiltersDirectiveController', msbQuickFiltersDirectiveController);

    /** @ngInject */
    function msbQuickFiltersDirectiveController($scope, msbCommonApiService, msbUtilService) {
        var vm = this;
        vm.toggleFilter = toggleFilter;
        vm.isFilterSelected = isFilterSelected;
        vm.isAllSelected = isAllSelected;
        vm.selectAll = selectAll;

        function toggleFilter(filter, item) {
            if (!filter || !filter.id) {
                return;
            }

            if (!$scope.selectedFilters) {
                console.log("selectedFilters is undefined");
                return;
            }

            if (!$scope.selectedFilters[filter.id]) {
                $scope.selectedFilters[filter.id] = {
                    "key": filter.key,
                    "value": filter.value,
                    "comparisonKey": filter.comparisonKey,
                    "multiSelect": filter.multiSelect,
                    "items": []
                };
            }

            var index = msbUtilService.getIndex($scope.selectedFilters[filter.id].items, "value", item[$scope.selectedFilters[filter.id].key]);
            if (index > -1) {
                $scope.selectedFilters[filter.id].items.splice(index, 1);
            } else {
                if (!$scope.selectedFilters[filter.id].multiSelect) {
                    $scope.selectedFilters[filter.id].items = [];
                }
                $scope.selectedFilters[filter.id].items.push({ "key": $scope.selectedFilters[filter.id].key, value: item[$scope.selectedFilters[filter.id].key] });
            }

            if ($scope.onFilterChange) {
                $scope.onFilterChange({ selectedFilters: $scope.selectedFilters, helperItems: $scope.helperItems });
            }

            loadDependentFilters(filter.id);
        }

        function selectAll() {

            var keys = Object.keys($scope.selectedFilters);

            for (var i = 0; i < keys.length; i++) {
                $scope.selectedFilters[keys[i]].items.length = 0;
            }

            for (var i = 0; i < $scope.filters.length; i++) {
                if ($scope.filters[i].dependent) {
                    if ($scope.filters[i].items) {
                        $scope.filters[i].items.length = 0;
                    }
                }

            }

            if ($scope.onFilterChange) {
                $scope.onFilterChange({ selectedFilters: $scope.selectedFilters, helperItems: $scope.helperItems });
            }
        }

        function isAllSelected() {
            if (!$scope.selectedFilters) {
                return true;;
            }

            var keys = Object.keys($scope.selectedFilters);

            for (var i = 0; i < keys.length; i++) {
                var filter = $scope.selectedFilters[keys[i]];
                if (!filter.items || !filter.items.length) {
                    continue;
                } else {
                    return false;
                }
            }

            return true;
        }

        function isFilterSelected(filter, item) {
            if (!$scope.selectedFilters || !$scope.selectedFilters[filter.id]) {
                return;
            }
            return msbUtilService.getIndex($scope.selectedFilters[filter.id].items, "value", item[$scope.selectedFilters[filter.id].key]) > -1;
        }

        init();

        function init() {
            loadFilters();
        }

        function loadFilters() {
            var independentFilters = $.grep($scope.filters, function (filter) {
                return !filter.dependent;
            });

            loadFilterItems(0, independentFilters);
        }


        function loadDependentFilters(filterId) {

            var dependentFilters = $.grep($scope.filters, function (filter) {
                if (filter.dependent) {
                    return msbUtilService.getIndex(filter.dependsOn, "filterId", filterId) > -1;
                }
            });

            var items = $scope.selectedFilters[filterId].items;

            for (var i = 0; i < dependentFilters.length; i++) {

                if ($scope.selectedFilters[dependentFilters[i].id]) {
                    $scope.selectedFilters[dependentFilters[i].id].items.length = 0;
                }

                var index = msbUtilService.getIndex(dependentFilters[i].dependsOn, "filterId", filterId);
                var dependsOn = dependentFilters[i].dependsOn[index];

                if (!dependentFilters[i][dependsOn.includeInto]) {
                    dependentFilters[i][dependsOn.includeInto] = [];
                } else {
                    var paramIndex = msbUtilService.getIndex(dependentFilters[i][dependsOn.includeInto], "key", dependsOn.key);
                    if (paramIndex > -1) {
                        dependentFilters[i][dependsOn.includeInto].splice(paramIndex, 1);
                    }
                }

                var param = { "key": dependsOn.key };
                if (!items.length) {
                    param.value = null;
                } else if (items.length > 1) {
                    var values = [];
                    for (var j = 0; j < items.length; j++) {
                        values.push(items[j].value);
                    }
                    param.value = values;
                } else {
                    param.value = items[0].value;
                }

                dependentFilters[i][dependsOn.includeInto].push(param);

            }

            loadFilterItems(0, dependentFilters);

        }

        function loadFilterItems(index, filters) {

            if (index >= filters.length) {
                return;
            }

            if (!filters[index].service) {
                index += 1;
                loadFilterItems(index, filters);
                return;
            }

            msbCommonApiService.getItems(filters[index].service, filters[index].params, function (data) {

                filters[index].items = [];

                if (data) {
                    for (var i = 0; i < data.length; i++) {
                        filters[index].items.push(data[i]);
                    }
                }

                index += 1;
                loadFilterItems(index, filters);

            }, function () {
                index += 1;
                loadFilterItems(index, filters);
            }, false, null, filters[index].task, filters[index].path, filters[index].pathParams);


        }

    }
})();