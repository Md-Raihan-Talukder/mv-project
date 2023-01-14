(function () {
    'use strict';

    angular
        .module('tech-diser')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $timeout, $state, utilService, referenceGroups, editableThemes, commonApiService) {
        utilService.addPrototypeMethods();

        editableThemes.default.submitTpl = '<md-button class="md-icon-button" type="submit" aria-label="save"><md-icon md-font-icon="icon-checkbox-marked-circle" class="md-accent-fg md-hue-1"></md-icon></md-button>';
        editableThemes.default.cancelTpl = '<md-button class="md-icon-button" ng-click="$form.$cancel()" aria-label="cancel"><md-icon md-font-icon="icon-close-circle" class="icon-cancel"></md-icon></md-button>';

        var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            // if(!isValidState(toState.name)){
            //     event.preventDefault();
            //     return;
            // }

            if ($rootScope.unSaveState) {
                event.preventDefault();
                commonApiService.confirmAndDelete('You have unsaved data. Data will be lost.', function (argument) {
                    $rootScope.unSaveState = false;
                    $state.go(toState.name, toParams);
                });
            } else {
                changeState(event, toState, toParams, fromState, fromParams);
            }
        });

        function isValidState(state) {
            if (!$rootScope.selectedModule) {
                return true;
            }

            if (state === "app.pages_auth_login-v2") {
                return true;
            }

            if ($rootScope.selectedModule.homeState === state) {
                return true;
            }

            var states = $.grep($rootScope.mainMenus, function (menu) {
                return menu.state && menu.state === state;
            });

            return states && states.length > 0;
        }

        function changeState(event, toState, toParams, fromState, fromParams) {
            var loginRequired = true;

            switch (toState.name) {
                case 'app.pages_auth_forgot-password':
                case 'app.pages_auth_register-v2':
                case 'app.pages_auth_login-v2':
                case 'app.pages_auth_reset-password':
                case 'app.pages_auth_activate-invitation':
                    loginRequired = false;
                    break;
                default:
                    loginRequired = true;
                    break;
            }

            if (loginRequired && !utilService.checkLogin()) {
                event.preventDefault();
                $state.go('app.pages_auth_login-v2');
            }

            referenceGroups.getAllReferenceGroups();

            $rootScope.loadingProgress = true;
        }

        // De-activate loading indicator
        var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function () {
            $timeout(function () {
                $rootScope.loadingProgress = false;
            });
        });

        // Store state in the root scope for easy access
        $rootScope.state = $state;

        // Cleanup
        $rootScope.$on('$destroy', function () {
            stateChangeStartEvent();
            stateChangeSuccessEvent();
        });

        $rootScope.preventDefault = function (e) {
            e.preventDefault();
            e.stopPropagation();
        }

    }

})();
