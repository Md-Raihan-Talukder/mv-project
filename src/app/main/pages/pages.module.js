(function () {
    'use strict';

    angular
        .module('app.pages', [
            'app.pages.auth',
            'app.pages.coming-soon',
            'app.pages.error-404',
            'app.pages.error-500',
            'app.pages.invoice',
            'app.pages.maintenance',
            'app.pages.profile',
            'app.pages.search',
            'app.pages.timeline',
            'app.pages.nopermission'
        ])
        .config(config);

    /** @ngInject */
    function config() {

    }
})();