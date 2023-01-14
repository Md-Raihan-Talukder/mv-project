(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('AddShipmentTypeStepDialogController', AddShipmentTypeStepDialogController);

    function AddShipmentTypeStepDialogController($mdDialog, ShipmentStepDef,
        TypeStep, IsNew, msbUtilService, PRIMARY_COLUMN_NAME) {

        var vm = this;
        vm.title = "Type Step";
        vm.isNew = IsNew;
        vm.closeDialog = closeDialog;
        vm.addShipmentTypeStepDetail = addShipmentTypeStepDetail;

        init();
        function init() {

            if (TypeStep) {
                vm.typeStep = angular.copy(TypeStep);
            }
            if (ShipmentStepDef) {
                vm.shipmentSteps = angular.copy(ShipmentStepDef);
            }
        }

        function addShipmentTypeStepDetail(typeStep) {
            if (vm.isNew) {
                if (typeStep && vm.shipmentSteps) {
                    for (var index = 0; index < vm.shipmentSteps.length; index++) {
                        if (vm.shipmentSteps[index].title == typeStep.title) {
                            msbUtilService.showToast(
                                'The Step is already exists.',
                                'error-toast',
                                3000
                            );
                            vm.found = true;
                        }
                    }
                    if (!vm.found) {
                        var largeNum = 0;
                        if (vm.shipmentSteps) {
                            for (var j = 0; j < vm.shipmentSteps.length; j++) {
                                if (vm.shipmentSteps[j].TECHDISER_SERIAL_NO > largeNum) {
                                    largeNum = vm.shipmentSteps[j].TECHDISER_SERIAL_NO;
                                }
                            }
                        }
                        var typeStepObj = {
                            "TECHDISER_ID": msbUtilService.generateId(),
                            "TECHDISER_SERIAL_NO": largeNum + 1,
                            "title": typeStep.title,
                            "code": typeStep.code,
                            "description": typeStep.description
                        }
                        $mdDialog.hide(typeStepObj);
                    }
                    vm.found = false;
                }
            }
            else {
                if (typeStep && vm.shipmentSteps) {
                    for (var index = 0; index < vm.shipmentSteps.length; index++) {
                        if (vm.shipmentSteps[index].title == typeStep.title) {
                            msbUtilService.showToast(
                                'The Step is already exists.',
                                'error-toast',
                                3000
                            );
                            vm.found = true;
                            break;
                        }
                    }
                    if (!vm.found) {
                        $mdDialog.hide(typeStep);
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
