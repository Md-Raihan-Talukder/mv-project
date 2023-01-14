(function () {
    'use strict';

    angular
        .module('app.pages.auth.login-v2')
        .controller('LoginV2Controller', LoginV2Controller);

    /** @ngInject */
    function LoginV2Controller($rootScope, $state, authService, utilService, mainMenuService) {
        var vm = this;
        vm.login = login;

        init();

        function init(argument) {
            vm.loginInfo = {
                emailOrMobile: '',
                password: ''
            }
        }

        function login() {

            authService.login(vm.loginInfo)
                .success(function (response) {
                    utilService.saveLoginDataLocally(response);
                    selectDefaultModule();
                })
                .error(function (err) {

                });
        }

        function selectDefaultModule() {
            var user = utilService.getCurrentUser();

            if (user) {
                $state.go('app.dashboards_project');
                //  if(user.modules.length){
                //      var selected = $.grep(user.modules, function(mdl){
                //          return mdl.isDefault;
                //      });

                //      if (selected && selected.length) {
                //          $rootScope.selectedModule = selected[0];                    
                //      }else{
                //          $rootScope.selectedModule = user.modules[0];
                //      } 

                //      $rootScope.mainMenus = angular.copy($rootScope.selectedModule.mainMenus);
                //      mainMenuService.addMainMenu($rootScope.selectedModule.mainMenus);
                //      $state.go($rootScope.selectedModule.homeState, $rootScope.selectedModule.homeStateParams);                                    
                // }else{
                //  $state.go('app.pages_nopermission');  
                // }     
            }
        }
    }
})();