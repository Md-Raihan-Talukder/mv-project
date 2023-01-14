(function () {
    'use strict';

    angular
        .module('app.license')
        .controller('LicenseController', LicenseController);

    /** @ngInject */
    function LicenseController(commonApiService, $mdDialog, $mdSidenav, $state, mainMenuService, utilService, PRIMARY_COLUMN_NAME) {
        var vm = this;
        vm.name = "Ha-meem Group";

        init();
        function init() {
            commonApiService.getItems(vm, "LICENSE-MODULES", "modules", false, function () {
                vm.allModules = vm.modules;
            });

        }

    }
})();
