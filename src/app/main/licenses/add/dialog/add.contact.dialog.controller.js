(function () {
    'use strict';

    angular
        .module('app.licenses')
        .controller('AddContactDialogController', AddContactDialogController);

    /** @ngInject */
    function AddContactDialogController($scope, $stateParams, OrgName, $mdDialog, Contact, IsLead, OnSaveContact, commonApiService,
        utilService, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME) {
        var vm = this;
        vm.isNew = false;
        vm.closeDialog = closeDialog;
        vm.contactInfo = angular.copy(Contact);
        vm.isLead = IsLead;
        vm.orgName = OrgName;

        vm.addContactInfo = addContactInfo;
        vm.onSaveContact = OnSaveContact;

        init();
        function init() {
            if (!vm.contactInfo) {
                // getting Id from server for adding new Item
                commonApiService.getIdFromServer('LICENSES', function (data) {
                    if (data) {
                        vm.hasId = true;
                        createNewContact(angular.copy(data));
                    }
                });

            } else {
                vm.hasId = true;
            }
        }

        function createNewContact(idInfo) {
            vm.isNew = true;
            vm.contactInfo =
            {
                "TECHDISER_ID": "",
                "active": true,
                "type": "Organization",
                "isLead": vm.isLead
            }

            vm.contactInfo[PRIMARY_COLUMN_NAME] = idInfo.id;
            vm.contactInfo[SERIAL_COLUMN_NAME] = idInfo.slNo;

        }

        function addContactInfo() {
            vm.onSaveContact(vm.contactInfo, vm.isNew);
        }

        function closeDialog() {
            $mdDialog.hide();

        }

    }
})();
