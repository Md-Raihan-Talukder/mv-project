(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('TreeViewCheckBoxDirectiveController', TreeViewCheckBoxDirectiveController);

    /** @ngInject */

    function TreeViewCheckBoxDirectiveController($scope, utilService, commonApiService, PRIMARY_COLUMN_NAME) {
        var vm = this;

        vm.treeOptions = {
            "accept": function (sourceNodeScope, destNodesScope, destIndex) {
                return false;
            }
        };

        // Methods
        vm.addUserAccess = addUserAccess;
        vm.addItem = addItem;
        vm.removeItem = removeItem;
        vm.isRoot = isRoot;
        vm.toggle = toggle;
        vm.selectItem = selectItem;
        vm.addNewItem = addNewItem;


        init();
        function init() {
            commonApiService.getItems(vm, "ORG_DEPARTMENTS", "departments", false);
            vm.items = [];
            vm.options = angular.copy($scope.options);
            if (!vm.options) {
                vm.options = {
                    showUserBtn: true,
                    showAddBtn: true,
                    showRemoveBtn: true,
                    maxLevel: 100
                }
            }
        }


        if ($scope.items) {
            var items = $.grep($scope.items, function (item) {
                return !item.deleted;
            });
            var sortedItems = utilService.sortItems(items);
            createTreeStructure(sortedItems);
            //selectNode($scope.selectedId);
        }

        function createTreeStructure(nodes) {
            var map = {}, node, roots = [];
            for (var i = 0; i < nodes.length; i += 1) {
                node = nodes[i];
                node.nodes = [];
                map[node[PRIMARY_COLUMN_NAME]] = i;
                if (node.parentId) {
                    if (nodes[map[node.parentId]]) {
                        if (!nodes[map[node.parentId]].nodes) {
                            nodes[map[node.parentId]].nodes = [];
                        }

                        nodes[map[node.parentId]].nodes.push(node);
                    }
                } else {
                    roots.push(node);
                }
            }

            vm.items = roots;

        }


        function addUserAccess(node, scope, event) {
            $scope.onAddUserAccess({
                "item": node, "event": event, "callBack": function (newNode) {
                    if (!node.nodes) {
                        node.nodes = [];
                    }
                    node.nodes.push(newNode);
                    scope.expand();
                }
            });

        }

        function addNewItem(event) {
            $scope.onAddItem({
                "event": event, "callBack": function (newNode) {
                    vm.items.push(newNode);
                }
            });
        }

        function addItem(node, scope, event) {
            $scope.onAddItem({
                "item": node, "event": event, "callBack": function (newNode) {
                    if (!node.nodes) {
                        node.nodes = [];
                    }
                    node.nodes.push(newNode);
                    scope.expand();
                }
            });

        }

        function removeItem(node, scope) {

            $scope.onRemoveItem({
                "item": node, "event": event, "callBack": function () {
                    if (scope.$nodeScope.$parentNodeScope) {
                        var parentNode = scope.$nodeScope.$parentNodeScope.$modelValue;
                        var index = utilService.getIndex(parentNode.nodes, PRIMARY_COLUMN_NAME, node[PRIMARY_COLUMN_NAME]);
                        if (index >= 0) {
                            parentNode.nodes.splice(index, 1);
                        }
                    } else {
                        var index = utilService.getIndex(vm.items, PRIMARY_COLUMN_NAME, node[PRIMARY_COLUMN_NAME]);
                        if (index >= 0) {
                            vm.items.splice(index, 1);
                        }

                    }
                }
            });

        }


        function selectItem(node, scope, event) {



            $scope.onSelectItem({
                "item": node, "event": event, "callBack": function (updatedNode) {
                    node.title = updatedNode.title;
                }
            });

        }



        function isRoot(scope) {
            return !scope.$nodeScope.$parentNodeScope;
        }

        function toggle(scope) {
            scope.toggle();
        };

    }

})();
