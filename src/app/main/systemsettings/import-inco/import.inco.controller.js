(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('ImportInCoController', ImportInCoController);

    /** @ngInject */
    function ImportInCoController(PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME, $mdDialog,
        msbCommonApiService, msbUtilService, inCoService, styleDataService) {

        var vm = this;

        vm.selectInCoType = selectInCoType;
        vm.primaryColumnName = PRIMARY_COLUMN_NAME;
        vm.addShipmentType = addShipmentType;
        vm.addTypeStep = addTypeStep;
        vm.addTypeDocument = addTypeDocument;
        vm.selectTypeStep = selectTypeStep;
        vm.checkStepExist = checkStepExist;
        vm.checkImportExist = checkImportExist;
        vm.checkPayment = checkPayment;
        vm.checkExportExist = checkExportExist;
        vm.filterBySelectedDocuments = filterBySelectedDocuments;
        vm.saveDataSheet = saveDataSheet;
        vm.selectDataSheet = selectDataSheet;
        vm.deleteDataSheet = deleteDataSheet;
        vm.selectDocument = selectDocument;
        vm.selectTypeDocumentDialog = selectTypeDocumentDialog;
        vm.selectTypeDocument = selectTypeDocument;
        vm.selectPortToPortTransport = selectPortToPortTransport;
        vm.callSaveType = callSaveType;
        vm.addStakeholder = addStakeholder;
        vm.callSaveStakeholder = callSaveStakeholder;
        vm.createNewDataSheet = createNewDataSheet;
        vm.selectStakeholder = selectStakeholder;
        vm.getSelectedStakeholder = getSelectedStakeholder;

        vm.getStakeholderTitle = getStakeholderTitle;
        vm.addBill = addBill;
        vm.checkImportExportStakeholders = checkImportExportStakeholders;
        vm.checkStakeholderExist = checkStakeholderExist;
        vm.getStepTitle = getStepTitle;
        vm.deleteBill = deleteBill;
        vm.selectInCoTypeStep = selectInCoTypeStep;
        vm.getBillPolicyTitle = getBillPolicyTitle;

        init();

        function init() {
            vm.leftNavPined = true;
            getIncoTypeDefinition();
            // checkStepExist(vm.inCoTypeDefs[0].steps[0]);
            getStakeholders();

            getImportsBillsByInCoTypes();
            getExportsBillsByInCoTypes();
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

        function getBillPolicy() {
            msbCommonApiService.interfaceManager(function (billPolicyData) {
                if (billPolicyData) {
                    vm.billPolicy = billPolicyData;

                }
            }, "inCoService", "getBillPolicy", null);
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

        function selectInCoType(item) {
            if (item) {
                vm.selectedIncoType = angular.copy(item);

                vm.updateDataSheet = false;
                vm.isNewDataSheet = true;
                vm.isExapndDataSheet = false;

                if (vm.selectedIncoType && vm.selectedIncoType.steps && vm.selectedIncoType.steps.length > 0 && !vm.selectedInCoTypeStep) {
                    selectInCoTypeStep(vm.selectedIncoType.steps[0]);
                }
                getImportsBillsByInCoTypes();
            }
        }

        function addShipmentType(shipmentType, isNew) {
            if (vm.inCoTypeDefs) {
                $mdDialog
                    .show({
                        controller: "AddIncoShipmentTypeDialogController",
                        controllerAs: "vm",
                        clickOutsideToClose: false,
                        preserveScope: true,
                        templateUrl: "app/main/systemsettings/import-inco/dialog/shipment-type/add-shipment-type-dialog.html",
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
                                checkTypeSteps();
                                callSaveType(answer);
                                var typeIndex = msbUtilService.getIndex(vm.inCoTypeDefs, PRIMARY_COLUMN_NAME, answer.TECHDISER_ID);
                                if (typeIndex > -1) {
                                    selectInCoType(vm.inCoTypeDefs[typeIndex]);
                                }
                            } else {
                                if (vm.inCoTypeDefs) {
                                    var typeIndex = msbUtilService.getIndex(vm.inCoTypeDefs, "TECHDISER_ID", answer.TECHDISER_ID);
                                    if (typeIndex > -1) {
                                        vm.inCoTypeDefs[typeIndex] = answer;
                                        checkTypeSteps();
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
                        templateUrl: "app/main/systemsettings/import-inco/dialog/add-shipment-type-step/add-shipment-type-step-dialog.html",
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
                                // callSaveStep();
                            } else {
                                if (vm.inCoStepDefs) {
                                    var stepIndex = msbUtilService.getIndex(vm.inCoStepDefs, "TECHDISER_ID", answer.TECHDISER_ID);
                                    if (stepIndex > -1) {
                                        vm.inCoStepDefs[stepIndex] = answer;
                                        // callSaveStep();
                                    }
                                }
                            }
                            checkTypeSteps();
                        }
                    });
            }
        }

        function checkTypeSteps() {
            if (vm.inCoStepDefs && vm.inCoStepDefs.length > 0 && vm.inCoTypeDefs && vm.inCoTypeDefs.length > 0) {
                for (var i = 0; i < vm.inCoTypeDefs.length; i++) {
                    if (vm.inCoTypeDefs[i].steps) {
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

        function addTypeDocument(typeDocument, isNew) {
            if (vm.inCoDocumentDefs) {
                $mdDialog
                    .show({
                        controller: "AddShipmentTypeDocumentDialogController",
                        controllerAs: "vm",
                        clickOutsideToClose: false,
                        preserveScope: true,
                        templateUrl: "app/main/systemsettings/import-inco/dialog/add-document/add-shipment-type-document-dialog.html",
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
                            } else {
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


        function checkStepExist(selectedStep) {
            if (selectedStep) {
                if (selectedStep.isSelected == true) {
                    return true;
                } else {
                    return false;
                }
            }
            // if (!vm.selectedIncoType.steps) {
            //   return;
            // }
            // // var stepPos = msbUtilService.getIndex(vm.selectedIncoType.steps, "stepId", stepId);
            // var param = [{"key": "stepId", "value": stepId},{"key": "isSelected", "value": true}];
            // var stepPos = msbUtilService.getItemsByProperties(vm.selectedIncoType.steps, param);
            // // console.log(stepPos);
            // return stepPos.length > -1;
        }

        function selectTypeStep(step) {
            if (step && vm.selectedIncoType.steps) {
                var i = msbUtilService.getIndex(vm.selectedIncoType.steps, "stepId", step.TECHDISER_ID);
                if (i > -1) {
                    vm.selectedIncoType.steps[i].isSelected = !vm.selectedIncoType.steps[i].isSelected;
                }
                callSaveType(vm.selectedIncoType);
                // if (i > -1) {
                //   vm.selectedIncoType.steps.splice(i, 1);
                // } else {
                //   var largeNum = 0;
                //   if (vm.selectedIncoType.steps) {
                //     for (var j = 0; j < vm.selectedIncoType.steps.length; j++) {
                //       if (vm.selectedIncoType.steps[j].TECHDISER_SERIAL_NO > largeNum) {
                //         largeNum = vm.selectedIncoType.steps[j].TECHDISER_SERIAL_NO;
                //       }
                //     }
                //   }
                //   var stepObj = {
                //     "TECHDISER_ID": msbUtilService.generateId(),
                //     "TECHDISER_SERIAL_NO": largeNum + 1,
                //     "stepId": step.TECHDISER_ID,
                //     "isImportPayment": false,
                //     "isExportPayment": false,
                //     "stakeholderId": null,
                //     "isSelected": false
                //   }
                //   vm.selectedIncoType.steps.push(stepObj);
                //   callSaveType(vm.selectedIncoType);
                // }
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


        function updateTypeVM(selectedType) {
            if (selectedType && vm.inCoTypeDefs && vm.inCoTypeDefs.length > 0) {
                var typeType = msbUtilService.getIndex(vm.inCoTypeDefs, PRIMARY_COLUMN_NAME, selectedType.TECHDISER_ID);
                if (typeType > -1) {
                    vm.inCoTypeDefs[typeType] = selectedType;
                }
            }
        }

        function callSaveDocument() {
            var param = {
                'path': '/documentDefinition',
                'itemId': vm.inCoTypes.TECHDISER_ID,
                'pathParam': [],
                'data': vm.inCoDocumentDefs
            };
            savaIncoTypeDef(function (data) {
                if (data) {
                    // console.log(data);
                }
            }, param);
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

        function checkImportExist(step) {
            if (step && vm.selectedIncoType && vm.selectedIncoType.steps && vm.selectedIncoType.steps.length > 0) {
                var stepIndex = msbUtilService.getIndex(vm.selectedIncoType.steps, "stepId", step.TECHDISER_ID);
                if (stepIndex > -1) {
                    return vm.selectedIncoType.steps[stepIndex].isImportPayment;
                }
            }
        }

        function checkPayment(stepId, flag) {
            if (stepId && vm.selectedIncoType && vm.selectedIncoType.steps && vm.selectedIncoType.steps.length > 0) {
                var i = msbUtilService.getIndex(vm.selectedIncoType.steps, "stepId", stepId);
                if (i > -1) {
                    if (vm.selectedIncoType.steps[i].isExportPayment == true && vm.selectedIncoType.steps[i].isImportPayment == false) {
                        vm.selectedIncoType.steps[i].isExportPayment = false;
                        vm.selectedIncoType.steps[i].isImportPayment = true;
                    } else if (vm.selectedIncoType.steps[i].isExportPayment == false && vm.selectedIncoType.steps[i].isImportPayment == true) {
                        vm.selectedIncoType.steps[i].isExportPayment = true;
                        vm.selectedIncoType.steps[i].isImportPayment = false;
                    } else if (vm.selectedIncoType.steps[i].isExportPayment == true && vm.selectedIncoType.steps[i].isImportPayment == true) {
                        if (flag == true) {
                            vm.selectedIncoType.steps[i].isImportPayment = true;
                            vm.selectedIncoType.steps[i].isExportPayment = false;
                        } else if (flag == false) {
                            vm.selectedIncoType.steps[i].isImportPayment = false;
                            vm.selectedIncoType.steps[i].isExportPayment = true;
                        }
                    } else if (vm.selectedIncoType.steps[i].isExportPayment == false && vm.selectedIncoType.steps[i].isImportPayment == false) {
                        if (flag == true) {
                            vm.selectedIncoType.steps[i].isImportPayment = true;
                            vm.selectedIncoType.steps[i].isExportPayment = false;
                        } else if (flag == false) {
                            vm.selectedIncoType.steps[i].isImportPayment = false;
                            vm.selectedIncoType.steps[i].isExportPayment = true;
                        }
                    }
                    callSaveType(vm.selectedIncoType);
                    if (flag) {
                        return vm.selectedIncoType.steps[i].isImportPayment;
                    } else {
                        return vm.selectedIncoType.steps[i].isExportPayment;
                    }
                }
            }
        }

        function checkExportExist(step) {
            if (step && vm.selectedIncoType && vm.selectedIncoType.steps && vm.selectedIncoType.steps.length > 0) {
                var stepIndex = msbUtilService.getIndex(vm.selectedIncoType.steps, "stepId", step.TECHDISER_ID);
                if (stepIndex > -1) {
                    return vm.selectedIncoType.steps[stepIndex].isExportPayment;
                }
            }
        }

        function filterBySelectedDocuments(e) {
            if (vm.selectedInCoTypeStep && vm.selectedInCoTypeStep.documentId) {
                return vm.selectedInCoTypeStep.documentId.indexOf(e.TECHDISER_ID) !== -1;
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

        function deleteDataSheet(stakeholder, dataSheet) {
            if (stakeholder && stakeholder.dataSheets && stakeholder.dataSheets.length > 0 && dataSheet) {
                var sheetIndex = msbUtilService.getIndex(stakeholder.dataSheet, PRIMARY_COLUMN_NAME, dataSheet[PRIMARY_COLUMN_NAME]);
                if (sheetIndex > -1) {
                    stakeholder.dataSheets.splice(sheetIndex, 1);
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
                        templateUrl: "app/main/systemsettings/import-inco/dialog/select-document/select-type-documents-dialog.html",
                        locals: {
                            DocumentDef: vm.inCoDocumentDefs,
                            Documents: documentIds
                        }
                    })
                    .then(function (answer) {
                        if (answer && vm.selectedInCoTypeStep) {
                            vm.selectedInCoTypeStep.documentId = answer;
                            updateStepVM(vm.selectedInCoTypeStep);
                            console.log(vm.selectedInCoTypeStep);
                            callSaveType(vm.selectedIncoType);
                        }
                    });
            }
        }

        function updateStepVM(inCoTypeStep) {
            if (inCoTypeStep && vm.selectedIncoType && vm.selectedIncoType.steps && vm.selectedIncoType.steps.length > 0) {
                var stepIndex = msbUtilService.getIndex(vm.selectedIncoType.steps, PRIMARY_COLUMN_NAME, inCoTypeStep.TECHDISER_ID);
                if (stepIndex > -1) {
                    vm.selectedIncoType.steps[stepIndex] = inCoTypeStep;
                }
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

        function addStakeholder(stakeholder, isNew) {
            if (vm.stakeholderDefs) {
                $mdDialog
                    .show({
                        controller: "AddStakeholderDialogController",
                        controllerAs: "vm",
                        clickOutsideToClose: false,
                        preserveScope: true,
                        templateUrl: "app/main/systemsettings/import-inco/dialog/add-stakeholders/add-stakeholders-dialog.html",
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

        function selectStakeholder(item) {
            if (item) {
                vm.selectedStakeholder = angular.copy(item);
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

        function getSelectedStakeholder(stepId) {
            if (stepId && vm.selectedIncoType && vm.selectedIncoType.steps && vm.selectedIncoType.steps.length > 0) {
                var stepIndex = msbUtilService.getIndex(vm.selectedIncoType.steps, "stepId", stepId);
                if (stepIndex > -1) {
                    return vm.selectedIncoType.steps[stepIndex].stakeholderId;
                }
            }
        }

        // service to get stakeholders
        function getStakeholders() {
            msbCommonApiService.interfaceManager(function (stakeholderData) {
                if (stakeholderData) {
                    console.log(stakeholderData);
                }
            }, "inCoService", "getStakeholders", null);
        }

        function getStakeholderTitle(stakeholderId) {
            if (stakeholderId && vm.stakeholderDefs && vm.stakeholderDefs.length > 0) {
                var index = msbUtilService.getIndex(vm.stakeholderDefs, PRIMARY_COLUMN_NAME, stakeholderId);
                if (index > -1) {
                    return vm.stakeholderDefs[index].title;
                }
            }
        }

        function addBill(stakeholder, bill, isNew, code) {
            if (vm.selectedIncoType && vm.selectedIncoType.steps && vm.billPolicy) {
                $mdDialog
                    .show({
                        controller: "AddStakeholderBillDialogController",
                        controllerAs: "vm",
                        clickOutsideToClose: false,
                        preserveScope: true,
                        templateUrl: "app/main/systemsettings/import-inco/dialog/add-bill/add-bill-dialog.html",
                        locals: {
                            Stakeholder: stakeholder,
                            Steps: vm.selectedIncoType.steps,
                            Bill: bill,
                            IsNew: isNew,
                            Code: code,
                            Policy: vm.billPolicy
                        }
                    })
                    .then(function (answer) {
                        if (answer && stakeholder && stakeholder.bills) {
                            console.log(answer);
                            if (isNew) {
                                stakeholder.bills.unshift(answer);
                            } else {
                                var billIndex = msbUtilService.getIndex(stakeholder.bills, PRIMARY_COLUMN_NAME, answer.TECHDISER_ID);
                                if (billIndex > -1) {
                                    stakeholder.bills[billIndex] = answer;
                                }
                            }
                        }
                        callSaveType(vm.selectedIncoType);
                    });
            }
        }

        // function checkImportExportStakeholders() {
        //   if (vm.inCoTypeDefs && vm.inCoTypeDefs.length > 0) {
        //     for (var i = 0; i < vm.inCoTypeDefs.length; i++) {
        //       if (vm.inCoTypeDefs[i].steps && vm.inCoTypeDefs[i].steps.length > 0 &&
        //         vm.inCoTypeDefs[i].importers && vm.inCoTypeDefs[i].exporters) {
        //         for (var j = 0; j < vm.inCoTypeDefs[i].steps.length; j++) {
        //           if (vm.inCoTypeDefs[i].steps[j].stepId &&
        //             (vm.inCoTypeDefs[i].steps[j].isSelected === true) && vm.inCoTypeDefs[i].steps[j].stakeholderId) {
        //             if (vm.inCoTypeDefs[i].steps[j].isImportPayment === true) {
        //               var importerIndex = msbUtilService.getIndex(vm.inCoTypeDefs[i].importers, "stakeholderId", vm.inCoTypeDefs[i].steps[j].stakeholderId);
        //               if (importerIndex === -1) {
        //                 var importerObj = {
        //                   "TECHDISER_ID": msbUtilService.generateId(),
        //                   "stakeholderId": vm.inCoTypeDefs[i].steps[j].stakeholderId,
        //                   "bills": []
        //                 }
        //                 vm.inCoTypeDefs[i].importers.push(importerObj);
        //               }
        //             }else if (vm.inCoTypeDefs[i].steps[j].isExportPayment === true) {
        //               var exporterIndex = msbUtilService.getIndex(vm.inCoTypeDefs[i].exporters, "stakeholderId", vm.inCoTypeDefs[i].steps[j].stakeholderId);
        //               if (exporterIndex === -1) {
        //                 var exporterObj = {
        //                   "TECHDISER_ID": msbUtilService.generateId(),
        //                   "stakeholderId": vm.inCoTypeDefs[i].steps[j].stakeholderId,
        //                   "bills": []
        //                 }
        //                 vm.inCoTypeDefs[i].exporters.push(exporterObj);
        //               }
        //             }
        //           }
        //         }
        //
        //       }
        //     }
        //     console.log(vm.inCoTypeDefs);
        //   }
        // }
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

        function checkStakeholderExist(stakeholder, code) {
            if (stakeholder && stakeholder.stakeholderId && vm.selectedIncoType &&
                vm.selectedIncoType.steps && vm.selectedIncoType.steps.length > 0) {
                if (code === 'importer') {
                    var params = [
                        { "key": "stakeholderId", "value": stakeholder.stakeholderId },
                        { "key": "isSelected", "value": true },
                        { "key": "isImportPayment", "value": true }
                    ];
                } else if (code === 'exporter') {
                    var params = [
                        { "key": "stakeholderId", "value": stakeholder.stakeholderId },
                        { "key": "isSelected", "value": true },
                        { "key": "isExportPayment", "value": true }
                    ];
                }
                var index = msbUtilService.getIndexByValues(vm.selectedIncoType.steps, params);
                if (index > -1) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        function getStepTitle(stepId) {
            if (stepId && vm.inCoStepDefs && vm.inCoStepDefs.length > 0) {
                var index = msbUtilService.getIndex(vm.inCoStepDefs, PRIMARY_COLUMN_NAME, stepId);
                if (index > -1) {
                    return vm.inCoStepDefs[index].title;
                }
            }
        }

        function deleteBill(importStakeholder, importBill) {
            if (importStakeholder && importStakeholder.bills && importStakeholder.bills.length > 0 && importBill) {

                msbUtilService.showConfirmDialog("Bill will be removed.", function () {
                    var billIndex = msbUtilService.getIndex(importStakeholder.bills, PRIMARY_COLUMN_NAME, importBill[PRIMARY_COLUMN_NAME]);
                    if (billIndex > -1) {
                        importStakeholder.bills[billIndex].TD_IS_DELETED = 1;
                    }
                });
            }
        }

        function selectInCoTypeStep(stepItem) {
            if (stepItem) {
                vm.selectedInCoTypeStep = angular.copy(stepItem);
            }
        }

        function getBillPolicyTitle(policy) {
            if (policy && vm.billPolicy && vm.billPolicy.length > 0) {
                var index = msbUtilService.getIndex(vm.billPolicy, "key", policy);
                if (index > -1) {
                    return vm.billPolicy[index].value;
                }
            }
        }

        function getImportsBillsByInCoTypes() {
            var params = [{ "key": "inCoIds", "value": ["ShipmentType1", "ShipmentType2", "ShipmentType3"] }];
            msbCommonApiService.interfaceManager(function (importData) {
                if (importData) {
                    vm.inCoImports = importData;
                    console.log(vm.inCoImports);
                }
            }, "inCoService", "getImportsBillsByInCoTypes", params);
        }

        function getExportsBillsByInCoTypes() {
            var params = [{ "key": "inCoIds", "value": ["ShipmentType1", "ShipmentType2", "ShipmentType3"] }];
            msbCommonApiService.interfaceManager(function (exportData) {
                if (exportData) {
                    vm.inCoExports = exportData;
                    console.log(vm.inCoExports);
                }
            }, "inCoService", "getExportsBillsByInCoTypes", params);
        }
    }
})();
