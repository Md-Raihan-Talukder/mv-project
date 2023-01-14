(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('FormLayoutColumnDialogController', FormLayoutColumnDialogController);

    /** @ngInject */
    function FormLayoutColumnDialogController($scope, $mdDialog, utilService,
        HSegment, VSegment, Columns) {

        var vm = this;
        vm.columns = Columns;
        vm.column = angular.copy(VSegment);
        vm.hSegment = angular.copy(HSegment);

        vm.closeDialog = closeDialog;
        vm.saveSetup = saveSetup;
        vm.onColumnChange = onColumnChange;
        vm.hasColumnInGroup = hasColumnInGroup;

        init();

        function init() {

        }

        function hasColumnInGroup(item) {
            for (var i = 0; i < vm.columns.length; i++) {
                if (vm.columns[i].type === 'group' && vm.columns[i].columns && vm.columns[i].columns.length) {
                    return vm.columns[i].columns.indexOf(item.data) > -1;
                }
            }

        }

        function onColumnChange() {
            var index = utilService.getIndex(vm.columns, 'data', vm.column.dataProperty);
            if (index >= 0) {
                vm.column.dataValue = vm.columns[index].title;
            }
        }

        function saveSetup() {
            $mdDialog.hide({ vSegment: vm.column, hSegment: vm.hSegment });
        }

        function closeDialog() {
            $mdDialog.hide();
        }

    }

})();