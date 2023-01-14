(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('DirectiveDialogController', DirectiveDialogController);

    /** @ngInject */
    function DirectiveDialogController(msbUtilService, msbCommonApiService, $mdDialog, title, info, widthDef, heightDef) {
        var vm = this;
        vm.title = title;
        vm.info = info.doNotCopy ? info : angular.copy(info);
        vm.checkValidity = vm.info.checkValidity;
        vm.okTitle = vm.info.okTitle ? vm.info.okTitle : "OK";
        vm.closeDialog = closeDialog;
        vm.onOk = OK;
        vm.onUpdate = onUpdate;

        init()

        function init() {


            vm.info.data.onUpdate = vm.onUpdate;

            if (widthDef) {
                vm.widthType = widthDef.type;
                vm.width = widthDef.width;
            }

            if (heightDef) {
                vm.height = heightDef.height;
                vm.heightType = heightDef.type;
            } else {
                vm.height = "600";
                vm.heightType = "px";
            }

            vm.ready = true;
        }

        function onUpdate(info, isValid, errorMessage) {
            vm.directiveInfo = angular.copy(info);
            vm.isValid = isValid;
            vm.errorMessage = errorMessage;
        }

        function OK() {

            if (vm.checkValidity) {
                if (vm.isValid) {
                    $mdDialog.hide(vm.directiveInfo);
                    return;
                }
                var err = vm.errorMessage ? vm.errorMessage : "Invalid Data";
                msbUtilService.showToast(err, 'error-toast', 7000);
                return;
            }

            $mdDialog.hide(vm.directiveInfo);
        }

        function closeDialog() {
            $mdDialog.hide();
        }

    }

})();