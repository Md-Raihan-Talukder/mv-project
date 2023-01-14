(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('FormLayoutRowDirectiveController', FormLayoutRowDirectiveController);

    /** @ngInject */
    function FormLayoutRowDirectiveController() {
        var vm = this;
        vm.preventDefault = preventDefault;

        init();

        function preventDefault(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        function init() {


        }



    }
})();