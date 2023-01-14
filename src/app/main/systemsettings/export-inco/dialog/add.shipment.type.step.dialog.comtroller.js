(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('AddShipmentTypeStepDialogController', AddShipmentTypeStepDialogController);

    function AddShipmentTypeStepDialogController(commonApiService, $mdDialog, ShipmentStepDef, TypeStep, IsNew, utilService, PRIMARY_COLUMN_NAME) {

        var vm = this;
        vm.title = "Type Step";
        vm.isNew = IsNew;
        vm.shipmentStepsColumns = [
            {
                "TECHDISER_ID": "ShipmentStepColumn1",
                "title": "Title",
                "data": "title",
                "type": "text",
                "flex": "100"
            },
            {
                "TECHDISER_ID": "ShipmentStepColumn2",
                "title": "Code",
                "data": "code",
                "type": "text",
                "flex": "100"
            },
            {
                "TECHDISER_ID": "ShipmentStepColumn3",
                "title": "Description",
                "data": "description",
                "type": "text",
                "flex": "100"
            }
        ];
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
                            utilService.showToast(
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
                            "TECHDISER_ID": utilService.generateId(),
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
                            utilService.showToast(
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
