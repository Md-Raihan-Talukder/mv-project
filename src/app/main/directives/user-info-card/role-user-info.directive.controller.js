(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('UserInfoCardDirectiveController', UserInfoCardDirectiveController);

    /** @ngInject */

    function UserInfoCardDirectiveController($scope, utilService, PRIMARY_COLUMN_NAME,
        PERSON_IMG_HOLDER, msbCommonApiService) {
        var vm = this;

        vm.treeOptions = {
            "accept": function (sourceNodeScope, destNodesScope, destIndex) {
                return false;
            }
        };
        vm.personImgHolder = PERSON_IMG_HOLDER;

        init();
        function init() {
            $scope.$watch("userId", function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    getUserInfo();
                }
            }, true);
            getUserInfo();
        }
        vm.selectInCharge = selectInCharge;
        function selectInCharge(id) {
            if (id) {
                $scope.inChargeId = id;
            }
            else if (id == null) {
                $scope.inChargeId = id;
            }
        }

        function getUserInfo() {
            msbCommonApiService.getItem("USERS", $scope.userId, null, function (data) {
                if (data) {
                    vm.user = data;
                }
            }, null, false, "clientUrl");
        }



    }

})();
