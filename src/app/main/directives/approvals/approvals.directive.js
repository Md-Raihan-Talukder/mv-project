(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('approvalsDirective', approvalsDirective);

    /** @ngInject */
    function approvalsDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                accordion: '=',
                index: '=',
                oninfochange: '&',
                dataremove: '&',
                showPlan: '=',
                showActual: '=',
                workdaysChanged: '&',
            },
            link: function (scope, element, attrs) {

            },
            controller: "ApprovalsController",
            templateUrl: 'app/main/directives/approvals/approvals.directive.html'
        };
    }
})();