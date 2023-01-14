(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('PackingTypeController', PackingTypeController);

    /** @ngInject */
    function PackingTypeController(PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME, DIMENSION_TYPE,
        MEASUREMENT_UNITS, $mdDialog, msbCommonApiService, msbUtilService, msbMeasurementService) {

        debugger

        var vm = this;
        vm.dimensionTypes = DIMENSION_TYPE;
        vm.measUnits = MEASUREMENT_UNITS;
        vm.selectMaterialCategoryDialog = selectMaterialCategoryDialog;
        vm.getMaterialTitle = getMaterialTitle;
        vm.getMaterialTypeTitle = getMaterialTypeTitle;
        vm.savePackingType = savePackingType;
        vm.getSqQu = getSqQu;
        vm.getCategoryTitle = getCategoryTitle;
        vm.getDimensionTitle = getDimensionTitle;
        vm.getUnitTitle = getUnitTitle;
        vm.getCategorySizeInfo = getCategorySizeInfo;
        vm.initSelecctedItems = initSelecctedItems;
        vm.loadSizeCards = loadSizeCards;
        vm.getCategoryUnit = getCategoryUnit;
        vm.updateDefaultStatus = updateDefaultStatus;
        vm.showSizeInfo = showSizeInfo;

        init();

        function init() {

            getMaterialCateries();

        }

        function getMaterialCateries() {
            msbCommonApiService.interfaceManager(function (data) {
                vm.allMaterialCategories = data;
                getPackingMaterial();
                getCateriesByType();
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

        function getCateriesByType() {
            var param = { "typeId": "packingMaterialsGroup" };
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    vm.matTypes = data[0];
                }
                getSupplyDefinition();
            }, "supplyDefinitionService", "getAllCategoriesByType", param);
        }

        function getSupplyDefinition() {
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    vm.supplies = data;
                }
                getPackingMaterials();
            }, "supplyDefinitionService", "getSupplyDefinition", null);
        }

        function getPackingMaterials() {
            msbCommonApiService.interfaceManager(function (data) {
                vm.packingMaterials = data;
                getPackingConsInfo();
            }, "supplyDefinitionService", "getPackagingMaterials", null);

        }

        function getPackingConsInfo() {
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    vm.consInfo = data;
                } else {
                    vm.consInfo = [];
                }
                getPackingType();
            }, "packingTypeService", "getPackingConsInfo", null);
        }

        function getPackingType() {
            msbCommonApiService.interfaceManager(function (data) {
                vm.materialTypes = data;
                generatePackingType();
            }, "packingTypeService", "getPackingType", null);
        }

        function showSizeInfo(sizeItem, infoType) {
            if (sizeItem) {
                sizeItem.infoType = infoType;
            }
        }


        function updateDefaultStatus(sizeItem) {

            if (sizeItem && sizeItem.containerSizeInfo && vm.consCards) {

                var selectedIndex = msbUtilService.getIndex(vm.consCards, "containerSizeInfo", sizeItem.containerSizeInfo);

                vm.consCards.forEach(function (item, itemIndex) {
                    if (selectedIndex == itemIndex) {
                        item.isDefault = (sizeItem.setAsDefault) ? 1 : 0;
                        item.setAsDefault = sizeItem.setAsDefault;
                    } else {
                        item.isDefault = (sizeItem.setAsDefault) ? 0 : 1;
                        item.setAsDefault = !sizeItem.setAsDefault;
                    }
                });

                msbMeasurementService.setCategoryDefaultSize(vm.consCards);

            }

        }

        function getCategorySizeInfo(packageItem, materialItem, selectedPackingSupply, consInfo, supplies) {

            var supplySizeInfo = msbMeasurementService.getCategorySizeInfo(packageItem, materialItem, selectedPackingSupply, consInfo, supplies);

            vm.defNotFound = (supplySizeInfo && supplySizeInfo.defNotFound) ? supplySizeInfo.defNotFound : "";

            vm.obsoleteSizes = (supplySizeInfo && supplySizeInfo.obsoleteSizes) ? supplySizeInfo.obsoleteSizes : [];

            var sizeDef = (supplySizeInfo && supplySizeInfo.sizeInfo) ? supplySizeInfo.sizeInfo : [];

            return sizeDef;

        }

        function generatePackingType() {
            for (var i = 0; i < vm.supplies.length; i++) {
                if (vm.supplies[i].typeId == "packContainer") {
                    var index = msbUtilService.getIndex(vm.materialTypes, "categoryId", vm.supplies[i][PRIMARY_COLUMN_NAME]);
                    if (index < 0) {
                        var object = {
                            "categoryId": vm.supplies[i][PRIMARY_COLUMN_NAME],
                            "materials": []
                        };
                        object[PRIMARY_COLUMN_NAME] = msbUtilService.generateId();
                        vm.materialTypes.push(object);
                    }
                }
            }
            if (vm.materialTypes && vm.materialTypes.length > 0) {
                initSelecctedItems(vm.materialTypes[0]);
            }
        }

        function loadSizeCards(material) {
            vm.selectedMaterial = material;
            if (vm.selectedMaterial && vm.selectedMaterial.materialId) {
                var selectedPackingSupplyIndex = msbUtilService.getIndex(vm.packingMaterials, "TECHDISER_ID", vm.selectedMaterial.materialId);
                var selectedPackingSupply = (selectedPackingSupplyIndex > 0) ? vm.packingMaterials[selectedPackingSupplyIndex] : null;
                vm.consCards = getCategorySizeInfo(vm.selectedPackage, vm.selectedMaterial, selectedPackingSupply, vm.consInfo, vm.supplies);
            } else {
                vm.consCards = [];
            }
        }

        function initSelecctedItems(materialType) {
            vm.selectedPackage = materialType;
            vm.selectedMaterial = (vm.selectedPackage.materials && vm.selectedPackage.materials.length > 0) ? vm.selectedPackage.materials[0] : null;
            if (vm.selectedMaterial && vm.selectedMaterial.materialId) {
                var selectedPackingSupplyIndex = msbUtilService.getIndex(vm.packingMaterials, "TECHDISER_ID", vm.selectedMaterial.materialId);
                var selectedPackingSupply = (selectedPackingSupplyIndex > 0) ? vm.packingMaterials[selectedPackingSupplyIndex] : null;
                vm.consCards = getCategorySizeInfo(vm.selectedPackage, vm.selectedMaterial, selectedPackingSupply, vm.consInfo, vm.supplies);
            } else {
                vm.consCards = [];
            }
        }


        function selectMaterialCategoryDialog(materialType) {

            var param = { "typeKey": 'packingMaterials', "isPosition": false, "selectedCategories": [] };

            msbCommonApiService.interfaceManager(function (answer) {
                if (answer) {
                    // console.log(answer);
                    if (answer && answer.length > 0) {
                        for (var i = 0; i < answer.length; i++) {
                            var material = {
                                "TECHDISER_ID": msbUtilService.generateId(),
                                "materialId": answer[i],
                                "consumptionValue": 0
                            };
                            materialType.materials.push(material);

                        }
                    }
                }
            }, "styleDataService", "selectStyleCategoryWiseMaterials", param);
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

        function getSqQu(materialId) {
            var index = msbUtilService.getIndex(vm.supplies, PRIMARY_COLUMN_NAME, materialId);
            if (index > -1) {
                var dimensionId = vm.supplies[index].dimensionId;
                if (dimensionId == 'area') {
                    return "square";
                } else if (dimensionId == "volume") {
                    return "cubic";
                }
            }
        }

        function getCategoryUnit(categoryId) {
            if (vm.supplies) {
                var index = msbUtilService.getIndex(vm.supplies, PRIMARY_COLUMN_NAME, categoryId);
                if (index > -1) {
                    return vm.supplies[index].measurementUnitId;
                }
            }
        }

        function getCategoryTitle(categoryId) {
            if (vm.supplies) {
                var index = msbUtilService.getIndex(vm.supplies, PRIMARY_COLUMN_NAME, categoryId);
                if (index > -1) {
                    return vm.supplies[index].title;
                }
            }
        }

        function getDimensionTitle(categoryId) {
            var index = msbUtilService.getIndex(vm.supplies, PRIMARY_COLUMN_NAME, categoryId);
            if (index > -1) {
                var dimensionIndex = msbUtilService.getIndex(vm.dimensionTypes, "key", vm.supplies[index].dimensionId);
                return vm.dimensionTypes[dimensionIndex].value;
            }
        }

        function getUnitTitle(categoryId) {
            var index = msbUtilService.getIndex(vm.supplies, PRIMARY_COLUMN_NAME, categoryId);
            if (index > -1) {
                var measureIndex = msbUtilService.getIndex(vm.measUnits, "key", vm.supplies[index].measurementUnitId);
                return vm.measUnits[measureIndex].value;
            }
        }

        function getSizes(item) {
            var sizes = [];
            if (item.sizeInfo) {
                item.sizeInfo.forEach(function (size) {
                    var takenSize = null;
                    if (size && size.matQty && size.forContainers) {
                        takenSize = size;
                    } else if (size.existingInfo && size.existingInfo.matQty && size.existingInfo.forContainers) {
                        takenSize = size.existingInfo
                    }
                    if (takenSize) {
                        takenSize.TECHDISER_ID = size.TECHDISER_ID;
                        delete takenSize["existingInfo"];
                        delete takenSize["infoType"];
                        delete takenSize["setAsDefault"];
                        sizes.push(takenSize);
                    }
                });
            }
            return sizes;
        }

        function handleConsInfo() {
            var consInfo = [];
            vm.consInfo.forEach(function (item) {
                if (item) {
                    var info = angular.copy(item);
                    info.sizeInfo = getSizes(item);
                    consInfo.push(info);
                }
            });
            return consInfo;
        }

        function savePackingType() {
            var consInfo = handleConsInfo();
            var param = {
                "materialTypes": vm.materialTypes,
                "costInfo": consInfo
            }
            msbCommonApiService.interfaceManager(function (data) {

            }, "packingTypeService", "savePackingType", param);
        }

    }
})();
