(function () {
    'use strict';

    angular
        .module('app.team.contacts', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {

        $stateProvider.state('app.contacts', {
            url: '/contacts',
            views: {
                'content@app': {

                    templateUrl: 'app/main/team/contacts/contacts.html',
                    controller: 'ContactsController as vm'
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
        msNavigationServiceProvider.saveItem('team.contacts', {
            title: 'Contacts',
            icon: 'icon-account-box',
            state: 'app.contacts',
            weight: 1
        });

    }

})();