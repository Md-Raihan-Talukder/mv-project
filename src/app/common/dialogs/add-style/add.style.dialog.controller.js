(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('AddStyleDialogController', AddStyleDialogController);

    function AddStyleDialogController($scope, $mdDialog, Column, HSegment, VSegment, Type, Row) {
        var vm = this;
        vm.closeDialog = closeDialog;
        vm.saveSetup = saveSetup;
        vm.type = Type;
        //////////

        init();

        function init() {
            switch (Type) {
                case 'row':
                    vm.style = angular.copy(Row.style);
                    break;
                case 'column':
                    vm.style = angular.copy(Column.style);
                    break;
                case 'hSegment':
                    vm.style = angular.copy(HSegment.style);
                    break;
                case 'vSegment':
                    vm.style = angular.copy(VSegment.style);
                    break;
                default:
                    vm.style = {};
                    break;
            }
        }

        function saveSetup() {
            $mdDialog.hide({ column: Column, hSegment: HSegment, vSegment: VSegment, type: Type, style: vm.style });
        }

        function closeDialog() {
            $mdDialog.hide();
        }

    }

})();
