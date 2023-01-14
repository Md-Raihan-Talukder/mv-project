(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('AddShipmentCountryZoneDialogController', AddShipmentCountryZoneDialogController);

    function AddShipmentCountryZoneDialogController(msbCommonApiService, msbUtilService, $mdDialog,
        Shipments, ShipmentCountry, IsNew, PRIMARY_COLUMN_NAME) {

        var vm = this;
        vm.title = "Shipment Country / Zone";
        vm.isNew = IsNew;
        vm.closeDialog = closeDialog;
        vm.addShipmentCountryDetail = addShipmentCountryDetail;

        init();
        function init() {

            if (ShipmentCountry) {
                vm.shipmentCountry = angular.copy(ShipmentCountry);
            }
            if (Shipments) {
                vm.shipments = angular.copy(Shipments);
            }

        }


        function addShipmentCountryDetail(shipmentCountry) {
            if (vm.isNew) {
                if (shipmentCountry && vm.shipments) {
                    for (var index = 0; index < vm.shipments.length; index++) {
                        if (vm.shipments[index].title == shipmentCountry.title) {
                            msbUtilService.showToast(
                                'The Country / Zone is already exists.',
                                'error-toast',
                                3000
                            );
                            vm.found = true;
                        }
                    }
                    if (!vm.found) {

                        msbCommonApiService.getIdFromServer("SHIPMENT_TIME_SETUP", function (data) {
                            if (data) {

                                var shipmentCountryObj = {
                                    "TECHDISER_ID": data.id,
                                    "TECHDISER_SERIAL_NO": data.slNo,
                                    "title": shipmentCountry.title,
                                    "transportModes": [],
                                    "deleted": "false"
                                }
                                console.log(shipmentCountryObj);
                                $mdDialog.hide(shipmentCountryObj);
                            }
                        }, "clientUrl");
                    }
                    vm.found = false;
                }
            }
            else {
                if (shipmentCountry && vm.shipments) {
                    for (var index = 0; index < vm.shipments.length; index++) {
                        if (vm.shipments[index].title == shipmentCountry.title) {
                            msbUtilService.showToast(
                                'The Country / Zone is already exists.',
                                'error-toast',
                                3000
                            );
                            vm.found = true;
                            break;
                        }
                    }
                    if (!vm.found) {
                        console.log(shipmentCountry);
                        $mdDialog.hide(shipmentCountry);
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
