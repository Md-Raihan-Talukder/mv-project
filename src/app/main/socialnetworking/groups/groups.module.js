(function () {
    'use strict';

    angular
        .module('app.social.groups', [
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider) {

        msNavigationServiceProvider.saveItem('social.groups', {
            title: 'Groups',
            icon: 'icon-account-multiple',
            weight: 1
        });

    }
})();