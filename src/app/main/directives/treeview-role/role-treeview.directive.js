(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdRoleTreeView', tdRoleTreeView);

    /** @ngInject */
    function tdRoleTreeView() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                item: '=',
                treeData: '=',
                selectedItems: '=',
                selectedId: '=',
                onAddItem: '&',
                onSelectRole: '&',
                onRemoveItem: '&',
                onSelectItem: '&',
                onCheckTreeNode: '&',
                onAddUserAccess: '&',
                options: '=',
                type: '='
            },
            link: function (scope, element, attrs) {

            },
            controller: "RoleTreeViewDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/treeview-role/role-treeview.directive.html'
        };
    }
})();
