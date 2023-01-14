(function () {
    'use strict';

    angular
        .module('app.pages.auth.activate-invitation')
        .controller('ActivateInvitationController', ActivateInvitationController);

    /** @ngInject */
    function ActivateInvitationController($scope, $stateParams, commonApiService, utilService, PRIMARY_COLUMN_NAME) {
        var vm = this;
        // Data
        vm.acceptInvitation = acceptInvitation;

        init();
        function init() {
            var params = [{ "key": "invitationId", "value": $stateParams.id }];
            // get multiple Item according to params
            commonApiService.getItems(vm, "USERS", "users", params, function () {
                vm.user = vm.users[0];
            });
        }

        function acceptInvitation() {
            alert(vm.invitation.password);
        }


    }
})();
