(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .factory('supplyTypeTestService', supplyTypeTestService);

    /** @ngInject */
    function supplyTypeTestService(utilService, msbCommonApiService, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME) {
        var services = {
            getAllCategoryTestType: getAllCategoryTestType
        };

        function getAllCategoryTestType(callBack) {

            var catList = [];
            msbCommonApiService.getItems("SUPPLY_DEFINITION", null, function (data) {
                if (data) {
                    var supplies = data;
                    if (supplies) {
                        for (var i = 0; i < supplies.length; i++) {
                            var catId = utilService.getIndex(supplies, "parentId", supplies[i].TECHDISER_ID);
                            if (catId < 0) {
                                catList.push(supplies[i]);
                            }
                        }
                    }
                    callBack(catList);
                }
            });
        }

        return services;
    }
})();
