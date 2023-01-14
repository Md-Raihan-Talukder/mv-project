(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('DocumentsController', DocumentsController);


    /** @ngInject */
    function DocumentsController(msbCommonApiService, msbUtilService, $state, $mdDialog,
        PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME) {

        var vm = this;
        vm.addTypeDocument = addTypeDocument;
        vm.getIncoTypeDefinition = getIncoTypeDefinition;
        vm.selectDocument = selectDocument;


        init();

        function init() {
            getIncoTypeDefinition();
        }

        function addTypeDocument(typeDocument, isNew) {
            if (vm.inCoDocumentDefs) {
                $mdDialog
                    .show({
                        controller: "DocumentSetupDialogController",
                        controllerAs: "vm",
                        clickOutsideToClose: false,
                        preserveScope: true,
                        templateUrl: "app/main/systemsettings/documents/dialog/add-document/add-shipment-type-document-dialog.html",
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

        function savaIncoTypeDef(callBack, param) {
            if (param) {
                msbCommonApiService.interfaceManager(function (data) {
                    if (data) {
                        callBack(data);
                    }
                }, "inCoService", "saveImportIncoType", param);

            }
        }

        function getIncoTypeDefinition() {
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    vm.inCoTypes = data[0];
                    vm.inCoTypeDefs = vm.inCoTypes.typeDefinition;
                    vm.inCoStepDefs = vm.inCoTypes.stepDefinition;
                    vm.inCoDocumentDefs = vm.inCoTypes.documentDefinition;
                    vm.stakeholderDefs = vm.inCoTypes.stakeholderDefinition;
                    // getBillPolicy();
                    // selectInCoType(vm.inCoTypeDefs[0]);
                    // selectStakeholder(vm.stakeholderDefs[0]);
                    // checkTypeSteps();
                    // checkImportExportStakeholders();
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

        function selectDocument(item) {
            if (item) {
                vm.selectedDocument = angular.copy(item);
            }
        }


    }
})();
