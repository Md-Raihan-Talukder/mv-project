(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdRemiders', RemidersDirective);

    /** @ngInject */
    function RemidersDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                itemList: '=',
                selectRoleUser: '&',
                type: '=',
                expanded: '=',
                onAddItem: '&',
                onRemoveItem: '&'
            },
            link: function (scope, element, attrs) {

            },
            controller: "RemidersDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/reminders/reminders.directive.html'

        };
    }
})();
