(function () {
    'use strict';

    angular
        .module('app.licenses')
        .controller('NewLicenseController', NewLicenseController);

    /** @ngInject */
    function NewLicenseController($rootScope, $scope, $window, $stateParams, commonApiService, $mdDialog, msUtils, utilService, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME) {
        var vm = this;

        vm.backToList = backToList;
        vm.addContactDialog = addContactDialog;
        vm.activationDate = new Date();
        vm.toggleActiveModule = toggleActiveModule;
        vm.saveLicense = saveLicense;
        vm.organizationChanged = organizationChanged;
        vm.formChanged = formChanged;
        vm.onSaveContact = onSaveContact;
        vm.licenseActivation = licenseActivation;
        vm.createCheckList = createCheckList;

        init();
        function init() {
            vm.organizationId = $stateParams.id;
            vm.licenseType = ["Master", "Guru", "Custom"];
            commonApiService.getItems(vm, "ORGANIZATIONS", "organizations", false);
            commonApiService.getItems(vm, "LICENSE-MODULES", "modules", false);
            var params = [{ "key": "organizationId", "value": vm.organizationId }];
            // get multiple Item according to params
            commonApiService.getItems(vm, "LICENSES", "license", params, function () {
                vm.license = vm.license[0];
                getNumberOfUsers();
            });


            if (!vm.organizationId) {
                // getting Id from server for adding new Item
                commonApiService.getIdFromServer('LICENSES', function (data) {
                    if (data) {
                        vm.hasId = true;
                        createNewLicense(angular.copy(data));
                    }
                });

            } else {
                vm.hasId = true;
                commonApiService.getItems(vm, "ORGANIZATIONS", vm.organizationId, "organization");
            }

            vm.minDate = new Date(
                vm.activationDate.getFullYear(), vm.activationDate.getMonth() - 1, vm.activationDate.getDate()
            );
            vm.maxDate = new Date(
                vm.activationDate.getFullYear(), vm.activationDate.getMonth() + 2, vm.activationDate.getDate()
            );

        }

        function getNumberOfUsers() {
            if (vm.license) {
                vm.getUserPerModule = [];
                var totalUsers = 0;
                for (var i = 0; i < vm.license.organizationInfo.users.modules.length; i++) {
                    var prevModule = totalUsers;
                    for (var j = 0; j < vm.license.organizationInfo.users.modules[i].roles.length; j++) {
                        if (vm.license.organizationInfo.users.modules[i].roles[j].numberOfUsers > -1 && vm.license.organizationInfo.users.modules[i].roles[j].numberOfUsers < 100) {
                            totalUsers = totalUsers + parseInt(vm.license.organizationInfo.users.modules[i].roles[j].numberOfUsers);
                            var perModule = totalUsers - prevModule;
                        }

                    }
                    if (!isNaN(perModule)) {
                        vm.getUserPerModule.push(perModule);
                    }

                }
                vm.license.organizationInfo.numberOfUsers = totalUsers;
                //console.log(vm.license.getUserPerModule);
            }
        }

        function createNewLicense(idInfo) {

            vm.isNew = true;
            vm.license = {
                "TECHDISER_ID": "",
                "organizationInfo": {
                    "contactInfo": [],
                    "users": {
                        "modules": []
                    }
                },
                "licenseInfo": {
                    "activationDate": vm.activationDate,
                    "tenure": 12,
                    "validityDate": vm.validityDate
                },
                "modules": angular.copy(vm.modules), // copying the original module into the license module
                "checklist": []
            };
            // assigning Id from server to TECHDISER_ID
            vm.license[PRIMARY_COLUMN_NAME] = idInfo.id;
            vm.license[SERIAL_COLUMN_NAME] = idInfo.slNo;
            vm.license.organizationInfo.users.modules = vm.modules;

        }

        // Toggle active/inactive all features coresponding to the module
        function toggleActiveModule(module) {

            var index = utilService.getIndex(vm.license.modules, PRIMARY_COLUMN_NAME, module[PRIMARY_COLUMN_NAME]);

            var i;
            for (i = 0; i < vm.license.modules[index].features.length; i++) {
                if (module.active == true) {
                    vm.license.modules[index].features[i].active = false;
                }
                else {
                    vm.license.modules[index].features[i].active = true;
                }
            }
            //console.log(vm.license.modules);
            $rootScope.unSaveState = true;
        }

        function createCheckList(name) {
            var chkList = {
                "name": name,
                "id": msUtils.guidGenerator(),
                "checkItemsChecked": 0,
                "checkItems": [
                ]

            }

            vm.license.checklist.push(chkList);
            //console.log(vm.license);
        }

        vm.checkListDirective = {

            onAddItem: function (item) {
                var index = vm.license.checklist.indexOf(item.checkList)
                if (index >= 0) {
                    vm.license.checklist[index].checkItems.push(item.newCheckItem);
                    return true;
                }
            },
            onRemoveItem: function (item) {
                var index = vm.license.checklist.indexOf(item.checkList)
                if (index >= 0) {
                    var itemIndex = vm.license.checklist[index].checkItems.indexOf(item.newCheckItem);
                    if (itemIndex >= 0) {
                        vm.license.checklist[index].checkItems.splice(itemIndex, 1);
                        return true;
                    }
                }

            },
            onRemoveCheckList: function (item) {
                var index = vm.license.checklist.indexOf(item)
                if (index >= 0) {
                    vm.license.checklist.splice(index, 1);
                    return true;
                }
            }
        }

        function licenseActivation() {
            $rootScope.unSaveState = true;

        }

        function saveLicense(license, isNew) {

            getNumberOfUsers();
            var calculatedDate = calculateValidityDate(license.licenseInfo.activationDate, license.licenseInfo.tenure);
            vm.license.licenseInfo.validityDate = calculatedDate.validityDate;
            //vm.license.licenseInfo.remainingInDay = calculatedDate.remainingInDay;
            commonApiService.saveItem(vm, license, isNew, "LICENSES", "licenses", false, function () {
                utilService.showToast(
                    'Saved successfully.',
                    'success-toast',
                    3000
                );
                $rootScope.unSaveState = false;
            });
        }

        function calculateValidityDate(a, t) {
            if (a) {
                var strDate = a.split('-');
                var aYear = parseInt(strDate[0]);
                var aMonth = parseInt(strDate[1]);
                var ddtt = strDate[2];
                var strTime = ddtt.split(' ');
                var aDay = parseInt(strTime[0]);
                if (aDay < 10) {
                    aDay = "0" + aDay;
                }
                var aTime = strTime[1];
                //console.log(yy+mm+dd);
                var vYear = aYear + Math.floor((aMonth + t) / 12);
                var vMonth = "0" + ((aMonth + t) % 12);

                var vDate = vYear + "-" + vMonth + "-" + aDay + " " + aTime;
                var validityDate = vDate.toString();
            }


            return {
                validityDate: validityDate
                //remainingInDay:remainingInDay
            }

        }

        function organizationChanged() {
            commonApiService.getItem(vm, "ORGANIZATIONS", vm.license.organizationId, 'organization', function () {
                vm.license.organizationInfo.name = vm.organization.name;

            });
            $rootScope.unSaveState = true;

        }
        function formChanged() {
            $rootScope.unSaveState = true;
        }

        function backToList() {
            $window.history.back();
        }

        function addContactDialog(event, contact, isLead) {

            $mdDialog.show({
                controller: 'AddContactDialogController',
                controllerAs: 'vm',
                clickOutsideToClose: true,
                preserveScope: true,
                templateUrl: 'app/main/licenses/add/dialog/add-contact-dialog.html',
                locals: {
                    Contact: contact,
                    IsLead: isLead,
                    OnSaveContact: onSaveContact,
                    event: event,
                    OrgName: vm.license.organizationInfo.name
                }
            });
        }

        function onSaveContact(contact, isNew) {
            if (isNew == true) {
                vm.license.organizationInfo.contactInfo[vm.license.organizationInfo.contactInfo.length] = contact;
            }
            else {
                var index = utilService.getIndex(vm.license.organizationInfo.contactInfo, PRIMARY_COLUMN_NAME, contact[PRIMARY_COLUMN_NAME]);
                //console.log(index);
                vm.license.organizationInfo.contactInfo[index] = contact;
            }
            //console.log(vm.license);
            $mdDialog.hide();
            $rootScope.unSaveState = true;

        }



    }
})();
