(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('MaxImageDialogController', MaxImageDialogController);

    /** @ngInject */
    function MaxImageDialogController($scope, $rootScope, image, $mdDialog) {
        var vm = this;
        vm.image = image;
        vm.closeDialog = closeDialog;
        vm.getWidth = getWidth;

        function getWidth() {
            var height = angular.element("#maxdialog-image").outerWidth();
            return height < 300 ? 300 : height;
        }

        function closeDialog() {
            $mdDialog.hide();
        }

    }

})();