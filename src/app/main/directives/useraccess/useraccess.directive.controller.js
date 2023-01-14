(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('UserAccessController', UserAccessController);

    /** @ngInject */

    function UserAccessController($scope, $mdDialog, $document,
        utilService, msUtils, $mdMenu) {
        var vm = this;
        vm.permittedUsers = [];
        vm.deniedUsers = [];
        vm.accessTypes = ['Create', 'Read', 'Update', 'Delete'];
        vm.selectedTypes = [];

        ////////////////////


        vm.memberQuerySearch = memberQuerySearch;
        vm.getGroupName = getGroupName;
        vm.getUser = getUser;
        vm.closeMenu = closeMenu;
        vm.itemFilter = itemFilter;
        vm.addNewPermission = addNewPermission;
        vm.typeExists = typeExists;
        vm.toggleType = toggleType;
        vm.removePermission = removePermission;



        function removePermission(item, event) {
            $scope.onRemoveItem({ "item": item, "event": event });
        };

        function toggleType(item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
            }
            else {
                list.push(item);
            }
        };

        function typeExists(item, list) {
            return list.indexOf(item) > -1;
        };


        function addNewPermission(event) {
            var permission = {
                id: msUtils.guidGenerator(),
                objectType: "",
                objectId: "",
                types: vm.selectedTypes,
                groupIds: vm.selectedUserGroups,
                userIds: vm.permittedUsers.map(function (item) {
                    return item.id;
                }),
                deniedUserIds: vm.deniedUsers.map(function (item) {
                    return item.id;
                })
            }

            $scope.onAddItem({
                "item": permission, "event": event, "callBack": function () {
                    vm.selectedTypes = [];
                    vm.selectedUserGroups = [];
                    vm.permittedUsers = [];
                    vm.deniedUsers = [];
                }
            });

        };

        function itemFilter(item) {
            if (item.deleted) {
                return false;
            }

            return true
        };


        function closeMenu() {
            $mdMenu.hide();
        }

        function getUser(userId) {
            var index = utilService.getIndex($scope.users, 'id', userId);
            if (index >= 0) {
                return $scope.users[index];
            }
            return {};
        }

        function getGroupName(groupId) {
            var index = utilService.getIndex($scope.groups, 'id', groupId);
            if (index >= 0) {
                return $scope.groups[index].name;
            }
        }

        function memberQuerySearch(query) {

            return query ? $scope.users.filter(createFilter(query, "name")) : [];
        }

        function createFilter(query, property) {
            var lowercaseQuery = angular.lowercase(query);
            var prp = property;
            return function filterFn(item) {
                return angular.lowercase(item[prp]).indexOf(lowercaseQuery) >= 0;
            };
        }


    }

})();
