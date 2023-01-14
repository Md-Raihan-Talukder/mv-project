(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('ModulesDialogController', ModulesDialogController);

    /** @ngInject */
    function ModulesDialogController($mdDialog, utilService, $rootScope, mainMenuService, $state, PRIMARY_COLUMN_NAME) {
        var vm = this;
        vm.closeDialog = closeDialog;
        vm.makeDefault = makeDefault;
        vm.openModule = openModule;

        init();

        function init() {
            vm.modules = [];
            getModules();
        }

        function getModules() {
            var user = utilService.getCurrentUser();
            if (user) {
                vm.modules = user.modules;
            }
        }

        function makeDefault(module) {
            for (var i = 0; i < vm.modules.length; i++) {
                vm.modules[i].isDefault = false;
            }

            module.isDefault = true;
        }

        function openModule(module) {
            if ($rootScope.selectedModule[PRIMARY_COLUMN_NAME] === module[PRIMARY_COLUMN_NAME]) {
                closeDialog();
                return;
            }

            $rootScope.selectedModule = module;
            mainMenuService.removeCurrentMenu($rootScope.mainMenus);
            $rootScope.mainMenus = angular.copy(module.mainMenus);
            mainMenuService.addMainMenu(module.mainMenus);
            closeDialog();
            gotoHome(module);
        }

        function gotoHome(module) {
            $state.go(module.homeState, module.homeStateParams);
        }

        function closeDialog() {
            $mdDialog.hide();
        }


    }

})();