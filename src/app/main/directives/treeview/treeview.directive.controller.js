(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('TreeViewDirectiveController', TreeViewDirectiveController);

    /** @ngInject */

    function TreeViewDirectiveController(msbUtilService, $scope, utilService, PRIMARY_COLUMN_NAME) {
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
        vm.checkTreeNode = checkTreeNode;
        vm.selectRow = selectRow;
        init();
        function init() {
            vm.items = [];
            vm.options = angular.copy($scope.options);
            if (!vm.options) {
                vm.options = {
                    showUserBtn: true,
                    showAddBtn: true,
                    showRemoveBtn: true,
                    maxLevel: 100,
                    isExpanded: false
                }
            }
        }

        function selectRow(nodeId) {
            vm.selectedRowId = nodeId;
        }

        if ($scope.items) {
            var items = $.grep($scope.items, function (item) {
                return !item.deleted;
            });
            if (!$scope.isShorted) {
                var sortedItems = utilService.sortItems(items);
                createTreeStructure(sortedItems);
            }
            createTreeStructure(items);
            $scope.$broadcast('angular-ui-tree:expand-all');
            selectNode($scope.selectedId);
        }

        function selectNode(id) {
            if (id) {
                var selectedItems = msbUtilService.getItemsByProperties($scope.items, [{ "key": "TECHDISER_ID", "value": id }]);
            }
            if (selectedItems && selectedItems[0]) {
                $scope.onSelectItem({ item: selectedItems[0] });
            }
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

        function checkTreeNode(node) {
            if (node) {
                if (vm.selectedTreeNode && (vm.selectedTreeNode.TECHDISER_ID == node.TECHDISER_ID)) {
                    vm.selectedTreeNode = null;
                }
                else {
                    vm.selectedTreeNode = node;
                }
                $scope.onCheckTreeNode({ "item": node });
            }
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
