(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('msbImageViewerDirectiveController', msbImageViewerDirectiveController);

    /** @ngInject */

    function msbImageViewerDirectiveController($scope, msbUtilService, $mdDialog, $document) {
        var vm = this;

        vm.expandImage = expandImage;
        vm.removeImage = removeImage;

        init();

        function init() {
            if (!$scope.items) {
                $scope.items = [];
            }
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

            var index = getFileIndex(item.file);
            if (index >= 0) {
                $scope.items.splice(index, 1);

                if ($scope.onRemove) {
                    $scope.onRemove({ info: { item: item, helperItems: $scope.helperItems } });
                }
            }

        }

        function getFileIndex(name) {
            for (var i = 0; i < $scope.items.length; i++) {
                if ($scope.items[i].file === name) {
                    return i;
                }
            }

            return -1;
        }



    }

})();
