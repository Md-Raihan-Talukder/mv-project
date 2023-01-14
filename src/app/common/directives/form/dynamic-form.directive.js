(function () {
    'use strict';

    angular
        .module('app.common')
        .directive('msbForm', MsbFormDirective)
        .directive('msbFormColumnRenderer', MsbFormColumnRenderer)
        .directive('msbFormColumnRefRenderer', msbFormColumnRefRenderer)
        .directive('msbFormColumnChildRefRenderer', msbFormColumnChildRefRenderer);

    /** @ngInject */
    function msbFormColumnChildRefRenderer() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                item: '=',
                col: '=',
                multiSelect: '=',
            },
            controller: "MsbFormColumnChildRefRendererController",
            controllerAs: 'vm',
            templateUrl: 'app/common/directives/form/dynamic-form-column-child-ref.html'

        };
    }

    /** @ngInject */
    function msbFormColumnRefRenderer() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                item: '=',
                col: '=',
                onItemClick: '&'
            },
            controller: "MsbFormColumnRefRendererController",
            controllerAs: 'vm',
            templateUrl: 'app/common/directives/form/dynamic-form-column-ref.html'

        };
    }

    /** @ngInject */
    function MsbFormDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                columnDefs: '=?',
                formId: '=',
                objectProperty: '='
            },
            controller: "MsbFormController",
            controllerAs: 'vm',
            templateUrl: 'app/common/directives/form/dynamic-form.html'

        };
    }

    /** @ngInject */
    function MsbFormColumnRenderer() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                item: '=',
                col: '='

            },
            controller: "MsbFormColumnRendererController",
            controllerAs: 'vm',
            templateUrl: 'app/common/directives/form/dynamic-form-column.html'

        };
    }

})();