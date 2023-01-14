(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('SelectTestMethodDialogController', SelectTestMethodDialogController);

    /** @ngInject */
    function SelectTestMethodDialogController($mdDialog, msbUtilService, msbCommonApiService,
        PRIMARY_COLUMN_NAME, testSetupService, Tests) {

        var vm = this;
        vm.saveTests = saveTests;
        vm.checkTestExist = checkTestExist;
        vm.selectTest = selectTest;
        vm.filterBySelectedTests = filterBySelectedTests;
        vm.closeDialog = closeDialog;

        init();

        function init() {
            getAllTestDefinition();
            if (!Tests) {
                console.log(!Tests);
                vm.selectedTests = [];
            }
            else {
                vm.selectedTests = angular.copy(Tests);
            }
        }

        function getAllTestDefinition() {
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    vm.testList = data;
                    console.log(vm.testList);
                }

            }, "testSetupService", "getAllTestDefinition", null);
        }


        function selectTest(testId) {
            if (testId) {
                var i = vm.selectedTests.indexOf(testId);
                if (i > -1) {
                    vm.selectedTests.splice(i, 1);
                }
                else {
                    vm.selectedTests.push(testId);
                }
            }
        }

        function checkTestExist(testId) {
            if (testId) {
                if (!vm.selectedTests) {
                    return;
                }
                var testPos = vm.selectedTests.indexOf(testId);
                return testPos > -1;
            }

        }

        function filterBySelectedTests(e) {
            if (vm.selectedTests && e) {
                return vm.selectedTests.indexOf(e.TECHDISER_ID) !== -1;
            }
        }


        function saveTests() {
            if (vm.selectedTests) {
                $mdDialog.hide(vm.selectedTests);
            }
        }

        function closeDialog() {
            $mdDialog.hide();
        }


    }

})();
