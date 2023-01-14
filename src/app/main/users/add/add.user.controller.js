(function () {
    'use strict';

    angular
        .module('app.users')
        .controller('RAddUserController', AddUserController);

    /** @ngInject */
    function AddUserController($rootScope, $scope, $window, $stateParams, commonApiService, $mdDialog, msUtils, utilService, PERMISSION_DIRECTIVE_MODES, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME) {
        var vm = this;

        vm.backToList = backToList;
        vm.saveUser = saveUser;
        vm.isNew = false;
        vm.getPermissionSet = getPermissionSet;
        vm.formChanged = formChanged;
        // vm.calculate = function(){
        //     console.log("cal");
        // }
        vm.permissionDirectiveModes = PERMISSION_DIRECTIVE_MODES;

        init();
        function init() {
            commonApiService.getItems(vm, "LICENSE-MODULES", "modules", false);

            var id = "Organization_1";
            var params1 = [{ "key": "organizationId", "value": id }];
            commonApiService.getItem(vm, "ORGANIZATIONS", id, 'organization', function () {
                console.log(vm.organization);
            });
            commonApiService.getItems(vm, "USERS", "users", false);
            commonApiService.getItems(vm, "GROUPS", "groups", params1);

            if (!$stateParams.id) {
                commonApiService.getIdFromServer('USERS', function (data) {
                    if (data) {
                        vm.hasId = true;
                        createNewUser(angular.copy(data));
                    }
                });

            } else {
                vm.hasId = true;
                // update time
                commonApiService.getItem(vm, "USERS", $stateParams.id, 'user');
            }
        }



        function createNewUser(idInfo) {
            vm.isNew = true;
            vm.user = {
                "isAdmin": false,
                "organizationId": vm.organizationId,
                "name": "",
                "email": "",
                "phonenumber": "",
                "designation": "",
                "deleted": false,
                "important": false,
                "starred": false,
                "preview": "assets/images/avatars/Reyna.jpg",
                "groups": [],
                "userPermission": angular.copy(vm.modules),
                "denyPermissions": angular.copy(vm.modules)
            };

            vm.user[PRIMARY_COLUMN_NAME] = idInfo.id;
            vm.user[SERIAL_COLUMN_NAME] = idInfo.slNo;

        }

        function formChanged() {
            $rootScope.unSaveState = true;
        }

        function getPermissionSet() {
            console.log(vm.user.additionalRoles);

            if (vm.user.permissionSet) {
                var permissionSet = vm.user.permissionSet;
            }
            else {
                var permissionSet = angular.copy(vm.modules);
            }

            // Thinking like a pro
            if (vm.user.role == "No Role") {
                vm.user.role = null;
            }

            var id = "Organization_1";
            commonApiService.getItem(vm, "ORGANIZATIONS", id, 'organization', function () {

                // START
                // checking who is active among roles,groups and user permissions
                if (vm.user.role || vm.user.groups.length > 0 || vm.user.userPermission.length > 0 || vm.user.additionalRoles.length > 0) {
                    var index = utilService.getIndex(vm.organization.roles, "title", vm.user.role);
                    var a, b, c, d, e, f;
                    var module = angular.copy(vm.modules);
                    var role = vm.organization.roles[index];
                    var additionalRoles = vm.user.additionalRoles;
                    var group = vm.user.groups;
                    var nullifiedPosition = [];
                    // touching every activity and their permissions
                    for (a = 0; a < module.length; a++) {
                        for (b = 0; b < module[a].features.length; b++) {
                            for (c = 0; c < module[a].features[b].functionalities.length; c++) {

                                // write fun and accessTypes conflict removal code
                                var nullified = false;
                                permissionSet[a].features[b].functionalities[c].isNullified = nullified;
                                if (vm.user.role && role.permissions[a].features[b].functionalities[c].accessTypes.length > 0) {
                                    var roleArray = [];
                                    roleArray = roleArray.concat(role.permissions[a].features[b].functionalities[c].accessTypes);
                                    permissionSet[a].features[b].functionalities[c].accessTypes = permissionSet[a].features[b].functionalities[c].accessTypes
                                        .concat(roleArray);
                                    console.log(role.permissions[a].features[b].functionalities[c].accessTypes);
                                    for (d = 0; d < module[a].features[b].functionalities[c].activities.length; d++) {
                                        if (vm.user.userPermission[a].features[b].functionalities[c].activities[d].accessTypes.length > 0) {
                                            nullified = true;

                                        }
                                    }
                                    if (nullified) {
                                        permissionSet[a].features[b].functionalities[c].isNullified = nullified;
                                        //continue;
                                    }

                                }
                                else {
                                    var roleArray = [];
                                    permissionSet[a].features[b].functionalities[c].accessTypes = module[a].features[b].functionalities[c].accessTypes
                                        .concat(roleArray);
                                }

                                // some ligic must be added here after eid-ul-fitre
                                var nullifiedAddRoles = false;

                                permissionSet[a].features[b].functionalities[c].isNullified = nullifiedAddRoles;
                                if (additionalRoles) {
                                    if (additionalRoles.length > 0) {

                                        var additionalRolesArray = [];
                                        for (var r = 0; r < additionalRoles.length; r++) {
                                            //var additionalRolesArray2 = additionalRolesArray.concate(role.permissions[a].features[b].functionalities[c].accessTypes);
                                            additionalRolesArray = additionalRolesArray.concat(additionalRoles[r].permissions[a].features[b].functionalities[c].accessTypes);

                                            console.log(additionalRolesArray);

                                        }
                                        // Issue to be fix
                                        permissionSet[a].features[b].functionalities[c].accessTypes = permissionSet[a].features[b].functionalities[c].accessTypes
                                            .concat(additionalRolesArray);

                                        //console.log(role.permissions[a].features[b].functionalities[c].accessTypes);
                                        for (var g = 0; g < additionalRoles.length; g++) {
                                            if (additionalRoles[g].permissions[a].features[b].functionalities[c].accessTypes.length > 0) {
                                                for (f = 0; f < module[a].features[b].functionalities[c].activities.length; f++) {
                                                    if (vm.user.userPermission[a].features[b].functionalities[c].activities[f].accessTypes.length > 0) {
                                                        nullifiedAddRoles = true;

                                                    }
                                                }
                                            }

                                            if (nullifiedAddRoles) {
                                                permissionSet[a].features[b].functionalities[c].isNullified = nullifiedAddRoles;
                                                //continue;
                                            }
                                        }


                                    }
                                    else if (vm.user.role) {
                                        permissionSet[a].features[b].functionalities[c].accessTypes = [];
                                        var roleArray = [];
                                        roleArray = roleArray.concat(role.permissions[a].features[b].functionalities[c].accessTypes);
                                        permissionSet[a].features[b].functionalities[c].accessTypes = permissionSet[a].features[b].functionalities[c].accessTypes
                                            .concat(roleArray);
                                    }
                                    else {
                                        additionalRolesArray = [];
                                        permissionSet[a].features[b].functionalities[c].accessTypes = module[a].features[b].functionalities[c].accessTypes
                                            .concat(additionalRolesArray);
                                    }
                                }



                                for (d = 0; d < module[a].features[b].functionalities[c].activities.length; d++) {

                                    // if additionalRoles selected, merge their accessTypes or create empty accessTypes
                                    if (additionalRoles) {
                                        if (additionalRoles.length > 0) {
                                            var additionalRolesMergedAccess = [];
                                            for (e = 0; e < additionalRoles.length; e++) {

                                                additionalRolesMergedAccess = additionalRolesMergedAccess.concat(additionalRoles[e].permissions[a].features[b].functionalities[c].activities[d].accessTypes);

                                            }
                                        }
                                        else {
                                            var additionalRolesMergedAccess = [];
                                        }
                                    }

                                    // if groups selected, merge their accessTypes or create empty accessTypes
                                    if (group.length > 0) {
                                        var groupMergedAccess = [];
                                        for (e = 0; e < group.length; e++) {
                                            if (group[e].permissions[a].features[b].functionalities[c].activities[d].accessTypes[0] == "1") {
                                                groupMergedAccess = groupMergedAccess.concat(group[e].permissions[a].features[b].functionalities[c].activities[d].accessTypes[0]);
                                            }
                                        }
                                    }
                                    else {
                                        var groupMergedAccess = [];
                                    }
                                    // if role selected, merge their accessTypes or create empty accessTypes

                                    if (role) {
                                        var psAccessType = role.permissions[a].features[b].functionalities[c].activities[d].accessTypes.concat(groupMergedAccess);
                                        //psAccessType.concat(additionalRolesMergedAccess);
                                    }
                                    else {
                                        var psAccessType = groupMergedAccess;
                                        //psAccessType.concat(groupMergedAccess);
                                        //permissionSet[a].features[b].functionalities[c].accessTypes = []; // Main Bug
                                    }
                                    // merge role's accessTypes with userpermissions
                                    psAccessType = psAccessType.concat(vm.user.userPermission[a].features[b].functionalities[c].activities[d].accessTypes);
                                    psAccessType = psAccessType.concat(additionalRolesMergedAccess);

                                    // final permission set
                                    permissionSet[a].features[b].functionalities[c].activities[d].accessTypes = psAccessType;
                                    if (vm.user.denyPermissions[a].features[b].functionalities[c].activities[d].isDenied == true) {
                                        permissionSet[a].features[b].functionalities[c].activities[d].accessTypes = [];
                                        console.log("permission denied");
                                    }

                                }
                            }
                        }

                    }
                    vm.user.permissionSet = permissionSet;
                }
                // DONE

            });

        }
        function saveUser() {
            getPermissionSet();
            commonApiService.saveItem(vm, vm.user, true, "USERS", "users", false, function () {
                utilService.showToast(
                    'Saved successfully.',
                    'success-toast',
                    3000
                );
                $rootScope.unSaveState = false;
                console.log(vm.user);
            });
        }

        function backToList() {
            $window.history.back();
        }


    }
})();
