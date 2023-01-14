(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('PiHeadsController', PiHeadsController);

    /** @ngInject */
    function PiHeadsController(costingHeadsService, msbCommonApiService,
        supplyDefinitionService, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME,
        commonApiService, utilService, msbUtilService, $mdDialog) {

        var vm = this;


        init();

        function init() {

            getPIHeads();

            // service for get PiHeads and CostingHeads By PiId
            getPiHeadsCostingHeadsByPiId();
        }

        function getPIHeads() {

            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    vm.piHeads = data;
                }
            }, "costingHeadsService", "getAllPIHeads", null);
        }

        function getPiHeadsCostingHeadsByPiId() {

            msbCommonApiService.interfaceManager(function (costingPiData) {
                if (costingPiData) {
                    console.log(costingPiData);
                }
            }, "costingHeadsService", "getPiHeadsCostingHeadsByPiId", null);
        }




    }
})();
