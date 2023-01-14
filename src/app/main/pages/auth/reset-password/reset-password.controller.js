(function () {
    'use strict';

    angular
        .module('app.pages.auth.reset-password')
        .controller('ResetPasswordController', ResetPasswordController);

    /** @ngInject */
    function ResetPasswordController($state, authService, utilService) {
        var vm = this;
        // Data
        vm.resetInfo = {
            code: '',
            password: '',
            passwordConfirm: ''
        };
        // Methods
        vm.resetPassword = resetPassword;

        //////////

        function resetPassword() {

            authService.resetPassword(vm.resetInfo)
                .success(function (response) {
                    utilService.showToast(
                        'Your password successfully updated. please login using new password.',
                        'success-toast',
                        10000
                    );
                    $state.go('app.pages_auth_login-v2');
                })
                .error(function (err) {

                });
        }
    }
})();