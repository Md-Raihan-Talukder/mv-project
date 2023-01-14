(function () {
    'use strict';

    angular
        .module('app.common')
        .directive('msbAttachments', msbAttachmentsDirective);

    /** @ngInject */
    function msbAttachmentsDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                itemList: '=',
                label: '=',
                onAddItem: '&',
                onRemoveItem: '&',
                doNotShow: '='
            },
            controller: "msbAttachmentsDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/common/directives/attachments/attachments.directive.html'
        };
    }
})();