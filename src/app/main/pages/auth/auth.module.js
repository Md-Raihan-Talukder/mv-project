(function () {
    'use strict';

    angular
        .module('app.pages.auth', [
            'app.pages.auth.login-v2',
            'app.pages.auth.register-v2',
            'app.pages.auth.forgot-password',
            'app.pages.auth.reset-password',
            'app.pages.auth.lock',
            'app.pages.auth.activate-invitation'

        ])
        .config(config);

    /** @ngInject */
    function config() {

    }
})();
