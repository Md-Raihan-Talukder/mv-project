(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller("AddBarCodeDialogController", AddBarCodeDialogController);

    function AddBarCodeDialogController(msbUtilService, msbCommonApiService, BLANK_IMAGE, PRIMARY_COLUMN_NAME, $mdDialog,
        Barcode, GetMaterialAttributes, GetUnitContainers, GetContainerTitle, GetUnitPackagingAttributes, GetContainers,
        GetContainerPackagingAttributes, GetCautionMark, GetPackageMarkAttributes) {
        var vm = this;
        vm.primaryColumnName = PRIMARY_COLUMN_NAME;
        vm.imgHolder = BLANK_IMAGE;
        vm.barcode = angular.copy(Barcode);
        vm.getMaterialAttributes = GetMaterialAttributes;
        vm.getUnitContainers = GetUnitContainers;
        vm.getContainerTitle = GetContainerTitle;
        vm.getUnitPackagingAttributes = GetUnitPackagingAttributes;
        vm.getContainers = GetContainers;
        vm.getContainerPackagingAttributes = GetContainerPackagingAttributes;
        vm.getCautionMark = GetCautionMark;
        vm.getPackageMarkAttributes = GetPackageMarkAttributes;
        vm.closeDialog = closeDialog;
        vm.changeAttribute = changeAttribute;
        vm.isExist = isExist;
        vm.ok = ok;
        vm.addCautionMarkAttr = addCautionMarkAttr;
        vm.isExistCautionAtt = isExistCautionAtt;
        vm.setQrCode = setQrCode;
        vm.setBarcode = setBarcode;


        init();

        function init() {
            if (Object.keys(vm.barcode).length < 1) {
                vm.barcode.isBarCode = 1;
            }
            // vm.cautionMarkAttributes = vm.getCautionMarkAttributes();
        }

        function addCautionMarkAttr(cautionMark) {
            if (!vm.barcode.attributes) {
                vm.barcode.attributes = [];
            }
            var index = msbUtilService.getIndex(vm.barcode.attributes, "cautionMarkId", cautionMark[PRIMARY_COLUMN_NAME]);
            if (index > -1) {
                vm.barcode.attributes.splice(index, 1);
            } else {
                var attIndex = msbUtilService.getIndex(vm.cautionMarkAttributes, "cautionMarkId", cautionMark[PRIMARY_COLUMN_NAME]);
                if (attIndex > -1) {
                    vm.barcode.attributes.push(vm.cautionMarkAttributes[attIndex]);
                }
            }
        }

        function isExistCautionAtt(cautionMark) {
            var index = msbUtilService.getIndex(vm.barcode.attributes, "cautionMarkId", cautionMark[PRIMARY_COLUMN_NAME]);
            if (index > -1) {
                return true;
            } else {
                return false;
            }
        }

        function changeAttribute(attribute) {
            if (vm.barcode) {
                if (!vm.barcode.attributes) {
                    vm.barcode.attributes = [];
                }
                var index = msbUtilService.getIndex(vm.barcode.attributes, PRIMARY_COLUMN_NAME, attribute[PRIMARY_COLUMN_NAME]);
                if (index > -1) {
                    vm.barcode.attributes.splice(index, 1);
                } else {
                    vm.barcode.attributes.push(attribute);
                }
            }
        }

        function isExist(attribute) {
            if (vm.barcode && vm.barcode.attributes) {
                var index = msbUtilService.getIndex(vm.barcode.attributes, PRIMARY_COLUMN_NAME, attribute[PRIMARY_COLUMN_NAME]);
                if (index > -1) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        function setQrCode() {
            if (vm.barcode.isQrCode == 1) {
                vm.barcode.isQrCode = 0;
                vm.barcode.isBarCode = 1;
            } else if (vm.barcode.isQrCode == 0 || vm.barcode.isQrCode == undefined) {
                vm.barcode.isQrCode = 1;
                vm.barcode.isBarCode = 0;
            }
        }

        function setBarcode() {
            if (vm.barcode.isBarCode == 1) {
                vm.barcode.isBarCode = 0;
                vm.barcode.isQrCode = 1;
            } else if (vm.barcode.isBarCode == 0 || vm.barcode.isBarCode == undefined) {
                vm.barcode.isBarCode = 1;
                vm.barcode.isQrCode = 0;
            }
        }

        function closeDialog() {
            $mdDialog.hide();
        }

        function ok() {
            $mdDialog.hide(vm.barcode);
        }
    }
})();
