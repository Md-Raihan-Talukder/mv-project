(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('ImageLoaderDirectiveController', ImageLoaderDirectiveController);

    /** @ngInject */

    function ImageLoaderDirectiveController($scope, utilService, msbUtilService) {
        var vm = this;
        initList();
        vm.getSize = function (item) {
            if (!item.size) {
                item.size = "250";
            }

            return item.size;
        }

        vm.increaseSize = function (item) {
            item.size = item.size * 1 + 50;
            return item.size;
        }

        vm.decreaseSize = function (item) {
            item.size = item.size * 1 - 50;
            return item.size;
        }

        $scope.imageUpload = function (element) {
            var size = element.files[0].size / 1024 / 1024;
            var maxSize = 1;
            if ($scope.maxSize) {
                maxSize = $scope.maxSize * 1;
            }

            if (size > maxSize) {
                utilService.showToast(
                    'File is too big. Please upload file size below 1 MB',
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

        $scope.imageIsLoaded = function (e) {
            $scope.$apply(function () {
                if ($scope.selectionType === 'single') {
                    var info = { file: vm.file, data: e.target.result };
                    $scope.imageObject = info;
                } else {
                    $scope.itemList.push({ file: vm.file, data: e.target.result });
                }

                if ($scope.onUpload) {
                    $scope.onUpload({ info: info });
                }

            });
        }

        vm.removeImage = function (item) {
            var index = getFileIndex(item.file);
            if (index >= 0) {
                $scope.itemList.splice(index, 1);
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

        function initList() {
            if (!$scope.itemList || !$.isArray($scope.itemList)) {
                $scope.itemList = [];
            }
        }

    }

})();
