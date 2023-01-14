(function () {
    'use strict';

    angular
        .module('app.tools.calculator.consumption', [])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider) {


        msNavigationServiceProvider.saveItem('tools.consumptioncalculator', {
            title: 'Consumption Calculator',
            icon: 'icon-tshirt-crew',
            weight: 4
        });

    }
})();