(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('DeptWeightDialogController', DeptWeightDialogController);

    /** @ngInject */
    function DeptWeightDialogController(commonApiService, utilService, systemUtils, $mdDialog, systemSettingsValidation, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME) {
        var vm = this;
        vm.closeDialog = closeDialog;
        init();
        function init() {

        }

        function closeDialog() {
            $mdDialog.hide();
        }
    }
})();
