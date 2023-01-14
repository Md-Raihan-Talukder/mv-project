(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdXlReader', XlReaderDirective);

    /** @ngInject */
    function XlReaderDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                xlData: '=',
            },
            link: function (scope, element, attrs) {

            },
            controller: "XlReaderDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/xlreader/xlreader.html'
        };
    }
})();