(function () {
    'use strict';

    angular
        .module('app.social.blog', [
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider) {

        msNavigationServiceProvider.saveItem('social.blog', {
            title: 'Blogs',
            icon: 'icon-blogger',
            weight: 3
        });

    }
})();