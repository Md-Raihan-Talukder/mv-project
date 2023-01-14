(function () {
    'use strict';

    angular
        .module('app.licenses')
        .controller('AddMangroveContactDialogController', AddMangroveContactDialogController);

    /** @ngInject */
    function AddMangroveContactDialogController($scope, $mdDialog, MangroveContact, OnSaveMangroveContact, commonApiService, utilService, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME) {
        var vm = this;
        vm.isNew = false;
        vm.closeDialog = closeDialog;
        vm.mangroveContactInfo = angular.copy(MangroveContact);
        //console.log(Contact);
        vm.addContactInfo = addContactInfo;
        vm.onSaveMangroveContact = OnSaveMangroveContact;

        init();
        function init() {
            if (!vm.mangroveContactInfo) {
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
            vm.mangroveContactInfo =
            {
                "TECHDISER_ID": "",
                "active": true
            }

            vm.mangroveContactInfo[PRIMARY_COLUMN_NAME] = idInfo.id;
            vm.mangroveContactInfo[SERIAL_COLUMN_NAME] = idInfo.slNo;

        }

        function addContactInfo() {
            vm.onSaveMangroveContact(vm.mangroveContactInfo, vm.isNew);
        }

        function closeDialog() {
            $mdDialog.hide();

        }

    }
})();
