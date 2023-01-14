(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdTreeViewCheckBox', TreeViewCheckBoxDirective);

    /** @ngInject */
    function TreeViewCheckBoxDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                items: '=',
                selectedId: '=',
                onAddItem: '&',
                onRemoveItem: '&',
                onSelectItem: '&',
                onAddUserAccess: '&',
                options: '=',
                checkedItems: '='
            },
            link: function (scope, element, attrs) {

            },
            controller: "TreeViewCheckBoxDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/treeviewcheckbox/treeview.directive.html'
        };
    }
})();
