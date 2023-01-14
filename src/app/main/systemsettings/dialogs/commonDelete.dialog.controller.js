(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('CommonDeleteDialogController', CommonDeleteDialogController);

    /** @ngInject */
    function CommonDeleteDialogController(systemUtils, SelectedItems, OnDelete, ClearSelectedItems, ItemType) {
        var vm = this;
        vm.closeDialog = systemUtils.closeDialog;
        vm.deleteItem = angular.copy(OnDelete);
        vm.deleteAllItems = deleteAllItems;
        vm.selectedItems = angular.copy(SelectedItems);
        vm.clearSelectedItems = angular.copy(ClearSelectedItems);
        vm.itemType = angular.copy(ItemType);

        function deleteAllItems() {
            vm.selectedItems.forEach(function (item) {
                vm.deleteItem(item);
            });
            vm.closeDialog();
            vm.clearSelectedItems();
        }
    }
})();
