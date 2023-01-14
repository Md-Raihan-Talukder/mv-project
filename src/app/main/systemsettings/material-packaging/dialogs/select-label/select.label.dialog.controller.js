(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller("SelectPackageLabelDialogController", SelectPackageLabelDialogController);

    function SelectPackageLabelDialogController(materialPackagingService, Labels, SelectedLabels) {
        var vm = this;
        vm.labels = Labels;
        vm.selectedLabels = SelectedLabels
        vm.okay = okay;
        vm.closeDialog = closeDialog;
        vm.checkLabelExist = checkLabelExist;
        vm.selectLabel = selectLabel;

        init();

        function init() {
            if (!angular.isArray(vm.selectedLabels)) {
                vm.selectedLabels = [];
            }
        }

        function selectLabel(label) {
            materialPackagingService.addOrRemoveLabel(vm.selectedLabels, label);
        }

        function checkLabelExist(label) {
            return materialPackagingService.checkLabelExist(vm.selectedLabels, label);
        }

        function closeDialog() {
            materialPackagingService.closeDialog();
        }

        function okay() {
            materialPackagingService.selectLabelDialogOk(vm.selectedLabels);
        }
    }
})();
