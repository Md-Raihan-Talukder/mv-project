(function () {
    'use strict';

    angular
        .module('app.toolbar')
        .controller('ToolbarController', ToolbarController);

    /** @ngInject */
    function ToolbarController(utilService, $rootScope, $q, $state, $timeout, $mdSidenav, $translate,
        $mdToast, msNavigationService, PRIMARY_COLUMN_NAME) {
        var vm = this;

        // Data       


        $rootScope.global = {
            search: ''
        };

        vm.bodyEl = angular.element('body');
        vm.userStatusOptions = [
            {
                'title': 'Online',
                'icon': 'icon-checkbox-marked-circle',
                'color': '#4CAF50'
            },
            {
                'title': 'Away',
                'icon': 'icon-clock',
                'color': '#FFC107'
            },
            {
                'title': 'Do not Disturb',
                'icon': 'icon-minus-circle',
                'color': '#F44336'
            },
            {
                'title': 'Invisible',
                'icon': 'icon-checkbox-blank-circle-outline',
                'color': '#BDBDBD'
            },
            {
                'title': 'Offline',
                'icon': 'icon-checkbox-blank-circle-outline',
                'color': '#616161'
            }
        ];

        vm.notifications = {
            email: {
                'title': 'Emails',
                'icon': 'icon-email',
                'badgeColor': 'red',
                'badgeBackground': '#FFC107',
                'badgeText': '5',
                'url': "app.mail.threads({type:'folder', filter: 'inbox'})"
            },
            message: {
                'title': 'Messages',
                'icon': 'icon-comment',
                'badgeColor': '#fff',
                'badgeBackground': '#4CAF50',
                'badgeText': '7',
                'url': 'app.sample'
            },
            notification: {
                'title': 'Notifications',
                'icon': 'icon-flag',
                'badgeColor': 'fff',
                'badgeBackground': 'red',
                'badgeText': '15',
                'url': 'app.sample'
            }
        };

        vm.tools = {
            tna: {
                'title': 'T&A',
                'icon': 'icon-timetable',
                'url': 'app.sample'

            },
            techpack: {
                'title': 'TechPack',
                'icon': 'icon-bulletin-board',
                'url': 'app.sample'
            },
            cost: {
                'title': 'Cost Calculator',
                'icon': 'icon-calculator',
                'url': 'app.sample'
            },
            consumption: {
                'title': 'Consumption Calculator',
                'icon': 'icon-tshirt-crew',
                'url': 'app.sample'
            }
        };

        // Methods
        vm.toggleSidenav = toggleSidenav;
        vm.logout = logout;
        vm.setUserStatus = setUserStatus;
        vm.gotoNotes = gotoNotes;
        vm.toggleHorizontalMobileMenu = toggleHorizontalMobileMenu;
        vm.toggleMsNavigationFolded = toggleMsNavigationFolded;
        vm.search = search;
        vm.searchResultClick = searchResultClick;
        vm.showMenu = showMenu;

        //////////

        init();


        function init() {
            vm.userStatus = vm.userStatusOptions[0];
            vm.currentUser = utilService.getCurrentUser();
        }

        function showMenu(menuId) {
            if (!$rootScope.selectedModule) {
                return false;
            }

            var show = false, moduleId = $rootScope.selectedModule[PRIMARY_COLUMN_NAME];
            switch (moduleId) {
                case 'admin':
                    show = true;
                    break;
                default:
                    show = false
                    break;
            }

            return show;
        }

        function gotoNotes() {
            $state.go('app.notes');
        }

        function toggleSidenav(sidenavId) {
            $mdSidenav(sidenavId).toggle();
        }

        function setUserStatus(status) {
            vm.userStatus = status;
        }

        function logout() {
            utilService.removeLoginDataLocally();
            $state.go('app.pages_auth_login-v2');
        }

        function toggleHorizontalMobileMenu() {
            vm.bodyEl.toggleClass('ms-navigation-horizontal-mobile-menu-active');
        }
        function toggleMsNavigationFolded() {
            msNavigationService.toggleFolded();
        }

        function search(query) {
            var navigation = [],
                flatNavigation = msNavigationService.getFlatNavigation(),
                deferred = $q.defer();

            // Iterate through the navigation array and
            // make sure it doesn't have any groups or
            // none ui-sref items
            for (var x = 0; x < flatNavigation.length; x++) {
                if (flatNavigation[x].uisref) {
                    navigation.push(flatNavigation[x]);
                }
            }

            // If there is a query, filter the navigation;
            // otherwise we will return the entire navigation
            // list. Not exactly a good thing to do but it's
            // for demo purposes.
            if (query) {
                navigation = navigation.filter(function (item) {
                    if (angular.lowercase(item.title).search(angular.lowercase(query)) > -1) {
                        return true;
                    }
                });
            }

            // Fake service delay
            $timeout(function () {
                deferred.resolve(navigation);
            }, 1000);

            return deferred.promise;
        }

        /**
         * Search result click action
         *
         * @param item
         */
        function searchResultClick(item) {
            // If item has a link
            if (item.uisref) {
                // If there are state params,
                // use them...
                if (item.stateParams) {
                    $state.go(item.state, item.stateParams);
                }
                else {
                    $state.go(item.state);
                }
            }
        }
    }

})();