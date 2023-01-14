(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('FoldingTypeController', FoldingTypeController);

    /** @ngInject */
    function FoldingTypeController(PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME, msbCommonApiService,
        $mdDialog, msbUtilService) {
        var vm = this;
        vm.selectMaterialCategoryDialog = selectMaterialCategoryDialog;
        vm.getMaterialTitle = getMaterialTitle;
        vm.getMaterialTypeTitle = getMaterialTypeTitle;
        vm.saveFoldingType = saveFoldingType;

        init();

        function init() {
            getFoldingType();
            getMaterialCateries();
            getCateriesByType();
        }

        function getCateriesByType() {
            var param = {
                "typeId": "foldingMaterialsGroup"
            };
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    vm.matTypes = data[0];
                }
            }, "supplyDefinitionService", "getAllCategoriesByType", param);
        }

        function saveFoldingType() {
            var param = {
                "materialTypes": vm.materialTypes
            }
            msbCommonApiService.interfaceManager(function (data) {

            }, "foldingTypeService", "saveFoldingType", param);
        }

        function getFoldingType() {
            msbCommonApiService.interfaceManager(function (data) {
                vm.materialTypes = data;
            }, "foldingTypeService", "getFoldingType", null);
        }

        function getMaterialCateries() {
            msbCommonApiService.interfaceManager(function (data) {
                vm.allMaterialCategories = data;
                getPackingMaterial();
            }, "supplyDefinitionService", "getLeafNodesOfAllSupplyCategoryForContext", null);
        }

        function getPackingMaterial() {
            if (vm.allMaterialCategories) {
                var index = msbUtilService.getIndex(vm.allMaterialCategories, "typeId", "packingMaterialsGroup");
                if (index > -1) {
                    vm.packingMaterial = vm.allMaterialCategories[index];
                }
            }
        }

        function selectMaterialCategoryDialog(materialType) {
            var materialIds = getMaterialIds(materialType.materials);
            var param = {
                "typeKey": 'foldingMaterials',
                "isPosition": false,
                "selectedCategories": materialIds
            };

            msbCommonApiService.interfaceManager(function (answer) {
                if (answer) {
                    console.log(answer);
                    if (answer && answer.length > 0) {
                        materialType.materials.splice(0, materialType.materials.length);
                        for (var i = 0; i < answer.length; i++) {
                            var material = {
                                "materialId": answer[i],
                                "consumptionValue": 0
                            };
                            material[PRIMARY_COLUMN_NAME] = msbUtilService.generateId();
                            materialType.materials.push(material);
                        }
                    }
                }
            }, "styleDataService", "selectStyleCategoryWiseMaterials", param);
        }

        function getMaterialIds(materials) {
            var materialIds = [];
            for (var i = 0; i < materials.length; i++) {
                materialIds.push(materials[i].materialId);
            }
            return materialIds;
        }

        function getMaterialTitle(materialId) {
            if (vm.allMaterialCategories) {
                var index = msbUtilService.getIndex(vm.allMaterialCategories, PRIMARY_COLUMN_NAME, materialId);
                if (index > -1) {
                    return vm.allMaterialCategories[index].title;
                }
            }

        }

        function getMaterialTypeTitle(typeId) {
            if (vm.matTypes) {
                var index = msbUtilService.getIndex(vm.matTypes.types, PRIMARY_COLUMN_NAME, typeId);
                if (index > -1) {
                    return vm.matTypes.types[index].title;
                }
            }

        }


        function updateQty(item) {
            console.log(item);
        }
    }
})();
