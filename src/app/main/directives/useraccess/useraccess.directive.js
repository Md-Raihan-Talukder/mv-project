(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdUserAccess', UserAccessDirective);

    /** @ngInject */
    function UserAccessDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                users: '=',
                groups: '=',
                permissions: '=',
                onAddItem: '&',
                onRemoveItem: '&',
                viewMode: '='
            },
            controller: "UserAccessController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/useraccess/useraccess.directive.html'
        };
    }
})();