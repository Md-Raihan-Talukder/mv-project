(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('msbMultiRadioDirectiveController', msbMultiRadioDirectiveController);

    /** @ngInject */

    function msbMultiRadioDirectiveController($scope, msbUtilService, $mdDialog, $document) {
        var vm = this;
        console.log($scope.selectItems)

        vm.onRadioChange = function () {

            if ($scope.onUpdate) {
                $scope.onUpdate();
            }

        };

    }

})();
