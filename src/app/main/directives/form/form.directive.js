(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdForm', TdFormDirective)
        .directive('tdFormColumnRenderer', TdFormColumnRenderer);

    /** @ngInject */
    function TdFormDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                formId: '=',
                objectProperty: '='
            },
            controller: "TdFormController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/form/td-form.html'

        };
    }

    /** @ngInject */
    function TdFormColumnRenderer() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                item: '=',
                col: '='

            },
            controller: "TdFormColumnRendererController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/form/td-form-column.html'

        };
    }

})();