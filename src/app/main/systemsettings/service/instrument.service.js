(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('instrumentSetupService', instrumentSetupService);

    /** @ngInject */
    function instrumentSetupService(msbUtilService, msbCommonApiService,
        UNIT, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME) {


        var services = {
            interfaceDef: interfaceDef,
            getInstrumentDefinition: getInstrumentDefinition

        };


        function interfaceDef(callBack, taskCode, param) {
            if (taskCode) {
                services[taskCode](callBack, param);
            }
        }

        // get Instrument List
        function getInstrumentDefinition(callBack, param) {
            msbCommonApiService.getItems("INSTRUMENT_SETUP", null, function (data) {
                callBack(data);
            });
        }


        return services;
    }
})();
