(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('msbImageSelectorDirectiveController', msbImageSelectorDirectiveController);

    /** @ngInject */

    function msbImageSelectorDirectiveController($scope, msbUtilService, $mdDialog, $document) {
        var vm = this;
        $scope.imageUpload = imageUpload;
        $scope.imageIsLoaded = imageIsLoaded;

        init();

        function init() {

            if (!$scope.labelText) {
                $scope.labelText = "Select Image"
            }
        }

        function imageUpload(element) {

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

                if ($scope.onUpload) {
                    $scope.onUpload({ info: info });
                }

            });
        }



    }

})();
