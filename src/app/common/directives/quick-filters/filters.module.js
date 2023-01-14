(function () {
    'use strict';

    angular
        .module('app.common')
        .directive('msbQuickFilters', msbQuickFiltersDirective);

    /** @ngInject */
    function msbQuickFiltersDirective() {
        return {
            restrict: 'E',
            scope: {
                filters: '=?',
                selectedFilters: '=?',
                onFilterChange: '&',
                helperItems: '=?'
            },
            controller: "msbQuickFiltersDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/common/directives/quick-filters/filters.html'

        };
    }

})();