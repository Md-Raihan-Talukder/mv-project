(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('AddUpdateStakeholderDialogController', AddUpdateStakeholderDialogController);

    function AddUpdateStakeholderDialogController($mdDialog, StakeholderDef, Stakeholder,
        IsNew, msbUtilService, PRIMARY_COLUMN_NAME) {

        var vm = this;
        vm.title = "Add Stakeholder";
        vm.isNew = IsNew;
        vm.closeDialog = closeDialog;
        vm.addStakeholderDetail = addStakeholderDetail;

        init();

        function init() {

            if (Stakeholder) {
                vm.stakeholder = angular.copy(Stakeholder);
            }
            if (StakeholderDef) {
                vm.stakeholderDefs = angular.copy(StakeholderDef);
            }

        }

        function addStakeholderDetail(stakeholder) {
            if (vm.isNew) {
                if (stakeholder && vm.stakeholderDefs) {
                    for (var index = 0; index < vm.stakeholderDefs.length; index++) {
                        if (vm.stakeholderDefs[index].title == stakeholder.title) {
                            msbUtilService.showToast(
                                'The Stakeholder is already exists.',
                                'error-toast',
                                3000
                            );
                            vm.found = true;
                        }
                    }
                    if (!vm.found) {
                        var largeNum = 0;
                        if (vm.stakeholderDefs) {
                            for (var j = 0; j < vm.stakeholderDefs.length; j++) {
                                if (vm.stakeholderDefs[j].TECHDISER_SERIAL_NO > largeNum) {
                                    largeNum = vm.stakeholderDefs[j].TECHDISER_SERIAL_NO;
                                }
                            }
                        }
                        var stakeholderObj = {
                            "TECHDISER_ID": msbUtilService.generateId(),
                            "TECHDISER_SERIAL_NO": largeNum + 1,
                            "title": stakeholder.title,
                            "description": stakeholder.description,
                            "dataSheets": []
                        }
                        $mdDialog.hide(stakeholderObj);
                    }
                    vm.found = false;
                }
            } else {
                if (stakeholder && vm.stakeholderDefs) {
                    for (var index = 0; index < vm.stakeholderDefs.length; index++) {
                        if (vm.stakeholderDefs[index].title == stakeholder.title) {
                            msbUtilService.showToast(
                                'The Stakeholder is already exists.',
                                'error-toast',
                                3000
                            );
                            vm.found = true;
                            break;
                        }
                    }
                    if (!vm.found) {
                        $mdDialog.hide(stakeholder);
                    }
                    vm.found = false;
                }
            }
        }

        function closeDialog() {
            $mdDialog.hide();
        }
    }

})();
