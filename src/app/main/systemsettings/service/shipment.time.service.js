(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('shipmentTimeService', shipmentTimeService);

    /** @ngInject */
    function shipmentTimeService(msbUtilService, msbCommonApiService,
        PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME) {


        var services = {
            interfaceDef: interfaceDef,
            getShipmentCountryZoneTime: fetchShipmentCountryZoneTime,
            saveShipmentCountryZoneTime: saveShipmentCountryZoneTime,
            getShipmentTimeWhereCountryZoneAndMode: getShipmentTimeWhereCountryZoneAndMode,
            getShipmentModes: getShipmentModes,
            getShipmentZonesAndTime: getShipmentZonesAndTime

        };


        function interfaceDef(callBack, taskCode, param) {
            if (taskCode) {
                services[taskCode](callBack, param);
            }
        }

        function fetchShipmentCountryZoneTime(callBack, param) {
            msbCommonApiService.getItems("SHIPMENT_TIME_SETUP", null, function (data) {
                callBack(data);
            });
        }

        function saveShipmentCountryZoneTime(callBack, param) {

            if (param) {
                //     msbCommonApiService.saveInnerItem(param.itemId, param.data, "SHIPMENT_TIME_SETUP", "clientUrl", param.path, param.pathParam, function (data) {
                //         if (data && callBack) {
                //             callBack(data);
                //         }
                //     }, null, null, true);
                msbCommonApiService.saveItem(param.shipmentData, param.isNew, "SHIPMENT_TIME_SETUP", function (data) {
                    if (data && callBack) {
                        callBack(data);
                    }
                }, null, false, null, "clientUrl", true);
            }

        }

        /* To get Shipment Time where we have to pass zone and mode*/

        function getShipmentTimeWhereCountryZoneAndMode(callBack, param) {
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    var shipments = data[0].shipmentTimeDef;

                    var countryZoneId = param.countryZone;
                    var shipmentModeId = param.shipmentMode;
                    var shipmentDays = 0;
                    var countryZoneIndex = msbUtilService.getIndex(shipments, PRIMARY_COLUMN_NAME, countryZoneId);
                    if (countryZoneIndex > -1) {
                        if (shipments[countryZoneIndex].transportModes && shipments[countryZoneIndex].transportModes.length > 0) {
                            var modeIndex = msbUtilService.getIndex(shipments[countryZoneIndex].transportModes, "shipmentModeId", shipmentModeId);
                            if (modeIndex > -1) {
                                shipmentDays = shipments[countryZoneIndex].transportModes[modeIndex].shipmentTime;
                            }

                        }
                    }
                    callBack(shipmentDays);
                }

            }, "shipmentTimeService", "getShipmentCountryZoneTime", null);
        }

        // get Shipment Modes
        function getShipmentModes(callBack, param) {
            msbCommonApiService.getItems("SHIPMENT_TIME_SETUP", null, function (data) {
                if (callBack) {
                    callBack(data);
                }
            }, null, null, null, "clientUrl", "/shipmentModeDefinition", []);
        }

        // get Shipment zones along with its time
        function getShipmentZonesAndTime(callBack, param) {
            msbCommonApiService.getItems("SHIPMENT_TIME_SETUP", null, function (data) {
                if (callBack) {
                    callBack(data);
                }
            }, null, null, null, "clientUrl", "/shipmentTimeDef", []);
        }

        return services;
    }
})();
