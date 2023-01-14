(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('AddIncoShipmentTypeDialogController', AddIncoShipmentTypeDialogController);

    function AddIncoShipmentTypeDialogController(commonApiService, $mdDialog, ShipmentTypeDef, ShipmentType, IsNew, msbUtilService, PRIMARY_COLUMN_NAME) {

        var vm = this;
        vm.title = "Shipment Type nnn";
        vm.isNew = IsNew;
        vm.closeDialog = closeDialog;
        vm.addShipmentTypeDetail = addShipmentTypeDetail;
        vm.checkDestinationPort = checkDestinationPort;
        vm.checkSailingPort = checkSailingPort;
        vm.checkDeliveryPoint = checkDeliveryPoint;

        init();
        function init() {

            if (ShipmentType) {
                vm.shipmentType = angular.copy(ShipmentType);
            } else {
                vm.shipmentType = {
                    "title": "",
                    "description": "",
                    "isPortToPortTransport": true,
                    "isDestinationPort": 0,
                    "isSailingPort": 0,
                    "isDeliveryPoint": 0
                }
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
                            msbUtilService.showToast(
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
                            "TECHDISER_ID": msbUtilService.generateId(),
                            "TECHDISER_SERIAL_NO": largeNum + 1,
                            "title": shipmentType.title,
                            "description": shipmentType.description,
                            "isPortToPortTransport": shipmentType.isPortToPortTransport,
                            "isDestinationPort": shipmentType.isDestinationPort,
                            "isSailingPort": shipmentType.isSailingPort,
                            "isDeliveryPoint": shipmentType.isDeliveryPoint,
                            "importers": [],
                            "exporters": [],
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
                    //         msbUtilService.showToast(
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

        function checkDestinationPort() {
            if (vm.shipmentType.isDestinationPort == 1) {
                vm.shipmentType.isDestinationPort = 0;
            } else if (vm.shipmentType.isDestinationPort == 0) {
                vm.shipmentType.isDestinationPort = 1;
            }
        }

        function checkSailingPort() {
            if (vm.shipmentType.isSailingPort == 1) {
                vm.shipmentType.isSailingPort = 0;
            } else if (vm.shipmentType.isSailingPort == 0) {
                vm.shipmentType.isSailingPort = 1;
            }
        }

        function checkDeliveryPoint() {
            if (vm.shipmentType.isDeliveryPoint == 1) {
                vm.shipmentType.isDeliveryPoint = 0;
            } else if (vm.shipmentType.isDeliveryPoint == 0) {
                vm.shipmentType.isDeliveryPoint = 1;
            }
        }


        function closeDialog() {
            $mdDialog.hide();
        }
    }

})();
