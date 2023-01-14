(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdActivitySelector', TdActivitySelector)
        .controller('TdActivitySelectorController', TdActivitySelectorController);

    /** @ngInject */
    function TdActivitySelector() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                selected: '=',
                type: '='
            },
            link: function (scope, element, attrs) {

            },
            controller: "TdActivitySelectorController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/activity-selector/activity-selector.html'
        };
    }

    function TdActivitySelectorController($scope, msbCommonApiService, msbUtilService,
        PRIMARY_COLUMN_NAME, organizationsDataService) {

        var vm = this;
        vm.selectActivity = selectActivity;
        vm.checkSelected = checkSelected;
        vm.selectFun = selectFun;

        init();
        function init() {
            var orgId = msbUtilService.getOrganizationId();
            var param = [
                { "key": "orgId", "value": orgId }
            ]
            msbCommonApiService.getItems("ORGANIZATIONS", null,
                function (data) {
                    vm.allModules = angular.copy(data);
                    vm.modules = angular.copy(data);
                    console.log(data);
                }, null, false, null, "clientUrl", "/[TECHDISER_ID=$orgId]/operationSet", param);

        }

        function selectActivity(modId, feaId, funId, act) {
            if (msbUtilService.checkUndefined(modId, feaId, funId, act)) {
                var index = msbUtilService.getIndex($scope.selected, "activityId", act.TECHDISER_ID);
                if (index > -1) {
                    $scope.selected.splice(index, 1);
                }
                else if (index === -1) {
                    var item = {
                        "moduleId": modId,
                        "featureId": feaId,
                        "functionId": funId,
                        "activityId": act.TECHDISER_ID,
                        "activityTitle": act.title
                    };
                    $scope.selected.push(item);
                }
            }
        }

        function selectFun(modId, feaId, fun) {
            if (msbUtilService.checkUndefined(modId, feaId, fun)) {
                var index = msbUtilService.getIndex($scope.selected, "functionId", fun.TECHDISER_ID);
                if (index > -1) {
                    $scope.selected.splice(index, 1);
                }
                else if (index === -1) {
                    var item = {
                        "moduleId": modId,
                        "featureId": feaId,
                        "functionId": fun.TECHDISER_ID,
                        "functionaly": fun
                    };
                    $scope.selected.push(item);
                }
            }
        }

        function checkSelected(id, attr) {
            if (id && attr) {
                var index2 = msbUtilService.getIndex($scope.selected, attr, id);
                return index2 != -1;
            }
        }
    }
})();
