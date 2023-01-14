(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('ExportIncoController', ExportIncoController);

    /** @ngInject */
    function ExportIncoController(PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME, $mdDialog,
        msbCommonApiService, msbUtilService, inCoService) {

        var vm = this;

        vm.selectInCoType = selectInCoType;
        vm.addShipmentType = addShipmentType;
        vm.addTypeStep = addTypeStep;
        vm.addTypeDocument = addTypeDocument;
        vm.selectTypeStep = selectTypeStep;
        vm.checkStepExist = checkStepExist;
        vm.checkRisk = checkRisk;
        vm.checkRiskExist = checkRiskExist;
        vm.checkPayment = checkPayment;
        vm.checkPaymentExist = checkPaymentExist;
        vm.filterBySelectedDocuments = filterBySelectedDocuments;
        vm.saveDataSheet = saveDataSheet;
        vm.selectDataSheet = selectDataSheet;
        vm.deleteDataSheet = deleteDataSheet;
        vm.selectDocument = selectDocument;
        vm.selectTypeDocumentDialog = selectTypeDocumentDialog;
        vm.selectTypeDocument = selectTypeDocument;
        vm.selectPortToPortTransport = selectPortToPortTransport;
        vm.callSaveType = callSaveType;

        init();

        function init() {
            vm.leftNavPined = true;
            getIncoTypeDefinition();
            // checkStepExist(vm.inCoTypeDefs[0].steps[0]);
        }

        function getIncoTypeDefinition() {
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    vm.inCoTypes = data[0];
                    vm.inCoTypeDefs = vm.inCoTypes.typeDefinition;
                    vm.inCoStepDefs = vm.inCoTypes.stepDefinition;
                    vm.inCoDocumentDefs = vm.inCoTypes.documentDefinition;

                    selectInCoType(vm.inCoTypeDefs[0]);
                }

            }, "inCoService", "getExportIncoDefinition", null);
        }

        function savaIncoTypeDef(callBack, param) {
            if (param) {
                msbCommonApiService.interfaceManager(function (data) {
                    if (data) {
                        callBack(data);
                    }
                }, "inCoService", "saveExportIncoType", param);

            }
        }

        function selectInCoType(item) {
            if (item) {
                vm.selectedIncoType = angular.copy(item);

                vm.dataSheet = {};
                vm.updateDataSheet = false;
                vm.isNewDataSheet = true;
                vm.isExapndDataSheet = false;
            }
        }

        function addShipmentType(shipmentType, isNew) {
            if (vm.inCoTypeDefs) {
                $mdDialog
                    .show({
                        controller: "AddShipmentTypeDialogController",
                        controllerAs: "vm",
                        clickOutsideToClose: false,
                        preserveScope: true,
                        templateUrl: "app/main/systemsettings/export-inco/dialog/add-shipment-type-dialog.html",
                        locals: {
                            ShipmentTypeDef: vm.inCoTypeDefs,
                            ShipmentType: shipmentType,
                            IsNew: isNew
                        }
                    })
                    .then(function (answer) {
                        if (answer) {
                            if (isNew) {
                                vm.inCoTypeDefs.push(answer);
                                callSaveType(answer);

                                var typeIndex = msbUtilService.getIndex(vm.inCoTypeDefs, PRIMARY_COLUMN_NAME, answer.TECHDISER_ID);
                                if (typeIndex > -1) {
                                    selectInCoType(vm.inCoTypeDefs[typeIndex]);
                                }
                            }
                            else {
                                if (vm.inCoTypeDefs) {
                                    var typeIndex = msbUtilService.getIndex(vm.inCoTypeDefs, "TECHDISER_ID", answer.TECHDISER_ID);
                                    if (typeIndex > -1) {
                                        vm.inCoTypeDefs[typeIndex] = answer;
                                        callSaveType(answer);
                                        selectInCoType(vm.inCoTypeDefs[typeIndex]);

                                    }

                                }
                            }
                        }
                    });
            }
        }

        function addTypeStep(typeStep, isNew) {
            if (vm.inCoStepDefs) {
                $mdDialog
                    .show({
                        controller: "AddShipmentTypeStepDialogController",
                        controllerAs: "vm",
                        clickOutsideToClose: false,
                        preserveScope: true,
                        templateUrl: "app/main/systemsettings/export-inco/dialog/add-shipment-type-step-dialog.html",
                        locals: {
                            ShipmentStepDef: vm.inCoStepDefs,
                            TypeStep: typeStep,
                            IsNew: isNew
                        }
                    })
                    .then(function (answer) {
                        if (answer) {
                            if (isNew) {
                                vm.inCoStepDefs.push(answer);
                                callSaveStep();
                            }
                            else {
                                if (vm.inCoStepDefs) {
                                    var stepIndex = msbUtilService.getIndex(vm.inCoStepDefs, "TECHDISER_ID", answer.TECHDISER_ID);
                                    if (stepIndex > -1) {
                                        vm.inCoStepDefs[stepIndex] = answer;
                                        callSaveStep();
                                    }
                                }
                            }
                        }
                    });
            }
        }

        function addTypeDocument(typeDocument, isNew) {
            if (vm.inCoDocumentDefs) {
                $mdDialog
                    .show({
                        controller: "AddShipmentTypeDocumentDialogController",
                        controllerAs: "vm",
                        clickOutsideToClose: false,
                        preserveScope: true,
                        templateUrl: "app/main/systemsettings/export-inco/dialog/add-shipment-type-document-dialog.html",
                        locals: {
                            ShipmentDocumentDef: vm.inCoDocumentDefs,
                            TypeDocument: typeDocument,
                            IsNew: isNew
                        }
                    })
                    .then(function (answer) {
                        if (answer) {
                            if (isNew) {
                                vm.inCoDocumentDefs.unshift(answer);
                                callSaveDocument();
                            }
                            else {
                                if (vm.inCoDocumentDefs) {
                                    var documentIndex = msbUtilService.getIndex(vm.inCoDocumentDefs, "TECHDISER_ID", answer.TECHDISER_ID);
                                    if (documentIndex > -1) {
                                        vm.inCoDocumentDefs[documentIndex] = answer;
                                        callSaveDocument();
                                    }
                                }
                            }
                        }
                    });
            }
        }

        function checkStepExist(stepId) {
            if (!vm.selectedIncoType.steps) {
                return;
            }
            var stepPos = msbUtilService.getIndex(vm.selectedIncoType.steps, "stepId", stepId);
            return stepPos > -1;
        }

        function selectTypeStep(step) {
            if (step && vm.selectedIncoType.steps) {
                var i = msbUtilService.getIndex(vm.selectedIncoType.steps, "stepId", step.TECHDISER_ID);
                if (i > -1) {
                    vm.selectedIncoType.steps.splice(i, 1);
                }
                else {
                    var largeNum = 0;
                    if (vm.selectedIncoType.steps) {
                        for (var j = 0; j < vm.selectedIncoType.steps.length; j++) {
                            if (vm.selectedIncoType.steps[j].TECHDISER_SERIAL_NO > largeNum) {
                                largeNum = vm.selectedIncoType.steps[j].TECHDISER_SERIAL_NO;
                            }
                        }
                    }
                    var stepObj = {
                        "TECHDISER_ID": msbUtilService.generateId(),
                        "TECHDISER_SERIAL_NO": largeNum + 1,
                        "stepId": step.TECHDISER_ID,
                        "isRisk": false,
                        "isPayment": false
                    }
                    vm.selectedIncoType.steps.push(stepObj);
                    callSaveType(vm.selectedIncoType);
                }
            }
        }

        function callSaveType(selectedIncoType) {
            updateTypeVM(selectedIncoType);
            var param = { 'path': '/typeDefinition', 'itemId': vm.inCoTypes.TECHDISER_ID, 'pathParam': [], 'data': vm.inCoTypeDefs };
            savaIncoTypeDef(function (data) {
                if (data) {
                    // console.log(data);
                }
            }, param);
        }

        function updateTypeVM(selectedType) {
            if (selectedType && vm.inCoTypeDefs && vm.inCoTypeDefs.length > 0) {
                var typeType = msbUtilService.getIndex(vm.inCoTypeDefs, PRIMARY_COLUMN_NAME, selectedType.TECHDISER_ID);
                if (typeType > -1) {
                    vm.inCoTypeDefs[typeType] = selectedType;
                }
            }
        }

        function callSaveDocument() {
            var param = { 'path': '/documentDefinition', 'itemId': vm.inCoTypes.TECHDISER_ID, 'pathParam': [], 'data': vm.inCoDocumentDefs };
            savaIncoTypeDef(function (data) {
                if (data) {
                    // console.log(data);
                }
            }, param);
        }

        function callSaveStep() {
            var param = { 'path': '/stepDefinition', 'itemId': vm.inCoTypes.TECHDISER_ID, 'pathParam': [], 'data': vm.inCoStepDefs };
            savaIncoTypeDef(function (data) {
                if (data) {
                    // console.log(data);
                }
            }, param);
        }

        function checkRisk(stepId) {
            if (stepId && vm.selectedIncoType && vm.selectedIncoType.steps && vm.selectedIncoType.steps.length > 0) {
                var i = msbUtilService.getIndex(vm.selectedIncoType.steps, "stepId", stepId);
                if (i > -1) {
                    vm.selectedIncoType.steps[i].isRisk = vm.selectedIncoType.steps[i].isRisk == true ? false : true;
                    callSaveType(vm.selectedIncoType);
                    return vm.selectedIncoType.steps[i].isRisk;
                }
            }
        }

        function checkRiskExist(step) {
            if (step && vm.selectedIncoType && vm.selectedIncoType.steps && vm.selectedIncoType.steps.length > 0) {
                var stepIndex = msbUtilService.getIndex(vm.selectedIncoType.steps, "stepId", step.TECHDISER_ID);
                if (stepIndex > -1) {
                    return vm.selectedIncoType.steps[stepIndex].isRisk;
                }
            }
        }

        function checkPayment(stepId) {
            if (stepId && vm.selectedIncoType && vm.selectedIncoType.steps && vm.selectedIncoType.steps.length > 0) {
                var i = msbUtilService.getIndex(vm.selectedIncoType.steps, "stepId", stepId);
                if (i > -1) {
                    vm.selectedIncoType.steps[i].isPayment = vm.selectedIncoType.steps[i].isPayment == true ? false : true;
                    callSaveType(vm.selectedIncoType);
                    return vm.selectedIncoType.steps[i].isPayment;
                }
            }
        }

        function checkPaymentExist(step) {
            if (step && vm.selectedIncoType && vm.selectedIncoType.steps && vm.selectedIncoType.steps.length > 0) {
                var stepIndex = msbUtilService.getIndex(vm.selectedIncoType.steps, "stepId", step.TECHDISER_ID);
                if (stepIndex > -1) {
                    return vm.selectedIncoType.steps[stepIndex].isPayment;
                }
            }
        }

        function filterBySelectedDocuments(e) {
            if (vm.selectedIncoType.documentId) {
                return vm.selectedIncoType.documentId.indexOf(e.TECHDISER_ID) !== -1;
            }
        }

        function selectDataSheet(item) {
            if (item) {
                vm.dataSheet.title = angular.copy(item);
                vm.selectedDataSheet = item;
                vm.updateDataSheet = true;
                vm.isNewDataSheet = false;
            }
        }

        function saveDataSheet(incoType, dataSheet, isNewDataSheet) {
            if (incoType && dataSheet) {
                if (isNewDataSheet) {
                    var dataSheetStr = dataSheet.title;
                    incoType.dataSheet.unshift(dataSheetStr);
                    callSaveType(vm.selectedIncoType);
                }
                else {
                    var sheetIndex = incoType.dataSheet.indexOf(vm.selectedDataSheet);
                    if (sheetIndex > -1) {
                        incoType.dataSheet[sheetIndex] = dataSheet.title;
                        callSaveType(vm.selectedIncoType);
                    }
                }
                vm.updateDataSheet = false;
                vm.isNewDataSheet = true;
            }
        }

        function deleteDataSheet(incoType, dataSheet) {
            if (incoType && dataSheet) {
                var sheetIndex = incoType.dataSheet.indexOf(dataSheet);
                if (sheetIndex > -1) {
                    incoType.dataSheet.splice(sheetIndex, 1);

                    vm.dataSheet = {};
                    vm.updateDataSheet = false;
                    vm.isNewDataSheet = true;
                }
            }
        }

        function selectDocument(item) {
            if (item) {
                vm.selectedDocument = angular.copy(item);
            }
        }

        function selectTypeDocumentDialog(documentIds) {
            if (vm.inCoDocumentDefs) {
                $mdDialog
                    .show({
                        controller: "SelectTypeDocumentDialogController",
                        controllerAs: "vm",
                        clickOutsideToClose: false,
                        preserveScope: true,
                        templateUrl: "app/main/systemsettings/export-inco/dialog/select-type-documents-dialog.html",
                        locals: {
                            DocumentDef: vm.inCoDocumentDefs,
                            Documents: documentIds
                        }
                    })
                    .then(function (answer) {
                        if (answer) {
                            vm.selectedIncoType.documentId = answer;
                            callSaveType(vm.selectedIncoType);
                        }
                    });
            }
        }

        function selectTypeDocument(item) {
            if (item) {
                vm.selectedTypeDocument = angular.copy(item);
            }
        }

        function selectPortToPortTransport() {
            // have to work
        }

    }
})();
