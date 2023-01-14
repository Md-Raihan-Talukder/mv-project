(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('styleEnquiryOrderService', styleEnquiryOrderService);

    /** @ngInject */
    function styleEnquiryOrderService(utilService, msbUtilService, msbCommonApiService,
        UNIT, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME) {
        var services = {
            interfaceDef: interfaceDef,
            getAllSupplyCategory: getAllSupplyCategory,
            getStyleEnquiry: fetchStyleEnquiryDefinition,
            getHashTags: fetchHashTags,
            getStyleContext: fetchStyleContext,
            getStyleContextSizeDef: fetchStyleContextSizeDef,
            getMeasurementUnits: fetchMeasurementUnits
        };

        function interfaceDef(callBack, taskCode, param) {
            var functions = {
                getStyleEnquiryDefinition: fetchStyleEnquiryDefinition
            }
            if (taskCode) {
                functions[taskCode](callBack, param);
            }
        }

        function getAllSupplyCategory(callBack) {
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    callBack(data);
                }
            }, "supplyDefinitionService", "getLeafNodesOfAllSupplyCategory", null);
        }

        function fetchStyleEnquiryDefinition(callBack, param) {
            msbCommonApiService.getItems("ENQUIRY_STYLE_ORDER", null, function (data) {
                if (data) {
                    callBack(data);
                }
            });
        }

        function fetchHashTags(callBack, id) {
            if (id) {
                var styleLogId = "Style_Info_Log_1";
                var param = [{ "key": "TECHDISER_ID", "value": [id, styleLogId] }];
                var path = "/[TECHDISER_ID=$TECHDISER_ID]/styleInfoLog/[TECHDISER_ID=$TECHDISER_ID]/hashTags";
                msbCommonApiService.getItems("ENQUIRY_STYLE_ORDER", null, function (data) {
                    callBack(data);
                }, null, false, null, "clientUrl", path, param);
            }
        }
        function fetchStyleContext(callBack, param) {
            if (param) {
                var path = "/[TECHDISER_ID=$TECHDISER_ID]/styleInfoLog/[TECHDISER_ID=$TECHDISER_ID]/styleContext";
                msbCommonApiService.getItems("ENQUIRY_STYLE_ORDER", null, function (data) {
                    callBack(data);
                }, null, false, null, "clientUrl", path, param);
            }
        }

        function fetchStyleContextSizeDef(callBack, param) {
            if (param) {
                var path = "/[TECHDISER_ID=$TECHDISER_ID]/styleInfoLog/[TECHDISER_ID=$TECHDISER_ID]/styleContext/[TECHDISER_ID=$TECHDISER_ID]/sizeDefinition";
                msbCommonApiService.getItems("ENQUIRY_STYLE_ORDER", null, function (data) {
                    callBack(data);
                }, null, false, null, "clientUrl", path, param);
            }
        }

        function fetchMeasurementUnits(callBack) {
            var param = [{ "key": "TECHDISER_ID", "value": UNIT.MEASUREMENT_UNIT }]
            var path = "/[TECHDISER_ID=$TECHDISER_ID]/units";
            msbCommonApiService.getItems("BASIC_SETUP", null, function (data) {
                if (data) {
                    callBack(data);
                }
            }, null, false, null, "clientUrl", path, param);
        }

        return services;
    }
})();
