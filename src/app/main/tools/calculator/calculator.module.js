(function () {
    'use strict';

    angular
        .module('app.tools.calculator', ['app.tools.calculator.cost', 'app.tools.calculator.consumption'])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider) {


    }

})();