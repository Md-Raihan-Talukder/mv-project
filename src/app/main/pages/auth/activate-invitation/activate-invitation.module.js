(function () {
    'use strict';

    angular
        .module('app.pages.auth.activate-invitation', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {
        // State
        $stateProvider.state('app.pages_auth_activate-invitation', {
            url: '/pages/auth/activate-invitation/:id',
            views: {
                'main@': {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller: 'MainController as vm'
                },
                'content@app.pages_auth_activate-invitation': {
                    templateUrl: 'app/main/pages/auth/activate-invitation/activate-invitation.html',
                    controller: 'ActivateInvitationController as vm'
                }
            },
            bodyClass: 'activate-invitation'
        });
    }

})();
