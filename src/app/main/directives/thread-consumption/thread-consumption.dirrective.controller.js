(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('ThreadConsumptionController', ThreadConsumptionController);

    /** @ngInject */
    function ThreadConsumptionController($scope, PRIMARY_COLUMN_NAME, $rootScope, msbCommonApiService,
        enquiryDataService, consumptionCalculationService, msbMeasurementService) {

        debugger;

        var vm = this;
        vm.primaryColumnName = PRIMARY_COLUMN_NAME;
        vm.updateIsSave = updateIsSave;
        vm.getEtdConsumptions = getEtdConsumptions;
        vm.showThreadComboConsumption = showThreadComboConsumption;


        init();

        function init() {

            getDataDefinition();
        }

        function updateIsSave() {
            $rootScope.unSaveState = true;
        }

        //  ThreadComboMats, ComboDefinition

        function showThreadComboConsumption() {
            if (vm.comboThreadCons && vm.comboDefinition && vm.comboDefinition.length > 0) {
                var params = [{ "key": "comboThreadCons", "value": vm.comboThreadCons },
                { "key": "comboDefinition", "value": vm.comboDefinition }];
                enquiryDataService.showThreadComboConsumption(params);
            }
        }

        function getEtdConsumptions(etd) {
            var info = [];
            if (vm.etdThreadCons && etd && etd.TECHDISER_ID) {
                vm.etdThreadCons.forEach(function (item) {
                    if (item && item.etdId && item.etdId == etd.TECHDISER_ID) {
                        info.push(item);
                    }
                });
            }
            return info;
        }

        function getDataDefinition() {
            if ($scope.materialDef && $scope.stitches && $scope.materialQuantity) {
                vm.materialDef = $scope.materialDef;
                vm.stitches = $scope.stitches;
                vm.materialQuantity = $scope.materialQuantity;
                vm.etds = $scope.etds;
                vm.assortments = $scope.assortments;
                vm.processDefinition = $scope.processDefinition;
                vm.stitchDefinition = $scope.stitchDefinition;
                vm.comboDefinition = $scope.comboDefinition;
                vm.uniqueId = $scope.enqId;
                vm.persistableData = $scope.persistableData;
                vm.matType = $scope.matType;
                vm.consPolicy = $scope.consPolicy;


                if (typeof $scope.isReferenceSize !== 'undefined' && typeof $scope.isAllSize !== 'undefined') {

                    vm.isReferenceSize = $scope.isReferenceSize;
                    vm.isAllSize = $scope.isAllSize;

                }

                msbCommonApiService.interfaceManager(function (categoryData) {

                    if (categoryData) {

                        vm.category = categoryData;

                        vm.garmentQuantity = consumptionCalculationService.calculateTotalGarmentQuantity(vm.etds, vm.assortments);

                        var totalQuantityDef = consumptionCalculationService.calculateComboSizeWiseTotalQuantityDef(vm.garmentQuantity, vm.assortments);

                        var etdAssort = consumptionCalculationService.calculateComboSizeEtdQuantityDef(vm.etds, vm.assortments)

                        var sizeWiseThreadPositionConsumption = consumptionCalculationService.calculateSizeWiseThreadPositionConsumption(
                            vm.stitchDefinition, vm.processDefinition, vm.stitches,
                            $scope.supplyCategory, msbMeasurementService.getThreadItemDefinition,
                            msbMeasurementService.getThreadHostDefinition, msbMeasurementService.getThreadProcessStitchDeffinition
                        );

                        vm.consumptionOfAMaterialForComboSize = consumptionCalculationService.calculateThreadConsumptionOfAMaterialForComboSize(
                            vm.uniqueId, vm.materialDef, vm.assortments, sizeWiseThreadPositionConsumption,
                            $scope.supplyCategory, msbMeasurementService.getThreadItemDefinition,
                            msbMeasurementService.getThreadHostDefinition);

                        vm.threadCons = consumptionCalculationService.calculateMaterialConsumption(vm.uniqueId, vm.consumptionOfAMaterialForComboSize, totalQuantityDef, $scope.supplyCategory, consumptionCalculationService.getThreadConsumptionUnit);

                        vm.etdThreadCons = consumptionCalculationService.calculateEtdwiseConsumption(vm.uniqueId, vm.consumptionOfAMaterialForComboSize, etdAssort, $scope.supplyCategory, consumptionCalculationService.getThreadConsumptionUnit);

                        vm.comboThreadCons = consumptionCalculationService.calculateComboWiseConsumption(vm.uniqueId, vm.consumptionOfAMaterialForComboSize, totalQuantityDef);

                        vm.persistableData = consumptionCalculationService.preparePersistableData(vm.uniqueId, vm.consPolicy, vm.consumptionOfAMaterialForComboSize, vm.threadCons);

                        $scope.persistableData = vm.persistableData;
                    }

                }, "styleDataService", "getMaterialCategoriesLeaf", null);

            }

        }






    }
})();
