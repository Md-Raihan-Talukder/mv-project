(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('AddShipmentTypeDialogController', AddShipmentTypeDialogController);

    function AddShipmentTypeDialogController(commonApiService, $mdDialog, ShipmentTypeDef, ShipmentType, IsNew, utilService, PRIMARY_COLUMN_NAME) {

        var vm = this;
        vm.title = "Shipment Type";
        vm.isNew = IsNew;
        vm.closeDialog = closeDialog;
        vm.addShipmentTypeDetail = addShipmentTypeDetail;

        init();
        function init() {

            if (ShipmentType) {
                vm.shipmentType = angular.copy(ShipmentType);
            }
            if (ShipmentTypeDef) {
                vm.shipmentTypes = angular.copy(ShipmentTypeDef);
            }

        }

        function addShipmentTypeDetail(shipmentType) {
            if (vm.isNew) {
                if (shipmentType && vm.shipmentTypes) {
                    for (var index = 0; index < vm.shipmentTypes.length; index++) {
                        if (vm.shipmentTypes[index].title == shipmentType.title) {
                            utilService.showToast(
                                'The Shipment Type is already exists.',
                                'error-toast',
                                3000
                            );
                            vm.found = true;
                        }
                    }
                    if (!vm.found) {
                        var largeNum = 0;
                        if (vm.shipmentTypes) {
                            for (var j = 0; j < vm.shipmentTypes.length; j++) {
                                if (vm.shipmentTypes[j].TECHDISER_SERIAL_NO > largeNum) {
                                    largeNum = vm.shipmentTypes[j].TECHDISER_SERIAL_NO;
                                }
                            }
                        }
                        var shipmentTypeObj = {
                            "TECHDISER_ID": utilService.generateId(),
                            "TECHDISER_SERIAL_NO": largeNum + 1,
                            "title": shipmentType.title,
                            "description": shipmentType.description,
                            "isPortToPortTransport": shipmentType.isPortToPortTransport,
                            "dataSheet": [],
                            "steps": [],
                            "documentId": []
                        }
                        $mdDialog.hide(shipmentTypeObj);
                    }
                    vm.found = false;
                }
            }
            else {
                if (shipmentType && vm.shipmentTypes) {
                    // for (var index = 0; index < vm.shipmentTypes.length; index++) {
                    //     if(vm.shipmentTypes[index].title == shipmentType.title){
                    //         utilService.showToast(
                    //             'The Shipment Type is already exists.',
                    //             'error-toast',
                    //             3000
                    //         );
                    //         vm.found = true;
                    //         break;
                    //     }
                    // }
                    if (!vm.found) {
                        $mdDialog.hide(shipmentType);
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
