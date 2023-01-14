(function () {
    'use strict';

    angular
        .module('app.licenses')
        .controller('LicensesController', LicensesController);

    /** @ngInject */
    function LicensesController($mdSidenav, commonApiService, $mdDialog, utilService, PRIMARY_COLUMN_NAME) {
        var vm = this;

        vm.pinSideNav = pinSideNav;
        vm.toggleSidenav = toggleSidenav;
        vm.toggleFilterWithEmpty = toggleFilterWithEmpty;
        vm.resetFilters = resetFilters;
        vm.select = select;

        init();
        function init() {
            createFilters();
            vm.leftNavPined = true;
            commonApiService.getItems(vm, "ORGANIZATIONS", "organizations", false, function () {
                vm.selected = null;
            });
            commonApiService.getItems(vm, "LICENSE-MODULES", "modules", false);
            commonApiService.getItems(vm, "LICENSES", "licenses", false, function () {

                vm.todayInDays = new Date().getTime() / (1000 * 3600 * 24);
                //console.log(vm.todayInDays);

            });

        }

        function pinSideNav(argument) {
            vm.leftNavPined = !vm.leftNavPined;
        }

        function toggleSidenav(sidenavId) {

            if ($mdSidenav(sidenavId).isLockedOpen()) {
                vm.leftNavPined = false;
                $mdSidenav(sidenavId).close();
            } else {
                vm.leftNavPined = true;
                $mdSidenav(sidenavId).toggle();
            }
        }

        function createFilters() {
            vm.filerByOrg = '';
            vm.filerByOrgsDefaults = angular.copy(vm.filerByOrg);

        }
        function toggleFilterWithEmpty(filter) {

            if (vm.filerByOrg === '') {
                vm.filerByOrg = filter;

            }
            else {
                vm.filerByOrg = '';

            }

        }

        function select(organization) {
            if (vm.selected == null) {
                vm.selected = organization;
            }
            else {
                vm.selected = null;
            }

        }

        function resetFilters() {
            vm.filerByOrg = angular.copy(vm.filerByOrgDefaults);
            vm.selected = null;
        }






    }
})();
