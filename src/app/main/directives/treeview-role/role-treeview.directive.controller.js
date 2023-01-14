(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('RoleTreeViewDirectiveController', RoleTreeViewDirectiveController);

    /** @ngInject */

    function RoleTreeViewDirectiveController($scope, utilService, PRIMARY_COLUMN_NAME,
        msbUtilService, msbCommonApiService, PERSON_IMG_HOLDER, roleManagerService) {
        var vm = this;
        vm.personImgHolder = PERSON_IMG_HOLDER;
        vm.treeOptions = {
            "accept": function (sourceNodeScope, destNodesScope, destIndex) {
                return false;
            }
        };
        vm.item = $scope.item;
        vm.selectedNodes = $scope.selectedItems;
        // Methods
        vm.addUserAccess = addUserAccess;
        vm.addItem = addItem;
        vm.removeItem = removeItem;
        vm.isRoot = isRoot;
        vm.toggle = toggle;
        vm.selectRole = selectRole;
        vm.selectItem = selectItem;
        vm.addNewItem = addNewItem;
        vm.checkTreeNode = checkTreeNode;
        vm.selectRow = selectRow;
        vm.checkNodeExist = checkNodeExist;
        vm.checkIfLead = checkIfLead;

        init();
        function init() {
            vm.treeType = $scope.type;
            vm.items = [];
            vm.options = angular.copy($scope.options);
            if (!vm.options) {
                vm.options = {
                    showUserBtn: true,
                    showAddBtn: true,
                    showRemoveBtn: true,
                    maxLevel: 100,
                    isExpanded: false,
                    showRightCheck: true
                }
            }
        }
        function selectRow(nodeId) {
            vm.selectedRowId = nodeId;
        }

        if ($scope.treeData) {
            var items = $.grep($scope.treeData, function (item) {
                return !item.deleted;
            });
            createTreeStructure(items);
            $scope.$broadcast('angular-ui-tree:expand-all');
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

        function selectRole(node) {
            if (node && node.isRole == true) {
                $scope.onSelectRole({ "item": node });
            }
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
        function checkTreeNode(nodeId, isAll) {
            if (!nodeId) {
                return;
            }
            else {
                nodeId = angular.copy(nodeId);
            }
            if (isAll === true) {
                nodeId = nodeId + "#ALL";
            }

            if (vm.treeType === 'role') {
                if (vm.selectedNodes[0] && (vm.selectedNodes[0] == nodeId)) {
                    vm.selectedNodes.splice(0, 1);
                }
                else {
                    vm.selectedNodes[0] = nodeId;
                }


            }
            else if (vm.treeType === 'additionalRoles' || vm.treeType === 'approvals' || vm.treeType === 'reporting' || vm.treeType === 'monitoring') {
                var nodeInd = vm.selectedNodes.indexOf(nodeId);
                if (nodeInd > -1) {
                    vm.selectedNodes.splice(nodeInd, 1);
                }
                else {
                    vm.selectedNodes.push(nodeId);
                }
                $scope.onCheckTreeNode({ "item": vm.selectedNodes });
            }
            $scope.selectedItems = vm.selectedNodes;
            console.log(vm.selectedNodes);
        }

        function checkNodeExist(nodeId, isAll) {
            if (nodeId) {
                if (isAll === true) {
                    nodeId = angular.copy(nodeId) + "#ALL";
                }
                var nodeInd = vm.selectedNodes.indexOf(nodeId);
                if (nodeInd > -1) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        function checkIfLead(roleId) {
            return roleManagerService.isLead(roleId);
        }
        vm.selectPostTeamUnit = selectPostTeamUnit;

        function selectPostTeamUnit(type, isAll) {

            var data = {
                "nid": type.TECHDISER_ID,
                "title": type.title,
                "isRole": true,
                "isAll": isAll
            }
            vm.selectedRoleId = data.nid;
            // $scope.onSelectItem({"item": data, "event": null, "callBack": null});
            $scope.onSelectRole({ "item": data });
        }

        function selectItem(node) {
            if (node) {
                // Getting node data
                vm.selectedRoleId = node.nid;
                var orgId = msbUtilService.getOrganizationId();
                var param = [{ "key": "orgId", "value": orgId }, { "key": "item", "value": node }]
                msbCommonApiService.interfaceManager(function (data) {
                    if (data) {
                        vm.selectedNodeData = data;
                    }
                }, "roleManagerService", "getRoleDeptData", param);
                // End of getting node data
                vm.selectedNode = node;
                $scope.onSelectRole({ "item": node });
            }
        }
        function isRoot(scope) {
            return !scope.$nodeScope.$parentNodeScope;
        }

        function toggle(scope) {
            scope.toggle();
        };

    }

})();
