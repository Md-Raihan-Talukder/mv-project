(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('matrixDirective', MatrixDirective);

    /** @ngInject */
    function MatrixDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                accordion: '='
            },
            link: function (scope, element, attrs) {

            },
            templateUrl: 'app/main/directives/matrix/matrix.directive.html'
        };
    }
})();