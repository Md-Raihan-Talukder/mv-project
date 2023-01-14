(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('DuproSetupController', DuproSetupController);

    /** @ngInject */
    function DuproSetupController(PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME, $mdDialog,
        msbCommonApiService, duproSetupService, msbUtilService, organizationsDataService) {

        var vm = this;
        vm.addDuproInspection = addDuproInspection;
        vm.removeDuproInspection = removeDuproInspection;
        vm.saveDuproInspection = saveDuproInspection;
        vm.getJobProcessTitle = getJobProcessTitle;

        vm.addDeproQc = addDeproQc;
        vm.saveDuproQc = saveDuproQc;
        vm.removeDuproQc = removeDuproQc;
        vm.getCatalogTitle = getCatalogTitle;

        init();

        function init() {
            vm.orgId = msbUtilService.getOrganizationId();
            getDuproDefinition();
            getOrgProductCatalogs();
            getDuproInspections();
            getDuproQcs();
            getJobWiseOperations();
        }

        function getOrgProductCatalogs() {
            if (vm.orgId) {
                var catParam = [{ "key": "orgId", "value": vm.orgId }];
                msbCommonApiService.interfaceManager(function (cats) {
                    if (cats) {
                        vm.catalogs = cats;
                    }
                }, "organizationsDataService", "getOrgProductCatalogs", catParam);
            }
        }

        function getJobWiseOperations() {
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    vm.jobWiseOperations = data;
                }
            }, "organizationsDataService", "getJobWiseOperations", []);
        }

        function getDuproInspections() {
            duproSetupService.getDuproInspections(function (inspectionData) {
                if (inspectionData) {
                    vm.duproInspections = inspectionData;
                }
            }, []);
        }

        function getDuproQcs() {
            duproSetupService.getDuproQcs(function (qcData) {
                if (qcData) {
                    vm.duproQcs = qcData;
                }
            }, []);
        }

        function addDuproInspection(duproInspection) {
            var param = {
                "duproInspections": vm.duproInspections,
                "duproInspection": (duproInspection) ? duproInspection : null,
                "catalogs": vm.catalogs,
                "mode": 'inspection'
            };
            duproSetupService.addDuproInspection(function (duproInspectionData) {
                if (duproInspectionData) {
                    vm.duproInspections = duproInspectionData;
                }
            }, param);
        }

        function removeDuproInspection(duproInspection) {
            if (duproInspection && vm.duproInspections && vm.duproInspections.length > 0) {
                msbUtilService.confirmAndDelete(null, [{ Inspection: duproInspection.title }], function () {
                    msbUtilService.removeItems(vm.duproInspections, duproInspection.TECHDISER_ID);
                });
            }
        }

        function getJobProcessTitle(duproInspection, code) {
            if (duproInspection && duproInspection.jobId && vm.jobWiseOperations && vm.jobWiseOperations.length > 0) {
                return duproSetupService.getJobProcessTitle(duproInspection, vm.jobWiseOperations, code);
            }
        }

        function saveDuproInspection() {
            var inspectionParams = [
                { "key": "dataInstruction", "value": vm.duproInspections },
                { "key": "itemId", "value": vm.itemId }
            ];
            if (vm.duproInspections) {
                duproSetupService.saveDuproInspection(function (data) {
                }, inspectionParams);
            }
        }

        function addDeproQc(duproQc) {
            var param = {
                "duproInspections": vm.duproQcs,
                "duproInspection": (duproQc) ? duproQc : null,
                "catalogs": vm.catalogs,
                "mode": 'qc'
            };
            duproSetupService.addDuproInspection(function (duproQcData) {
                if (duproQcData) {
                    vm.duproQcs = duproQcData;
                }
            }, param);
        }

        function removeDuproQc(duproQc) {
            if (duproQc && vm.duproQcs && vm.duproQcs.length > 0) {
                msbUtilService.confirmAndDelete(null, [{ 'QC': duproQc.title }], function () {
                    msbUtilService.removeItems(vm.duproQcs, duproQc.TECHDISER_ID);
                });
            }
        }

        function saveDuproQc() {
            var qcParams = [
                { "key": "dataQc", "value": vm.duproQcs },
                { "key": "itemId", "value": vm.itemId }
            ];
            if (vm.duproQcs) {
                duproSetupService.saveDuproQc(function (data) {
                }, qcParams);
            }
        }

        function getCatalogTitle(catalogId) {
            if (catalogId && vm.catalogs && vm.catalogs.length > 0) {
                return duproSetupService.getCatalogTitle(catalogId, vm.catalogs);
            }
        }

        function getDuproDefinition() {

            duproSetupService.getDuproDefinition(function (data) {
                if (data) {
                    vm.itemId = data[0].TECHDISER_ID;
                }
            }, []);
        }


    }
})();
