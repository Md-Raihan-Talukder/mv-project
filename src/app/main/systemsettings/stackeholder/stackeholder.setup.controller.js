(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('StackeholderSetupController', StackeholderSetupController);


    /** @ngInject */
    function StackeholderSetupController(msbCommonApiService, msbUtilService, $state, $mdDialog,
        PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME) {

        var vm = this;
        vm.addStakeholder = addStakeholder;
        vm.selectStakeholder = selectStakeholder;
        vm.createNewDataSheet = createNewDataSheet;
        vm.saveDataSheet = saveDataSheet;
        vm.selectDataSheet = selectDataSheet;

        init();

        function init() {
            getIncoTypeDefinition();
        }

        function getIncoTypeDefinition() {
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    vm.inCoTypes = data[0];
                    vm.inCoTypeDefs = vm.inCoTypes.typeDefinition;
                    vm.inCoStepDefs = vm.inCoTypes.stepDefinition;
                    vm.inCoDocumentDefs = vm.inCoTypes.documentDefinition;
                    vm.stakeholderDefs = vm.inCoTypes.stakeholderDefinition;
                    getBillPolicy();
                    selectInCoType(vm.inCoTypeDefs[0]);
                    selectStakeholder(vm.stakeholderDefs[0]);
                    checkTypeSteps();
                    checkImportExportStakeholders();
                }

            }, "inCoService", "getIncoTypeDefinition", null);
        }

        function checkImportExportStakeholders() {
            if (vm.inCoTypeDefs && vm.inCoTypeDefs.length > 0 && vm.stakeholderDefs && vm.stakeholderDefs.length > 0) {
                for (var i = 0; i < vm.inCoTypeDefs.length; i++) {
                    if (vm.inCoTypeDefs[i].importers && vm.inCoTypeDefs[i].exporters) {
                        for (var j = 0; j < vm.stakeholderDefs.length; j++) {
                            var stakeholderIndex = msbUtilService.getIndex(vm.inCoTypeDefs[i].importers, "stakeholderId", vm.stakeholderDefs[j][PRIMARY_COLUMN_NAME]);
                            if (stakeholderIndex === -1) {
                                var stakeholderObj = {
                                    "TECHDISER_ID": msbUtilService.generateId(),
                                    "stakeholderId": vm.stakeholderDefs[j][PRIMARY_COLUMN_NAME],
                                    "bills": []
                                }
                                vm.inCoTypeDefs[i].importers.push(stakeholderObj);
                            }
                        }
                        for (var j = 0; j < vm.stakeholderDefs.length; j++) {
                            var stakeholderIndex = msbUtilService.getIndex(vm.inCoTypeDefs[i].exporters, "stakeholderId", vm.stakeholderDefs[j][PRIMARY_COLUMN_NAME]);
                            if (stakeholderIndex === -1) {
                                var stakeholderObj = {
                                    "TECHDISER_ID": msbUtilService.generateId(),
                                    "stakeholderId": vm.stakeholderDefs[j][PRIMARY_COLUMN_NAME],
                                    "bills": []
                                }
                                vm.inCoTypeDefs[i].exporters.push(stakeholderObj);
                            }
                        }
                    }
                }
            }
        }

        function selectStakeholder(item) {
            if (item) {
                vm.selectedStakeholder = angular.copy(item);
            }
        }

        function getBillPolicy() {
            msbCommonApiService.interfaceManager(function (billPolicyData) {
                if (billPolicyData) {
                    vm.billPolicy = billPolicyData;

                }
            }, "inCoService", "getBillPolicy", null);
        }

        function selectInCoType(item) {
            if (item) {
                vm.selectedIncoType = angular.copy(item);

                vm.updateDataSheet = false;
                vm.isNewDataSheet = true;
                vm.isExapndDataSheet = false;

                if (vm.selectedIncoType && vm.selectedIncoType.steps && vm.selectedIncoType.steps.length > 0 && !vm.selectedInCoTypeStep) {
                    selectInCoTypeStep(vm.selectedIncoType.steps[0]);
                }
            }
        }

        function selectInCoTypeStep(stepItem) {
            if (stepItem) {
                vm.selectedInCoTypeStep = angular.copy(stepItem);
            }
        }

        function checkTypeSteps() {
            if (vm.inCoStepDefs && vm.inCoStepDefs.length > 0 && vm.inCoTypeDefs && vm.inCoTypeDefs.length > 0) {
                for (var i = 0; i < vm.inCoTypeDefs.length; i++) {
                    if (vm.inCoTypeDefs[i].steps && vm.inCoTypeDefs[i].steps.length > 0) {
                        for (var j = 0; j < vm.inCoStepDefs.length; j++) {
                            var stepIndex = msbUtilService.getIndex(vm.inCoTypeDefs[i].steps, "stepId", vm.inCoStepDefs[j][PRIMARY_COLUMN_NAME]);
                            if (stepIndex === -1) {

                                var stepObj = {
                                    "TECHDISER_ID": msbUtilService.generateId(),
                                    "TECHDISER_SERIAL_NO": vm.inCoTypeDefs[i].steps.length + 1,
                                    "stepId": vm.inCoStepDefs[j][PRIMARY_COLUMN_NAME],
                                    "isImportPayment": false,
                                    "isExportPayment": false,
                                    "stakeholderId": null,
                                    "isSelected": false
                                }
                                vm.inCoTypeDefs[i].steps.push(stepObj);
                            }
                        }
                    }
                }
                callSaveType();
            }
        }

        function callSaveType(selectedIncoType) {
            updateTypeVM(selectedIncoType);
            var param = {
                'path': '/typeDefinition',
                'itemId': vm.inCoTypes.TECHDISER_ID,
                'pathParam': [],
                'data': vm.inCoTypeDefs
            };
            savaIncoTypeDef(function (data) {
                if (data) {
                    // console.log(data);
                    callSaveStep();
                }
            }, param);
        }

        function savaIncoTypeDef(callBack, param) {
            if (param) {
                msbCommonApiService.interfaceManager(function (data) {
                    if (data) {
                        callBack(data);
                    }
                }, "inCoService", "saveImportIncoType", param);

            }
        }

        function updateTypeVM(selectedType) {
            if (selectedType && vm.inCoTypeDefs && vm.inCoTypeDefs.length > 0) {
                var typeType = msbUtilService.getIndex(vm.inCoTypeDefs, PRIMARY_COLUMN_NAME, selectedType.TECHDISER_ID);
                if (typeType > -1) {
                    vm.inCoTypeDefs[typeType] = selectedType;
                }
            }
        }

        function callSaveStep() {
            var param = {
                'path': '/stepDefinition',
                'itemId': vm.inCoTypes.TECHDISER_ID,
                'pathParam': [],
                'data': vm.inCoStepDefs
            };
            savaIncoTypeDef(function (data) {
                if (data) {
                    console.log(vm.inCoTypeDefs);
                    console.log(vm.inCoStepDefs);
                    var typIndex = msbUtilService.getIndex(vm.inCoTypeDefs, PRIMARY_COLUMN_NAME, vm.selectedIncoType[PRIMARY_COLUMN_NAME]);
                    if (typIndex > -1) {
                        selectInCoType(vm.inCoTypeDefs[typIndex]);
                    }
                }
            }, param);
        }

        function addStakeholder(stakeholder, isNew) {
            if (vm.stakeholderDefs) {
                $mdDialog
                    .show({
                        controller: "AddUpdateStakeholderDialogController",
                        controllerAs: "vm",
                        clickOutsideToClose: false,
                        preserveScope: true,
                        templateUrl: "app/main/systemsettings/stackeholder/dialogs/add-stakeholders/add-stakeholders-dialog.html",
                        locals: {
                            StakeholderDef: vm.stakeholderDefs,
                            Stakeholder: stakeholder,
                            IsNew: isNew
                        }
                    })
                    .then(function (answer) {
                        if (answer) {
                            if (isNew) {
                                vm.stakeholderDefs.unshift(answer);
                                selectStakeholder(answer);
                                callSaveStakeholder();
                            } else {
                                if (vm.stakeholderDefs) {
                                    var documentIndex = msbUtilService.getIndex(vm.stakeholderDefs, "TECHDISER_ID", answer.TECHDISER_ID);
                                    if (documentIndex > -1) {
                                        vm.stakeholderDefs[documentIndex] = answer;
                                        selectStakeholder(answer);
                                        callSaveStakeholder();
                                    }
                                }
                            }
                        }
                    });
            }
        }

        function callSaveStakeholder(stakeholder) {
            if (stakeholder) {
                updateStakeholderVM(stakeholder);
            }
            var param = {
                'path': '/stakeholderDefinition',
                'itemId': vm.inCoTypes.TECHDISER_ID,
                'pathParam': [],
                'data': vm.stakeholderDefs
            };
            savaIncoTypeDef(function (data) {
                if (data) {
                    // console.log(data);
                }
            }, param);
        }

        function updateStakeholderVM(selectedStakeholder) {
            if (selectedStakeholder && vm.stakeholderDefs && vm.stakeholderDefs.length > 0) {
                var stkIndex = msbUtilService.getIndex(vm.stakeholderDefs, PRIMARY_COLUMN_NAME, selectedStakeholder.TECHDISER_ID);
                if (stkIndex > -1) {
                    vm.stakeholderDefs[stkIndex] = selectedStakeholder;
                }
            }
        }

        function createNewDataSheet() {
            vm.isExapndDataSheet = true;
            vm.dataSheet = {
                "TECHDISER_ID": msbUtilService.generateId(),
                "title": ""
            };
            vm.isNewDataSheet = true;
            vm.updateDataSheet = false;
        }

        function saveDataSheet(stakeholder, dataSheet, isNewDataSheet) {
            if (msbUtilService.checkUndefined(stakeholder, dataSheet)) {
                if (isNewDataSheet) {
                    var dataSheetStr = dataSheet;
                    stakeholder.dataSheets.unshift(dataSheetStr);
                    callSaveStakeholder(stakeholder);
                } else {
                    var sheetIndex = msbUtilService.getIndex(stakeholder.dataSheets, PRIMARY_COLUMN_NAME, dataSheet[PRIMARY_COLUMN_NAME]);

                    if (sheetIndex > -1) {
                        stakeholder.dataSheets[sheetIndex] = dataSheet;
                        callSaveStakeholder(stakeholder);
                    }
                }
                vm.updateDataSheet = false;
                vm.isNewDataSheet = true;
            }
        }

        function selectDataSheet(item) {
            if (item) {
                vm.dataSheet = angular.copy(item);
                vm.selectedDataSheet = item;
                vm.updateDataSheet = true;
                vm.isNewDataSheet = false;
            }
        }

    }
})();
