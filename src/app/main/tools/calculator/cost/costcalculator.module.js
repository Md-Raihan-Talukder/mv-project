(function () {
    'use strict';

    angular
        .module('app.tools.calculator.cost', [])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider) {


        msNavigationServiceProvider.saveItem('tools.costcalculator', {
            title: 'Cost Calculator',
            icon: 'icon-calculator',
            weight: 3
        });

    }
})();