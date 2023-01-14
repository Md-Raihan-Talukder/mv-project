(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('DataEntryDialogController', DataEntryDialogController);

    /** @ngInject */
    function DataEntryDialogController(msbCommonApiService, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME, $mdDialog,
        Item, Type, FormId, Column) {
        var vm = this;

        vm.item = angular.copy(Item);
        vm.formId = angular.copy(FormId);
        vm.column = angular.copy(Column);
        vm.type = Type;

        vm.closeDialog = closeDialog;
        vm.onOk = OK;

        init()

        function init() {


            if (!vm.item) {
                if (idRequired()) {
                    msbCommonApiService.getIdFromServer('DATA_ENTRY_FORM', function (data) {
                        if (data) {
                            createNew(angular.copy(data));
                        }
                    });
                } else {
                    vm.isNew = true;
                    vm.item = {};
                }
            }
        }

        function idRequired() {
            if (vm.column) {
                if (vm.column.type === 'multiObject') {
                    return true;
                }
                if (vm.column.serviceKey) {
                    return true;
                }
                return false;
            }
            return true;
        }

        function createNew(idInfo) {
            vm.isNew = true;
            vm.item = {};
            vm.item[PRIMARY_COLUMN_NAME] = idInfo.id;
            vm.item[SERIAL_COLUMN_NAME] = idInfo.slNo;
        }

        function OK() {
            $mdDialog.hide(angular.copy(vm.item));
        }

        function closeDialog() {
            $mdDialog.hide();
        }

    }

})();