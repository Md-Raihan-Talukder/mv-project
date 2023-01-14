(function () {
    'use strict';

    angular
        .module('app.social.qa', [
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider) {

        msNavigationServiceProvider.saveItem('social.qa', {
            title: 'Ask for help',
            icon: 'icon-help-circle',
            weight: 2
        });

    }
})();