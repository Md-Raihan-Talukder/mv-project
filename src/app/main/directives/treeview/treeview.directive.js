(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdTreeView', TreeViewDirective);

    /** @ngInject */
    function TreeViewDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                items: '=',
                isShorted: '=',
                selectedId: '=',
                onAddItem: '&',
                onRemoveItem: '&',
                onSelectItem: '&',
                onCheckTreeNode: '&',
                onAddUserAccess: '&',
                options: '='
            },
            link: function (scope, element, attrs) {

            },
            controller: "TreeViewDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/treeview/treeview.directive.html'
        };
    }
})();
