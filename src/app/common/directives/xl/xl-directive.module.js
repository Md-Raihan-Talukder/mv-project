(function () {
    'use strict';

    angular
        .module('app.common')
        .directive('msbXl', msbXlDirective);

    /** @ngInject */
    function msbXlDirective() {
        return {
            restrict: 'E',
            scope: {
                columnDefs: '=?',
                items: '='
            },
            controller: "msbXlDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/common/directives/xl/xl-directive.html'

        };
    }

})();