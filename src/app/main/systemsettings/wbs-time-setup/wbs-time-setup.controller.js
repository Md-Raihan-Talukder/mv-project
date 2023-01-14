(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('WBSTimeSetupController', WBSTimeSetupController);

    /** @ngInject */
    function WBSTimeSetupController(msbCommonApiService, msbUtilService, PRIMARY_COLUMN_NAME,
        SERIAL_COLUMN_NAME, wbsTimeSetupService, $scope) {

        var vm = this;

        init();

        function init() {
            getWbsTimeSetup();
            getOrgProductCatalogs();
            getWbsWorkGroupsDef();
            getWbsLifeCycleEvents();
            getWbsLeadTimes();
        }

        function getWbsTimeSetup() {
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    vm.wbsTimeDef = data;
                    // console.log(data);
                } else {
                    vm.wbsTimeDef = [];
                }
            }, "wbsTimeSetupService", "getWbsTimeSetup", null);
        }

        function getOrgProductCatalogs() {

            var catParam = [{ "key": "orgId", "value": msbUtilService.getOrganizationId() }];
            msbCommonApiService.interfaceManager(function (cats) {
                if (cats) {
                    vm.catalogs = cats;
                    // console.log(vm.catalogs);
                }
            }, "organizationsDataService", "getOrgProductCatalogs", catParam);
        }

        function getWbsWorkGroupsDef() {
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    vm.wbsWorkGrpDef = data;
                    // console.log(data);
                } else {
                    vm.wbsWorkGrpDef = [];
                }

            }, "wbsTimeSetupService", "getWbsWorkGroups", null);
        }

        function getWbsLifeCycleEvents() {
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    vm.wbsLifeCycleEvents = data;
                    // console.log(data);
                } else {
                    vm.wbsLifeCycleEvents = [];
                }

            }, "wbsTimeSetupService", "getWbsLifeCycleEvents", null);
        }

        function getWbsLeadTimes() {
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    vm.wbsLeadTimes = data;
                    console.log(vm.wbsLeadTimes);
                } else {
                    vm.wbsLeadTimes = [];
                }

            }, "wbsTimeSetupService", "getWbsLeadTimes", null);
        }

        vm.save = function () {
            var param = {
                "wbsTimeDef": vm.wbsTimeDef
            }
            msbCommonApiService.interfaceManager(function (data) {
                console.log(data);
                msbUtilService.showToast("Saved", "success-toast", 3000);
            }, "wbsTimeSetupService", "saveWbsTimeDef", param);
        }

    }
})();
