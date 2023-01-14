(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('AddShipmentTypeDocumentDialogController', AddShipmentTypeDocumentDialogController);

    function AddShipmentTypeDocumentDialogController(commonApiService, $mdDialog, ShipmentDocumentDef, TypeDocument, IsNew, utilService, PRIMARY_COLUMN_NAME) {

        var vm = this;
        vm.title = "Add Document";
        vm.isNew = IsNew;
        vm.shipmentDocumentColumns = [
            {
                "TECHDISER_ID": "shipmentDocumentColumn1",
                "title": "Title",
                "data": "title",
                "type": "text",
                "flex": "100"
            },
            {
                "TECHDISER_ID": "shipmentDocumentColumn2",
                "title": "Purpose",
                "data": "purpose",
                "type": "text",
                "flex": "100"
            }
        ];
        vm.closeDialog = closeDialog;
        vm.addShipmentTypeDocumentDetail = addShipmentTypeDocumentDetail;

        init();
        function init() {

            if (TypeDocument) {
                vm.typeDocument = angular.copy(TypeDocument);
            }
            if (ShipmentDocumentDef) {
                vm.shipmentDocuments = angular.copy(ShipmentDocumentDef);
            }

        }

        function addShipmentTypeDocumentDetail(typeDocument) {
            if (vm.isNew) {
                if (typeDocument && vm.shipmentDocuments) {
                    for (var index = 0; index < vm.shipmentDocuments.length; index++) {
                        if (vm.shipmentDocuments[index].title == typeDocument.title) {
                            utilService.showToast(
                                'The Document is already exists.',
                                'error-toast',
                                3000
                            );
                            vm.found = true;
                        }
                    }
                    if (!vm.found) {
                        var largeNum = 0;
                        if (vm.shipmentDocuments) {
                            for (var j = 0; j < vm.shipmentDocuments.length; j++) {
                                if (vm.shipmentDocuments[j].TECHDISER_SERIAL_NO > largeNum) {
                                    largeNum = vm.shipmentDocuments[j].TECHDISER_SERIAL_NO;
                                }
                            }
                        }
                        var typeDocumentObj = {
                            "TECHDISER_ID": utilService.generateId(),
                            "TECHDISER_SERIAL_NO": largeNum + 1,
                            "title": typeDocument.title,
                            "purpose": typeDocument.purpose,
                            "templetes": []
                        }
                        $mdDialog.hide(typeDocumentObj);
                    }
                    vm.found = false;
                }
            }
            else {
                if (typeDocument && vm.shipmentDocuments) {
                    for (var index = 0; index < vm.shipmentDocuments.length; index++) {
                        if (vm.shipmentDocuments[index].title == typeDocument.title) {
                            utilService.showToast(
                                'The Document is already exists.',
                                'error-toast',
                                3000
                            );
                            vm.found = true;
                            break;
                        }
                    }
                    if (!vm.found) {
                        $mdDialog.hide(typeDocument);
                    }
                    vm.found = false;
                }
            }
        }

        function closeDialog() {
            $mdDialog.hide();
        }
    }

})();
