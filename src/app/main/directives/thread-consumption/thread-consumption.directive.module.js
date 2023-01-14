(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdThreadConsumption', ThreadConsumption);


    /** @ngInject */
    function ThreadConsumption() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                materialDef: '=',
                stitches: '=',
                materialQuantity: '=',
                etds: '=',
                assortments: '=',
                processDefinition: '=',
                stitchDefinition: '=',
                comboDefinition: '=',
                enqId: '=',
                persistableData: '=',
                matType: '=',
                supplyCategory: '=',
                consPolicy: '='
            },
            link: function (scope, element, attrs) {

            },
            controller: "ThreadConsumptionController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/thread-consumption/thread-consumption.html'
        };
    }
})();
