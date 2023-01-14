(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('AddDuproInspectionDialogController', AddDuproInspectionDialogController);

    function AddDuproInspectionDialogController($mdDialog, msbUtilService, PRIMARY_COLUMN_NAME,
        duproSetupService, msbDateTimeService, DuproInspections, DuproInspection, Catalogs,
        mode, msbCommonApiService) {

        var vm = this;
        vm.closeDialog = closeDialog;
        vm.addDuproInspection = addDuproInspection;
        vm.getJobProcessOperations = getJobProcessOperations;
        vm.selectJob = selectJob;
        vm.getOrgJobsByCatalogId = getOrgJobsByCatalogId;

        init();

        function init() {
            if (mode == 'inspection') {
                vm.title = "Dupro Inspection";
            } else if (mode == 'qc') {
                vm.title = "Dupro QC";
            }
            if (Catalogs) {
                vm.catalogs = angular.copy(Catalogs);
            }
            if (DuproInspections) {
                vm.duproInspections = angular.copy(DuproInspections);
            }

            // vm.hourTime = msbDateTimeService.formatDateValue(new Date(), "hh:00") + " " + msbDateTimeService.formatDateValue(new Date(), "tt");
            if (!DuproInspection) {
                vm.duproInspection = {
                    "TECHDISER_ID": msbUtilService.generateId(),
                    "TECHDISER_SERIAL_NO": vm.duproInspections.length + 1,
                    "title": "",
                    "code": "",
                    "description": "",
                    "catalogId": null,
                    "jobId": null,
                    "processId": null,
                    "hourlyFrequency": "",
                    "isOnlyJob": 1
                }
                vm.isNew = true;
            } else {
                vm.duproInspection = angular.copy(DuproInspection);
                getOrgJobsByCatalogId();
                vm.isNew = false;
            }

        }

        function addDuproInspection(duproInspection) {
            if (vm.isNew) {
                if (duproInspection && vm.duproInspections) {
                    for (var index = 0; index < vm.duproInspections.length; index++) {
                        if (vm.duproInspections[index].title == duproInspection.title) {
                            msbUtilService.showToast(
                                'The Item is already exists.',
                                'error-toast',
                                2000
                            );
                            vm.found = true;
                        }
                    }
                    if (!vm.found) {
                        var largeNum = 0;
                        if (vm.duproInspections) {
                            for (var j = 0; j < vm.duproInspections.length; j++) {
                                if (vm.duproInspections[j].TECHDISER_SERIAL_NO > largeNum) {
                                    largeNum = vm.duproInspections[j].TECHDISER_SERIAL_NO * 1;
                                }
                            }
                        }
                        var duproInspectionObj = {
                            "TECHDISER_ID": msbUtilService.generateId(),
                            "TECHDISER_SERIAL_NO": largeNum + 1,
                            "title": duproInspection.title,
                            "code": duproInspection.code,
                            "description": duproInspection.description,
                            "catalogId": duproInspection.catalogId,
                            "jobId": duproInspection.jobId,
                            "processId": duproInspection.processId,
                            "hourlyFrequency": duproInspection.hourlyFrequency,
                            "isOnlyJob": duproInspection.isOnlyJob * 1
                        }
                        $mdDialog.hide(duproInspectionObj);
                    }
                    vm.found = false;
                }
            } else {
                if (duproInspection && vm.duproInspections) {
                    var inspectionIndex = msbUtilService.getIndex(vm.duproInspections, PRIMARY_COLUMN_NAME, duproInspection[PRIMARY_COLUMN_NAME]);
                    for (var index = 0; index < vm.duproInspections.length; index++) {
                        if (vm.duproInspections[index].title == duproInspection.title && index != inspectionIndex) {
                            msbUtilService.showToast(
                                'The Item is already exists.',
                                'error-toast',
                                2000
                            );
                            vm.found = true;
                            break;
                        }
                    }
                    if (!vm.found) {
                        $mdDialog.hide(duproInspection);
                    }
                    vm.found = false;
                }
            }
        }

        function getOrgJobsByCatalogId() {
            var catParam = [{ "key": "catalogId", "value": vm.duproInspection.catalogId }];
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    vm.jobWiseOperations = data;
                }
            }, "organizationsDataService", "getOrgJobsByCatalogId", catParam);
        }

        function getJobProcessOperations() {
            if (vm.duproInspection && vm.duproInspection.jobId && vm.jobWiseOperations &&
                vm.jobWiseOperations.length > 0) {
                return duproSetupService.getJobProcessOperations(vm.duproInspection.jobId, vm.jobWiseOperations);
            }
        }

        function selectJob() {
            if (vm.duproInspection && vm.duproInspection.isOnlyJob == 1) {
                vm.duproInspection.processId = null;
            }
        }

        function closeDialog() {
            $mdDialog.hide();
        }
    }

})();
