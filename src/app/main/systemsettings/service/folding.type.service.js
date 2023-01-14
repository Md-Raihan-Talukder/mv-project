(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('foldingTypeService', foldingTypeService);

    /** @ngInject */
    function foldingTypeService(msbUtilService, msbCommonApiService,
        UNIT, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME) {


        var services = {
            interfaceDef: interfaceDef,
            getFoldingType: getFoldingType,
            saveFoldingType: saveFoldingType

        };


        function interfaceDef(callBack, taskCode, param) {
            if (taskCode) {
                services[taskCode](callBack, param);
            }
        }

        function getFoldingType(callBack, param) {
            msbCommonApiService.getItems("FOLDING_TYPE", null, function (data) {
                callBack(data);
            });
        }

        function saveFoldingType(callBack, param) {
            msbCommonApiService.saveItems("FOLDING_TYPE", param.materialTypes, function (data) {
                callBack(data);

            }, null);
        }

        return services;
    }
})();
