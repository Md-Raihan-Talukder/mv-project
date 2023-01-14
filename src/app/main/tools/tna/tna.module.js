(function () {
    'use strict';

    angular
        .module('app.tools.tna', [])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider) {


        msNavigationServiceProvider.saveItem('tools.tna', {
            title: 'T&A',
            icon: 'icon-timetable',
            weight: 1
        });

    }
})();