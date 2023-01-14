(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('containerSetupService', containerSetupService);

    /** @ngInject */
    function containerSetupService(msbUtilService, msbCommonApiService) {


        var services = {
            interfaceDef: interfaceDef,
            getContainers: getContainers,

        };

        function getContainers(callBack, params) {
            if (!callBack) {
                return
            }
            msbCommonApiService.getItems("SHIPMENT_CONTAINERS", params, function (data) {
                (data) ? callBack(data) : callBack(null)
            });
        }

        function interfaceDef(callBack, taskCode, param) {
            if (taskCode) {
                services[taskCode](callBack, param);
            }
        }


        return services;
    }
})();
