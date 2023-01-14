(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('mainMenuService', mainMenuService);

    /** @ngInject */
    function mainMenuService(msNavigationService, utilService, PRIMARY_COLUMN_NAME) {

        var service = {
            addMainMenu: addMainMenu,
            removeCurrentMenu: removeCurrentMenu
        };


        function addMainMenu(menus) {
            var sortedItems = angular.copy(utilService.sortItems(menus));
            for (var i = 0; i < sortedItems.length; i++) {
                var menu = createMenu(sortedItems[i], menus);
                msNavigationService.deleteItem(sortedItems[i].navTitle);
                msNavigationService.saveItem(sortedItems[i].navTitle, menu);
            }
        }

        function removeCurrentMenu(menus) {
            for (var i = 0; i < menus.length; i++) {
                msNavigationService.deleteItem(menus[i].navTitle);
            }
        }

        function createMenu(menu, menus) {
            var mnu = {
                title: menu.title,
                icon: menu.icon,
                class: menu.cssClass,
                weight: menu.weight,
                badge: menu.badge
            };

            if (!hasChild(menus, menu[PRIMARY_COLUMN_NAME])) {
                if (menu.type === 'state') {
                    mnu.state = menu.state;
                    mnu.stateParams = menu.stateParams;
                } else if (menu.registerId) {
                    mnu.state = 'app.registers';
                    mnu.stateParams = { 'id': menu[PRIMARY_COLUMN_NAME] };
                }
            }

            return mnu;
        }

        function hasChild(allMenus, id) {
            var menus = $.grep(allMenus, function (menu) {
                return menu.parentId === id;
            });

            return menus.length > 0;
        }

        return service;
    }
})();