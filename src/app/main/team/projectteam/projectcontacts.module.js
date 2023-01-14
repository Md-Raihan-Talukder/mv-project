(function () {
    'use strict';

    angular
        .module('app.team.project-contacts', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {

        $stateProvider.state('app.project-contacts', {
            url: '/projectcontacts',
            views: {
                'content@app': {

                    templateUrl: 'app/main/team/projectteam/project-contacts.html',
                    controller: 'ProjectContactsController as vm'
                }
            },
            resolve: {
                Contacts: function (msApi) {
                    return msApi.resolve('contacts.contacts@get');
                },
                User: function (msApi) {
                    return msApi.resolve('contacts.user@get');
                }
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/team/contacts');

        // Api
        msApiProvider.register('contacts.contacts', ['app/data/contacts/contacts.json']);
        msApiProvider.register('contacts.user', ['app/data/contacts/user.json']);

        // Navigation
        msNavigationServiceProvider.saveItem('team.project-contacts', {
            title: 'Project Team',
            icon: 'icon-account-box',
            state: 'app.project-contacts',
            weight: 2
        });

    }

})();