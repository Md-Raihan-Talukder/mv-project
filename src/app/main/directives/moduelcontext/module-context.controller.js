(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('moduleContextDirectiveController', moduleContextDirectiveController);

    /** @ngInject */
    function moduleContextDirectiveController($rootScope, mainMenuService, $state, $document, $mdDialog) {
        var vm = this;

        vm.openModulesDialog = openModulesDialog;
        vm.exitPoContext = exitPoContext;

        function exitPoContext() {
            $rootScope.poContext = null;
            mainMenuService.removeCurrentMenu($rootScope.mainMenus);
            $rootScope.mainMenus = angular.copy($rootScope.selectedModule.mainMenus);
            mainMenuService.addMainMenu($rootScope.mainMenus);
            gotoHome();
        }

        function gotoHome() {
            $state.go($rootScope.selectedModule.homeState, $rootScope.selectedModule.homeStateParams);
        }

        function openModulesDialog(ev) {
            $mdDialog.show({
                controller: 'ModulesDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/main/directives/moduelcontext/modules.dialog.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {

                }
            });
        }

    }
})();