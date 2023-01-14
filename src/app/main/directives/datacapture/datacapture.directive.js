(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdDataCapture', DataCaptureDirective)
        .directive('tdDataCaptureLayoutRenderer', DataCaptureLayoutRenderer)
        .directive('tdDataCaptureColumnRenderer', DataCaptureColumnRenderer);

    /** @ngInject */
    function DataCaptureDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                item: '=',
                columns: '=',
                template: '=',
                onBack: '&',
                onSave: '&',
                onDelete: '&'
            },
            controller: "DataCaptureController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/datacapture/datacapture.directive.html'

        };
    }

    /** @ngInject */
    function DataCaptureLayoutRenderer() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                item: '=',
                columns: '=',
                rows: '=',
                isInnerRegister: '=',
                onAddInnerItem: '&'
            },
            controller: "DataCaptureLayoutController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/datacapture/datacapture.layout.html'
        };
    }

    /** @ngInject */
    function DataCaptureColumnRenderer() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                item: '=',
                col: '=',
                columns: '=',
                isReadOnly: '=',
                isInnerRegister: '=',
                onAddInnerItem: '&'
            },
            controller: "DataCaptureColumnController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/datacapture/datacapture.column.html'
        };
    }


})();