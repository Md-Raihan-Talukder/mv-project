(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('PdfViewerDialogController', PdfViewerDialogController);

    /** @ngInject */
    function PdfViewerDialogController($mdDialog, commonApiService, pdfService, utilService,
        ModelItem, Template, DataSet, TestData) {
        var vm = this;
        vm.closeDialog = closeDialog;

        init();

        function init() {
            if (TestData) {
                vm.modelItem = TestData.modelItem;
                vm.template = TestData.template;
                viewReport();
                return;
            }

            vm.modelItem = ModelItem;
            vm.template = Template;
            viewReport();
        }


        function viewReport() {
            if (!vm.template) {
                utilService.showToast(
                    'Print template not defined.',
                    'error-toast',
                    5000
                );
                return;
            }

            initTemplate();
            initFonts();
            generate();
        }

        function initFonts() {
            pdfMake.fonts = {
                Siyamrupali: {
                    normal: 'Siyamrupali.ttf',
                    bold: 'Siyamrupali.ttf',
                    italics: 'Siyamrupali.ttf',
                    bolditalics: 'Siyamrupali.ttf'
                },
                SolaimanLipi: {
                    normal: 'SolaimanLipi_20-04-07.ttf',
                    bold: 'SolaimanLipi_20-04-07.ttf',
                    italics: 'SolaimanLipi_20-04-07.ttf',
                    bolditalics: 'SolaimanLipi_20-04-07.ttf'
                },
                Roboto: {
                    normal: 'Roboto-Regular.ttf',
                    bold: 'Roboto-Medium.ttf',
                    italics: 'Roboto-Italic.ttf',
                    bolditalics: 'Roboto-Italic.ttf'
                }
            };
        }

        function initTemplate() {

            if (!vm.template.pageSetup) {
                vm.template.pageSetup = {
                    "pageSize": "A4",
                    "pageOrientation": "portrait",
                    "pageMargins": [0, 0, 0, 0]
                }
            } else {
                if (!vm.template.pageSetup.pageSize) {
                    vm.template.pageSetup.pageSize = 'A4';
                }
                if (!vm.template.pageSetup.pageOrientation) {
                    vm.template.pageSetup.pageOrientation = 'portrait';
                }
                if (!vm.template.pageSetup.pageMargins) {
                    vm.template.pageSetup.pageMargins = [0, 0, 0, 0];
                }
            }
            if (!vm.template.rows) {
                vm.template.rows = [];
            }
        }


        function generate() {
            var docDefinition = pdfService.createDefinition(vm.template, vm.modelItem, DataSet);
            //utilService.downLoadJson(docDefinition, "docDefinition"); 
            //return;

            docDefinition.defaultStyle = {
                font: 'Siyamrupali'
            };

            pdfMake.createPdf(docDefinition).getDataUrl(function (outDoc) {
                document.getElementById('reportV').src = outDoc;
            });

            // pdfMake.createPdf(docDefinition).print(5000);
            //pdfMake.createPdf(docDefinition).download('sample.pdf');

        }

        function closeMenu() {
            $mdMenu.hide();
        }

        function closeDialog() {
            $mdDialog.hide();
        }

    }
})();