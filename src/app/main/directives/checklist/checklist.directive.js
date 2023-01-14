(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdCheckList', checkListDirective);

    /** @ngInject */
    function checkListDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                itemList: '=',
                onAddItem: '&',
                onRemoveItem: '&',
                onRemoveCheckList: '&'
            },
            link: function (scope, element, attrs) {

            },
            controller: "checkListDirectiveController",
            controllerAs: 'vm',
            templateUrl: function (el, attr) {
                if (attr) {
                    if (!attr.size) {
                        return 'app/main/directives/checklist/checklist.directive.html';
                    } else if (attr.size === 'small') {
                        return 'app/main/directives/checklist/small.checklist.directive.html';
                    }
                }
            }
        };
    }
})();
