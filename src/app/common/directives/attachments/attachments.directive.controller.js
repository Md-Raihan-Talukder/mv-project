(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('msbAttachmentsDirectiveController', msbAttachmentsDirectiveController);

    /** @ngInject */

    function msbAttachmentsDirectiveController($scope, msbUtilService) {
        var vm = this;
        vm.removeFile = removeFile;
        vm.downLoadFile = downLoadFile;

        init();

        function init() {

            if (!$scope.itemList || !$.isArray($scope.itemList)) {
                $scope.itemList = [];
            }
        }

        $scope.fileUpload = function (element) {
            var size = element.files[0].size / 1024 / 1024;
            var maxSize = 5;
            if ($scope.maxSize) {
                maxSize = $scope.maxSize * 1;
            }

            if (size > maxSize) {
                msbUtilService.showToast(
                    'File is too big. Please upload file size below 1 MB',
                    'warning-toast',
                    7000
                );
                return;
            }

            var reader = new FileReader();
            reader.onload = $scope.fileIsLoaded;
            vm.file = element.files[0];
            reader.readAsDataURL(element.files[0]);
        }

        $scope.fileIsLoaded = function (e) {
            $scope.$apply(function () {
                var info = { data: e.target.result };
                info.fileName = vm.file.name;
                info.type = vm.file.type;
                info.modified = moment(vm.file.lastModified).format('hh:mm A, DD MMMM, YYYY');
                info.uploaded = moment(new Date()).format('hh:mm A, DD MMMM, YYYY');
                // Figure out & upddate the size
                if (vm.file.size < 1024) {
                    info.size = parseFloat(vm.file.size).toFixed(2) + ' B';
                }
                else if (vm.file.size >= 1024 && vm.file.size < 1048576) {
                    info.size = parseFloat(vm.file.size / 1024).toFixed(2) + ' Kb';
                }
                else if (vm.file.size >= 1048576 && vm.file.size < 1073741824) {
                    info.size = parseFloat(vm.file.size / (1024 * 1024)).toFixed(2) + ' Mb';
                }
                else {
                    info.size = parseFloat(vm.file.size / (1024 * 1024 * 1024)).toFixed(2) + ' Gb';
                }

                $scope.itemList.push(info);

                if ($scope.onAddItem) {
                    $scope.onAddItem({ item: info });
                }

            });
        }

        function converBase64toBlob(content, contentType) {
            contentType = contentType || '';
            var sliceSize = 512;
            var byteCharacters = window.atob(content); //method which converts base64 to binary
            var byteArrays = [
            ];
            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);
                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                var byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }
            var blob = new Blob(byteArrays, {
                type: contentType
            }); //statement which creates the blob
            return blob;
        }

        function downLoadFile(file) {
            //http://blog.web-worker.in/convert-base64-string-file-javascript/

            var splt = file.data.split('base64,');
            var blob = converBase64toBlob(splt[1], splt[0]);
            saveAs(blob, file.fileName);

        }
        function removeFile(file) {
            var index = msbUtilService.getIndex($scope.itemList, "fileName", file.fileName);
            if (index > -1) {
                $scope.itemList.splice(index, 1);
                $scope.onRemoveItem({ item: file });
            }
        }


    }

})();
