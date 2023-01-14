(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('msbMultiCheckboxDirectiveController', msbMultiCheckboxDirectiveController);

    /** @ngInject */

    function msbMultiCheckboxDirectiveController($scope, msbUtilService, $mdDialog, $document) {
        var vm = this;

        if (!$scope.selectedIds) {
            $scope.selectedIds = [];
        }

        $scope.toggle = function (item, list) {
            var idx = getItemIndex(item, list);
            if (idx > -1) {
                list.splice(idx, 1);
            }
            else {
                list.push(item[$scope.keyProperty]);
            }

            if ($scope.onUpdate) {
                $scope.onUpdate();
            }
        };

        function getItemIndex(item, list) {
            return list.indexOf(item[$scope.keyProperty]);
        }

        $scope.exists = function (item, list) {
            return getItemIndex(item, list) > -1;
        };

        $scope.isIndeterminate = function () {
            return ($scope.selectedIds.length !== 0 &&
                $scope.selectedIds.length !== $scope.items.length);
        };

        $scope.isChecked = function () {
            return $scope.selectedIds.length === $scope.items.length;
        };

        $scope.toggleAll = function () {
            if ($scope.selectedIds.length === $scope.items.length) {
                $scope.selectedIds = [];
            } else if ($scope.selectedIds.length === 0 || $scope.selectedIds.length > 0) {
                $scope.selectedIds = $scope.items.slice(0);
            }
        };



    }

})();
