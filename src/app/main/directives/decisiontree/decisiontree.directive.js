(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdDecisionTree', decisionTreeDirective);

    /** @ngInject */
    function decisionTreeDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                treeData: '=',
                isShrinked: '=',
                tid: '=',
                selectedNodes: '=',
                choice: '=',
                activities: '=',
                selectedCase: '=',
                area: '=',
            },
            controller: "decisionTreeDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/decisiontree/decisiontree.html'

        };
    }


})();