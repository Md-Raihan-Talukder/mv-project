(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('ShipmentTimeController', ShipmentTimeController);


    /** @ngInject */
    function ShipmentTimeController(msbCommonApiService, msbUtilService, $state,
        PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME, $mdDialog, shipmentTimeService) {

        var vm = this;

        vm.saveShipmentTime = saveShipmentTime;
        vm.addShipmentCountryZone = addShipmentCountryZone;
        vm.deleteShipmentCountryZone = deleteShipmentCountryZone;
        vm.addShipmentMode = addShipmentMode;
        vm.selectShipmentCountry = selectShipmentCountry;
        vm.addModeInAllCountryZone = addModeInAllCountryZone;
        vm.deleteShipmentMode = deleteShipmentMode;
        vm.primaryColumnName = PRIMARY_COLUMN_NAME;
        vm.updateIsSave = updateIsSave;


        init();

        function init() {

            getShipmentCountryZoneTime();

            getShipmentZonesAndTime();
            getShipmentModes();

        }

        function getShipmentZonesAndTime() {

            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    console.log(data);
                }
            }, "shipmentTimeService", "getShipmentZonesAndTime", null);
        }

        function getShipmentModes() {

            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    console.log(data);
                }
            }, "shipmentTimeService", "getShipmentModes", null);
        }


        function saveShipmentTime() {
            var param = {
                "shipmentData": vm.shipmentData,
                "isNew": false
            };
            msbCommonApiService.interfaceManager(function (data) {
                if (data) { }
            }, "shipmentTimeService", "saveShipmentCountryZoneTime", param);
        }

        function getShipmentCountryZoneTime() {
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    console.log(data);
                    vm.shipmentData = data[0];
                    vm.shipments = vm.shipmentData.shipmentTimeDef;
                    vm.shipmentModes = vm.shipmentData.shipmentModeDefinition;
                    /* To get Shipment Time where we have to pass zone and mode*/
                    var countryZone = "CountryZone2";
                    var shipmentMode = "ShipmentMode1";
                    getShipmentTimeWhereCountryZoneAndMode(countryZone, shipmentMode);
                }

            }, "shipmentTimeService", "getShipmentCountryZoneTime", null);
        }


        function getShipmentTimeWhereCountryZoneAndMode(countryZone, shipmentMode) {
            if (countryZone && shipmentMode) {

                var param = {
                    "countryZone": countryZone,
                    "shipmentMode": shipmentMode
                };
                msbCommonApiService.interfaceManager(function (data) {
                    if (data) { }
                }, "shipmentTimeService", "getShipmentTimeWhereCountryZoneAndMode", param);

            }

        }

        function addShipmentCountryZone(shipmentCountry, isNew) {
            if (vm.shipments) {
                $mdDialog
                    .show({
                        controller: "AddShipmentCountryZoneDialogController",
                        controllerAs: "vm",
                        clickOutsideToClose: false,
                        preserveScope: true,
                        templateUrl: "app/main/systemsettings/shipment-time/dialog/add-shipment-country-zone-dialog.html",
                        locals: {
                            Shipments: vm.shipments,
                            ShipmentCountry: shipmentCountry,
                            IsNew: isNew
                        }
                    })
                    .then(function (answer) {
                        if (answer) {
                            if (isNew) {
                                if (vm.shipmentModes && vm.shipmentModes.length > 0 && answer.transportModes) {
                                    for (var i = 0; i < vm.shipmentModes.length; i++) {

                                        // msbCommonApiService.getIdFromServer("SHIPMENT_TIME_SETUP", function (data) {
                                        //     if (data) {
                                        //
                                        //         var shipmentMode = {
                                        //             "TECHDISER_ID": data.id,
                                        //             "TECHDISER_SERIAL_NO": data.slNo,
                                        //             "shipmentModeId": vm.shipmentModes[i].TECHDISER_ID,
                                        //             "shipmentTime": 0
                                        //         }
                                        //         answer.transportModes.push(shipmentMode);
                                        //     }
                                        // }, "clientUrl");


                                        var shipmentMode = {
                                            "TECHDISER_ID": msbUtilService.generateId(),
                                            "shipmentModeId": vm.shipmentModes[i].TECHDISER_ID,
                                            "shipmentTime": 0
                                        }
                                        answer.transportModes.push(shipmentMode);

                                    }
                                }
                                vm.shipments.unshift(answer);
                                // call save
                                // var param = {'path': '/shipmentTimeDef', 'itemId': vm.shipmentData.TECHDISER_ID, 'pathParam': [], 'data': vm.shipments};
                                // savaData(function (data) {
                                //     if (data) {
                                //         console.log(data);
                                //     }
                                // }, param);
                            } else {
                                if (vm.shipments) {
                                    var spmntIndex = msbUtilService.getIndex(vm.shipments, PRIMARY_COLUMN_NAME, answer.TECHDISER_ID);
                                    if (spmntIndex > -1) {
                                        vm.shipments[spmntIndex] = answer;

                                        // var param = {'path': '/shipmentTimeDef', 'itemId': vm.shipmentData.TECHDISER_ID, 'pathParam': [], 'data': vm.shipments};
                                        // savaData(function (data) {
                                        //     if (data) {
                                        //         console.log(data);
                                        //     }
                                        // }, param);

                                    }
                                }
                            }
                        }
                    });
            }
        }

        // function savaData(callBack, param) {
        //     if (param) {
        //         msbCommonApiService.interfaceManager(function (data) {
        //             if (data) {
        //                 callBack(data);
        //             }
        //         }, "shipmentTimeService", "saveShipmentCountryZoneTime", param);
        //
        //     }
        // }

        function deleteShipmentCountryZone(shipmentCountry, shipments) {
            if (shipmentCountry && vm.shipments && vm.shipments.length > 0) {
                var spmntIndex = msbUtilService.getIndex(vm.shipments, PRIMARY_COLUMN_NAME, shipmentCountry.TECHDISER_ID);
                if (spmntIndex > -1) {
                    vm.shipments.splice(spmntIndex, 1);
                }
            }
        }

        function addShipmentMode(mode, isNew) {
            if (vm.shipmentModes && vm.shipmentData) {

                if (isNew) {
                    msbUtilService.showPrompt('Add a Shipment Mode', "Enter Mode name", "Mode Name", '',
                        function (modeName) {
                            if (modeName) {

                                var path = "/shipmentModeDefinition";
                                msbCommonApiService.getIdFromServer("SHIPMENT_TIME_SETUP", function (data) {
                                    if (data) {

                                        var shipmentModeObj = {
                                            "TECHDISER_ID": data.id,
                                            "TECHDISER_SERIAL_NO": data.slNo,
                                            "shipmentMode": modeName,
                                            "deleted": "false"
                                        }
                                        vm.shipmentModes.push(shipmentModeObj);
                                        addModeInAllCountryZone();
                                    }
                                }, "clientUrl", vm.shipmentData.TECHDISER_ID, path);
                            }
                        });

                } else {
                    msbUtilService.showPrompt('Update Shipment Mode', "Enter Mode name", "Mode Name", mode.shipmentMode,
                        function (modeName) {
                            if (modeName) {
                                mode.shipmentMode = modeName;
                                var modeIndex = msbUtilService.getIndex(vm.shipmentModes, PRIMARY_COLUMN_NAME, mode.TECHDISER_ID);
                                if (modeIndex > -1) {
                                    vm.shipmentModes[modeIndex] = mode;
                                }
                            }
                        });
                }



            }
        }

        function addModeInAllCountryZone() {
            if (vm.shipments && vm.shipments.length > 0 && vm.shipmentModes && vm.shipmentModes.length > 0) {
                for (var i = 0; i < vm.shipments.length; i++) {
                    if (vm.shipments[i].transportModes && vm.shipments[i].transportModes.length > 0) {
                        for (var j = 0; j < vm.shipmentModes.length; j++) {
                            var modeIndex = msbUtilService.getIndex(vm.shipments[i].transportModes, "shipmentModeId", vm.shipmentModes[j].TECHDISER_ID);
                            if (modeIndex === -1) {
                                var shipmentMode = {
                                    "TECHDISER_ID": msbUtilService.generateId(),
                                    "shipmentModeId": vm.shipmentModes[j].TECHDISER_ID,
                                    "shipmentTime": 0
                                }
                                vm.shipments[i].transportModes.push(shipmentMode);
                            }
                        }
                    }
                }
            }
        }

        function selectShipmentCountry(shipmentCountry) {
            if (shipmentCountry) {
                vm.shipmentCountry = angular.copy(shipmentCountry);
                vm.selectedShipmentCountry = shipmentCountry;
            }
        }

        function deleteShipmentMode(shipmentMode, shipmentModes) {
            // if (shipmentMode && shipmentModes && shipmentModes.length > 0) {
            //     var modeIndex = msbUtilService.getIndex(shipmentModes, PRIMARY_COLUMN_NAME, shipmentMode.TECHDISER_ID);
            //     if (modeIndex > -1) {
            //         shipmentModes.splice(modeIndex, 1);
            //     }
            // }
            removeMode(shipmentMode, shipmentModes);
            removeModeFromAllCountryZone();
        }

        function removeMode(shipmentMode, shipmentModes) {
            if (shipmentMode && shipmentModes && shipmentModes.length > 0) {
                var modeIndex = msbUtilService.getIndex(shipmentModes, PRIMARY_COLUMN_NAME, shipmentMode.TECHDISER_ID);
                if (modeIndex > -1) {
                    shipmentModes.splice(modeIndex, 1);
                }
            }
        }

        function removeModeFromAllCountryZone() {
            if (vm.shipments && vm.shipments.length > 0 && vm.shipmentModes && vm.shipmentModes.length > 0) {
                for (var i = 0; i < vm.shipments.length; i++) {
                    if (vm.shipments[i].transportModes && vm.shipments[i].transportModes.length > 0) {
                        for (var j = 0; j < vm.shipments[i].transportModes.length; j++) {
                            var modeIndex = msbUtilService.getIndex(vm.shipmentModes, PRIMARY_COLUMN_NAME, vm.shipments[i].transportModes[j].shipmentModeId);
                            if (modeIndex === -1) {
                                var modeIndex = msbUtilService.getIndex(vm.shipments[i].transportModes, PRIMARY_COLUMN_NAME, vm.shipments[i].transportModes[j].TECHDISER_ID);
                                if (modeIndex > -1) {
                                    vm.shipments[i].transportModes.splice(modeIndex, 1);
                                }
                            }
                        }
                    }
                }
            }
        }

        function updateIsSave() {

        }


    }
})();
