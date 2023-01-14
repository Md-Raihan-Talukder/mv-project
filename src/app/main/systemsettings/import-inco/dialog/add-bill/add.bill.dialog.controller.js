(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('AddStakeholderBillDialogController', AddStakeholderBillDialogController);

    function AddStakeholderBillDialogController($mdDialog, msbCommonApiService,
        IsNew, Stakeholder, Steps, Bill, Code, Policy, msbUtilService, PRIMARY_COLUMN_NAME) {

        var vm = this;
        vm.title = "Add Bill";
        vm.isNew = IsNew;
        vm.code = Code;
        vm.closeDialog = closeDialog;
        vm.addBillDetail = addBillDetail;
        vm.getStepTitle = getStepTitle;
        vm.checkStepExist = checkStepExist;
        vm.selectStep = selectStep;
        // vm.checkBillStepExist = checkBillStepExist;

        init();

        function init() {

            getInCoStepsDefinition();
            if (Policy) {
                vm.billPolicy = angular.copy(Policy);
            }
            if (Stakeholder) {
                vm.stakeholder = angular.copy(Stakeholder);
            }
            if (Steps) {
                vm.steps = angular.copy(Steps);
                getShipmentSteps(vm.steps);
            }
            if (Bill) {
                vm.bill = angular.copy(Bill);
            } else {
                createBill();
            }
        }

        function createBill() {
            vm.bill = {
                "TECHDISER_ID": msbUtilService.generateId(),
                "title": "",
                "stepIds": [],
                "policy": null,
                "TD_IS_DELETED": 0
            }
        }

        function checkStepExist(stepId) {
            if (stepId && vm.bill.stepIds && vm.bill.stepIds.length > 0) {
                var index = vm.bill.stepIds.indexOf(stepId);
                if (index > -1) {
                    return true;
                }
            }
        }

        function selectStep(stepId) {
            if (stepId && vm.bill && vm.bill.stepIds) {
                var i = vm.bill.stepIds.indexOf(stepId);
                if (i > -1) {
                    vm.bill.stepIds.splice(i, 1);
                } else {
                    vm.bill.stepIds.unshift(stepId);
                }
            }
        }

        function getInCoStepsDefinition() {
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    vm.stepDefs = data;
                }

            }, "inCoService", "getInCoStepsDefinition", []);
        }

        function getShipmentSteps(steps) {
            if (steps && steps.length > 0) {
                vm.shipmentTypeSteps = [];
                if (vm.code === 'importer') {

                    var params = [{
                        "key": "stakeholderId",
                        "value": vm.stakeholder.stakeholderId
                    },
                    {
                        "key": "isSelected",
                        "value": true
                    },
                    {
                        "key": "isImportPayment",
                        "value": true
                    }
                    ];

                } else if (vm.code === 'exporter') {

                    var params = [{
                        "key": "stakeholderId",
                        "value": vm.stakeholder.stakeholderId
                    },
                    {
                        "key": "isSelected",
                        "value": true
                    },
                    {
                        "key": "isExportPayment",
                        "value": true
                    }
                    ];

                }
                var stepItems = msbUtilService.getItemsByProperties(steps, params);
                if (stepItems && stepItems.length > 0) {
                    vm.shipmentTypeSteps = stepItems;
                }
            }
        }

        function addBillDetail() {
            if (vm.bill && vm.bill.stepIds && vm.bill.stepIds.length > 0) {
                $mdDialog.hide(vm.bill);
            } else {
                msbUtilService.showToast('Step not exists', 'error-toast');
            }
        }

        function getStepTitle(stepId) {
            if (stepId && vm.stepDefs && vm.stepDefs.length > 0) {
                var index = msbUtilService.getIndex(vm.stepDefs, PRIMARY_COLUMN_NAME, stepId);
                if (index > -1) {
                    return vm.stepDefs[index].title;
                }
            }
        }

        // function checkBillStepExist(billId, stepId) {
        //   if (billId && stepId && vm.stakeholder && vm.stakeholder.bills && vm.stakeholder.bills.length > 0) {
        //     var hasStep = false;
        //     for (var i = 0; i < vm.stakeholder.bills.length; i++) {
        //       if (billId == vm.stakeholder.bills[i].TECHDISER_ID) {
        //         continue;
        //       }
        //       if (vm.stakeholder.bills[i].stepIds && vm.stakeholder.bills[i].stepIds.length > 0) {
        //         var stepIdx = vm.stakeholder.bills[i].stepIds.indexOf(stepId);
        //         if (stepIdx > -1) {
        //           return hasStep = true;
        //         }
        //       }
        //     }
        //     return hasStep;
        //   }
        // }


        function closeDialog() {
            $mdDialog.hide();
        }
    }

})();
