(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('BarcodeTypeDialogController', BarcodeTypeDialogController);

    /** @ngInject */
    function BarcodeTypeDialogController($mdDialog, msbCommonApiService, Barcode) {
        var vm = this;
        vm.selected = angular.copy(Barcode);
        vm.selectBarcode = selectBarcode;
        vm.closeDialog = closeDialog;
        vm.onOk = OK;

        init()

        function init() {

            msbCommonApiService.interfaceManager(function (data) {
                vm.barcodeGroups = data;
            }, "barcodeService", "getBarcodeGroups");

        }

        function selectBarcode(barcode) {
            vm.selected = barcode;
        }

        function OK() {
            $mdDialog.hide(vm.selected);
        }

        function closeDialog() {
            $mdDialog.hide();
        }

    }

})();