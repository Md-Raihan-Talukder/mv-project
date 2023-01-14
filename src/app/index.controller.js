(function () {
    'use strict';

    angular
        .module('tech-diser')
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(fuseTheming) {
        var vm = this;

        // Data
        vm.themes = fuseTheming.themes;

        //////////
    }
})();