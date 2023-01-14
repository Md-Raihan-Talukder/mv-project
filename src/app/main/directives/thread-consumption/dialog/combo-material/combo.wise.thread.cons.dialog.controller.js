(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('ComboWiseThreadConsDialogController', ComboWiseThreadConsDialogController);

    function ComboWiseThreadConsDialogController($mdDialog, ComboThreadCons, ComboDefinition) {

        var vm = this;

        vm.title = "Combo Wise Thread Consumption";
        vm.closeDialog = closeDialog;
        vm.ok = ok;
        vm.getComboConsumption = getComboConsumption;

        init();

        function init() {
            if (!ComboThreadCons) {
                vm.comboThreadCons = [];
            }
            else {
                vm.comboThreadCons = angular.copy(ComboThreadCons);
            }
            if (ComboDefinition) {
                vm.comboDefinition = angular.copy(ComboDefinition);
            }

        }

        function getComboConsumption(combo) {

            var items = [];

            if (vm.comboThreadCons) {
                vm.comboThreadCons.forEach(function (item) {
                    if (item && item.comboId && item.comboId == combo.TECHDISER_ID) {
                        items.push(item);
                    }
                });
            }

            return items;

        }

        function ok() {
            $mdDialog.hide();
        }

        function closeDialog() {
            $mdDialog.hide();
        }

    }
})();
