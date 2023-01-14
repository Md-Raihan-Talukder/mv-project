(function () {
    'use strict';

    angular
        .module('app.pages.auth.register-v2')
        .controller('RegisterV2Controller', RegisterV2Controller);

    /** @ngInject */
    function RegisterV2Controller($rootScope, utilService, $state, $mdDialog, authService) {
        var vm = this;

        // Data
        vm.isAgree = false;
        vm.emailSend = false;
        vm.registerAs = [
            { key: 'merchanDiser', value: 'Merchandiser' },
            { key: 'owner', value: 'Owner' },
            { key: 'buyer', value: 'Buyer' },
            { key: 'supplier', value: 'Supplier' },
        ];

        vm.registerInfo = {
            name: '',
            email: '',
            mobile: '',
            registerAs: '',
            password: '',
            passwordConfirm: ''
        }

        // Methods
        vm.registerUser = registerUser;
        vm.confirmRegister = confirmRegister;
        vm.showTearmsAndConditions = showTearmsAndConditions;
        vm.checkSendType = checkSendType;
        vm.ResendCode = ResendCode;
        vm.showResendCodeBlock = showResendCodeBlock;

        //////////

        function showResendCodeBlock() {
            vm.codeNotFound = true;
        }

        function checkSendType() {
            return !vm.sendCodeToMobile && !vm.sendCodeToEmail;
        }

        function ResendCode() {
            authService.registerUser(vm.registerInfo)
                .success(function (response) {
                    showSendCodeToast();
                    vm.emailSend = true;
                })
                .error(function (err) {

                });
        }

        function registerUser() {
            authService.registerUser(vm.registerInfo)
                .success(function (response) {
                    showSendCodeToast();
                    vm.emailSend = true;
                })
                .error(function (err) {

                });
        }

        function showSendCodeToast() {
            utilService.showToast(
                'Confirmaition code has been send to your mobile or email. Please confirm your registration.',
                'success-toast',
                10000
            );
        }

        function confirmRegister() {
            var loginInfo = {
                mobile: vm.registerInfo.mobile,
                email: vm.registerInfo.email,
                password: vm.registerInfo.password
            }
            authService.login(loginInfo)
                .success(function (response) {
                    $rootScope.currentUser = response.user;
                    $rootScope.hasLogin = true;
                    utilService.showToast(
                        'Congratulations!, You have registered successfully. Welcome to TchDiser.',
                        'success-toast',
                        10000
                    );
                    $state.go('app.dashboards_project');
                })
                .error(function (err) {

                });
        }


        // function showTearmsAndConditions() {
        //      var dlg ={
        //         contentElement: '#tearms-and-conditions',
        //         parent: angular.element(document.body),
        //         clickOutsideToClose: true
        //      }

        //      $mdDialog.show(dlg);
        // }

        function showTearmsAndConditions(ev) {

            $mdDialog.show({
                controller: TermsAndConditionsController,
                controllerAs: 'vm',
                locals: {
                    isAgree: vm.isAgree,
                    onSuccess: function onSuccess() {
                        alert('ok');
                    }
                },
                templateUrl: 'app/main/pages/auth/register-v2/terms.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            })
                .then(function (answer) {
                    vm.isAgree = answer;
                }, function () {
                    //$scope.status = 'You cancelled the dialog.';
                });

        }

    }

    //tearms and conditions dialog controller

    /** @ngInject */
    function TermsAndConditionsController($scope, $mdDialog, isAgree, onSuccess) {
        var vm = this;
        //data
        vm.isAgree = isAgree;


        // Methods
        vm.closeDialog = closeDialog;
        vm.clreateAccount = clreateAccount;
        //////////

        function clreateAccount() {

            onSuccess();
        }


        function closeDialog() {
            $mdDialog.hide(vm.isAgree);
        }
    }




})();