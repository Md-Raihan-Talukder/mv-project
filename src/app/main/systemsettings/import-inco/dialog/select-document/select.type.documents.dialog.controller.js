(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('SelectTypeDocumentDialogController', SelectTypeDocumentDialogController);

    function SelectTypeDocumentDialogController(commonApiService, DocumentDef, Documents, $mdDialog, utilService, PRIMARY_COLUMN_NAME) {

        var vm = this;
        vm.title = "Select Documents";
        vm.closeDialog = closeDialog;
        vm.selectDocument = selectDocument;
        vm.checkDocumentExist = checkDocumentExist;
        vm.saveDocuments = saveDocuments;
        vm.filterBySelectedDocuments = filterBySelectedDocuments;

        init();
        function init() {
            if (DocumentDef) {
                vm.documents = angular.copy(DocumentDef);
            }
            if (!Documents) {
                console.log(!Documents);
                vm.selectedDocument = [];
            }
            else {
                vm.selectedDocument = angular.copy(Documents);
            }

        }

        function selectDocument(documentId) {
            if (documentId) {
                var i = vm.selectedDocument.indexOf(documentId);
                if (i > -1) {
                    vm.selectedDocument.splice(i, 1);
                }
                else {
                    vm.selectedDocument.unshift(documentId);
                }
            }
        }

        function checkDocumentExist(documentId) {
            if (documentId) {
                if (!vm.selectedDocument) {
                    return;
                }
                var documentPos = vm.selectedDocument.indexOf(documentId);
                return documentPos > -1;
            }
        }

        function filterBySelectedDocuments(e) {
            if (vm.selectedDocument && e) {
                return vm.selectedDocument.indexOf(e.TECHDISER_ID) !== -1;
            }
        }


        function saveDocuments() {
            if (vm.selectedDocument) {
                $mdDialog.hide(vm.selectedDocument);
            }
        }

        function closeDialog() {
            $mdDialog.hide();
        }
    }

})();
