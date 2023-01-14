(function () {
    'use strict';

    angular
        .module('app.users', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msNavigationServiceProvider) {
        // State
        $stateProvider.state('app.users', {
            url: '/users',
            views: {
                'content@app': {
                    templateUrl: 'app/main/users/users.html',
                    controller: 'RUsersController as vm'
                }
            },
            bodyClass: 'users'
        }).state('app.users.add', {
            url: '/add/:id',
            views: {
                'content@app': {
                    templateUrl: 'app/main/users/add/add-user.html',
                    controller: 'RAddUserController as vm'
                }
            }
        }).state('app.users.update', {
            url: '/update/:id',
            views: {
                'content@app': {
                    templateUrl: 'app/main/users/add/add-user.html',
                    controller: 'RAddUserController as vm'
                }
            }
        });



        // Navigation
        msNavigationServiceProvider.saveItem('users', {
            title: 'Users',
            state: 'app.users',
            icon: 'icon-account-multiple',
            weight: 1
        });
    }
})();
