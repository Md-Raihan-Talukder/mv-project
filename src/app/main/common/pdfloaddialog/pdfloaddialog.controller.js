(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('PdfLoadDialogController', PdfLoadDialogController);

    /** @ngInject */
    function PdfLoadDialogController($mdDialog, $timeout, pdfDialogService) {
        var vm = this;
        vm.currentPage = 1;
        vm.totalPage = 1;

        vm.closeDialog = closeDialog;
        vm.updatePageNo = updatePageNo;

        vm.loadData = loadData;

        init();

        function loadData() {
            pdfDialogService.loadData();
        }




        function updatePageNo(type) {

            if (!vm.data) {
                return;
            }

            switch (type) {
                case 'incr':
                    if (vm.currentPage < vm.totalPage) {
                        vm.currentPage++;
                    }
                    break;
                case 'decr':
                    if (vm.currentPage > 1) {
                        vm.currentPage--;
                    }
                    break;
                case 'first':
                    vm.currentPage = 1;
                    break;
                case 'last':
                    vm.currentPage = vm.totalPage;
                    break;
                default:
                    break;
            }

            pdfDialogService.renderPDF(vm.data, document.getElementById('pdf-canvas-holder'), vm.currentPage, onPageRender);

        }

        function init() {
            $timeout(function () {
                var pdffile = document.getElementById('pdffile');
                pdffile.addEventListener('change', handleFile, false);
            });
        }

        function handleFile(e) {
            var files = e.target.files;
            var i, f;

            for (i = 0, f = files[i]; i != 1; ++i) {
                var reader = new FileReader();
                var name = f.name;
                reader.onload = function (e) {
                    vm.data = e.target.result;
                    vm.currentPage = 1;
                    vm.totalPage = 1;

                    pdfDialogService.renderPDF(vm.data, document.getElementById('pdf-canvas-holder'), vm.currentPage, onPageRender);

                };

                reader.readAsBinaryString(f);
            }

        }

        function onPageRender(totalPage) {
            vm.totalPage = totalPage;
        }

        function closeDialog() {
            $mdDialog.hide();
        }

    }
})();