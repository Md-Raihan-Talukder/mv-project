(function () {
    'use strict';

    angular
        .module('app.users')
        .controller('UsersDialogController', UsersDialogController);

    /** @ngInject */
    function UsersDialogController($mdDialog, $stateParams, IsAdmin, utilService, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME, commonApiService, User, Groups, Roles, OnSave, OnDelete) {
        var vm = this;
        vm.isNew = false;
        vm.user = angular.copy(User);
        vm.groups = angular.copy(Groups);
        vm.roles = angular.copy(Roles);
        vm.isAdmin = angular.copy(IsAdmin);
        vm.organizationId = $stateParams.id;
        vm.onSave = OnSave;
        vm.saveTask = saveTask;
        vm.onDelete = OnDelete;
        vm.closeDialog = closeDialog;
        vm.closeMenu = closeMenu;
        vm.deleteUser = deleteUser;

        init();

        function init() {
            if (!vm.user) {
                commonApiService.getIdFromServer('USERS', function (data) {
                    if (data) {
                        vm.hasId = true;
                        createNewUser(angular.copy(data));
                    }
                });

            } else {
                vm.hasId = true;
            }
        }

        function createNewUser(idInfo) {
            vm.isNew = true;
            vm.user = {
                "isAdmin": vm.isAdmin,
                "organizationId": vm.organizationId,
                "name": "",
                "email": "",
                "phonenumber": "",
                "designation": "",
                "deleted": false,
                "important": false,
                "starred": false,
                "preview": "assets/images/avatars/Tyson.jpg",
                "groups": [],
                "role": {}
            };

            vm.user[PRIMARY_COLUMN_NAME] = idInfo.id;
            vm.user[SERIAL_COLUMN_NAME] = idInfo.slNo;
        }

        function saveTask() {
            $mdDialog.hide();
            vm.onSave(vm.user, vm.isNew);
        }
        function deleteUser() {
            $mdDialog.hide();
            vm.onDelete(vm.user);
        }

        function closeDialog() {
            $mdDialog.hide();
        }

        function closeMenu() {
            $mdMenu.hide();
        }
    }

})();
