(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('TreeselectorDialogController', TreeselectorDialogController);

    /** @ngInject */
    function TreeselectorDialogController($mdDialog, Items) {
        var vm = this;
        vm.closeDialog = closeDialog;
        vm.selectItem = selectItem;

        init()

        function init() {
            vm.treeOptions = {
                showUserBtn: false,
                showAddBtn: false,
                showRemoveBtn: false,
                maxLevel: 100
            }

            vm.items = angular.copy(Items)
        }

        function selectItem(item, event, callBack) {
            $mdDialog.hide(item);
        }

        function closeDialog() {
            $mdDialog.hide();
        }


    }

})();