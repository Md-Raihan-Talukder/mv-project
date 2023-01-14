(function () {
    'use strict';

    angular
        .module('app.common')
        .directive('msbFullScreen', msbFullScreenDirective);

    /** @ngInject */
    function msbFullScreenDirective() {
        return {
            restrict: 'E',
            scope: {},
            controller: "msbFullScreenDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/common/directives/full-screen/full-screen.html'

        };
    }

})();