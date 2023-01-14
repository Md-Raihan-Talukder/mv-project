(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('packingLabelService', packingLabelService);

    /** @ngInject */
    function packingLabelService(msbUtilService, msbCommonApiService,
        UNIT, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME) {


        var services = {
            interfaceDef: interfaceDef,
            getPackingLabels: getPackingLabels,
            savePackingLabels: savePackingLabels
        };


        function interfaceDef(callBack, taskCode, param) {
            if (taskCode) {
                services[taskCode](callBack, param);
            }
        }

        function getPackingLabels(callBack, param) {
            msbCommonApiService.getItems("PACKING_LABEL", null, function (data) {
                callBack(data);
            });
        }

        function savePackingLabels(callBack, param) {
            msbCommonApiService.saveItems("PACKING_LABEL", param.packingLabels, function (data) {
                callBack(data);

            }, null);
        }

        return services;
    }
})();
