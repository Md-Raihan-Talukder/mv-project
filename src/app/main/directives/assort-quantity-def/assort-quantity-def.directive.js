(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdAssortQuantityDef', AssortQuantityDefDirective)
        .controller('AssortQuantityDefDirectiveController', AssortQuantityDefDirectiveController);

    /** @ngInject */
    function AssortQuantityDefDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                poId: '=',
                quantity: '=',
                assortIds: '='
            },
            controller: "AssortQuantityDefDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/assort-quantity-def/assort-quantity-def.html'
        };
    }

    /** @ngInject */

    function AssortQuantityDefDirectiveController($rootScope, $scope, poUtillService,
        poDetailService, msbCommonApiService, PRIMARY_COLUMN_NAME) {
        var vm = this;
        vm.getCalculatedQty = getCalculatedQty;
        vm.getLessNExtraQty = getLessNExtraQty;
        vm.onChange = onChange;

        init();

        function init() {

            vm.poId = $scope.poId;
            getPo();


        }

        function getPo() {
            var param = [{ "key": "poId", "value": vm.poId }];
            msbCommonApiService.interfaceManager(function (poData) {
                if (poData) {
                    vm.sizeDef = poData.sizeDef;
                    vm.comboDef = poData.comboDef;
                    vm.quantityDef = poData.quantityDef.quantityDef;
                    console.log(vm.quantityDef);
                    vm.quantityRatio = poData.quantityRatio.quantityDef;
                    vm.sizeWiseQty = $scope.quantity ? $scope.quantity : poData.basicInfo.quantity;
                    vm.assortments = filterAssort(poData);
                    vm.isCalculateFormRatio = poData.quantityDef.isCalculateFormRatio;
                    vm.isCalculateFromAssort = poData.quantityRatio.isCalculateFromAssort;
                    getSizes();
                    onChange();

                }
            }, "poDetailService", "getPoById", param);
        }

        function filterAssort(poData) {
            console.log($scope.assortIds)
            if ($scope.assortIds) {
                var assorts = $.grep(poData.assortments, function (item) {
                    return $scope.assortIds.indexOf(item[PRIMARY_COLUMN_NAME]) > -1;
                });

                return assorts;
            }

            return poData.assortments;
        }

        function getSizes() {

            if (vm.sizeDef) {
                vm.sizes = poUtillService.flattenSizeDef(vm.sizeDef);
                vm.quantityDef = poUtillService.genQuantityDef(vm.quantityDef, vm.comboDef, vm.sizes);
                vm.quantityRatio = poUtillService.genQuantityDef(vm.quantityRatio, vm.comboDef, vm.sizes);

                if (!vm.assortments) {
                    vm.assortments = [];
                }

                for (var i = 0; i < vm.assortments.length; i++) {
                    vm.assortments[i].quantityDef = poUtillService.genQuantityDef(vm.assortments[i].quantityDef, vm.comboDef, vm.sizes);
                }

            }

        }

        function onChange() {
            if (vm.isCalculateFromAssort) {
                calculateFromAssort();
            }
            if (vm.isCalculateFormRatio) {
                calculateFromQuantityRatio();
            }
        }

        function getCalculatedQty() {
            if (vm.quantityDef && angular.isArray(vm.quantityDef) && vm.quantityDef.length > 0) {
                return poUtillService.calculateAssortQuantity(vm.quantityDef);
            }
            return 0;
        }

        function getLessNExtraQty() {
            if (vm.sizeWiseQty) {
                var qty = getCalculatedQty() - vm.sizeWiseQty;
                if (qty > 0) {
                    vm.less = false;
                    vm.extra = true;
                    vm.extraQty = qty;
                }
                if (qty < 0) {
                    vm.extra = false;
                    vm.less = true;
                    vm.lessQty = qty;
                }
                if (qty == 0) {
                    vm.less = false;
                    vm.extra = false;
                }
            }
        }


        function calculateFromAssort() {
            if (vm.assortments) {
                vm.quantityRatio = poUtillService.mergeAssort(vm.assortments, vm.quantityRatio);
            }
        }

        function calculateFromQuantityRatio() {
            if (vm.quantityRatio && angular.isArray(vm.quantityRatio) && vm.quantityRatio.length > 0) {
                poUtillService.calculateQuantityDef(vm.quantityRatio, vm.sizeWiseQty, vm.quantityDef);
            }
        }


    }



})();
