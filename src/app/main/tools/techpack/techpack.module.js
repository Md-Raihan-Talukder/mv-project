(function () {
    'use strict';

    angular
        .module('app.tools.techpack', [])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider) {


        msNavigationServiceProvider.saveItem('tools.techpack', {
            title: 'TechPack',
            icon: 'icon-bulletin-board',
            weight: 2
        });

    }
})();