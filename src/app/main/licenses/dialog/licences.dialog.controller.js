(function () {
    'use strict';

    angular
        .module('app.licenses')
        .controller('LicensesDialogController', LicensesDialogController);

    /** @ngInject */
    function LicensesDialogController($mdDialog, commonApiService, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME) {
        var vm = this;

        vm.closeDialog = closeDialog;

        function closeDialog() {
            $mdDialog.cancle();

        }

    }
})();
