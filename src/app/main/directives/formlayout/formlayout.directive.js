(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdFormLayout', FormLayoutDirective)
        .directive('tdFormLayoutRow', FormLayoutRowDirective)
        .directive('tdFormLayoutColumn', FormLayoutColumnDirective);

    /** @ngInject */
    function FormLayoutDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                registerItem: '=',
                viewType: '=',
            },
            controller: "FormLayoutDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/formlayout/formlayout.directive.html'

        };
    }

    /** @ngInject */
    function FormLayoutRowDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                rowData: '=',
                registerColumns: '='
            },
            controller: "FormLayoutRowDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/formlayout/formlayout-row.directive.html'

        };
    }
    /** @ngInject */
    function FormLayoutColumnDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                rowData: '=',
                columnData: '=',
                registerColumns: '='
            },
            controller: "FormLayoutColumnDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/formlayout/formlayout-column.directive.html'

        };
    }



})();