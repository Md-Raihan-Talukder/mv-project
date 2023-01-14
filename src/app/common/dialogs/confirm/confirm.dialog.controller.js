(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('MsbConfirmDialogController', MsbConfirmDialogController);

    /** @ngInject */
    function MsbConfirmDialogController(Items, Type, $mdDialog, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME) {
        var vm = this;
        vm.items = angular.copy(Items);
        vm.type = angular.copy(Type);

        vm.closeDialog = closeDialog;
        vm.onOk = OK;

        init()

        function init() {
            vm.displayItems = [];

            if (!vm.type) {
                vm.type = 'items';
            }

            for (var i = 0; i < vm.items.length; i++) {
                var item = vm.items[i], displayItem = [];
                for (var key in item) {
                    var value = item[key];
                    if (key === PRIMARY_COLUMN_NAME || key === SERIAL_COLUMN_NAME) { continue; }
                    displayItem.push(key + " : " + value);
                }

                vm.displayItems.push(displayItem.join(", "));
            }
        }

        function OK() {
            $mdDialog.hide(true);
        }

        function closeDialog() {
            $mdDialog.hide();
        }

    }

})();