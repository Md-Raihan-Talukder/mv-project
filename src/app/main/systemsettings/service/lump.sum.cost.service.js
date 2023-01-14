(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('lumpSumCostService', lumpSumCostService);

    /** @ngInject */
    function lumpSumCostService(msbUtilService, msbCommonApiService,
        PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME, shipmentTimeService) {


        var services = {
            interfaceDef: interfaceDef,
            getLumpSumCost: fetchLumpSumCost,
            saveLumpSumCost: saveLumpSumCost,
            getShipmentCountryZoneTime: getShipmentCountryZoneTime,
            getListOfCostWhereCategoryAndType: getListOfCostWhereCategoryAndType

        };


        function interfaceDef(callBack, taskCode, param) {
            if (taskCode) {
                services[taskCode](callBack, param);
            }
        }

        function fetchLumpSumCost(callBack, param) {
            msbCommonApiService.getItems("LUMP_SUM_COST_SETUP", null, function (data) {
                callBack(data);
            });
        }

        function saveLumpSumCost(callBack, param) {

            msbCommonApiService.saveItem(param.lscMaterials, param.isNew, "LUMP_SUM_COST_SETUP", function (data) {
                if (data && callBack) {
                    callBack(data);
                }

            }, null, false, null, "clientUrl", true);
        }

        function getShipmentCountryZoneTime(callBack, param) {
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    callBack(data[0].shipmentTimeDef);
                }

            }, "shipmentTimeService", "getShipmentCountryZoneTime", null);
        }

        /* To get List of Cost where we have to pass materialCategoryId and typeId */

        function getListOfCostWhereCategoryAndType(callBack, param) {
            // var paramVal = param;
            if (callBack && param) {
                msbCommonApiService.interfaceManager(function (data) {
                    if (data) {
                        var lscMaterials = data;

                        var materialCategoryId = param.materialCategoryId;
                        var materialTypeId = param.materialTypeId;

                        var params = [{ "key": "materialCategoryId", "value": materialCategoryId },
                        { "key": "materialTypeId", "value": materialTypeId }];

                        var matIndex = msbUtilService.getIndexByValues(lscMaterials, params);
                        if (matIndex > -1) {
                            if (lscMaterials[matIndex].countryWiseUnitCost) {
                                if (callBack) {
                                    callBack(lscMaterials[matIndex].countryWiseUnitCost);
                                }
                            }
                        }

                    }
                }, "lumpSumCostService", "getLumpSumCost", null);

            }
        }


        return services;
    }
})();
