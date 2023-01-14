(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdModuleContext', moduleContextDirective);

    /** @ngInject */
    function moduleContextDirective() {
        return {
            restrict: 'E',
            transclude: true,
            controller: "moduleContextDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/moduelcontext/module-context.html'
        };
    }
})();