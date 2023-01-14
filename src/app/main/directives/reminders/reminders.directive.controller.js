(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('RemidersDirectiveController', RemidersDirectiveController);

    /** @ngInject */

    function RemidersDirectiveController($rootScope, $scope, $mdMenu) {
        var vm = this;

        vm.reminder = $scope.itemList;
        vm.reminder.expand = $scope.expanded;
        vm.showHideForm = showHideForm;
        vm.selectRoleUser = selectRoleUser;
        vm.dataChanged = dataChanged;

        init();
        function init() {
            vm.dueType = $scope.type;
        }

        function showHideForm() {
            vm.reminder.expand = !vm.reminder.expand;
        }

        function selectRoleUser(type) {
            if (type) {
                $scope.selectRoleUser({ "selType": type, "dueType": vm.dueType });
            }
        }
        function dataChanged() {
            $rootScope.unSaveState = true;
        }

    }

})();
