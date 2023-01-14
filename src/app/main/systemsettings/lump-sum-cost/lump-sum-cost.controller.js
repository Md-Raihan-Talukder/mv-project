(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('LumpSumCostController', LumpSumCostController);


    /** @ngInject */
    function LumpSumCostController(msbCommonApiService, msbUtilService, $state,
        PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME, $mdDialog, lumpSumCostService,
        supplyDefinitionService, dateTimeService) {

        var vm = this;

        vm.saveLumpSumCost = saveLumpSumCost;
        vm.primaryColumnName = PRIMARY_COLUMN_NAME;
        vm.updateIsSave = updateIsSave;

        vm.selectCategory = selectCategory;
        vm.replaceSpaces = replaceSpaces;
        vm.getMaterialTitle = getMaterialTitle;
        vm.getMaterialType = getMaterialType;
        vm.getThisSpecValue = getThisSpecValue;
        vm.getCountryWiseUnitCost = getCountryWiseUnitCost;
        vm.addLumpSumCost = addLumpSumCost;
        vm.selectMaterial = selectMaterial;
        vm.deleteMaterial = deleteMaterial;
        vm.prepareNewMaterial = prepareNewMaterial;
        vm.updateMaterial = updateMaterial;


        init();

        function init() {

            getLumpSumCost();
            supplyDefinition();

            vm.categoryTreeOptions = {
                showUserBtn: false,
                showAddBtn: false,
                showRemoveBtn: false,
                maxLevel: 4
            };


            /* To get List of Cost where we have to pass materialCategoryId and typeId */
            var materialCategoryId = "SupplyDefinitionMaterialCategory1";
            var materialTypeId = "SupplyDefinitionMaterialType1";
            getListOfCostWhereCategoryAndType(materialCategoryId, materialTypeId);

        }

        function getListOfCostWhereCategoryAndType(materialCategory, materialType) {
            if (materialCategory && materialType) {

                var param = {
                    "materialCategoryId": materialCategory,
                    "materialTypeId": materialType
                };
                msbCommonApiService.interfaceManager(function (data) {
                    if (data) {
                        console.log(data);
                    }
                }, "lumpSumCostService", "getListOfCostWhereCategoryAndType", param);

            }

        }

        function supplyDefinition() {

            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    vm.supplies = data;
                }
            }, "supplyDefinitionService", "getSupplyDefinition", null);
        }


        function saveLumpSumCost(isNew) {
            var param = { "lscMaterials": vm.material, "isNew": isNew };
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                }
            }, "lumpSumCostService", "saveLumpSumCost", param);
        }

        function getLumpSumCost() {
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    vm.lscMaterials = data;

                    getShipmentCountryZoneTime();
                }

            }, "lumpSumCostService", "getLumpSumCost", null);
        }

        function getShipmentCountryZoneTime() {
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    vm.shipments = data;
                    checkAllCountryZoneExist();
                }

            }, "lumpSumCostService", "getShipmentCountryZoneTime", null);
        }

        function prepareNewMaterial() {
            vm.material = {
                'countryWiseUnitCost': prepareCountryZoneWiseUnitCost()
            }
            console.log(vm.material);
        }


        function updateIsSave() {

        }

        function selectCategory(item, event, callBack) {
            if (vm.supplies) {

                vm.callBack = callBack;
                vm.isSelectedCategory = true;
                vm.item = item;
                var index = msbUtilService.getIndex(vm.supplies, PRIMARY_COLUMN_NAME, item[PRIMARY_COLUMN_NAME]);
                vm.category = angular.copy(vm.supplies[index]);

                if (item.types) {
                    getTypesForMaterialDef(item.types);
                }
                if (item.dataSheet) {
                    getMaterialSpecSheet(item.dataSheet);
                }
                vm.material = {};

                prepareNewMaterial();

                vm.isNewLumpSumCost = true;
                vm.updateLumpSumCost = false;
            }

        }

        function updateMaterial() {

            vm.isSelectedCategory = true;
            vm.isExapndLumpSumCost = true;
        }

        function getTypesForMaterialDef(item) {
            if (item && item.length > 0) {
                // var types = [];
                // for (var i = 0; i < item.length; i++) {
                //     if (item[i]) {
                //         var typeObj = { "id": item[i].TECHDISER_ID, "text": item[i].title};
                //         types.push(typeObj);
                //     }
                // }
                // vm.materialTypes = types;
                vm.materialTypes = item;
            }
        }

        function getMaterialSpecSheet(specs) {
            if (specs) {
                vm.materialSpecs = specs;
            }

        }

        function replaceSpaces(val) {
            return msbUtilService.replaceSpaces(val);
        }

        function getMaterialTitle(materialId) {
            if (materialId && vm.supplies && vm.supplies.length > 0) {

                getMaterialSpec(materialId);

                var matIndex = msbUtilService.getIndex(vm.supplies, PRIMARY_COLUMN_NAME, materialId);
                if (matIndex > -1) {
                    return vm.supplies[matIndex].title;
                }
            }
        }

        function getMaterialType(material) {
            if (material && vm.supplies && vm.supplies.length > 0) {
                var matIndex = msbUtilService.getIndex(vm.supplies, PRIMARY_COLUMN_NAME, material.materialCategoryId);
                if (matIndex > -1) {
                    if (vm.supplies[matIndex].types && vm.supplies[matIndex].types.length > 0) {
                        var typeIndex = msbUtilService.getIndex(vm.supplies[matIndex].types, PRIMARY_COLUMN_NAME, material.materialTypeId);
                        if (typeIndex > -1) {
                            return vm.supplies[matIndex].types[typeIndex].title;
                        }
                    }
                }
            }
        }

        function getMaterialSpec(materialId) {
            if (materialId && vm.supplies && vm.supplies.length > 0) {
                var matIndex = msbUtilService.getIndex(vm.supplies, PRIMARY_COLUMN_NAME, materialId);

                if (matIndex > -1) {
                    if (vm.supplies[matIndex].dataSheet && vm.supplies[matIndex].dataSheet.length > 0) {
                        vm.specs = vm.supplies[matIndex].dataSheet;
                    }
                }
            }
        }

        function getThisSpecValue(spec, material) {
            if (material && vm.lscMaterials && vm.lscMaterials.length > 0) {
                var matIndex = msbUtilService.getIndex(vm.lscMaterials, PRIMARY_COLUMN_NAME, material.TECHDISER_ID);

                if (matIndex > -1) {
                    return vm.lscMaterials[matIndex][spec];
                }
            }
        }

        function getCountryWiseUnitCost(countryCost, material) {
            if (countryCost && material && vm.shipments && vm.shipments.length > 0) {
                var zoneIndex = msbUtilService.getIndex(vm.shipments, PRIMARY_COLUMN_NAME, countryCost.shipmentCountryId);
                if (zoneIndex > -1) {
                    return vm.shipments[zoneIndex].title;
                }
            }
        }

        function addLumpSumCost(category, material, isNewLumpSumCost) {
            if (material && material.materialTypeId && vm.lscMaterials) {

                var currentDate = dateTimeService.formatDateValue(new Date());

                if (isNewLumpSumCost && category) {
                    msbCommonApiService.getIdFromServer("LUMP_SUM_COST_SETUP", function (data) {
                        if (data) {

                            var lumpSumCostObj = {
                                "TECHDISER_ID": data.id,
                                "TECHDISER_SERIAL_NO": data.slNo,
                                "materialCategoryId": category[PRIMARY_COLUMN_NAME],
                                "materialTypeId": material.materialTypeId,
                                "lastUpdatedData": currentDate,
                                "countryWiseUnitCost": material.countryWiseUnitCost
                            }
                            if (vm.materialSpecs) {
                                for (var i = 0; i < vm.materialSpecs.length; i++) {
                                    lumpSumCostObj[vm.materialSpecs[i]] = material[vm.materialSpecs[i]];
                                }
                            }
                            vm.lscMaterials.push(lumpSumCostObj);
                            selectMaterial(lumpSumCostObj);
                            saveLumpSumCost(isNewLumpSumCost);
                            // vm.material = lumpSumCostObj;

                        }
                    }, "clientUrl");
                } else {
                    material.lastUpdatedData = currentDate;
                    var lscMatIndex = msbUtilService.getIndex(vm.lscMaterials, PRIMARY_COLUMN_NAME, material.TECHDISER_ID);
                    if (lscMatIndex > -1) {
                        vm.lscMaterials[lscMatIndex] = material;
                        selectMaterial(material);
                        saveLumpSumCost(isNewLumpSumCost);
                        prepareNewMaterial();

                    }
                }
                vm.isNewLumpSumCost = true;
                vm.updateLumpSumCost = false;

            }
        }

        function prepareCountryZoneWiseUnitCost() {
            if (vm.shipments && vm.shipments.length > 0) {
                var zoneUnitCosts = [];
                for (var i = 0; i < vm.shipments.length; i++) {
                    var zoneUnitCost = {
                        "TECHDISER_ID": msbUtilService.generateId(),
                        "shipmentCountryId": vm.shipments[i][PRIMARY_COLUMN_NAME],
                        "unitCost": 0
                    }
                    zoneUnitCosts.push(zoneUnitCost);
                }
                return zoneUnitCosts;
            }
        }

        function checkAllCountryZoneExist() {
            if (vm.lscMaterials && vm.lscMaterials.length > 0 && vm.shipments && vm.shipments.length > 0) {
                for (var i = 0; i < vm.lscMaterials.length; i++) {
                    if (vm.lscMaterials[i].countryWiseUnitCost) {
                        for (var j = 0; j < vm.shipments.length; j++) {
                            var zoneIndex = msbUtilService.getIndex(vm.lscMaterials[i].countryWiseUnitCost, "shipmentCountryId", vm.shipments[j][PRIMARY_COLUMN_NAME]);
                            if (zoneIndex === -1) {
                                var zoneUnitCost = {
                                    "TECHDISER_ID": msbUtilService.generateId(),
                                    "shipmentCountryId": vm.shipments[j][PRIMARY_COLUMN_NAME],
                                    "unitCost": 0
                                }
                                vm.lscMaterials[i].countryWiseUnitCost.push(zoneUnitCost);
                            }
                        }
                    }
                }
            }
        }

        function selectMaterial(material) {
            if (material) {
                vm.isNewLumpSumCost = false;
                vm.updateLumpSumCost = true;
                vm.material = angular.copy(material);
                vm.selectedMaterial = material;

                getMaterialSpecData(material);
                getMaterialTypes(material);

            }
        }

        function getMaterialSpecData(material) {
            if (material.materialCategoryId && vm.supplies && vm.supplies.length > 0) {
                var matIndex = msbUtilService.getIndex(vm.supplies, PRIMARY_COLUMN_NAME, material.materialCategoryId);
                if (matIndex > -1) {
                    if (vm.supplies[matIndex].dataSheet) {
                        vm.materialSpecs = vm.supplies[matIndex].dataSheet;
                    }
                }
            }
        }

        function getMaterialTypes(material) {
            if (material.materialCategoryId && vm.supplies && vm.supplies.length > 0) {
                var matIndex = msbUtilService.getIndex(vm.supplies, PRIMARY_COLUMN_NAME, material.materialCategoryId);
                if (matIndex > -1) {
                    if (vm.supplies[matIndex].types) {
                        vm.materialTypes = vm.supplies[matIndex].types
                        // getTypesForMaterialDef(vm.supplies[matIndex].types);
                    }
                }
            }
        }

        function deleteMaterial(material, lscMaterials) {
            if (material && vm.shipments && vm.shipments.length > 0) {
                var matIndex = msbUtilService.getIndex(lscMaterials, PRIMARY_COLUMN_NAME, material.TECHDISER_ID);
                if (matIndex > -1) {
                    lscMaterials.splice(matIndex, 1);
                }
                vm.material = {};
                vm.isNewLumpSumCost = true;
                vm.updateLumpSumCost = false;
            }
        }



    }
})();
