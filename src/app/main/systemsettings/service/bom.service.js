(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('bomSetupService', bomSetupService);

    /** @ngInject */
    function bomSetupService(msbUtilService, msbCommonApiService,
        UNIT, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME) {


        var services = {
            interfaceDef: interfaceDef,
            getMaterialGroup: getMaterialGroup,
            saveMaterialGroup: saveMaterialGroup

        };


        function interfaceDef(callBack, taskCode, param) {
            if (taskCode) {
                services[taskCode](callBack, param);
            }
        }

        function getMaterialGroup(callBack, param) {
            msbCommonApiService.getItems("BOM_SETUP", null, function (data) {
                callBack(data);
            });
        }

        function saveMaterialGroup(callBack, param) {
            msbCommonApiService.saveItems("BOM_SETUP", param.materialGroups, function (data) {
                callBack(data);

            }, null);
        }

        return services;
    }
})();
