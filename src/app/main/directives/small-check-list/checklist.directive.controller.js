(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('smallCheckListDirectiveController', smallCheckListDirectiveController);

    /** @ngInject */

    function smallCheckListDirectiveController($scope, msbUtilService) {
        var vm = this;
        vm.checkList = $scope.checkList;
        vm.createCheckList = createCheckList;
        vm.removeCheckList = removeCheckList;

        function removeCheckList(arr, item) {
            if (arr && item) {
                var itemI = msbUtilService.getIndex(arr, "TECHDISER_ID", item.TECHDISER_ID);
                if (itemI > -1) {
                    arr.splice(itemI, 1);
                }
            }
        }

        function createCheckList(arr, title) {
            if (arr && title) {
                var chkList = {
                    "title": title,
                    "TECHDISER_ID": msbUtilService.generateId(),
                    "isChecked": false
                }
                arr.push(chkList);
            }
        }

    }

})();
