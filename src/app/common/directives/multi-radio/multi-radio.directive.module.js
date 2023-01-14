(function () {
    'use strict';

    angular
        .module('app.common')
        .directive('msbMultiRadio', msbMultiRadioDirective);

    /** @ngInject */
    function msbMultiRadioDirective() {
        return {
            restrict: 'E',
            scope: {
                selectItems: '=?',
                modelObject: '=',
                keyProperty: '=',
                valueProperty: '=',
                refProperty: '=',
                onUpdate: '&',
            },
            controller: "msbMultiRadioDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/common/directives/multi-radio/multi-radio-directive.html'

        };
    }

})();