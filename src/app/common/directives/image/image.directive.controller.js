(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('msbImageLoaderDirectiveController', msbImageLoaderDirectiveController);

    /** @ngInject */

    function msbImageLoaderDirectiveController($scope, msbUtilService, $mdDialog, $document) {
        var vm = this;
        vm.getSize = getSize;
        vm.expandImage = expandImage;
        vm.removeImage = removeImage;

        $scope.imageUpload = imageUpload;
        $scope.imageIsLoaded = imageIsLoaded;

        init();

        function init() {
            if ($scope.selectionType === 'single') {
                if (!$scope.imageObject) {
                    $scope.imageObject = [];
                }
            } else {
                if (!$scope.itemList || !$.isArray($scope.itemList)) {
                    $scope.itemList = [];
                }
            }

        }

        function getSize(item, side) {
            if (side === 'w') {
                return $scope.imageWidth ? $scope.imageWidth : 150;
            }

            return $scope.imageHeight ? $scope.imageHeight : 200;

        }


        function imageUpload(element) {

            var size = element.files[0].size / 1024 / 1024;
            var maxSize = $scope.maxSize ? $scope.maxSize * 1 : 1;

            if (size > maxSize) {
                msbUtilService.showToast(
                    'File is too big. Please upload file size below ' + maxSize + ' MB',
                    'warning-toast',
                    7000
                );
                return;
            }

            var reader = new FileReader();
            reader.onload = $scope.imageIsLoaded;
            vm.file = element.files[0].name;
            reader.readAsDataURL(element.files[0]);

        }

        function imageIsLoaded(e) {
            $scope.$apply(function () {
                var info = { file: vm.file, data: e.target.result };
                console.log(info.data)
                if ($scope.selectionType === 'single') {
                    $scope.imageObject = info;
                } else {
                    $scope.itemList.push(info);
                }

                if ($scope.onUpload) {
                    $scope.onUpload({ info: info });
                }

            });
        }


        function expandImage(item) {
            var image = {
                src: item.data,
                alt: item.file,
                info: {
                    title: item.file
                }
            };

            $mdDialog.show({
                controller: "MaxImageDialogController",
                controllerAs: 'vm',
                templateUrl: 'app/common/dialogs/maximize-image/maximize-image-dialog.html',
                parent: angular.element($document.body),
                clickOutsideToClose: true,
                locals: {
                    image: image
                }
            });
        }

        function removeImage(item) {
            if ($scope.selectionType === 'single') {
                $scope.imageObject = {};
            } else {
                var index = getFileIndex(item.file);
                if (index >= 0) {
                    $scope.itemList.splice(index, 1);
                    if ($scope.onRemove) {
                        $scope.onRemove({ info: item });
                    }
                }
            }
        }

        function getFileIndex(name) {
            for (var i = 0; i < $scope.itemList.length; i++) {
                if ($scope.itemList[i].file === name) {
                    return i;
                }
            }

            return -1;
        }

    }

})();
