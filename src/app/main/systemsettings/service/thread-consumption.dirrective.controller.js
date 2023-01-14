(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('ThreadConsumptionController', ThreadConsumptionController);

    /** @ngInject */
    function ThreadConsumptionController($scope, $state, PRIMARY_COLUMN_NAME, $rootScope,
        $mdDialog, $document, msbCommonApiService, msbUtilService, $stateParams,
        styleDataService, MEASUREMENT_UNITS, enquiryDataService) {

        var vm = this;
        vm.primaryColumnName = PRIMARY_COLUMN_NAME;
        vm.updateIsSave = updateIsSave;
        vm.getThreadMaterialDetail = getThreadMaterialDetail;
        vm.showThreadComboConsumption = showThreadComboConsumption;
        vm.getThreadMaterialEtdPerCons = getThreadMaterialEtdPerCons;
        vm.getThreadMaterialEtdCons = getThreadMaterialEtdCons;

        init();

        function init() {

            getDataDefinition();
        }

        function updateIsSave() {
            $rootScope.unSaveState = true;
        }

        function getDataDefinition() {
            if ($scope.materialDef && $scope.sizeDef && $scope.stitches &&
                $scope.materialQuantity && $scope.comboDef) {

                vm.sizeDefinition = $scope.sizeDef;
                vm.materialDef = $scope.materialDef;
                vm.threadsStitchLength = $scope.threadsStitchLength;
                vm.comboDefinition = $scope.comboDef;
                vm.quantityDef = $scope.quantityDef;
                vm.stitches = $scope.stitches;
                vm.materialQuantity = $scope.materialQuantity;
                vm.threadMats = $scope.threadMaterials;
                vm.threadEtdMats = $scope.threadEtdMaterials;
                vm.threadComboMats = $scope.threadComboMaterials;
                vm.stitchLengthDef = $scope.stitchLengthDef;
                vm.etds = $scope.etds;

                if (typeof $scope.isReferenceSize !== 'undefined' && typeof $scope.isAllSize !== 'undefined') {

                    vm.isReferenceSize = $scope.isReferenceSize;
                    vm.isAllSize = $scope.isAllSize;

                }

                msbCommonApiService.interfaceManager(function (categoryData) {

                    if (categoryData) {
                        vm.category = categoryData;
                        // checkMaterialForThread();
                        checkComboMaterialForThread();
                    }

                }, "styleDataService", "getMaterialCategoriesLeaf", null);

            }

        }

        // function checkMaterialForThread() { //
        //     if (vm.materialDef && vm.materialDef.length > 0) {
        //         for (var i = 0; i < vm.materialDef.length; i++) {
        //             if (vm.materialDef[i].matType == "thread") {
        //                 var index = msbUtilService.getIndex(vm.threadMats, "materialId", vm.materialDef[i].gMatColorSizeId);
        //                 if (index === -1) {
        //                     var materialObj = {
        //                         "TECHDISER_ID": msbUtilService.generateId(),
        //                         "materialId":  vm.materialDef[i].gMatColorSizeId,
        //                         "consPerGarment": 0,
        //                         "consumption": 0
        //                     }
        //                     vm.threadMats.push(materialObj);
        //                 }
        //             }
        //         }
        //         calCThreadConsumption();
        //     }
        // }

        // function calCThreadConsumption() { //
        //     if (vm.threadMats && vm.threadMats.length > 0) {
        //         for (var i = 0; i < vm.threadMats.length; i++) {
        //             if (vm.threadMats[i]) {
        //                 var params = [{"key": "threadsStitchLength", "value": vm.threadsStitchLength},
        //                             {"key": "material", "value": vm.threadMats[i]},
        //                             {"key": "quantityDef", "value": vm.quantityDef},
        //                             {"key": "comboDefinition", "value": vm.comboDefinition},
        //                             {"key": "materialDef", "value": vm.materialDef},
        //                             {"key": "stitches", "value": vm.stitches},
        //                             {"key": "sizeDefinition", "value": vm.sizeDefinition},
        //                             {"key": "isAllSize", "value": vm.isAllSize},
        //                             {"key": "isReferenceSize", "value": vm.isReferenceSize}];
        //                 vm.threadMats[i].consumption = enquiryDataService.getThreadLengthConsumption(params);
        //                 if (vm.materialQuantity > 0) {
        //                     vm.threadMats[i].consPerGarment = vm.threadMats[i].consumption / vm.materialQuantity;
        //                 }
        //             }
        //         }
        //     }
        // }

        function checkComboMaterialForThread() {
            if (vm.materialDef && vm.materialDef.length > 0) {
                if (!vm.threadComboMats) {
                    vm.threadComboMats = [];
                }
                for (var i = 0; i < vm.materialDef.length; i++) {
                    if (vm.materialDef[i].matType == "thread") {
                        var index = msbUtilService.getIndex(vm.threadComboMats, "materialId", vm.materialDef[i].gMatColorSizeId);
                        if (index === -1) {
                            var materialObj = {};
                            materialObj.TECHDISER_ID = msbUtilService.generateId();
                            materialObj.materialId = vm.materialDef[i].gMatColorSizeId;
                            materialObj.comboConsumption = [];
                            vm.threadComboMats.push(materialObj);
                        }
                    }
                }
                calComboWiseThreadConsumption();
            }
        }

        // function getComboConsumption() {
        //     if (vm.comboDefinition && vm.comboDefinition.length > 0) {
        //         var comboCons = [];
        //         for (var x = 0; x < vm.comboDefinition.length; x++) {
        //             if (vm.comboDefinition[x]) {
        //                 var combo = {};
        //                 combo.comboId = vm.comboDefinition[x][PRIMARY_COLUMN_NAME];
        //                 combo.perConsumption = 0;
        //                 comboCons.push(combo);
        //             }
        //         }
        //         return comboCons;
        //     }
        // }

        function calComboWiseThreadConsumption() {
            if (vm.threadComboMats && vm.threadComboMats.length > 0) {
                for (var i = 0; i < vm.threadComboMats.length; i++) {
                    if (vm.threadComboMats[i]) {
                        var params = [{ "key": "threadsStitchLength", "value": vm.threadsStitchLength },
                        { "key": "material", "value": vm.threadComboMats[i] },
                        { "key": "quantityDef", "value": vm.quantityDef },
                        { "key": "comboDefinition", "value": vm.comboDefinition },
                        { "key": "materialDef", "value": vm.materialDef },
                        { "key": "stitches", "value": vm.stitches },
                        { "key": "sizeDefinition", "value": vm.sizeDefinition },
                        { "key": "materialQuantity", "value": vm.materialQuantity },
                        { "key": "isAllSize", "value": vm.isAllSize },
                        { "key": "isReferenceSize", "value": vm.isReferenceSize },
                        { "key": "stitchLengthDef", "value": vm.stitchLengthDef }];

                        vm.threadComboMats[i].comboConsumption = enquiryDataService.getComboThreadLengthConsumption(params);
                    }
                }
                checkEtdWiseThreadConsumption();
            }
        }

        function showThreadComboConsumption() {
            if (vm.threadComboMats && vm.materialDef && vm.comboDefinition && vm.comboDefinition.length > 0) {
                var params = [{ "key": "threadComboMats", "value": vm.threadComboMats },
                { "key": "materialDef", "value": vm.materialDef },
                { "key": "quantityDef", "value": vm.quantityDef },
                { "key": "isAllSize", "value": vm.isAllSize },
                { "key": "isReferenceSize", "value": vm.isReferenceSize },
                { "key": "sizeDefinition", "value": vm.sizeDefinition },
                { "key": "comboDefinition", "value": vm.comboDefinition }];
                enquiryDataService.showThreadComboConsumption(params);
            }
        }

        function getThreadMaterialDetail(material, code) {
            if (material && code && vm.materialDef && vm.materialDef.length > 0) {
                var params = [{ "key": "material", "value": material },
                { "key": "code", "value": code },
                { "key": "materialDef", "value": vm.materialDef }];
                return enquiryDataService.getThreadMaterialDetail(params);
            }
        }

        function checkEtdWiseThreadConsumption() {
            if (vm.threadComboMats && vm.threadComboMats.length > 0) {
                if (!vm.threadEtdMats) {
                    vm.threadEtdMats = [];
                }
                for (var i = 0; i < vm.threadComboMats.length; i++) {
                    var index = msbUtilService.getIndex(vm.threadEtdMats, "materialId", vm.threadComboMats[i].materialId);
                    if (index === -1) {
                        var materialObj = {};
                        materialObj.TECHDISER_ID = msbUtilService.generateId();
                        materialObj.materialId = vm.threadComboMats[i].materialId;
                        materialObj.etdConsumption = [];
                        vm.threadEtdMats.push(materialObj);
                    }
                }
                calEtdWiseThreadConsumption();
            }
        }

        function calEtdWiseThreadConsumption() {
            if (vm.threadEtdMats && vm.threadEtdMats.length > 0) {
                for (var i = 0; i < vm.threadEtdMats.length; i++) {
                    if (vm.threadEtdMats[i]) {
                        var params = [{ "key": "threadsStitchLength", "value": vm.threadsStitchLength },
                        { "key": "material", "value": vm.threadEtdMats[i] },
                        { "key": "quantityDef", "value": vm.quantityDef },
                        { "key": "comboDefinition", "value": vm.comboDefinition },
                        { "key": "materialDef", "value": vm.materialDef },
                        { "key": "stitches", "value": vm.stitches },
                        { "key": "etds", "value": vm.etds },
                        { "key": "sizeDefinition", "value": vm.sizeDefinition },
                        { "key": "materialQuantity", "value": vm.materialQuantity },
                        { "key": "isAllSize", "value": vm.isAllSize },
                        { "key": "isReferenceSize", "value": vm.isReferenceSize },
                        { "key": "stitchLengthDef", "value": vm.stitchLengthDef }];
                        vm.threadEtdMats[i].etdConsumption = enquiryDataService.getEtdThreadLengthConsumption(params);
                    }
                }
                console.log(vm.threadEtdMats);
                checkThreadMaterialConsumption();
            }
        }

        function getThreadMaterialEtdPerCons(etdId, destinationId, threadCons) {
            if (etdId && destinationId && threadCons && threadCons.etdConsumption && threadCons.etdConsumption.length > 0) {

                var params = [{ "key": "etdId", "value": etdId },
                { "key": "destinationId", "value": destinationId },
                { "key": "threadCons", "value": threadCons }];
                return enquiryDataService.getThreadMaterialEtdPerCons(params);
            }
        }

        function getThreadMaterialEtdCons(etdId, destinationId, threadCons) {
            if (etdId && destinationId && threadCons && threadCons.etdConsumption && threadCons.etdConsumption.length > 0 &&
                vm.quantityDef && vm.quantityDef.length > 0 && vm.sizeDefinition) {

                var params = [{ "key": "etdId", "value": etdId },
                { "key": "destinationId", "value": destinationId },
                { "key": "etds", "value": vm.etds },
                { "key": "threadCons", "value": threadCons },
                { "key": "quantityDef", "value": vm.quantityDef },
                { "key": "sizeDefinition", "value": vm.sizeDefinition },
                { "key": "isReferenceSize", "value": vm.isReferenceSize },
                { "key": "isAllSize", "value": vm.isAllSize }];
                return enquiryDataService.getThreadMaterialEtdCons(params);
            }
        }

        function checkThreadMaterialConsumption() {
            if (vm.threadEtdMats && vm.threadEtdMats.length > 0) {
                if (!vm.threadMats) {
                    vm.threadMats = [];
                }
                for (var i = 0; i < vm.threadEtdMats.length; i++) {
                    var index = msbUtilService.getIndex(vm.threadMats, "materialId", vm.threadEtdMats[i].materialId);
                    if (index === -1) {
                        var materialObj = {};
                        materialObj.TECHDISER_ID = msbUtilService.generateId();
                        materialObj.materialId = vm.threadEtdMats[i].materialId;
                        materialObj.consPerGarment = getThreadPerConsumption(vm.threadEtdMats[i].materialId);
                        materialObj.consumption = vm.materialQuantity * getThreadPerConsumption(vm.threadEtdMats[i].materialId);
                        vm.threadMats.push(materialObj);
                    }
                }
                console.log(vm.threadMats);
            }
        }

        function getThreadPerConsumption(materialId) {
            if (materialId && vm.threadEtdMats && vm.threadEtdMats.length > 0) {
                var index = msbUtilService.getIndex(vm.threadEtdMats, "materialId", materialId);
                if (index > -1) {
                    var total = vm.threadEtdMats[index].etdConsumption.reduce(function (ttl, obj, ind) {
                        if (obj && obj.perConsumption * 1 > -1) {
                            return ttl + obj.perConsumption * 1;
                        } else {
                            return ttl;
                        }
                    }, 0);
                    return total;
                }
            }
        }


    }
})();
