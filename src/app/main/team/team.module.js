(function () {
    'use strict';

    angular
        .module('app.team', ['app.team.contacts',
            'app.team.project-contacts'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider) {

        msNavigationServiceProvider.saveItem('team', {
            title: 'Team Management',
            icon: 'icon-account-multiple',
            weight: 12
        });

    }
})();