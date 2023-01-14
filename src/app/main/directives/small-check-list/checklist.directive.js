(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdSmallCheckList', smallCheckListDirective);

    /** @ngInject */
    function smallCheckListDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                checkList: '=',
                addNew: '='
            },
            link: function (scope, element, attrs) {

            },
            controller: "smallCheckListDirectiveController",
            controllerAs: 'vm',
            templateUrl: "app/main/directives/small-check-list/small.checklist.directive.html"
        };
    }
})();
