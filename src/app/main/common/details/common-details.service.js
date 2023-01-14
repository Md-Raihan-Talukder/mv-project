(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('cmmonDetailService', cmmonDetailService);

    /** @ngInject */
    function cmmonDetailService(msbUtilService) {

        var menuList, stateName, saveAnd = true, selectedState, selectedUrl;

        var service = {
            setMenuList: setMenuList,
            getMenuList: getMenuList,
            updateSaveAnd: updateSaveAnd,
            updateSelected: updateSelected,
            getSelected: getSelected,
            getSelectedIndex: getSelectedIndex,
            makeMenuByCard: makeMenuByCard,
        };

        function makeMenuByCard(param, menus) {
            if (param && menus) {
                return !param.card || param.card == 'all'
                    ? menus
                    : makeCardWiseMenus(param.card, menus)
            }
        }

        function makeCardWiseMenus(card, menus) {
            if (card && menus) {
                var cardMenus = []
                menus.forEach(function (menu) {
                    if (menu) {
                        if (menu.type == 'alone') {
                            var checkIsStateCard = msbUtilService.getObjectByParams(menu.cards, 'card', card);
                            if (checkIsStateCard) {
                                cardMenus.push(menu)
                            }
                        }
                        else if (menu.type == 'family' && menu.members) {
                            menu.members || (menu.members = []);
                            if (menu.saveFamily === true && menu.members[0]) {
                                var checkIsStateCard = msbUtilService.getObjectByParams(menu.members[0].cards, 'card', card);
                                if (checkIsStateCard) {
                                    cardMenus.push(menu)
                                }
                            }
                            else {
                                menu.members.forEach(function (fMenu) {
                                    if (fMenu) {
                                        var checkIsStateCard = msbUtilService.getObjectByParams(fMenu.cards, 'card', card);
                                        if (checkIsStateCard) {
                                            cardMenus.push(fMenu)
                                        }
                                    }
                                });
                            }
                        }
                    }
                });


                return cardMenus
            }
        }

        function getSelectedIndex() {
            var sParams = [
                { "key": "state", "value": selectedState },
                { "key": "url", "value": selectedUrl }
            ];

            var index = -1;

            if (selectedUrl) {
                index = msbUtilService.getIndexByValues(menuList, sParams);
            } else {
                index = msbUtilService.getIndex(menuList, "state", selectedState);
            }

            return index;
        }

        function getSelected() {
            return { state: selectedState, url: selectedUrl };
        }

        function updateSelected(state, url) {
            selectedState = state;
            selectedUrl = url;
        }

        function updateSaveAnd(save) {
            saveAnd = save;
        }

        function setMenuList(menus, name) {
            menuList = menus;
            stateName = name
        }

        function getMenuList() {
            return { menuList: menuList, stateName: stateName, saveAnd: saveAnd };
        }

        return service;
    }
})();
