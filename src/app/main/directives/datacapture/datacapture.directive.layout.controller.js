(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('DataCaptureLayoutController', DataCaptureLayoutController);

    /** @ngInject */
    function DataCaptureLayoutController($scope) {
        var vm = this;
        vm.addInnerItem = addInnerItem;

        init();

        function init() {

        }

        function addInnerItem(innerItem, isNew) {
            $scope.onAddInnerItem({ innerItem: innerItem, isNew: isNew });
        }

    }
})();