(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('SelectContainerDialogController', SelectContainerDialogController);

    /** @ngInject */
    function SelectContainerDialogController($mdDialog, msbUtilService, msbCommonApiService,
        PRIMARY_COLUMN_NAME, supplyDefinitionService, Containers) {

        var vm = this;
        vm.saveContainers = saveContainers;
        vm.checkContainerExist = checkContainerExist;
        vm.selectContainer = selectContainer;
        vm.filterBySelectedContainers = filterBySelectedContainers;
        vm.closeDialog = closeDialog;

        init();

        function init() {

            getPackagingContainers();

            if (!Containers) {
                console.log(!Containers);
                vm.selectedContainers = [];
            }
            else {
                vm.selectedContainers = angular.copy(Containers);
            }
        }

        function getPackagingContainers() {
            msbCommonApiService.interfaceManager(function (containerData) {
                if (containerData) {
                    vm.containers = containerData;
                }

            }, "supplyDefinitionService", "getPackagingContainers", null);
        }


        function selectContainer(containerId) {
            if (containerId) {
                var i = vm.selectedContainers.indexOf(containerId);
                if (i > -1) {
                    vm.selectedContainers.splice(i, 1);
                }
                else {
                    vm.selectedContainers.push(containerId);
                }
            }
        }

        function checkContainerExist(containerId) {
            if (containerId) {
                if (!vm.selectedContainers) {
                    return;
                }
                var containerPos = vm.selectedContainers.indexOf(containerId);
                return containerPos > -1;
            }

        }

        function filterBySelectedContainers(e) {
            if (vm.selectedContainers && e) {
                return vm.selectedContainers.indexOf(e.TECHDISER_ID) !== -1;
            }
        }


        function saveContainers() {
            if (vm.selectedContainers) {
                $mdDialog.hide(vm.selectedContainers);
            }
        }

        function closeDialog() {
            $mdDialog.hide();
        }


    }

})();
