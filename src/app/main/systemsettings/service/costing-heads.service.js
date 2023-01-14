(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .factory('costingHeadsService', costingHeadsService);

    /** @ngInject */
    function costingHeadsService(msbUtilService, msbCommonApiService, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME) {

        var services = {
            interfaceDef: interfaceDef,
            getStitchDef: getStitchDef
        };

        function interfaceDef(callBack, taskCode, param) {
            var functions = {
                getAllCostingHeads: getAllCostingHeads,
                getAllPIHeads: getAllPIHeads,
                getPiHeadsCostingHeadsByPiId: getPiHeadsCostingHeadsByPiId,
                getStitchDef: getStitchDef
            }
            if (taskCode) {
                functions[taskCode](callBack, param);
            }
        }

        function getAllCostingHeads(callBack, param) {

            msbCommonApiService.getItems("COSTING_HEADS", null, function (data) {
                if (data) {
                    callBack(data);
                }
            });
        }

        function getAllPIHeads(callBack, param) {

            msbCommonApiService.getItems("PI_HEADS", null, function (data) {
                if (data) {
                    var piHeads = data;
                    callBack(piHeads);
                }
            });
        }

        // Service to get list of pi heads and its costing heads
        function getPiHeadsCostingHeadsByPiId(callBack, param) {

            msbCommonApiService.interfaceManager(function (piData) {
                if (piData) {
                    var piHeads = piData;

                    msbCommonApiService.interfaceManager(function (costingData) {
                        if (costingData) {
                            var costingHeads = costingData;

                            if (piHeads.length > 0) {

                                var piHeadsArr = [];

                                for (var i = 0; i < piHeads.length; i++) {
                                    if (piHeads[i] && costingHeads.length > 0) {

                                        piHeads[i].costingHeads = [];

                                        var piParam = [{ "key": "piHeadId", "value": piHeads[i][PRIMARY_COLUMN_NAME] }];
                                        var items = msbUtilService.getItemsByProperties(costingHeads, piParam);
                                        if (items.length > 0) {
                                            piHeads[i].costingHeads = items;
                                        }
                                        piHeadsArr.push(piHeads[i]);
                                    }
                                }
                                callBack(piHeadsArr);
                            }

                        }
                    }, "costingHeadsService", "getAllCostingHeads", null);
                }
            }, "costingHeadsService", "getAllPIHeads", null);

        }

        function getStitchDef(callBack, param) {
            msbCommonApiService.getItems("STITCHES", null, function (data) {
                callBack(data);
            });
        }


        return services;
    }
})();
