(function () {
    'use strict';

    angular
        .module('app.common')
        .directive('msbMultiCheckbox', msbMultiCheckboxDirective);

    /** @ngInject */
    function msbMultiCheckboxDirective() {
        return {
            restrict: 'E',
            scope: {
                selectItems: '=?',
                selectedIds: '=?',
                keyProperty: '=',
                valueProperty: '=',
                onUpdate: '&',
            },
            controller: "msbMultiCheckboxDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/common/directives/multi-checkbox/multi-checkbox-directive.html'

        };
    }

})();