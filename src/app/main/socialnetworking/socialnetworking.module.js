(function () {
    'use strict';

    angular
        .module('app.social', ['app.social.groups',
            'app.social.qa',
            'app.social.blog'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider) {

        msNavigationServiceProvider.saveItem('social', {
            title: 'Social Networking',
            icon: 'icon-web',
            weight: 15
        });

    }
})();