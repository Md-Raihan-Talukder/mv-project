(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('SelectPiHeadsDialogController', SelectPiHeadsDialogController);

    function SelectPiHeadsDialogController(msbCommonApiService, costingHeadsService,
        PiHead, $mdDialog, msbUtilService, PRIMARY_COLUMN_NAME) {

        var vm = this;
        vm.title = "Select PI heads";
        vm.okPiHeads = okPiHeads;
        vm.selectPiHead = selectPiHead;
        vm.getPiHeadTitle = getPiHeadTitle;
        vm.closeDialog = closeDialog;

        init();
        function init() {

            getPIHeads();


        }

        function getPIHeads() {

            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    vm.piHeads = data;
                    if (!PiHead) {
                        vm.selectedHeadId = "";
                        vm.selectedPiHead = null;
                    }
                    else {
                        console.log(PiHead);
                        vm.selectedHeadId = angular.copy(PiHead);
                        var piIndex = msbUtilService.getIndex(vm.piHeads, PRIMARY_COLUMN_NAME, PiHead);
                        if (piIndex > -1) {
                            vm.selectedPiHead = vm.piHeads[piIndex][PRIMARY_COLUMN_NAME];
                        }
                    }
                }
            }, "costingHeadsService", "getAllPIHeads", null);
        }


        function selectPiHead(piHead) {
            if (piHead) {
                if (piHead.TECHDISER_ID == vm.selectedHeadId) {
                    vm.selectedHeadId = null;
                    vm.selectedPiHead = null;
                } else {
                    vm.selectedHeadId = piHead.TECHDISER_ID;
                    vm.selectedPiHead = piHead;
                }
            }
        }

        function getPiHeadTitle(piHeadId) {
            if (piHeadId && vm.piHeads && vm.piHeads.length > 0) {
                var piIndex = msbUtilService.getIndex(vm.piHeads, PRIMARY_COLUMN_NAME, piHeadId);
                if (piIndex > -1) {
                    return vm.piHeads[piIndex].title;
                }
            }
        }


        function okPiHeads() {
            $mdDialog.hide(vm.selectedHeadId);
        }

        function closeDialog() {
            $mdDialog.hide();
        }
    }

})();
