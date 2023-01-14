(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('DataEntryDialogController', DataEntryDialogController);

    /** @ngInject */
    function DataEntryDialogController(msbCommonApiService, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME, $mdDialog,
        Item, Type, FormId, ColumnDefs, ServiceKey) {
        var vm = this;

        vm.item = angular.copy(Item);
        vm.formId = angular.copy(FormId);
        vm.columnDefs = angular.copy(ColumnDefs);
        vm.serviceKey = ServiceKey;
        vm.type = Type;

        vm.closeDialog = closeDialog;
        vm.onOk = OK;

        init()

        function init() {


            if (!vm.item) {
                if (idRequired()) {
                    msbCommonApiService.getIdFromServer(vm.serviceKey, function (data) {
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
            if (vm.serviceKey) {
                return true;
            }
            return false;
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