(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('msbImageViewerTableDirectiveController', msbImageViewerTableDirectiveController);

    /** @ngInject */

    function msbImageViewerTableDirectiveController($scope, emptyImageService, msbUtilService, $mdDialog, $document) {
        var vm = this;

        vm.expandImage = expandImage;
        vm.removeImage = removeImage;
        $scope.imageUpload = imageUpload;
        $scope.imageIsLoaded = imageIsLoaded;

        init();

        function init() {

            vm.emptyImage = emptyImageService.getImage("default");

            if ($scope.item && angular.isArray($scope.item)) {
                vm.imageItem = $scope.item[0];
            } else {
                vm.imageItem = $scope.item;
            }
        }

        function imageUpload(element) {
            if ($scope.itemMode !== 'create') {
                return;
            }

            if ($scope.maxSize) {
                var size = element.files[0].size / 1024 / 1024;
                var maxSize = $scope.maxSize * 1;

                if (size > maxSize) {
                    msbUtilService.showToast(
                        'File is too big. Please upload file size below ' + maxSize + ' MB',
                        'warning-toast',
                        7000
                    );
                    return;
                }
            }

            var reader = new FileReader();
            reader.onload = $scope.imageIsLoaded;
            vm.file = element.files[0].name;
            reader.readAsDataURL(element.files[0]);

        }

        function imageIsLoaded(e) {
            $scope.$apply(function () {
                var info = { file: vm.file, data: e.target.result, helperItems: $scope.helperItems };
                vm.imageItem = info;

                if (angular.isArray($scope.item)) {
                    $scope.item.unshift({ file: vm.file, data: e.target.result });
                } else {
                    $scope.item = { file: vm.file, data: e.target.result };
                }

                //  msbUtilService.downLoadJson(vm.imageItem, "image");

                if ($scope.onUpload) {
                    $scope.onUpload({ info: { item: angular.copy(vm.imageItem), helperItems: $scope.helperItems } });
                }

            });
        }

        function expandImage() {
            if (!vm.imageItem) {
                return;
            }

            var image = {
                src: vm.imageItem.data,
                alt: vm.imageItem.file,
                info: {
                    title: vm.imageItem.file
                }
            };

            $mdDialog.show({
                controller: "MaxImageDialogController",
                controllerAs: 'vm',
                templateUrl: 'app/common/dialogs/maximize-image/maximize-image-dialog.html',
                parent: angular.element($document.body),
                clickOutsideToClose: true,
                preserveScope: true,
                multiple: true,
                skipHide: true,
                locals: {
                    image: image
                }
            });
        }

        function removeImage() {
            if ($scope.itemMode !== 'create') {
                return;
            }

            if (!vm.imageItem) {
                return;
            }

            if (angular.isArray($scope.item)) {
                var index = msbUtilService.getIndex($scope.item, "file", vm.imageItem.file);
                if (index >= 0) {
                    $scope.item.splice(index, 1);
                    if ($scope.onRemove) {
                        $scope.onRemove({ info: { item: angular.copy(vm.imageItem), helperItems: $scope.helperItems } });
                    }

                    if ($scope.item.length) {
                        vm.imageItem = $scope.item[0];
                    } else {
                        vm.imageItem = null;
                    }
                }
            } else {
                $scope.onRemove({ info: { item: angular.copy(vm.imageItem), helperItems: $scope.helperItems } });
                vm.imageItem = null;
            }



        }


    }

})();
