(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdComments', CommentsDirective);

    /** @ngInject */
    function CommentsDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                itemList: '=',
                onAddItem: '&',
                onRemoveItem: '&'
            },
            link: function (scope, element, attrs) {

            },
            controller: "CommentsDirectiveController",
            controllerAs: 'vm',
            templateUrl: function (el, attr) {
                if (attr) {
                    if (attr.type === 'comment') {
                        return 'app/main/directives/comments/comments.directive.html';
                    } else if (attr.type === 'note') {
                        return 'app/main/directives/comments/notes.directive.html';
                    } else if (attr.type === 'activity') {
                        return 'app/main/directives/comments/activity.directive.html';
                    }
                }
            }
        };
    }
})();