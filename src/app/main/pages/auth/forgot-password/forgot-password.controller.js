(function () {
    'use strict';

    angular
        .module('app.pages.auth.forgot-password')
        .controller('ForgotPasswordController', ForgotPasswordController);

    /** @ngInject */
    function ForgotPasswordController($state, authService, utilService) {
        var vm = this;
        // Data
        vm.emailOrMobile = "";
        // Methods
        vm.sendResetCode = sendResetCode;

        //////////

        function sendResetCode() {

            authService.sendResetCode(vm.emailOrMobile)
                .success(function (response) {
                    utilService.showToast(
                        'A code has been sent to you. Please reset your password using the code.',
                        'success-toast',
                        20000
                    );
                    $state.go('app.pages_auth_reset-password');
                })
                .error(function (err) {

                });
        }
    }
})();