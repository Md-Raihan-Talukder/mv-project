(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdDeclareOverheadPreview', tdDeclareOverheadPreview);

    /** @ngInject */
    function tdDeclareOverheadPreview() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                factoryId: '=',
                declareOverHead: '='
            },
            link: function (scope, element, attrs) {
            },
            controller: "DeclareOverheadPreviewController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/declare-overhead-preview/declare-overhead-preview.html'
        };
    }
})();
