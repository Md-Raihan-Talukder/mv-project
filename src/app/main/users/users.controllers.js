(function () {
    'use strict';

    angular
        .module('app.users')
        .controller('RUsersController', UsersController);

    /** @ngInject */
    function UsersController(utilService, $mdSidenav, PRIMARY_COLUMN_NAME, commonApiService, $mdDialog) {
        var vm = this;

        vm.title = "List of Users";
        vm.isAdmin = false;
        vm.select = select;
        vm.toggleSidenav = toggleSidenav;
        vm.toggleDetails = toggleDetails;
        vm.pinSideNav = pinSideNav;
        vm.openUserDialog = openUserDialog;
        vm.onSave = onSave;
        vm.onDelete = onDelete;

        vm.usersFilters = {
            search: '',
            important: '',
            starred: ''
        };
        vm.usersFiltersDefaults = angular.copy(vm.usersFilters);
        vm.showAllUsers = true;
        vm.toggleFilterWithEmpty = toggleFilterWithEmpty;
        vm.resetFilters = resetFilters;

        vm.showGroupMembers = showGroupMembers;
        vm.showRoleMembers = showRoleMembers;

        init();

        function init() {
            vm.leftNavPined = false;
            commonApiService.getItems(vm, "ORGANIZATIONS", "organizations", false);
            //   var id = "Organization_1";
            //         commonApiService.getItem(vm, "ORGANIZATIONS", id, 'organization', function(){
            //
            //             console.log(vm.organization);
            //             });
            commonApiService.getItems(vm, "USERS", "users", false, function () {
                vm.selected = vm.users[0];
                vm.allUsers = vm.users;
            });
            commonApiService.getItems(vm, "GROUPS", "groups", false);
            commonApiService.getItems(vm, "ROLES", "roles", false);
            commonApiService.getItems(vm, "LICENSE-MODULES", "modules", false);
        }

        function select(user) {
            vm.selected = user;
        }

        function onSave(user, isNew) {
            console.log(user);
            save(user, isNew);
        }

        function onDelete(user) {
            var index = utilService.getIndex(vm.users, PRIMARY_COLUMN_NAME, user[PRIMARY_COLUMN_NAME]);
            if (index < 0) {
                return;
            }

            commonApiService.confirmAndDelete(vm.selected.name + " will be deleted", function () {
                user.deleted = !user.deleted;
                save(user, false);
                vm.selected = null;
            });

        }

        function save(user, isNew) {
            commonApiService.saveItem(vm, user, isNew, "USERS", "users", false, function () {
                if (isNew && vm.users.length < vm.allUsers.length) {
                    vm.allUsers.push(user);
                } else {
                    var index = utilService.getIndex(vm.allUsers, PRIMARY_COLUMN_NAME, user[PRIMARY_COLUMN_NAME]);
                    if (index > -1) {
                        vm.allUsers[index] = user;
                    }
                }
            });
        }

        function openUserDialog(ev, user) {
            $mdDialog.show({
                controller: 'UsersDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/main/users/dialogs/users.dialog.html',
                clickOutsideToClose: true,
                locals: {
                    IsAdmin: vm.isAdmin,
                    User: user,
                    Groups: vm.groups,
                    Roles: vm.roles,
                    OnSave: vm.onSave,
                    OnDelete: vm.onDelete,
                    event: ev
                }
            });
        }

        function pinSideNav(argument) {
            vm.leftNavPined = !vm.leftNavPined;
        }

        function toggleSidenav(sidenavId) {

            if ($mdSidenav(sidenavId).isLockedOpen()) {
                vm.leftNavPined = false;
                $mdSidenav(sidenavId).close();
            } else {
                vm.leftNavPined = true;
                $mdSidenav(sidenavId).toggle();
            }
        }

        function toggleDetails(item) {
            vm.selected = item;
            toggleSidenav('details-sidenav');
        }

        function toggleFilterWithEmpty(filter) {
            if (vm.usersFilters[filter] === '') {
                vm.usersFilters[filter] = true;
            } else {
                vm.usersFilters[filter] = '';
            }
            checkFilters();
        }

        function checkFilters() {
            vm.showAllUsers = !!angular.equals(vm.usersFiltersDefaults, vm.usersFilters);
        }

        function resetFilters() {
            vm.users = vm.allUsers;
            vm.selected = vm.users[0];
            vm.showAllUsers = true;
            vm.usersFilters = angular.copy(vm.usersFiltersDefaults);
            vm.selectedGroupId = false;
            vm.selectedRoleId = false;
        }

        function showGroupMembers(groupId) {
            resetFilters();
            if (vm.selectedGroupId === groupId) {
                vm.selectedGroupId = false;
                resetFilters();
                return;
            }
            vm.users = [];
            for (var i = 0; i < vm.allUsers.length; i++) {
                if (isInGroup(vm.allUsers[i], groupId)) {
                    vm.users.push(vm.allUsers[i]);
                }
            }
            vm.selected = vm.users[0];
            vm.selectedGroupId = groupId;
        }

        function isInGroup(user, groupId) {
            for (var i = 0; i < user.groups.length; i++) {
                if (user.groups[i][PRIMARY_COLUMN_NAME] === groupId) {
                    return true;
                }
            }
            return false;
        }

        function showRoleMembers(roleId) {
            resetFilters();
            if (vm.selectedRoleId === roleId) {
                vm.selectedRoleId = false;
                resetFilters();
                return;
            }
            vm.users = [];
            for (var i = 0; i < vm.allUsers.length; i++) {
                if (vm.allUsers[i].role[PRIMARY_COLUMN_NAME] === roleId) {
                    vm.users.push(vm.allUsers[i]);
                }
            }
            vm.selected = vm.users[0];
            vm.selectedRoleId = roleId;
        }
    }
})();
