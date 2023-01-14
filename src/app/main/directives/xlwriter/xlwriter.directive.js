(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdXlWriter', XlWriterDirective);

    /** @ngInject */
    function XlWriterDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                xlData: '=',
            },
            link: function (scope, element, attrs) {

            },
            controller: "XlWriterDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/xlwriter/xlwriter.html'
        };
    }
})();