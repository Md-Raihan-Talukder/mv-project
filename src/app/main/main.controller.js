(function () {
    'use strict';

    angular
        .module('tech-diser')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($scope, $rootScope, msbCommonApiService, commonApiService, utilService, mainMenuService, $timeout, $state) {
        var vm = this;

        init();

        // Remove the splash screen
        $scope.$on('$viewContentAnimationEnded', function (event) {
            if (event.targetScope.$id === $scope.$id) {
                $rootScope.$broadcast('msSplashScreen::remove');
            }

            $timeout(function () {
                $rootScope.mailMenuBadgeElement = angular.element('.mail-count').find('.badge');
                $rootScope.mailMenuBadgeElement.text('50');
            });
        });

        function init() {
            /*
            this methods is only for development
            in production it may be removed
            */
            //    getAllItems();
            //selectDefaultModule();                       
        }

        function getAllItems() {
            vm.serviceKeys = [
                "DATA_ENTRY_FORM",
                "SELECT_DEF",
                "DATA_GRID_DEF",
                "PURCHASE_ORDER",
                "STYLE_MANAGEMENT"
            ];
            //getItems(0);

        }

        function getItems(index) {
            var temp = {};
            commonApiService.getItems(temp, vm.serviceKeys[index], "items", false, function () {
                if (index === vm.serviceKeys.length - 1) {
                    getItemsFromMSB(0);
                    console.log("loaded: " + vm.serviceKeys.length + " items;");
                } else {
                    index += 1;
                    getItems(index);
                }
            });
        }

        function getItemsFromMSB(index) {
            var temp = {};
            msbCommonApiService.getItems(vm.serviceKeys[index], null, function () {
                if (index === vm.serviceKeys.length - 1) {
                    console.log("loaded: " + vm.serviceKeys.length + " items;");
                    $state.go('app.dashboards_project');
                } else {
                    index += 1;
                    getItemsFromMSB(index);
                }
            });
        }

        function selectDefaultModule() {
            var user = utilService.getCurrentUser();
            if (user && user.modules) {
                if (user.modules.length) {
                    var selected = $.grep(user.modules, function (mdl) {
                        return mdl.isDefault;
                    });

                    if (selected && selected.length) {
                        $rootScope.selectedModule = selected[0];
                    } else {
                        $rootScope.selectedModule = user.modules[0];
                    }

                    $rootScope.mainMenus = angular.copy($rootScope.selectedModule.mainMenus);
                    mainMenuService.addMainMenu($rootScope.selectedModule.mainMenus);
                    $state.go($rootScope.selectedModule.homeState, $rootScope.selectedModule.homeStateParams);
                } else {
                    $state.go('app.pages_nopermission');
                }
            } else {
                $state.go('app.pages_auth_login-v2');
            }

        }


    }
})();
