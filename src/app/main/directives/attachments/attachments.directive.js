(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdAttachments', AttachmentsDirective);

    /** @ngInject */
    function AttachmentsDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                itemList: '=',
                onAddItem: '&',
                onRemoveItem: '&',
                self: '='
            },
            link: function (scope, element, attrs) {

            },
            controller: "AttachmentsDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/attachments/attachments.directive.html'
        };
    }
})();