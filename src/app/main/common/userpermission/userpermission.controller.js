(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('UserPermissionDialogController', UserPermissionDialogController);

    /** @ngInject */
    function UserPermissionDialogController($mdMenu, $mdDialog, msUtils, commonApiService, Menu, ViewMode) {
        var vm = this;
        vm.isNew = false;
        vm.menu = angular.copy(Menu);
        vm.viewMode = ViewMode;

        ////////
        vm.closeDialog = closeDialog;
        vm.closeMenu = closeMenu;
        vm.addPermission = addPermission;
        vm.removePermission = removePermission;

        init()


        function init() {

            commonApiService.getItems(vm, "USER", "users");
            commonApiService.getItems(vm, "USERGROUP", "userGroups");
            var params = [{ "key": "menuId", "value": vm.menu.id }];
            commonApiService.getItems(vm, "USERPERMISSION", "permissions", params);

        }

        function removePermission(item, event, callBack) {
            $mdDialog.show(commonApiService.getConfirmDef(false, event)).then(function () {

                var permission = angular.copy(item);
                permission.deleted = true;
                commonApiService.saveItem(vm, permission, false, "USERPERMISSION", "permissions", false, callBack);

            }, function () {
                // Cancel Action
            });

        }

        function addPermission(item, event, callBack) {
            var permission = angular.copy(item);
            permission.menuId = angular.copy(vm.menu.id);
            commonApiService.saveItem(vm, permission, true, "USERPERMISSION", "permissions", false, callBack);
        }

        function closeMenu() {
            $mdMenu.hide();
        }

        function closeDialog() {
            $mdDialog.hide();
        }


    }

})();