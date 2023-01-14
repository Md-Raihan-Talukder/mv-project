(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdUserInfoCard', UserInfoCard);

    /** @ngInject */
    function UserInfoCard() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                userId: '=',
                helpers: '=',
                inChargeId: '=',
                isChackable: '=',
                onRemoveItem: '&',
                onSelectItem: '&',
                options: '='
            },
            link: function (scope, element, attrs) {

            },
            controller: "UserInfoCardDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/user-info-card/role-user-info.directive.html'
        };
    }
})();
