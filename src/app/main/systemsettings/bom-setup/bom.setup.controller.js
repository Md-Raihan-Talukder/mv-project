(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller("BomSetupController", BomSetupController);

    function BomSetupController(msbCommonApiService, msbUtilService, PRIMARY_COLUMN_NAME,
        SERIAL_COLUMN_NAME) {
        var vm = this;
        vm.save = save;
        vm.groupTitle = "";
        vm.addGroup = addGroup;

        init();

        function init() {
            getMaterialGroup();

            vm.sortableOptions = {
                handle: '.handle',
                forceFallback: true,
                ghostClass: 'td-item-placeholder',
                fallbackClass: 'td-item-ghost',
                fallbackOnBody: true
            };
        }

        function save() {
            var param = {
                "materialGroups": vm.materialGroups
            }
            msbCommonApiService.interfaceManager(function (data) {

            }, "bomSetupService", "saveMaterialGroup", param);
        }

        function getMaterialGroup() {
            msbCommonApiService.interfaceManager(function (data) {
                vm.materialGroups = data;
            }, "bomSetupService", "getMaterialGroup", null);
        }

        function addGroup() {
            if (vm.groupTitle) {
                msbCommonApiService.getIdFromServer("BOM_SETUP", function (data) {
                    if (data) {
                        var matGroup = {
                            "title": vm.groupTitle
                        }
                        matGroup[PRIMARY_COLUMN_NAME] = data.id;
                        matGroup[SERIAL_COLUMN_NAME] = data.slNo;
                        if (vm.materialGroups && angular.isArray(vm.materialGroups)) {
                            vm.materialGroups.unshift(matGroup);
                        } else {
                            vm.materialGroups = [];
                            vm.materialGroups.unshift(matGroup);
                        }
                        vm.groupTitle = "";
                    }
                }, "clientUrl");

            }
        }
    }
})();
