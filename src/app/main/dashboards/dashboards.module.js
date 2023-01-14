(function () {
    'use strict';

    angular
        .module('app.reports', [
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider) {

        msNavigationServiceProvider.saveItem('reports', {
            title: 'Reports & Dashboards',
            icon: 'icon-table-large',
            weight: 13
        });

    }
})();