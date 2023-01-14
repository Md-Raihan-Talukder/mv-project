(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('consumptionDataService', consumptionDataService);

    /** @ngInject */
    function consumptionDataService($mdDialog, msbUtilService, msbCommonApiService,
        PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME) {


        var services = {
            interfaceDef: interfaceDef,
            calculateCountable: calculateCountable,
            getCuttingMaterialDetail: getCuttingMaterialDetail,
            getMaterialMeasurementUnit: getMaterialMeasurementUnit,
            getMaterialFabricContainerTitle: getMaterialFabricContainerTitle,
            getFabricContainerCapacityUnitTitle: getFabricContainerCapacityUnitTitle,
            getCountableMaterialCategoryTitle: getCountableMaterialCategoryTitle,
            getCountableMaterialDetail: getCountableMaterialDetail,
            getMaterialTrimsContainerTitle: getMaterialTrimsContainerTitle,
            getTrimsContainerCapacityUnitTitle: getTrimsContainerCapacityUnitTitle,
            getThreadMaterialCategoryTitle: getThreadMaterialCategoryTitle,
            getMaterialDetail: getMaterialDetail,
            getMaterialThreadContainerTitle: getMaterialThreadContainerTitle,
            getThreadContainerCapacityUnitTitle: getThreadContainerCapacityUnitTitle,
            getEnquiryQuantityRatio: getEnquiryQuantityRatio,
            checkMaterialForCuttableSummary: checkMaterialForCuttableSummary,
            getFabricMaterialContainers: getFabricMaterialContainers,
            getContainerTitle: getContainerTitle,
            getFabricContainersMeasurementUnits: getFabricContainersMeasurementUnits,
            getNumOfFabricContainersforConsumption: getNumOfFabricContainersforConsumption,
            getMaterialPOMCons: getMaterialPOMCons,
            getMaterialQMCons: getMaterialQMCons,
            getPomConsumption: getPomConsumption,
            getQuickMarkerConsumption: getQuickMarkerConsumption,
            selectConsumptionForCosting: selectConsumptionForCosting,
            getMaterialWastageforCuttable: getMaterialWastageforCuttable,
            getMaterialWastageforCountable: getMaterialWastageforCountable,
            getMaterialWastageforThread: getMaterialWastageforThread,
            checkMaterialForCountableSummary: checkMaterialForCountableSummary,
            getCountableMaterialContainers: getCountableMaterialContainers,
            getNumOfCountableContainersforConsumption: getNumOfCountableContainersforConsumption,
            getMaterialCountCons: getMaterialCountCons,
            getTotalCountConsumption: getTotalCountConsumption,
            getMeasurementUnitTitle: getMeasurementUnitTitle,
            getThraedMaterialContainers: getThraedMaterialContainers,
            getNumOfThreadContainersforConsumption: getNumOfThreadContainersforConsumption,
            checkMaterialForThread: checkMaterialForThread,
            getTotalThreadConsumption: getTotalThreadConsumption,
            selectFabricPolicy: selectFabricPolicy,
            getThreadCons: getThreadCons,
            getMaterialPanelCons: getMaterialPanelCons,
            getPanelConsumption: getPanelConsumption,
            getComboMaterialDetail: getComboMaterialDetail,
            getCountableMaterialConsumption: getCountableMaterialConsumption,
            getMaterialPOMAreaCons: getMaterialPOMAreaCons,
            getMaterialQMAreaCons: getMaterialQMAreaCons,
            getMaterialPanelAreaCons: getMaterialPanelAreaCons,
            isClothOrYarn: isClothOrYarn,
            calculateEtdCountable: calculateEtdCountable,
            checkMaterialTypeId: checkMaterialTypeId,
            checkComboMaterialTypeId: checkComboMaterialTypeId,
            getCuttableComboMaterialDetail: getCuttableComboMaterialDetail,
            getTotalFoldingMaterialConsumption: getTotalFoldingMaterialConsumption,
            getFoldingMaterialContainers: getFoldingMaterialContainers,
            getNumOfFoldingContainersforConsumption: getNumOfFoldingContainersforConsumption,
            getTotalPackingMaterialConsumption: getTotalPackingMaterialConsumption,
            getPackingMaterialContainers: getPackingMaterialContainers,
            getNumOfPackingMatContainersforConsumption: getNumOfPackingMatContainersforConsumption,
            getPackingContainers: getPackingContainers,
            getNumOfPackingContainersforConsumption: getNumOfPackingContainersforConsumption,
            getFoldingMaterialDetail: getFoldingMaterialDetail,
            getPackingMaterialDetail: getPackingMaterialDetail,
            getPackingContainerDetail: getPackingContainerDetail,
            getPackingContainerTitle: getPackingContainerTitle,
            getFoldingContainersCapacityUnitTitle: getFoldingContainersCapacityUnitTitle,
            getPackingMaterialContainerTitle: getPackingMaterialContainerTitle,
            getPackingMaterialContainersCapacityUnitTitle: getPackingMaterialContainersCapacityUnitTitle,
            getFoldingMaterialContainerTitle: getFoldingMaterialContainerTitle,
            getFoldingMaterialContainersCapacityUnitTitle: getFoldingMaterialContainersCapacityUnitTitle,
            getMaterialMarkerPlanAreaCons: getMaterialMarkerPlanAreaCons,
            getMaterialMarkerPlanCons: getMaterialMarkerPlanCons,
            getMarkerPlanConsumption: getMarkerPlanConsumption,

        };

        function interfaceDef(callBack, taskCode, param) {
            var functions = {

            }
            if (taskCode) {
                functions[taskCode](callBack, param);
            }
        }

        // services for calculate countable consumption
        function calculateCountable(callBack, param) {

            var styleQuantityRatio = param.styleQuantityRatio;
            var sizeDefinition = param.sizeDefinition;
            var countableComboMats = param.countableComboMats;
            var materialDef = param.materialDef;
            var materialQuantity = param.materialQuantity;
            var allMaterials = param.allMaterials;
            var trimsItemQnty = param.trimsItemQnty;

            msbCommonApiService.interfaceManager(function (categoryData) {

                if (categoryData) {
                    var category = categoryData;
                    checkComboMaterialForCountable();
                    createSizeRefForCountable();

                    calculateSizeRarioConsumption();

                    countableData();

                }

            }, "styleDataService", "getMaterialCategoriesLeaf", null);


            function checkComboMaterialForCountable() {
                if (materialDef && materialDef.length > 0) {
                    for (var i = 0; i < materialDef.length; i++) {
                        if (materialDef[i].matType == "countable") {
                            var index = msbUtilService.getIndex(countableComboMats, "materialId", materialDef[i].gMatColorSizeComboId);
                            if (index === -1) {
                                var materialObj = {
                                    "TECHDISER_ID": msbUtilService.generateId(),
                                    "materialId": materialDef[i].gMatColorSizeComboId,
                                    "comboId": materialDef[i].comboId,
                                    "consPerGarment": 0,
                                    "consumption": 0,
                                    "refSizes": []
                                }
                                countableComboMats.push(materialObj);
                            }
                        }
                    }
                }
            }

            function createSizeRefForCountable() {
                if (countableComboMats && countableComboMats.length > 0 && sizeDefinition && sizeDefinition.length > 0) {

                    for (var m = 0; m < countableComboMats.length; m++) {
                        var matIndex = msbUtilService.getIndex(materialDef, "gMatColorSizeComboId", countableComboMats[m].materialId);
                        if (matIndex > -1) {
                            var materialTechId = materialDef[matIndex].materialId;
                        }
                        for (var i = 0; i < sizeDefinition.length; i++) {
                            for (var j = 0; j < sizeDefinition[i].sizes.length; j++) {
                                var params = [
                                    { "key": "zoneId", "value": sizeDefinition[i].TECHDISER_ID },
                                    { "key": "sizeId", "value": sizeDefinition[i].sizes[j].TECHDISER_ID }
                                ];
                                var material = countableComboMats[m];

                                var index = msbUtilService.getIndexByValues(material.refSizes, params);
                                if (index === -1) {
                                    var qtyParams = [{ "key": "materialId", "value": materialTechId },
                                    { "key": "comboId", "value": material.comboId },
                                    { "key": "sizeId", "value": sizeDefinition[i].sizes[j].TECHDISER_ID },
                                    { "key": "trimsItemQnty", "value": trimsItemQnty }];

                                    var sizeObj = {
                                        "TECHDISER_ID": msbUtilService.generateId(),
                                        "zoneId": sizeDefinition[i].TECHDISER_ID,
                                        "sizeId": sizeDefinition[i].sizes[j].TECHDISER_ID,
                                        "quantity": getTrimsComboSizeQty(qtyParams),
                                        "sizeConsumption": 0
                                    }
                                    if (!material.refSizes) {
                                        material.refSizes = [];
                                    }
                                    material.refSizes.push(sizeObj);
                                }

                            }
                        }
                    }
                }
            }

            function calculateSizeRarioConsumption() {
                if (sizeDefinition && sizeDefinition.length > 0 && countableComboMats && countableComboMats.length > 0) {
                    for (var m = 0; m < countableComboMats.length; m++) {
                        if (countableComboMats[m] && countableComboMats[m].refSizes && countableComboMats[m].refSizes.length > 0) {

                            for (var i = 0; i < sizeDefinition.length; i++) {
                                if (sizeDefinition[i].sizes && sizeDefinition[i].sizes.length > 0) {
                                    for (var j = 0; j < sizeDefinition[i].sizes.length; j++) {
                                        getSizeRatioConsumption(sizeDefinition[i].sizes[j], sizeDefinition[i], countableComboMats[m].refSizes);
                                    }
                                }
                            }
                            getConsumptionCountable(countableComboMats[m]);
                            getPerConsumptionCountable(countableComboMats[m]);
                        }

                    }
                }
            }

            function getSizeRatioConsumption(size, zone, referenceSizes) {
                var sizeConsumption = 0;

                var qtyRatioSum = 0;

                if (styleQuantityRatio && styleQuantityRatio.length > 0) {
                    for (var i = 0; i < styleQuantityRatio.length; i++) {
                        qtyRatioSum += styleQuantityRatio[i].quantity;
                    }
                }

                var refIndex = msbUtilService.getIndexByValues(referenceSizes,
                    [{ "key": "zoneId", "value": zone.TECHDISER_ID },
                    { "key": "sizeId", "value": size.TECHDISER_ID }]);

                var ratioIndex = msbUtilService.getIndexByValues(styleQuantityRatio,
                    [{ "key": "zoneId", "value": zone.TECHDISER_ID },
                    { "key": "sizeId", "value": size.TECHDISER_ID }]);

                if (refIndex > -1 && ratioIndex > -1) {

                    if (referenceSizes[refIndex] && styleQuantityRatio[ratioIndex] && qtyRatioSum && materialQuantity) {
                        var garmentQty = Math.ceil((styleQuantityRatio[ratioIndex].quantity / qtyRatioSum) * materialQuantity);
                        referenceSizes[refIndex].sizeConsumption = Math.ceil(garmentQty * referenceSizes[refIndex].quantity);
                    }

                    return referenceSizes[refIndex].sizeConsumption;

                }

            }


            function getConsumptionCountable(material) {

                var consumptionCount = 0;
                if (material && material.refSizes && material.refSizes.length > 0) {
                    for (var i = 0; i < material.refSizes.length; i++) {
                        consumptionCount += material.refSizes[i].sizeConsumption;
                    }
                    material.consumption = consumptionCount;

                    return material.consumption;
                }

            }

            function getPerConsumptionCountable(material) {

                if (material && materialQuantity) {
                    var calCons = getConsumptionCountable(material);
                    var consUnit = calCons / materialQuantity;
                    material.consPerGarment = consUnit;
                    return material.consPerGarment;
                }

            }

            function countableData() {
                var materialData = [];
                if (countableComboMats && countableComboMats.length > 0) {
                    for (var i = 0; i < countableComboMats.length; i++) {
                        var index = msbUtilService.getIndex(materialData, "materialId", countableComboMats[i].materialId);
                        if (index === -1) {
                            materialData.push(countableComboMats[i]);
                        }
                    }
                }
                callBack(materialData);
            }


        }

        function getCuttingMaterialDetail(param) {

            if (!param.enqConsMaterialDef) {
                return;
            }

            var index = msbUtilService.getIndex(param.enqConsMaterialDef, "gMatColorId", param.material.materialId);

            if (index > -1) {
                if (param.code == 'title') {
                    return param.enqConsMaterialDef[index].materialTitle;
                } else if (param.code == 'description') {
                    return param.enqConsMaterialDef[index].materialDescription;
                } else if (param.code == 'color') {
                    return param.enqConsMaterialDef[index].color;
                } else if (param.code == 'combo') {
                    return param.enqConsMaterialDef[index].comboTitle;
                } else if (param.code == 'width') {
                    return param.enqConsMaterialDef[index].materialWidth * 1;
                }
            } else {
                return;
            }

        }

        function getMaterialMeasurementUnit(param) {
            if (param.material && param.material.measurementUnitId && param.measurementUnits && param.measurementUnits.length > 0) {
                var unitIndex = msbUtilService.getIndex(param.measurementUnits, PRIMARY_COLUMN_NAME, param.material.measurementUnitId);
                if (unitIndex > -1) {
                    return param.measurementUnits[unitIndex].title;
                }
            }
        }

        function getMaterialFabricContainerTitle(param) {
            if (param.material && param.allMaterials && param.allMaterials.length > 0 && param.category &&
                param.category.length > 0 && param.enqConsMaterialDef && param.enqConsMaterialDef.length > 0 &&
                param.containers && param.containers.length > 0) {

                var enqMatIndex = msbUtilService.getIndex(param.enqConsMaterialDef, "gMatColorId", param.material.materialId);
                if (enqMatIndex > -1) {
                    var matIndex = msbUtilService.getIndex(param.allMaterials, PRIMARY_COLUMN_NAME, param.enqConsMaterialDef[enqMatIndex].materialId);
                    if (matIndex > -1) {
                        if (param.allMaterials[matIndex].categoryId) {
                            var catIndex = msbUtilService.getIndex(param.category, PRIMARY_COLUMN_NAME, param.allMaterials[matIndex].categoryId);
                            if (catIndex > -1) {
                                if (param.category[catIndex].containers && param.category[catIndex].containers.length > 0) {
                                    var containerIndex = msbUtilService.getIndex(param.category[catIndex].containers, PRIMARY_COLUMN_NAME, param.material.containerId);
                                    if (containerIndex > -1) {
                                        if (param.category[catIndex].containers[containerIndex].containerId) {
                                            var containerIndex = msbUtilService.getIndex(param.containers, PRIMARY_COLUMN_NAME, param.category[catIndex].containers[containerIndex].containerId);
                                            if (containerIndex > -1) {
                                                return param.containers[containerIndex].title;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        function getFabricContainerCapacityUnitTitle(param) {
            if (param.material && param.allMaterials && param.allMaterials.length > 0 && param.category && param.category.length > 0 &&
                param.enqConsMaterialDef && param.enqConsMaterialDef.length > 0) {
                var enqMatIndex = msbUtilService.getIndex(param.enqConsMaterialDef, "gMatColorId", param.material.materialId);
                if (enqMatIndex > -1) {
                    var matIndex = msbUtilService.getIndex(param.allMaterials, PRIMARY_COLUMN_NAME, param.enqConsMaterialDef[enqMatIndex].materialId);
                    if (matIndex > -1) {
                        if (param.allMaterials[matIndex].categoryId) {
                            var catIndex = msbUtilService.getIndex(param.category, PRIMARY_COLUMN_NAME, param.allMaterials[matIndex].categoryId);
                            if (catIndex > -1) {
                                if (param.category[catIndex].containers && param.category[catIndex].containers.length > 0) {
                                    var containerIndex = msbUtilService.getIndex(param.category[catIndex].containers, PRIMARY_COLUMN_NAME, param.material.containerId);
                                    if (containerIndex > -1) {
                                        if (param.category[catIndex].containers[containerIndex].sizes && param.category[catIndex].containers[containerIndex].sizes.length > 0) {
                                            var unitSizeIndex = msbUtilService.getIndex(param.category[catIndex].containers[containerIndex].sizes, PRIMARY_COLUMN_NAME, param.material.sizeUnitId);
                                            if (unitSizeIndex > -1) {
                                                return param.category[catIndex].containers[containerIndex].sizes[unitSizeIndex].capacity + " " + getMeasurementUnitTitle(param.category[catIndex].containers[containerIndex].sizes[unitSizeIndex].measurementUnitId, param.measUnits);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        function getMeasurementUnitTitle(measurementUnitId, measUnits) {
            if (measurementUnitId && measUnits && measUnits.length > 0) {
                var mUnitIndex = msbUtilService.getIndex(measUnits, "key", measurementUnitId);
                if (mUnitIndex > -1) {
                    return measUnits[mUnitIndex].value;
                }
            }
        }

        function getCountableMaterialCategoryTitle(param) {
            if (param.summaryCountableMaterials && param.summaryCountableMaterials.length > 0 &&
                param.enqConsMaterialDef && param.enqConsMaterialDef.length > 0) {
                for (var i = 0; i < param.summaryCountableMaterials.length; i++) {
                    var enqMatIndex = msbUtilService.getIndex(param.enqConsMaterialDef, "gMatColorSizeId", param.summaryCountableMaterials[i].materialId);
                    if (enqMatIndex > -1) {
                        if (param.summaryCountableMaterials[i] && param.allMaterials && param.allMaterials.length > 0) {
                            var matIndex = msbUtilService.getIndex(param.allMaterials, PRIMARY_COLUMN_NAME, param.enqConsMaterialDef[enqMatIndex].materialId);
                            if (matIndex > -1) {
                                if (param.allMaterials[matIndex] && param.supplies && param.supplies.length > 0) {
                                    var catIndex = msbUtilService.getIndex(param.supplies, PRIMARY_COLUMN_NAME, param.allMaterials[matIndex].categoryId);
                                    if (catIndex > -1) {
                                        var parentIndex = msbUtilService.getIndex(param.supplies, PRIMARY_COLUMN_NAME, param.supplies[catIndex].parentId);
                                        if (parentIndex > -1) {
                                            return param.supplies[parentIndex].title;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        function getCountableMaterialDetail(param) {

            if (!param.enqConsMaterialDef) {
                return;
            }

            var index = msbUtilService.getIndex(param.enqConsMaterialDef, "gMatColorSizeId", param.material.materialId);

            if (index > -1) {
                if (param.code == 'title') {
                    return param.enqConsMaterialDef[index].materialTitle;
                } else if (param.code == 'description') {
                    return param.enqConsMaterialDef[index].materialDescription;
                } else if (param.code == 'color') {
                    return param.enqConsMaterialDef[index].color;
                } else if (param.code == 'combo') {
                    return param.enqConsMaterialDef[index].comboTitle;
                } else if (param.code == 'size') {
                    return param.enqConsMaterialDef[index].size;
                }
            } else {
                return;
            }

        }

        function getMaterialTrimsContainerTitle(param) {
            if (param.material && param.allMaterials && param.allMaterials.length > 0 && param.category &&
                param.category.length > 0 && param.enqConsMaterialDef && param.enqConsMaterialDef.length > 0 &&
                param.containers && param.containers.length > 0) {

                var enqMatIndex = msbUtilService.getIndex(param.enqConsMaterialDef, "gMatColorSizeId", param.material.materialId);
                if (enqMatIndex > -1) {
                    var matIndex = msbUtilService.getIndex(param.allMaterials, PRIMARY_COLUMN_NAME, param.enqConsMaterialDef[enqMatIndex].materialId);
                    if (matIndex > -1) {
                        if (param.allMaterials[matIndex].categoryId) {
                            var catIndex = msbUtilService.getIndex(param.category, PRIMARY_COLUMN_NAME, param.allMaterials[matIndex].categoryId);
                            if (catIndex > -1) {
                                if (param.category[catIndex].containers && param.category[catIndex].containers.length > 0) {
                                    var containerIndex = msbUtilService.getIndex(param.category[catIndex].containers, PRIMARY_COLUMN_NAME, param.material.containerId);
                                    if (containerIndex > -1) {
                                        if (param.category[catIndex].containers[containerIndex].containerId) {
                                            var containerIndex = msbUtilService.getIndex(param.containers, PRIMARY_COLUMN_NAME, param.category[catIndex].containers[containerIndex].containerId);
                                            if (containerIndex > -1) {
                                                return param.containers[containerIndex].title;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        function getTrimsContainerCapacityUnitTitle(param) {
            if (param.material && param.allMaterials && param.allMaterials.length > 0 && param.category && param.category.length > 0 &&
                param.enqConsMaterialDef && param.enqConsMaterialDef.length > 0) {
                var enqMatIndex = msbUtilService.getIndex(param.enqConsMaterialDef, "gMatColorSizeId", param.material.materialId);
                if (enqMatIndex > -1) {
                    var matIndex = msbUtilService.getIndex(param.allMaterials, PRIMARY_COLUMN_NAME, param.enqConsMaterialDef[enqMatIndex].materialId);
                    if (matIndex > -1) {
                        if (param.allMaterials[matIndex].categoryId) {
                            var catIndex = msbUtilService.getIndex(param.category, PRIMARY_COLUMN_NAME, param.allMaterials[matIndex].categoryId);
                            if (catIndex > -1) {
                                if (param.category[catIndex].containers && param.category[catIndex].containers.length > 0) {
                                    var containerIndex = msbUtilService.getIndex(param.category[catIndex].containers, PRIMARY_COLUMN_NAME, param.material.containerId);
                                    if (containerIndex > -1) {
                                        if (param.category[catIndex].containers[containerIndex].sizes && param.category[catIndex].containers[containerIndex].sizes.length > 0) {
                                            var unitSizeIndex = msbUtilService.getIndex(param.category[catIndex].containers[containerIndex].sizes, PRIMARY_COLUMN_NAME, param.material.sizeUnitId);
                                            if (unitSizeIndex > -1) {
                                                return param.category[catIndex].containers[containerIndex].sizes[unitSizeIndex].capacity + " " + getMeasurementUnitTitle(param.category[catIndex].containers[containerIndex].sizes[unitSizeIndex].measurementUnitId, param.measUnits);
                                            }

                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        function getThreadMaterialCategoryTitle(param) {
            if (param.summaryThreadMaterials && param.summaryThreadMaterials.length > 0) {
                for (var i = 0; i < param.summaryThreadMaterials.length; i++) {
                    var enqMatIndex = msbUtilService.getIndex(param.enqConsMaterialDef, "gMatColorSizeId", param.summaryThreadMaterials[i].materialId);
                    if (enqMatIndex > -1) {
                        if (param.summaryThreadMaterials[i] && param.allMaterials && param.allMaterials.length > 0) {
                            var matIndex = msbUtilService.getIndex(param.allMaterials, PRIMARY_COLUMN_NAME, param.enqConsMaterialDef[enqMatIndex].materialId);
                            if (matIndex > -1) {
                                if (param.allMaterials[matIndex] && param.supplies && param.supplies.length > 0) {
                                    var catIndex = msbUtilService.getIndex(param.supplies, PRIMARY_COLUMN_NAME, param.allMaterials[matIndex].categoryId);
                                    if (catIndex > -1) {
                                        return param.supplies[catIndex].title;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        function getMaterialDetail(param) {
            if (!param.enqConsMaterialDef) {
                return;
            }
            var index = msbUtilService.getIndex(param.enqConsMaterialDef, "gMatColorSizeId", param.material.materialId);
            if (index > -1) {
                if (param.code == 'title') {
                    return param.enqConsMaterialDef[index].materialTitle;
                } else if (param.code == 'description') {
                    return param.enqConsMaterialDef[index].materialDescription;
                } else if (param.code == 'color') {
                    return param.enqConsMaterialDef[index].color;
                } else if (param.code == 'count') {
                    return param.enqConsMaterialDef[index].count;
                } else if (param.code == 'size') {
                    return param.enqConsMaterialDef[index].size;
                }
            } else {
                return;
            }
        }

        function getMaterialThreadContainerTitle(param) {
            if (param.material && param.allMaterials && param.allMaterials.length > 0 && param.category &&
                param.category.length > 0 && param.enqConsMaterialDef && param.enqConsMaterialDef.length > 0 &&
                param.containers && param.containers.length > 0) {

                var enqMatIndex = msbUtilService.getIndex(param.enqConsMaterialDef, "gMatColorSizeId", param.material.materialId);
                if (enqMatIndex > -1) {
                    var matIndex = msbUtilService.getIndex(param.allMaterials, PRIMARY_COLUMN_NAME, param.enqConsMaterialDef[enqMatIndex].materialId);
                    if (matIndex > -1) {
                        if (param.allMaterials[matIndex].categoryId) {
                            var catIndex = msbUtilService.getIndex(param.category, PRIMARY_COLUMN_NAME, param.allMaterials[matIndex].categoryId);
                            if (catIndex > -1) {
                                if (param.category[catIndex].containers && param.category[catIndex].containers.length > 0) {
                                    var containerIndex = msbUtilService.getIndex(param.category[catIndex].containers, PRIMARY_COLUMN_NAME, param.material.containerId);
                                    if (containerIndex > -1) {
                                        if (param.category[catIndex].containers[containerIndex].containerId) {
                                            var containerIndex = msbUtilService.getIndex(param.containers, PRIMARY_COLUMN_NAME, param.category[catIndex].containers[containerIndex].containerId);
                                            if (containerIndex > -1) {
                                                return param.containers[containerIndex].title;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        function getThreadContainerCapacityUnitTitle(param) {
            if (param.material && param.allMaterials && param.allMaterials.length > 0 && param.category && param.category.length > 0 &&
                param.enqConsMaterialDef && param.enqConsMaterialDef.length > 0) {
                var enqMatIndex = msbUtilService.getIndex(param.enqConsMaterialDef, "gMatColorSizeId", param.material.materialId);
                if (enqMatIndex > -1) {
                    var matIndex = msbUtilService.getIndex(param.allMaterials, PRIMARY_COLUMN_NAME, param.enqConsMaterialDef[enqMatIndex].materialId);
                    if (matIndex > -1) {
                        if (param.allMaterials[matIndex].categoryId) {
                            var catIndex = msbUtilService.getIndex(param.category, PRIMARY_COLUMN_NAME, param.allMaterials[matIndex].categoryId);
                            if (catIndex > -1) {
                                if (param.category[catIndex].containers && param.category[catIndex].containers.length > 0) {
                                    var containerIndex = msbUtilService.getIndex(param.category[catIndex].containers, PRIMARY_COLUMN_NAME, param.material.containerId);
                                    if (containerIndex > -1) {
                                        if (param.category[catIndex].containers[containerIndex].sizes && param.category[catIndex].containers[containerIndex].sizes.length > 0) {
                                            var unitSizeIndex = msbUtilService.getIndex(param.category[catIndex].containers[containerIndex].sizes, PRIMARY_COLUMN_NAME, param.material.sizeUnitId);
                                            if (unitSizeIndex > -1) {
                                                return param.category[catIndex].containers[containerIndex].sizes[unitSizeIndex].capacity + " " + getMeasurementUnitTitle(param.category[catIndex].containers[containerIndex].sizes[unitSizeIndex].measurementUnitId, param.measUnits);
                                            }

                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        function getEnquiryQuantityRatio(param) {
            if (param && param.sizeDefinition && param.sizeDefinition.length > 0) {
                for (var i = 0; i < param.sizeDefinition.length; i++) {
                    for (var j = 0; j < param.sizeDefinition[i].sizes.length; j++) {
                        var params = [
                            { "key": "zoneId", "value": param.sizeDefinition[i].TECHDISER_ID },
                            { "key": "sizeId", "value": param.sizeDefinition[i].sizes[j].TECHDISER_ID }
                        ];

                        var ratioIndex = msbUtilService.getIndexByValues(param.styleQuantityRatio, params);
                        if (ratioIndex === -1) {
                            var ratioObj = {
                                "TECHDISER_ID": msbUtilService.generateId(),
                                "zoneId": param.sizeDefinition[i].TECHDISER_ID,
                                "sizeId": param.sizeDefinition[i].sizes[j].TECHDISER_ID,
                                "quantity": 0
                            }
                            param.styleQuantityRatio.push(ratioObj);
                        }

                    }
                }
            }
            return param.styleQuantityRatio;
        }

        function checkMaterialForCuttableSummary(param) {
            if (param && param.enqConsMaterialDef && param.enqConsMaterialDef.length > 0) {
                for (var i = 0; i < param.enqConsMaterialDef.length; i++) {
                    if (param.enqConsMaterialDef[i].matType == "cuttable") {
                        var index = msbUtilService.getIndex(param.summaryCuttableMaterials, "materialId", param.enqConsMaterialDef[i].gMatColorId);
                        if (index === -1) {
                            var materialObj = {
                                "TECHDISER_ID": msbUtilService.generateId(),
                                "materialId": param.enqConsMaterialDef[i].gMatColorId,
                                "measurementUnitId": param.measurementUnitId,
                                "pomAreaConsumption": 0,
                                "qmAreaConsumption": 0,
                                "panelAreaConsumption": 0,
                                "markerPlanAreaConsumption": 0,
                                "pomConsumption": 0,
                                "qmConsumption": 0,
                                "panelConsumption": 0,
                                "markerPlanConsumption": 0,
                                "totalPomConsumption": 0,
                                "totalQmConsumption": 0,
                                "totalPanelConsumption": 0,
                                "totalMarkerPlanConsumption": 0,
                                "containerId": null,
                                "sizeUnitId": null,
                                "wastage": 0,
                                "numOfContainer": 0,
                                "pomCosting": false,
                                "qmCosting": false,
                                "panelCosting": false,
                                "markerPlanCosting": false,
                                "unitPrice": 0,
                                "price": 0
                            }
                            param.summaryCuttableMaterials.push(materialObj);
                        }
                    }
                }
                return param.summaryCuttableMaterials;
            }
        }

        function getFabricMaterialContainers(param) {
            if (param) {
                var fabricContainers = [];
                if (param.summaryCuttableMaterials && param.summaryCuttableMaterials.length > 0 &&
                    param.enqConsMaterialDef && param.enqConsMaterialDef.length > 0 && param.allMaterials &&
                    param.allMaterials.length > 0 && param.category && param.category.length > 0) {
                    for (var i = 0; i < param.summaryCuttableMaterials.length; i++) {
                        var enqMatIndex = msbUtilService.getIndex(param.enqConsMaterialDef, "gMatColorId", param.summaryCuttableMaterials[i].materialId);
                        if (enqMatIndex > -1) {
                            if (param.enqConsMaterialDef[enqMatIndex].materialId) {
                                var matIndex = msbUtilService.getIndex(param.allMaterials, PRIMARY_COLUMN_NAME, param.enqConsMaterialDef[enqMatIndex].materialId);
                                if (matIndex > -1) {
                                    if (param.allMaterials[matIndex].categoryId) {
                                        var catIndex = msbUtilService.getIndex(param.category, PRIMARY_COLUMN_NAME, param.allMaterials[matIndex].categoryId);
                                        if (catIndex > -1) {
                                            if (param.category[catIndex].containers && param.category[catIndex].containers.length > 0) {
                                                fabricContainers = param.category[catIndex].containers;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return fabricContainers;
                }
            }
        }

        function getContainerTitle(param) {
            if (param && param.containerId && param.containers && param.containers.length > 0) {
                var containerIndex = msbUtilService.getIndex(param.containers, PRIMARY_COLUMN_NAME, param.containerId);
                if (containerIndex > -1) {
                    return param.containers[containerIndex].title;
                }
            }
        }

        function getFabricContainersMeasurementUnits(param) {
            if (param && param.containerId && param.fabricContainers && param.fabricContainers.length > 0) {
                var containerIndex = msbUtilService.getIndex(param.fabricContainers, PRIMARY_COLUMN_NAME, param.containerId);
                if (containerIndex > -1) {
                    if (param.fabricContainers[containerIndex].sizes && param.fabricContainers[containerIndex].sizes.length > 0) {

                        return param.fabricContainers[containerIndex].sizes;
                    }
                }
            }
        }

        function getNumOfFabricContainersforConsumption(param) {
            if (param) {
                var sizeUnit = 0;
                if (param && param.material && param.material.containerId && param.material.sizeUnitId && param.material.materialId &&
                    param.enqConsMaterialDef && param.enqConsMaterialDef.length > 0 && param.allMaterials &&
                    param.allMaterials.length > 0 && param.category && param.category.length > 0) {

                    var enqMatIndex = msbUtilService.getIndex(param.enqConsMaterialDef, "gMatColorId", param.material.materialId);
                    if (enqMatIndex > -1) {

                        var matIndex = msbUtilService.getIndex(param.allMaterials, PRIMARY_COLUMN_NAME, param.enqConsMaterialDef[enqMatIndex].materialId);

                        if (matIndex > -1) {
                            if (param.category && param.category.length > 0) {
                                var catIndex = msbUtilService.getIndex(param.category, PRIMARY_COLUMN_NAME, param.allMaterials[matIndex].categoryId);

                                if (catIndex > -1) {
                                    if (param.category[catIndex].containers && param.category[catIndex].containers.length > 0) {
                                        var containerIndex = msbUtilService.getIndex(param.category[catIndex].containers, PRIMARY_COLUMN_NAME, param.material.containerId);

                                        if (containerIndex > -1) {
                                            if (param.category[catIndex].containers[containerIndex].sizes && param.category[catIndex].containers[containerIndex].sizes.length > 0) {
                                                var sizeUnitIndex = msbUtilService.getIndex(param.category[catIndex].containers[containerIndex].sizes, PRIMARY_COLUMN_NAME, param.material.sizeUnitId);

                                                if (sizeUnitIndex > -1) {
                                                    sizeUnit = param.category[catIndex].containers[containerIndex].sizes[sizeUnitIndex].capacity * 1 * 1000;
                                                    if (param.material.totalPomConsumption && param.material.pomCosting === true) {
                                                        return param.material.numOfContainer = Math.ceil((param.material.totalPomConsumption * 1) / sizeUnit);
                                                    } else if (param.material.totalQmConsumption && param.material.qmCosting === true) {
                                                        return param.material.numOfContainer = Math.ceil((param.material.totalQmConsumption * 1) / sizeUnit);
                                                    } else if (param.material.totalPanelConsumption && param.material.panelCosting === true) {
                                                        return param.material.numOfContainer = Math.ceil((param.material.totalPanelConsumption * 1) / sizeUnit);
                                                    } else if (param.material.totalMarkerPlanConsumption && param.material.markerPlanCosting === true) {
                                                        return param.material.numOfContainer = Math.ceil((param.material.totalMarkerPlanConsumption * 1) / sizeUnit);
                                                    } else {
                                                        return param.material.numOfContainer = 0;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        function getMaterialPOMAreaCons(param) {
            if (param && param.material) {
                if (!param.pomMaterials) {
                    return;
                }
                var index = msbUtilService.getIndex(param.pomMaterials, "materialId", param.material.materialId);

                if (index > -1) {
                    if (param.materialQuantity) {
                        param.material.pomAreaConsumption = param.materialQuantity * (param.pomMaterials[index].perConsumption * 1);
                    }
                    return param.material.pomAreaConsumption;
                }
            }
        }

        function getMaterialPOMCons(param) {
            if (param && param.material) {
                if (!param.pomMaterials) {
                    return;
                }

                var index = msbUtilService.getIndex(param.pomMaterials, "materialId", param.material.materialId);

                if (index > -1) {
                    if (param.materialQuantity) {
                        var pomAreaConsumption = param.materialQuantity * (param.pomMaterials[index].perConsumption * 1);

                        var widthParam = { "material": param.material, "code": 'width', "enqConsMaterialDef": param.enqConsMaterialDef };
                        var width = getCuttingMaterialDetail(widthParam);
                        if (width * 1 > 0) {
                            param.material.pomConsumption = pomAreaConsumption / (width * 1);
                        } else {
                            param.material.pomConsumption = 0;
                        }

                    }
                    return param.material.pomConsumption;
                }
            }
        }

        function getMaterialQMAreaCons(param) {
            if (param && param.material) {
                if (!param.quickMarkerMaterials) {
                    return;
                }

                var index = msbUtilService.getIndex(param.quickMarkerMaterials, "materialId", param.material.materialId);

                if (index > -1) {
                    if (param.materialQuantity) {
                        param.material.qmAreaConsumption = param.materialQuantity * (param.quickMarkerMaterials[index].perConsumption * 1);
                    }
                    return param.material.qmAreaConsumption;
                }

            }
        }

        function getMaterialQMCons(param) {
            if (param && param.material) {
                if (!param.quickMarkerMaterials) {
                    return;
                }
                var index = msbUtilService.getIndex(param.quickMarkerMaterials, "materialId", param.material.materialId);

                if (index > -1) {
                    if (param.materialQuantity) {
                        var qmAreaConsumption = param.materialQuantity * (param.quickMarkerMaterials[index].perConsumption * 1);
                        var widthParam = { "material": param.material, "code": 'width', "enqConsMaterialDef": param.enqConsMaterialDef };
                        var width = getCuttingMaterialDetail(widthParam);
                        if (width * 1 > 0) {
                            param.material.qmConsumption = qmAreaConsumption / (width * 1);
                        } else {
                            param.material.qmConsumption = 0;
                        }
                    }
                    return param.material.qmConsumption;
                }

            }
        }

        function getPomConsumption(param) {
            if (param) {
                // if (!param.pomMaterials) {
                //     return;
                // }
                // var index = msbUtilService.getIndex(param.pomMaterials, "materialId", param.material.materialId);
                //
                // if (index > -1) {
                //     if (param.materialQuantity) {
                //       var rawPomCons = param.materialQuantity * (param.pomMaterials[index].perConsumption *1);
                //       param.material.totalPomConsumption = (rawPomCons + (rawPomCons * (param.material.wastage / 100)));
                //     }
                //     return param.material.totalPomConsumption.toFixed(2);
                // }else {
                //     param.material.totalPomConsumption = 0;
                //     return param.material.totalPomConsumption;
                // }
                param.material.totalPomConsumption = (param.material.pomConsumption + (param.material.pomConsumption * (param.material.wastage / 100)));
                return param.material.totalPomConsumption;
            }
        }

        function getQuickMarkerConsumption(param) {
            if (param) {
                // if (!param.quickMarkerMaterials) {
                //     return;
                // }
                // var index = msbUtilService.getIndex(param.quickMarkerMaterials, "materialId", param.material.materialId);
                // if (index > -1) {
                //     if (param.materialQuantity) {
                //         var rawQmCons = param.materialQuantity * (param.quickMarkerMaterials[index].perConsumption *1);
                //         param.material.totalQmConsumption = (rawQmCons + (rawQmCons * (param.material.wastage / 100)));
                //     }
                //     return param.material.totalQmConsumption.toFixed(2);
                // }else {
                //     param.material.totalQmConsumption = 0;
                //     return param.material.totalQmConsumption;
                // }

                param.material.totalQmConsumption = (param.material.qmConsumption + (param.material.qmConsumption * (param.material.wastage / 100)));
                return param.material.totalQmConsumption;
            }
        }

        function selectConsumptionForCosting(param) {
            if (param && param.material && param.code) {
                if (param.code === "pom") {
                    param.material.qmCosting = false;
                    param.material.panelCosting = false;
                    param.material.markerPlanCosting = false;
                    param.material.pomCosting = !param.material.pomCosting;
                    return param.material.pomCosting;
                }
                else if (param.code === "qm") {
                    param.material.pomCosting = false;
                    param.material.panelCosting = false;
                    param.material.markerPlanCosting = false;
                    param.material.qmCosting = !param.material.qmCosting;
                    return param.material.qmCosting;
                }
                else if (param.code === "panel") {
                    param.material.pomCosting = false;
                    param.material.markerPlanCosting = false;
                    param.material.qmCosting = false;
                    param.material.panelCosting = !param.material.panelCosting;
                    return param.material.panelCosting;
                }
                else if (param.code === "markerPlan") {
                    param.material.pomCosting = false;
                    param.material.qmCosting = false;
                    param.material.panelCosting = false;
                    param.material.markerPlanCosting = !param.material.markerPlanCosting;
                    return param.material.markerPlanCosting;
                }
            }
        }

        function getMaterialWastageforCuttable(param) {
            // if typeId exists in material obj of allMaterials array.
            if (param && param.summaryCuttableMaterials && param.summaryCuttableMaterials.length > 0 &&
                param.allMaterials && param.allMaterials.length > 0 && param.category && param.category.length > 0) {
                for (var i = 0; i < param.summaryCuttableMaterials.length; i++) {

                    if (param.summaryCuttableMaterials[i] && param.summaryCuttableMaterials[i].materialId) {

                        var enqMatIndex = msbUtilService.getIndex(param.enqConsMaterialDef, "gMatColorId", param.summaryCuttableMaterials[i].materialId);
                        if (enqMatIndex > -1) {
                            if (param.enqConsMaterialDef[enqMatIndex].materialId) {

                                var matIndex = msbUtilService.getIndex(param.allMaterials, PRIMARY_COLUMN_NAME, param.enqConsMaterialDef[enqMatIndex].materialId);
                                if (matIndex > -1) {
                                    var catIndex = msbUtilService.getIndex(param.category, PRIMARY_COLUMN_NAME, param.allMaterials[matIndex].categoryId);
                                    if (catIndex > -1) {
                                        if (param.category[catIndex] && param.category[catIndex].types && param.category[catIndex].types.length > 0) {
                                            var typeIndex = msbUtilService.getIndex(param.category[catIndex].types, PRIMARY_COLUMN_NAME, param.allMaterials[matIndex].typeId);
                                            if (typeIndex > -1) {
                                                param.summaryCuttableMaterials[i].wastage = param.category[catIndex].types[typeIndex].wastage * 1;
                                            }
                                        }
                                    }

                                }
                            }
                        }
                    }

                }
                return param.summaryCuttableMaterials;
            }
        }

        function getMaterialWastageforCountable(param) {
            // if typeId exists in material obj of allMaterials array.
            if (param && param.summaryCountableMaterials && param.summaryCountableMaterials.length > 0 &&
                param.allMaterials && param.allMaterials.length > 0 && param.category && param.category.length > 0) {
                for (var i = 0; i < param.summaryCountableMaterials.length; i++) {

                    if (param.summaryCountableMaterials[i] && param.summaryCountableMaterials[i].materialId) {

                        var enqMatIndex = msbUtilService.getIndex(param.enqConsMaterialDef, "gMatColorSizeComboId", param.summaryCountableMaterials[i].materialId);
                        if (enqMatIndex > -1) {

                            var matIndex = msbUtilService.getIndex(param.allMaterials, PRIMARY_COLUMN_NAME, param.enqConsMaterialDef[enqMatIndex].materialId);
                            if (matIndex > -1) {
                                var catIndex = msbUtilService.getIndex(param.category, PRIMARY_COLUMN_NAME, param.allMaterials[matIndex].categoryId);
                                if (catIndex > -1) {
                                    if (param.category[catIndex] && param.category[catIndex].types && param.category[catIndex].types.length > 0) {
                                        var typeIndex = msbUtilService.getIndex(param.category[catIndex].types, PRIMARY_COLUMN_NAME, param.allMaterials[matIndex].typeId);
                                        if (typeIndex > -1) {
                                            param.summaryCountableMaterials[i].wastage = param.category[catIndex].types[typeIndex].wastage * 1;
                                        }
                                    }
                                }

                            }
                        }
                    }

                }
                return param.summaryCountableMaterials;
            }
        }

        function getMaterialWastageforThread(param) {
            // if typeId exists in material obj of allMaterials array.
            if (param.summaryThreadMaterials && param.summaryThreadMaterials.length > 0 &&
                param.allMaterials && param.allMaterials.length > 0 && param.category && param.category.length > 0) {
                for (var i = 0; i < param.summaryThreadMaterials.length; i++) {

                    if (param.summaryThreadMaterials[i] && param.summaryThreadMaterials[i].materialId) {

                        var enqMatIndex = msbUtilService.getIndex(param.enqConsMaterialDef, "gMatColorSizeId", param.summaryThreadMaterials[i].materialId);
                        if (enqMatIndex > -1) {
                            var matIndex = msbUtilService.getIndex(param.allMaterials, PRIMARY_COLUMN_NAME, param.enqConsMaterialDef[enqMatIndex].materialId);
                            if (matIndex > -1) {
                                var catIndex = msbUtilService.getIndex(param.category, PRIMARY_COLUMN_NAME, param.allMaterials[matIndex].categoryId);
                                if (catIndex > -1) {
                                    if (param.category[catIndex] && param.category[catIndex].types && param.category[catIndex].types.length > 0) {
                                        var typeIndex = msbUtilService.getIndex(param.category[catIndex].types, PRIMARY_COLUMN_NAME, param.allMaterials[matIndex].typeId);
                                        if (typeIndex > -1) {
                                            param.summaryThreadMaterials[i].wastage = param.category[catIndex].types[typeIndex].wastage * 1;
                                        }
                                    }
                                }

                            }
                        }
                    }

                }
                return param.summaryThreadMaterials;
            }
        }

        function checkMaterialForCountableSummary(param) {
            if (param.enqConsMaterialDef && param.enqConsMaterialDef.length > 0) {
                for (var i = 0; i < param.enqConsMaterialDef.length; i++) {
                    if (param.enqConsMaterialDef[i].matType == "countable") {
                        var index = msbUtilService.getIndex(param.summaryCountableMaterials, "materialId", param.enqConsMaterialDef[i].gMatColorSizeId);
                        if (index === -1) {
                            var materialObj = {
                                "TECHDISER_ID": msbUtilService.generateId(),
                                "materialId": param.enqConsMaterialDef[i].gMatColorSizeId,
                                "measurementUnitId": param.measurementUnitId,
                                "countConsumption": 0,
                                "wastage": 0,
                                "totalCountConsumption": 0,
                                "containerId": null,
                                "sizeUnitId": null,
                                "numOfContainer": 0,
                                "unitPrice": 0,
                                "price": 0
                            }
                            param.summaryCountableMaterials.push(materialObj);
                        }
                    }
                }
                return param.summaryCountableMaterials;
            }
        }

        function getCountableMaterialContainers(param) {
            if (param && param.material && param.allMaterials && param.allMaterials.length > 0 && param.enqConsMaterialDef &&
                param.enqConsMaterialDef.length > 0 && param.category && param.category.length > 0) {
                var enqMatIndex = msbUtilService.getIndex(param.enqConsMaterialDef, "gMatColorSizeId", param.material.materialId);
                if (enqMatIndex > -1) {
                    var matIndex = msbUtilService.getIndex(param.allMaterials, PRIMARY_COLUMN_NAME, param.enqConsMaterialDef[enqMatIndex].materialId);
                    if (matIndex > -1) {
                        if (param.allMaterials[matIndex].categoryId) {
                            var catIndex = msbUtilService.getIndex(param.category, PRIMARY_COLUMN_NAME, param.allMaterials[matIndex].categoryId);
                            if (catIndex > -1) {
                                if (param.category[catIndex].containers && param.category[catIndex].containers.length > 0) {
                                    return param.category[catIndex].containers;
                                }
                            }
                        }
                    }
                }
            }
        }

        function getNumOfCountableContainersforConsumption(param) {
            if (param) {
                var sizeUnit = 0;
                if (param.material && param.material.containerId && param.material.sizeUnitId && param.material.materialId &&
                    param.enqConsMaterialDef && param.enqConsMaterialDef.length > 0 && param.allMaterials && param.allMaterials.length > 0) {


                    var enqMatIndex = msbUtilService.getIndex(param.enqConsMaterialDef, "gMatColorSizeId", param.material.materialId);
                    if (enqMatIndex > -1) {
                        var matIndex = msbUtilService.getIndex(param.allMaterials, PRIMARY_COLUMN_NAME, param.enqConsMaterialDef[enqMatIndex].materialId);

                        if (matIndex > -1) {
                            if (param.category && param.category.length > 0) {
                                var catIndex = msbUtilService.getIndex(param.category, PRIMARY_COLUMN_NAME, param.allMaterials[matIndex].categoryId);

                                if (catIndex > -1) {
                                    if (param.category[catIndex].containers && param.category[catIndex].containers.length > 0) {
                                        var containerIndex = msbUtilService.getIndex(param.category[catIndex].containers, PRIMARY_COLUMN_NAME, param.material.containerId);

                                        if (containerIndex > -1) {
                                            if (param.category[catIndex].containers[containerIndex].sizes && param.category[catIndex].containers[containerIndex].sizes.length > 0) {
                                                var sizeUnitIndex = msbUtilService.getIndex(param.category[catIndex].containers[containerIndex].sizes, PRIMARY_COLUMN_NAME, param.material.sizeUnitId);

                                                if (sizeUnitIndex > -1) {
                                                    sizeUnit = param.category[catIndex].containers[containerIndex].sizes[sizeUnitIndex].capacity * 1 * 12;
                                                    if (param.material.totalCountConsumption) {
                                                        return param.material.numOfContainer = Math.ceil((param.material.totalCountConsumption * 1) / sizeUnit);
                                                    } else {
                                                        return param.material.numOfContainer = 0;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        function getMaterialCountCons(param) {
            if (param && param.material) {
                if (!param.countableMats) {
                    return;
                }

                var index = msbUtilService.getIndex(param.countableMats, "materialId", param.material.materialId);

                if (index > -1) {
                    if (param.materialQuantity) {
                        param.material.countConsumption = param.materialQuantity * (param.countableMats[index].consPerGarment * 1);

                    }
                    return param.material.countConsumption;
                }
            }
        }

        function getTotalCountConsumption(param) {
            if (param) {
                if (!param.countableMats) {
                    return;
                }

                var index = msbUtilService.getIndex(param.countableMats, "materialId", param.material.materialId);

                if (index > -1) {
                    if (param.materialQuantity) {
                        var rawCountCons = param.materialQuantity * (param.countableMats[index].consPerGarment * 1);
                        param.material.totalCountConsumption = (rawCountCons + (rawCountCons * (param.material.wastage / 100)));
                    }
                    return param.material.totalCountConsumption.toFixed(2);
                }
            }
        }

        function getThraedMaterialContainers(param) {
            if (param) {
                var threadContainers = [];
                if (param.summaryThreadMaterials && param.summaryThreadMaterials.length > 0 &&
                    param.enqConsMaterialDef && param.enqConsMaterialDef.length > 0 && param.allMaterials &&
                    param.allMaterials.length > 0 && param.category && param.category.length > 0) {
                    for (var i = 0; i < param.summaryThreadMaterials.length; i++) {
                        var enqMatIndex = msbUtilService.getIndex(param.enqConsMaterialDef, "gMatColorSizeId", param.summaryThreadMaterials[i].materialId);
                        if (enqMatIndex > -1) {
                            if (param.enqConsMaterialDef[enqMatIndex].materialId) {
                                var matIndex = msbUtilService.getIndex(param.allMaterials, PRIMARY_COLUMN_NAME, param.enqConsMaterialDef[enqMatIndex].materialId);
                                if (matIndex > -1) {
                                    if (param.allMaterials[matIndex].categoryId) {
                                        var catIndex = msbUtilService.getIndex(param.category, PRIMARY_COLUMN_NAME, param.allMaterials[matIndex].categoryId);
                                        if (catIndex > -1) {
                                            if (param.category[catIndex].containers && param.category[catIndex].containers.length > 0) {
                                                threadContainers = param.category[catIndex].containers;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return threadContainers;
                }
            }
        }

        function getNumOfThreadContainersforConsumption(param) {
            if (param) {
                var sizeUnit = 0;
                if (param.thread && param.thread.containerId && param.thread.sizeUnitId && param.thread.materialId &&
                    param.enqConsMaterialDef && param.enqConsMaterialDef.length > 0 && param.allMaterials &&
                    param.allMaterials.length > 0) {

                    var enqMatIndex = msbUtilService.getIndex(param.enqConsMaterialDef, "gMatColorSizeId", param.thread.materialId);
                    if (enqMatIndex > -1) {

                        var matIndex = msbUtilService.getIndex(param.allMaterials, PRIMARY_COLUMN_NAME, param.enqConsMaterialDef[enqMatIndex].materialId);

                        if (matIndex > -1) {
                            if (param.category && param.category.length > 0) {
                                var catIndex = msbUtilService.getIndex(param.category, PRIMARY_COLUMN_NAME, param.allMaterials[matIndex].categoryId);

                                if (catIndex > -1) {
                                    if (param.category[catIndex].containers && param.category[catIndex].containers.length > 0) {
                                        var containerIndex = msbUtilService.getIndex(param.category[catIndex].containers, PRIMARY_COLUMN_NAME, param.thread.containerId);

                                        if (containerIndex > -1) {
                                            if (param.category[catIndex].containers[containerIndex].sizes && param.category[catIndex].containers[containerIndex].sizes.length > 0) {
                                                var sizeUnitIndex = msbUtilService.getIndex(param.category[catIndex].containers[containerIndex].sizes, PRIMARY_COLUMN_NAME, param.thread.sizeUnitId);

                                                if (sizeUnitIndex > -1) {
                                                    sizeUnit = param.category[catIndex].containers[containerIndex].sizes[sizeUnitIndex].capacity * 1 * 1000;
                                                    if (param.thread.totalThreadConsumption > -1) {
                                                        return param.thread.numOfContainer = Math.ceil((param.thread.totalThreadConsumption * 1) / sizeUnit);
                                                    } else {
                                                        return param.thread.numOfContainer = 0;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        function checkMaterialForThread(param) {
            if (param.threadMats && param.threadMats.length > 0) {
                for (var i = 0; i < param.threadMats.length; i++) {
                    var index = msbUtilService.getIndex(param.summaryThreadMaterials, "materialId", param.threadMats[i].materialId);
                    if (index === -1) {
                        var materialObj = {
                            "TECHDISER_ID": msbUtilService.generateId(),
                            "materialId": param.threadMats[i].materialId,
                            "measurementUnitId": param.measurementUnitId,
                            "threadConsumption": 0,
                            "wastage": 0,
                            "totalThreadConsumption": 0,
                            "containerId": null,
                            "sizeUnitId": null,
                            "numOfContainer": 0,
                            "unitPrice": 0,
                            "price": 0
                        }
                        param.summaryThreadMaterials.push(materialObj);
                    }
                }
                return param.summaryThreadMaterials;
            }
        }

        function getTotalThreadConsumption(param) {
            if (param && param.thread) {
                if (!param.threadMats) {
                    return;
                }

                var index = msbUtilService.getIndex(param.threadMats, "materialId", param.thread.materialId);

                if (index > -1) {
                    if (param.materialQuantity) {
                        var rawThreadCons = param.materialQuantity * (param.threadMats[index].consPerGarment * 1);
                        param.thread.totalThreadConsumption = (rawThreadCons + (rawThreadCons * (param.thread.wastage / 100)));
                    }
                    return param.thread.totalThreadConsumption;
                }
            }
        }

        function selectFabricPolicy(param) {
            if (param && param.summaryCuttableMaterials && param.summaryCuttableMaterials.length > 0 && param.code) {
                if (param.code === "pom") {
                    param.qmCosting = false;
                    param.panelCosting = false;
                    param.markerPlanCosting = false;
                    param.pomCosting = !param.pomCosting;
                    param.summaryCuttableMaterials = changePolicy(param.summaryCuttableMaterials, param.qmCosting, param.pomCosting, param.panelCosting, param.markerPlanCosting);
                }
                else if (param.code === "qm") {
                    param.pomCosting = false;
                    param.panelCosting = false;
                    param.markerPlanCosting = false;
                    param.qmCosting = !param.qmCosting;
                    param.summaryCuttableMaterials = changePolicy(param.summaryCuttableMaterials, param.qmCosting, param.pomCosting, param.panelCosting, param.markerPlanCosting);
                }
                else if (param.code === "panel") {
                    param.pomCosting = false;
                    param.qmCosting = false;
                    param.markerPlanCosting = false;
                    param.panelCosting = !param.panelCosting;
                    param.summaryCuttableMaterials = changePolicy(param.summaryCuttableMaterials, param.qmCosting, param.pomCosting, param.panelCosting, param.markerPlanCosting);
                }
                else if (param.code === "markerPlan") {
                    param.pomCosting = false;
                    param.qmCosting = false;
                    param.panelCosting = false;
                    param.markerPlanCosting = !param.markerPlanCosting;
                    param.summaryCuttableMaterials = changePolicy(param.summaryCuttableMaterials, param.qmCosting, param.pomCosting, param.panelCosting, param.markerPlanCosting);
                }
                return param;
            }
        }

        function changePolicy(summaryCuttableMaterials, qmCosting, pomCosting, panelCosting, markerPlanCosting) {
            for (var i = 0; i < summaryCuttableMaterials.length; i++) {
                if (summaryCuttableMaterials[i]) {
                    summaryCuttableMaterials[i].pomCosting = pomCosting;
                    summaryCuttableMaterials[i].qmCosting = qmCosting;
                    summaryCuttableMaterials[i].panelCosting = panelCosting;
                    summaryCuttableMaterials[i].markerPlanCosting = markerPlanCosting;
                }
            }
            return summaryCuttableMaterials;
        }

        function getThreadCons(param) {
            if (param && param.material) {
                if (!param.threadMats) {
                    return;
                }
                var index = msbUtilService.getIndex(param.threadMats, "materialId", param.material.materialId);

                if (index > -1) {
                    if (param.materialQuantity) {
                        param.material.threadConsumption = param.materialQuantity * (param.threadMats[index].consPerGarment * 1);
                        return param.material.threadConsumption;
                    }
                }
            }
        }

        function getMaterialPanelAreaCons(param) {
            if (param && param.material) {
                if (!param.panelMaterialConsumption) {
                    return;
                }
                var index = msbUtilService.getIndex(param.panelMaterialConsumption, "materialId", param.material.materialId);

                if (index > -1) {
                    if (param.materialQuantity) {
                        param.material.panelAreaConsumption = param.materialQuantity * (param.panelMaterialConsumption[index].perConsumption * 1);
                    }
                    return param.material.panelAreaConsumption;
                } else {
                    param.material.panelAreaConsumption = 0;
                    return param.material.panelAreaConsumption;
                }
            }
        }

        function getMaterialPanelCons(param) {
            if (param && param.material) {
                if (!param.panelMaterialConsumption) {
                    return;
                }
                var index = msbUtilService.getIndex(param.panelMaterialConsumption, "materialId", param.material.materialId);

                if (index > -1) {
                    if (param.materialQuantity) {
                        var panelAreaConsumption = param.materialQuantity * (param.panelMaterialConsumption[index].perConsumption * 1);
                        var widthParam = { "material": param.material, "code": 'width', "enqConsMaterialDef": param.enqConsMaterialDef };
                        var width = getCuttingMaterialDetail(widthParam);
                        if (width * 1 > 0) {
                            param.material.panelConsumption = panelAreaConsumption / (width * 1);
                        } else {
                            param.material.panelConsumption = 0;
                        }
                    }
                    return param.material.panelConsumption;
                } else {
                    param.material.panelConsumption = 0;
                    return param.material.panelConsumption;
                }
            }
        }

        function getPanelConsumption(param) {
            if (param) {
                // if (!param.panelMaterialConsumption) {
                //     return;
                // }
                //
                // var index = msbUtilService.getIndex(param.panelMaterialConsumption, "materialId", param.material.materialId);
                //
                // if (index > -1) {
                //     if (param.materialQuantity) {
                //         var rawQmCons = param.materialQuantity * (param.panelMaterialConsumption[index].perConsumption *1);
                //         param.material.totalPanelConsumption = (rawQmCons + (rawQmCons * (param.material.wastage / 100)));
                //     }
                //     return param.material.totalPanelConsumption.toFixed(2);
                // }else {
                //     param.material.totalPanelConsumption = 0;
                //     return param.material.totalPanelConsumption;
                // }
                param.material.totalPanelConsumption = (param.material.panelConsumption + (param.material.panelConsumption * (param.material.wastage / 100)));
                return param.material.totalPanelConsumption;
            }
        }

        function getComboMaterialDetail(param) {
            if (param) {
                if (!param.materialDef) {
                    return;
                }
                var index = msbUtilService.getIndex(param.materialDef, "gMatColorSizeComboId", param.material.materialId);
                if (index > -1) {
                    if (param.code == 'title') {
                        return param.materialDef[index].materialTitle;
                    } else if (param.code == 'description') {
                        return param.materialDef[index].materialDescription;
                    } else if (param.code == 'color') {
                        return param.materialDef[index].color;
                    } else if (param.code == 'size') {
                        return param.materialDef[index].size;
                    } else if (param.code == 'combo') {
                        return param.materialDef[index].comboTitle;
                    }
                }
            }
        }

        function getCountableMaterialConsumption(param) {
            if (param) {
                if (!param.countableComboMats) {
                    return;
                }
                if (!param.materialDef) {
                    return;
                }
                var items = msbUtilService.getItemsByProperties(param.materialDef, [{ "key": "gMatColorSizeId", "value": param.material.materialId }]);
                if (items && items.length > 0) {
                    var cons = 0;
                    items.forEach(function (item) {
                        if (item && item.gMatColorSizeComboId) {
                            var index = msbUtilService.getIndex(param.countableComboMats, "materialId", item.gMatColorSizeComboId);
                            if (index > -1) {
                                cons += param.countableComboMats[index].consumption;
                            }
                        }
                    });
                    param.material.consumption = cons;
                    if (param.materialQuantity > 0) {
                        param.material.consPerGarment = param.material.consumption / param.materialQuantity;
                    } else {
                        param.material.consPerGarment = 0;
                    }
                    return param.material.consumption;
                } else {
                    return 0;
                }
            }
        }

        function isClothOrYarn(param) {
            if (param && param.material && param.enqConsMaterialDef && param.enqConsMaterialDef.length > 0) {
                var enqMatIndex = msbUtilService.getIndex(param.enqConsMaterialDef, "gMatColorId", param.material.materialId);
                if (enqMatIndex > -1) {
                    if (param.enqConsMaterialDef[enqMatIndex].sourcingForm === 'c') {
                        return true;
                    } else if (param.enqConsMaterialDef[enqMatIndex].sourcingForm === 'y') {
                        return false;
                    }
                }
            }
        }

        function getTrimsComboSizeQty(params) {
            if (msbUtilService.checkUndefined(params)) {
                var materialId = msbUtilService.searchFromParam(params, "materialId");
                var comboId = msbUtilService.searchFromParam(params, "comboId");
                var sizeId = msbUtilService.searchFromParam(params, "sizeId");
                var trimsItemQnty = msbUtilService.searchFromParam(params, "trimsItemQnty");
                if (materialId && sizeId && comboId && trimsItemQnty) {
                    var qtyParams = [{ "key": "materialId", "value": materialId },
                    { "key": "comboId", "value": comboId },
                    { "key": "sizeId", "value": sizeId }];
                    var index = msbUtilService.getIndexByValues(trimsItemQnty, qtyParams);
                    if (index > -1) {
                        return trimsItemQnty[index].quantity * 1;
                    }
                }
            }
        }

        // services for calculate countable ETD consumption
        function calculateEtdCountable(callBack, param) {
            if (msbUtilService.checkUndefined(callBack, param)) {

                var styleQuantityRatio = param.styleQuantityRatio;
                var sizeDefinition = param.sizeDefinition;
                var countableEtdMats = param.countableEtdMats;
                var materialDef = param.materialDef;
                var etds = param.etds;
                var allMaterials = param.allMaterials;
                var trimsItemQnty = param.trimsItemQnty;

                msbCommonApiService.interfaceManager(function (categoryData) {

                    if (categoryData) {
                        var category = categoryData;

                        var params1 = [{ "key": "countableEtdMats", "value": countableEtdMats },
                        { "key": "sizeDefinition", "value": sizeDefinition },
                        { "key": "trimsItemQnty", "value": trimsItemQnty },
                        { "key": "materialDef", "value": materialDef }];
                        countableEtdMats = createSizeRefForEtdCountable(params1);


                        var params2 = [{ "key": "countableEtdMats", "value": countableEtdMats },
                        { "key": "sizeDefinition", "value": sizeDefinition },
                        { "key": "styleQuantityRatio", "value": styleQuantityRatio },
                        { "key": "etds", "value": etds },
                        { "key": "materialDef", "value": materialDef }];
                        countableEtdMats = calculateSizeRarioEtdConsumption(params2);

                        // countableEtdData();

                        callBack(countableEtdMats);

                    }

                }, "styleDataService", "getMaterialCategoriesLeaf", null);
            }
        }


        function createSizeRefForEtdCountable(params) {
            if (msbUtilService.checkUndefined(params)) {
                var countableEtdMats = msbUtilService.searchFromParam(params, "countableEtdMats");
                var sizeDefinition = msbUtilService.searchFromParam(params, "sizeDefinition");
                var trimsItemQnty = msbUtilService.searchFromParam(params, "trimsItemQnty");
                var materialDef = msbUtilService.searchFromParam(params, "materialDef");
                if (countableEtdMats && countableEtdMats.length > 0 && sizeDefinition &&
                    sizeDefinition.length > 0 && materialDef && materialDef.length > 0 &&
                    trimsItemQnty.length > 0) {

                    for (var m = 0; m < countableEtdMats.length; m++) {
                        var matIndex = msbUtilService.getIndex(materialDef, "gMatColorSizeId", countableEtdMats[m].materialId);
                        if (matIndex > -1) {
                            var materialTechId = materialDef[matIndex].materialId;
                        }
                        for (var i = 0; i < sizeDefinition.length; i++) {
                            for (var j = 0; j < sizeDefinition[i].sizes.length; j++) {
                                var params = [
                                    { "key": "zoneId", "value": sizeDefinition[i].TECHDISER_ID },
                                    { "key": "sizeId", "value": sizeDefinition[i].sizes[j].TECHDISER_ID }
                                ];

                                var index = msbUtilService.getIndexByValues(countableEtdMats[m].refSizes, params);
                                if (index === -1) {
                                    var qtyParams = [{ "key": "materialId", "value": materialTechId },
                                    { "key": "sizeId", "value": sizeDefinition[i].sizes[j].TECHDISER_ID },
                                    { "key": "trimsItemQnty", "value": trimsItemQnty }];

                                    var sizeObj = {};
                                    sizeObj.TECHDISER_ID = msbUtilService.generateId();
                                    sizeObj.zoneId = sizeDefinition[i].TECHDISER_ID;
                                    sizeObj.sizeId = sizeDefinition[i].sizes[j].TECHDISER_ID;
                                    sizeObj.quantity = getTrimsSizeQty(qtyParams);
                                    sizeObj.sizeConsumption = 0;
                                    if (!countableEtdMats[m].refSizes) {
                                        countableEtdMats[m].refSizes = [];
                                    }
                                    countableEtdMats[m].refSizes.push(sizeObj);
                                }

                            }
                        }
                    }
                    return countableEtdMats;
                }
            }
        }

        function calculateSizeRarioEtdConsumption(params) {
            if (msbUtilService.checkUndefined(params)) {
                var countableEtdMats = msbUtilService.searchFromParam(params, "countableEtdMats");
                var styleQuantityRatio = msbUtilService.searchFromParam(params, "styleQuantityRatio");
                var etds = msbUtilService.searchFromParam(params, "etds");
                var sizeDefinition = msbUtilService.searchFromParam(params, "sizeDefinition");
                if (sizeDefinition && sizeDefinition.length > 0 && countableEtdMats && countableEtdMats.length > 0) {
                    for (var m = 0; m < countableEtdMats.length; m++) {
                        if (countableEtdMats[m] && countableEtdMats[m].refSizes && countableEtdMats[m].refSizes.length > 0) {
                            var etdQty = getEtdQty(countableEtdMats[m], etds);
                            for (var i = 0; i < sizeDefinition.length; i++) {
                                if (sizeDefinition[i].sizes && sizeDefinition[i].sizes.length > 0) {
                                    for (var j = 0; j < sizeDefinition[i].sizes.length; j++) {
                                        countableEtdMats[m].refSizes = getEtdSizeRatioConsumption(sizeDefinition[i].sizes[j], sizeDefinition[i], countableEtdMats[m].refSizes, styleQuantityRatio, etdQty);
                                    }
                                }
                            }
                            countableEtdMats[m].consumption = getEtdConsumptionCountable(countableEtdMats[m]);
                            countableEtdMats[m].consPerGarment = getEtdPerConsumptionCountable(countableEtdMats[m], etdQty);
                        }

                    }
                    return countableEtdMats;
                }
            }
        }

        function getTrimsSizeQty(params) {
            if (msbUtilService.checkUndefined(params)) {
                var materialId = msbUtilService.searchFromParam(params, "materialId");
                var sizeId = msbUtilService.searchFromParam(params, "sizeId");
                var trimsItemQnty = msbUtilService.searchFromParam(params, "trimsItemQnty");
                if (materialId && sizeId && trimsItemQnty) {
                    var qtyParams = [{ "key": "materialId", "value": materialId },
                    { "key": "sizeId", "value": sizeId }];
                    var items = msbUtilService.getItemsByProperties(trimsItemQnty, qtyParams);
                    if (items && items.length > 0) {
                        var qty = items.reduce(function (total, curr) {
                            return total + curr.quantity * 1;
                        }, 0);
                        return qty;
                    } else {
                        return 0;
                    }
                }
            }
        }

        function getEtdSizeRatioConsumption(size, zone, referenceSizes, styleQuantityRatio, etdQty) {
            var sizeConsumption = 0;

            var qtyRatioSum = 0;

            if (styleQuantityRatio && styleQuantityRatio.length > 0) {
                for (var i = 0; i < styleQuantityRatio.length; i++) {
                    qtyRatioSum += styleQuantityRatio[i].quantity;
                }
            }

            var refIndex = msbUtilService.getIndexByValues(referenceSizes,
                [{ "key": "zoneId", "value": zone.TECHDISER_ID },
                { "key": "sizeId", "value": size.TECHDISER_ID }]);

            var ratioIndex = msbUtilService.getIndexByValues(styleQuantityRatio,
                [{ "key": "zoneId", "value": zone.TECHDISER_ID },
                { "key": "sizeId", "value": size.TECHDISER_ID }]);

            if (refIndex > -1 && ratioIndex > -1) {

                if (referenceSizes[refIndex] && styleQuantityRatio[ratioIndex] && qtyRatioSum && etdQty) {
                    var garmentQty = Math.ceil((styleQuantityRatio[ratioIndex].quantity / qtyRatioSum) * etdQty);
                    referenceSizes[refIndex].sizeConsumption = Math.ceil(garmentQty * referenceSizes[refIndex].quantity);
                }


                return referenceSizes;
            }

        }

        function getEtdConsumptionCountable(material) {
            var consumptionCount = 0;
            if (material && material.refSizes && material.refSizes.length > 0) {
                for (var i = 0; i < material.refSizes.length; i++) {
                    consumptionCount += material.refSizes[i].sizeConsumption;
                }
                material.consumption = consumptionCount;

                return material.consumption;
            }
        }

        function getEtdPerConsumptionCountable(material, etdQty) {

            if (material && etdQty) {
                var calCons = getEtdConsumptionCountable(material);
                var consUnit = calCons / etdQty;
                material.consPerGarment = consUnit;
                return material.consPerGarment;
            }

        }

        // function countableEtdData() {
        //     var materialData = [];
        //     if (countableEtdMats && countableEtdMats.length > 0) {
        //         for (var i = 0; i < countableEtdMats.length; i++) {
        //             var index = msbUtilService.getIndex(materialData, "materialId", countableEtdMats[i].materialId);
        //             if (index === -1) {
        //                 materialData.push(countableEtdMats[i]);
        //             }
        //         }
        //     }
        //     callBack(materialData);
        // }

        function getEtdQty(material, etds) {
            if (material && etds) {
                var etdIndex = msbUtilService.getIndex(etds, PRIMARY_COLUMN_NAME, material.etdId);
                if (etdIndex > -1) {
                    if (etds[etdIndex] && etds[etdIndex].destinations && etds[etdIndex].destinations.length > 0) {
                        var destinationIndex = msbUtilService.getIndex(etds[etdIndex].destinations, PRIMARY_COLUMN_NAME, material.destinationId);
                        if (destinationIndex > -1) {
                            return etds[etdIndex].destinations[destinationIndex].assortQuantity;
                        } else {
                            return etds[etdIndex].assortQuantity;
                        }
                    }
                }
            }
        }

        function checkMaterialTypeId(params) {
            if (msbUtilService.checkUndefined(params)) {
                var material = msbUtilService.searchFromParam(params, "material");
                var materialDef = msbUtilService.searchFromParam(params, "materialDef");
                var stateUrl = msbUtilService.searchFromParam(params, "stateUrl");
                if (material && material.materialId && materialDef && materialDef.length > 0 && stateUrl) {
                    var index = msbUtilService.getIndex(materialDef, "gMatColorSizeId", material.materialId);
                    if (index > -1) {
                        if (materialDef[index] && materialDef[index].materialTypeId) {
                            if (materialDef[index].materialTypeId == stateUrl) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }
                }
            }
        }

        function checkComboMaterialTypeId(params) {
            if (msbUtilService.checkUndefined(params)) {
                var material = msbUtilService.searchFromParam(params, "material");
                var materialDef = msbUtilService.searchFromParam(params, "materialDef");
                var stateUrl = msbUtilService.searchFromParam(params, "stateUrl");
                if (material && material.materialId && materialDef && materialDef.length > 0 && stateUrl) {
                    var index = msbUtilService.getIndex(materialDef, "gMatColorSizeComboId", material.materialId);
                    if (index > -1) {
                        if (materialDef[index] && materialDef[index].materialTypeId) {
                            if (materialDef[index].materialTypeId == stateUrl) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }
                }
            }
        }

        function getCuttableComboMaterialDetail(param) {
            if (param) {
                if (!param.materialDef) {
                    return;
                }
                var index = msbUtilService.getIndex(param.materialDef, "gMatColorId", param.material.materialId);
                if (index > -1) {
                    if (param.code == 'title') {
                        return param.materialDef[index].materialTitle;
                    } else if (param.code == 'description') {
                        return param.materialDef[index].materialDescription;
                    } else if (param.code == 'color') {
                        return param.materialDef[index].color;
                    } else if (param.code == 'size') {
                        return param.materialDef[index].materialWidth;
                    } else if (param.code == 'combo') {
                        return param.materialDef[index].comboTitle;
                    }
                }
            }
        }

        function getTotalFoldingMaterialConsumption(param) {
            if (param) {
                if (!param.material) {
                    return;
                }
                if (param.materialQuantity) {
                    var rawCountCons = param.materialQuantity * (param.material.perConsumption * 1);
                    param.material.ttlConsumption = (rawCountCons + (rawCountCons * (param.material.wastage / 100)));
                }
                return param.material.ttlConsumption.toFixed(2);

            }
        }

        function getFoldingMaterialContainers(param) {
            if (param && param.material && param.category && param.category.length > 0) {
                var catIndex = msbUtilService.getIndex(param.category, PRIMARY_COLUMN_NAME, param.material.materialId);
                if (catIndex > -1) {
                    if (param.category[catIndex].containers && param.category[catIndex].containers.length > 0) {
                        return param.category[catIndex].containers;
                    }
                }
            }
        }

        function getNumOfFoldingContainersforConsumption(param) {
            if (param) {
                var sizeUnit = 0;
                if (param.material && param.material.containerId && param.material.sizeUnitId &&
                    param.material.materialId && param.category && param.category.length > 0) {

                    var catIndex = msbUtilService.getIndex(param.category, PRIMARY_COLUMN_NAME, param.material.materialId);

                    if (catIndex > -1) {
                        if (param.category[catIndex].containers && param.category[catIndex].containers.length > 0) {
                            var containerIndex = msbUtilService.getIndex(param.category[catIndex].containers, PRIMARY_COLUMN_NAME, param.material.containerId);

                            if (containerIndex > -1) {
                                if (param.category[catIndex].containers[containerIndex].sizes && param.category[catIndex].containers[containerIndex].sizes.length > 0) {
                                    var sizeUnitIndex = msbUtilService.getIndex(param.category[catIndex].containers[containerIndex].sizes, PRIMARY_COLUMN_NAME, param.material.sizeUnitId);

                                    if (sizeUnitIndex > -1) {
                                        sizeUnit = param.category[catIndex].containers[containerIndex].sizes[sizeUnitIndex].capacity * 1 * 12;
                                        if (param.material.ttlConsumption) {
                                            return param.material.numOfContainer = Math.ceil((param.material.ttlConsumption * 1) / sizeUnit);
                                        } else {
                                            return param.material.numOfContainer = 0;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        function getTotalPackingMaterialConsumption(param) {
            if (param) {
                if (!param.material) {
                    return;
                }
                if (param.materialQuantity) {
                    var rawCountCons = param.materialQuantity * (param.material.perConsumption * 1);
                    param.material.ttlConsumption = (rawCountCons + (rawCountCons * (param.material.wastage / 100)));
                }
                return param.material.ttlConsumption.toFixed(2);

            }
        }

        function getPackingMaterialContainers(param) {
            if (param && param.material && param.category && param.category.length > 0 &&
                param.containerMaterials && param.containerMaterials.length > 0) {
                var index = msbUtilService.getIndex(param.containerMaterials, PRIMARY_COLUMN_NAME, param.material.containerMaterialId);
                if (index > -1) {
                    var catIndex = msbUtilService.getIndex(param.category, PRIMARY_COLUMN_NAME, param.containerMaterials[index].categoryId);
                    if (catIndex > -1) {
                        if (param.category[catIndex].containers && param.category[catIndex].containers.length > 0) {
                            return param.category[catIndex].containers;
                        }
                    }
                }
            }
        }

        function getNumOfPackingMatContainersforConsumption(param) {
            if (param) {
                var sizeUnit = 0;
                if (param.material && param.material.containerId && param.material.sizeUnitId &&
                    param.material.containerMaterialId && param.category && param.category.length > 0 &&
                    param.containerMaterials && param.containerMaterials.length > 0) {

                    var index = msbUtilService.getIndex(param.containerMaterials, PRIMARY_COLUMN_NAME, param.material.containerMaterialId);
                    if (index > -1) {
                        var catIndex = msbUtilService.getIndex(param.category, PRIMARY_COLUMN_NAME, param.containerMaterials[index].categoryId);
                        if (catIndex > -1) {
                            if (param.category[catIndex].containers && param.category[catIndex].containers.length > 0) {
                                var containerIndex = msbUtilService.getIndex(param.category[catIndex].containers, PRIMARY_COLUMN_NAME, param.material.containerId);
                                if (containerIndex > -1) {
                                    if (param.category[catIndex].containers[containerIndex].sizes && param.category[catIndex].containers[containerIndex].sizes.length > 0) {
                                        var sizeUnitIndex = msbUtilService.getIndex(param.category[catIndex].containers[containerIndex].sizes, PRIMARY_COLUMN_NAME, param.material.sizeUnitId);
                                        if (sizeUnitIndex > -1) {
                                            sizeUnit = param.category[catIndex].containers[containerIndex].sizes[sizeUnitIndex].capacity * 1 * 12;
                                            if (param.material.ttlConsumption) {
                                                return param.material.numOfContainer = Math.ceil((param.material.ttlConsumption * 1) / sizeUnit);
                                            } else {
                                                return param.material.numOfContainer = 0;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        function getPackingContainers(param) {
            if (param && param.material && param.category && param.category.length > 0 && param.packingContainers &&
                param.packingContainers.length > 0 && param.packingMaterialTypes && param.packingMaterialTypes.length > 0) {
                var contIndex = msbUtilService.getIndex(param.packingContainers, PRIMARY_COLUMN_NAME, param.material.materialContainerId);
                if (contIndex > -1) {
                    var packTypeIndex = msbUtilService.getIndex(param.packingMaterialTypes, PRIMARY_COLUMN_NAME, param.packingContainers[contIndex].categoryId);
                    if (packTypeIndex > -1) {
                        if (param.packingMaterialTypes[packTypeIndex] && param.packingMaterialTypes[packTypeIndex].categoryId) {
                            var catIndex = msbUtilService.getIndex(param.category, PRIMARY_COLUMN_NAME, param.packingMaterialTypes[packTypeIndex].categoryId);
                            if (catIndex > -1) {
                                if (param.category[catIndex].containers && param.category[catIndex].containers.length > 0) {
                                    return param.category[catIndex].containers;
                                }
                            }
                        }
                    }
                }
            }
        }

        function getNumOfPackingContainersforConsumption(param) {
            if (param) {
                var sizeUnit = 0;
                if (param.material && param.material.containerId && param.material.sizeUnitId &&
                    param.material.materialContainerId && param.category && param.category.length > 0 && param.packingContainers &&
                    param.packingContainers.length > 0 && param.packingMaterialTypes && param.packingMaterialTypes.length > 0) {

                    var contIndex = msbUtilService.getIndex(param.packingContainers, PRIMARY_COLUMN_NAME, param.material.materialContainerId);
                    if (contIndex > -1) {
                        var packTypeIndex = msbUtilService.getIndex(param.packingMaterialTypes, PRIMARY_COLUMN_NAME, param.packingContainers[contIndex].categoryId);
                        if (packTypeIndex > -1) {
                            if (param.packingMaterialTypes[packTypeIndex] && param.packingMaterialTypes[packTypeIndex].categoryId) {
                                var catIndex = msbUtilService.getIndex(param.category, PRIMARY_COLUMN_NAME, param.packingMaterialTypes[packTypeIndex].categoryId);
                                if (catIndex > -1) {
                                    if (param.category[catIndex].containers && param.category[catIndex].containers.length > 0) {
                                        if (param.category[catIndex].containers && param.category[catIndex].containers.length > 0) {
                                            var containerIndex = msbUtilService.getIndex(param.category[catIndex].containers, PRIMARY_COLUMN_NAME, param.material.containerId);
                                            if (containerIndex > -1) {
                                                if (param.category[catIndex].containers[containerIndex].sizes && param.category[catIndex].containers[containerIndex].sizes.length > 0) {
                                                    var sizeUnitIndex = msbUtilService.getIndex(param.category[catIndex].containers[containerIndex].sizes, PRIMARY_COLUMN_NAME, param.material.sizeUnitId);
                                                    if (sizeUnitIndex > -1) {
                                                        sizeUnit = param.category[catIndex].containers[containerIndex].sizes[sizeUnitIndex].capacity * 1 * 12;
                                                        if (param.material.ttlConsumption) {
                                                            return param.material.numOfContainer = Math.ceil((param.material.ttlConsumption * 1) / sizeUnit);
                                                        } else {
                                                            return param.material.numOfContainer = 0;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        function getFoldingMaterialDetail(param) {
            if (param && param.material && param.material.materialId && param.foldingMaterials && param.foldingMaterials.length > 0 && param.code) {
                var index = msbUtilService.getIndex(param.foldingMaterials, "categoryId", param.material.materialId);
                if (index > -1) {
                    if (param.code === "description") {
                        return param.foldingMaterials[index].itemDescription;
                    } else if (param.code === "color") {
                        return param.foldingMaterials[index].color;
                    } else if (param.code === "size") {
                        return param.foldingMaterials[index].size;
                    }
                }
            }
        }

        function getPackingMaterialDetail(param) {
            if (param && param.material && param.material.containerMaterialId && param.containerMaterials && param.containerMaterials.length > 0 && param.code) {
                var index = msbUtilService.getIndex(param.containerMaterials, PRIMARY_COLUMN_NAME, param.material.containerMaterialId);
                if (index > -1) {
                    if (param.code === "description") {
                        return param.containerMaterials[index].itemDescription;
                    } else if (param.code === "color") {
                        return param.containerMaterials[index].color;
                    } else if (param.code === "size") {
                        return param.containerMaterials[index].size;
                    }
                }
            }
        }

        function getPackingContainerDetail(param) {
            if (param && param.material && param.material.materialContainerId && param.packingContainers && param.packingContainers.length > 0 && param.code) {
                var index = msbUtilService.getIndex(param.packingContainers, PRIMARY_COLUMN_NAME, param.material.materialContainerId);
                if (index > -1) {
                    if (param.code === "description") {
                        return param.packingContainers[index].description;
                    } else if (param.code === "color") {
                        return param.packingContainers[index].color;
                    } else if (param.code === "size") {
                        return param.packingContainers[index].size;
                    }
                }
            }
        }

        function getPackingContainerTitle(param) {
            if (param && param.material && param.category && param.category.length > 0 && param.packingContainers &&
                param.packingContainers.length > 0 && param.packingMaterialTypes && param.packingMaterialTypes.length > 0 &&
                param.containers && param.containers.length > 0) {
                var contIndex = msbUtilService.getIndex(param.packingContainers, PRIMARY_COLUMN_NAME, param.material.materialContainerId);
                if (contIndex > -1) {
                    var packTypeIndex = msbUtilService.getIndex(param.packingMaterialTypes, PRIMARY_COLUMN_NAME, param.packingContainers[contIndex].categoryId);
                    if (packTypeIndex > -1) {
                        if (param.packingMaterialTypes[packTypeIndex] && param.packingMaterialTypes[packTypeIndex].categoryId) {
                            var catIndex = msbUtilService.getIndex(param.category, PRIMARY_COLUMN_NAME, param.packingMaterialTypes[packTypeIndex].categoryId);
                            if (catIndex > -1) {
                                if (param.category[catIndex].containers && param.category[catIndex].containers.length > 0) {
                                    var containerIndex = msbUtilService.getIndex(param.category[catIndex].containers, PRIMARY_COLUMN_NAME, param.material.containerId);
                                    if (containerIndex > -1) {
                                        var contIndex = msbUtilService.getIndex(param.containers, PRIMARY_COLUMN_NAME, param.category[catIndex].containers[containerIndex].containerId);
                                        if (contIndex > -1) {
                                            return param.containers[contIndex].title;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        function getFoldingContainersCapacityUnitTitle(param) {
            if (param && param.material && param.category && param.category.length > 0 && param.packingContainers &&
                param.packingContainers.length > 0 && param.packingMaterialTypes && param.packingMaterialTypes.length > 0 &&
                param.containers && param.containers.length > 0 && param.measUnits && param.measUnits.length > 0) {
                var contIndex = msbUtilService.getIndex(param.packingContainers, PRIMARY_COLUMN_NAME, param.material.materialContainerId);
                if (contIndex > -1) {
                    var packTypeIndex = msbUtilService.getIndex(param.packingMaterialTypes, PRIMARY_COLUMN_NAME, param.packingContainers[contIndex].categoryId);
                    if (packTypeIndex > -1) {
                        if (param.packingMaterialTypes[packTypeIndex] && param.packingMaterialTypes[packTypeIndex].categoryId) {
                            var catIndex = msbUtilService.getIndex(param.category, PRIMARY_COLUMN_NAME, param.packingMaterialTypes[packTypeIndex].categoryId);
                            if (catIndex > -1) {
                                if (param.category[catIndex].containers && param.category[catIndex].containers.length > 0) {
                                    var containerIndex = msbUtilService.getIndex(param.category[catIndex].containers, PRIMARY_COLUMN_NAME, param.material.containerId);
                                    if (containerIndex > -1) {
                                        if (param.category[catIndex].containers[containerIndex].sizes && param.category[catIndex].containers[containerIndex].sizes.length > 0) {
                                            var sizeIndex = msbUtilService.getIndex(param.category[catIndex].containers[containerIndex].sizes, PRIMARY_COLUMN_NAME, param.material.sizeUnitId);
                                            if (sizeIndex > -1) {
                                                return param.category[catIndex].containers[containerIndex].sizes[sizeIndex].capacity
                                                    + " " + getMeasurementUnitTitle(param.category[catIndex].containers[containerIndex].sizes[sizeIndex].measurementUnitId, param.measUnits);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        function getPackingMaterialContainerTitle(param) {
            if (param && param.material && param.category && param.category.length > 0 &&
                param.containerMaterials && param.containerMaterials.length > 0) {
                var index = msbUtilService.getIndex(param.containerMaterials, PRIMARY_COLUMN_NAME, param.material.containerMaterialId);
                if (index > -1) {
                    var catIndex = msbUtilService.getIndex(param.category, PRIMARY_COLUMN_NAME, param.containerMaterials[index].categoryId);
                    if (catIndex > -1) {
                        if (param.category[catIndex].containers && param.category[catIndex].containers.length > 0) {
                            var containerIndex = msbUtilService.getIndex(param.category[catIndex].containers, PRIMARY_COLUMN_NAME, param.material.containerId);
                            if (containerIndex > -1) {
                                var contIndex = msbUtilService.getIndex(param.category, PRIMARY_COLUMN_NAME, param.category[catIndex].containers[containerIndex].containerId);
                                if (contIndex > -1) {
                                    return param.category[contIndex].title;
                                }
                            }
                        }
                    }
                }
            }
        }

        function getPackingMaterialContainersCapacityUnitTitle(param) {
            if (param && param.material && param.category && param.category.length > 0 &&
                param.containerMaterials && param.containerMaterials.length > 0 && param.measUnits && param.measUnits.length > 0) {
                var index = msbUtilService.getIndex(param.containerMaterials, PRIMARY_COLUMN_NAME, param.material.containerMaterialId);
                if (index > -1) {
                    var catIndex = msbUtilService.getIndex(param.category, PRIMARY_COLUMN_NAME, param.containerMaterials[index].categoryId);
                    if (catIndex > -1) {
                        if (param.category[catIndex].containers && param.category[catIndex].containers.length > 0) {
                            var containerIndex = msbUtilService.getIndex(param.category[catIndex].containers, PRIMARY_COLUMN_NAME, param.material.containerId);
                            if (containerIndex > -1) {
                                if (param.category[catIndex].containers[containerIndex].sizes && param.category[catIndex].containers[containerIndex].sizes.length > 0) {
                                    var sizeIndex = msbUtilService.getIndex(param.category[catIndex].containers[containerIndex].sizes, PRIMARY_COLUMN_NAME, param.material.sizeUnitId);
                                    if (sizeIndex > -1) {
                                        return param.category[catIndex].containers[containerIndex].sizes[sizeIndex].capacity
                                            + " " + getMeasurementUnitTitle(param.category[catIndex].containers[containerIndex].sizes[sizeIndex].measurementUnitId, param.measUnits);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        function getFoldingMaterialContainerTitle(param) {
            if (param && param.material && param.category && param.category.length > 0) {
                var catIndex = msbUtilService.getIndex(param.category, PRIMARY_COLUMN_NAME, param.material.materialId);
                if (catIndex > -1) {
                    if (param.category[catIndex].containers && param.category[catIndex].containers.length > 0) {
                        var containerIndex = msbUtilService.getIndex(param.category[catIndex].containers, PRIMARY_COLUMN_NAME, param.material.containerId);
                        if (containerIndex > -1) {
                            var contIndex = msbUtilService.getIndex(param.category, PRIMARY_COLUMN_NAME, param.category[catIndex].containers[containerIndex].containerId);
                            if (contIndex > -1) {
                                return param.category[contIndex].title;
                            }
                        }
                    }
                }
            }
        }

        function getFoldingMaterialContainersCapacityUnitTitle(param) {
            if (param && param.material && param.material.materialId && param.category && param.category.length > 0 &&
                param.foldingMaterials && param.foldingMaterials.length > 0 && param.measUnits && param.measUnits.length > 0) {
                var catIndex = msbUtilService.getIndex(param.category, PRIMARY_COLUMN_NAME, param.material.materialId);
                if (catIndex > -1) {
                    if (param.category[catIndex].containers && param.category[catIndex].containers.length > 0) {
                        var containerIndex = msbUtilService.getIndex(param.category[catIndex].containers, PRIMARY_COLUMN_NAME, param.material.containerId);
                        if (containerIndex > -1) {
                            if (param.category[catIndex].containers[containerIndex].sizes && param.category[catIndex].containers[containerIndex].sizes.length > 0) {
                                var sizeIndex = msbUtilService.getIndex(param.category[catIndex].containers[containerIndex].sizes, PRIMARY_COLUMN_NAME, param.material.sizeUnitId);
                                if (sizeIndex > -1) {
                                    return param.category[catIndex].containers[containerIndex].sizes[sizeIndex].capacity
                                        + " " + getMeasurementUnitTitle(param.category[catIndex].containers[containerIndex].sizes[sizeIndex].measurementUnitId, param.measUnits);
                                }
                            }
                        }
                    }
                }
            }
        }

        function getMaterialMarkerPlanAreaCons(param) {
            if (param && param.material) {
                if (!param.mpSizeDefCons) {
                    return;
                }
                if (!param.totalAssorts) {
                    return;
                }
                var cons = 0;
                for (var i = 0; i < param.totalAssorts.length; i++) {
                    if (param.totalAssorts[i]) {
                        for (var j = 0; j < param.mpSizeDefCons.length; j++) {
                            if (param.mpSizeDefCons[j] && param.mpSizeDefCons[j].sizeId === param.totalAssorts[i].sizeId &&
                                param.mpSizeDefCons[j].zoneId === param.totalAssorts[i].zoneId) {
                                if (param.mpSizeDefCons[j].isAvg === true) {
                                    if (param.mpSizeDefCons[j].averageCons * 1 > 0) {
                                        cons += ((param.mpSizeDefCons[j].averageCons * 1) * (param.totalAssorts[i].quantity * 1));
                                    }
                                } else {
                                    if (param.mpSizeDefCons[j].sizeCons * 1 > 0) {
                                        cons += ((param.mpSizeDefCons[j].sizeCons * 1) * (param.totalAssorts[i].quantity * 1));
                                    }
                                }
                            }
                        }
                    }
                }

                param.material.markerPlanAreaConsumption = cons;
                return param.material.markerPlanAreaConsumption;
            }
        }

        function getMaterialMarkerPlanCons(param) {
            if (param && param.material) {
                if (!param.mpSizeDefCons) {
                    return;
                }
                if (!param.totalAssorts) {
                    return;
                }
                var cons = 0;
                for (var i = 0; i < param.totalAssorts.length; i++) {
                    if (param.totalAssorts[i]) {
                        for (var j = 0; j < param.mpSizeDefCons.length; j++) {
                            if (param.mpSizeDefCons[j] && param.mpSizeDefCons[j].sizeId === param.totalAssorts[i].sizeId &&
                                param.mpSizeDefCons[j].zoneId === param.totalAssorts[i].zoneId) {
                                if (param.mpSizeDefCons[j].isAvg === true) {
                                    if (param.mpSizeDefCons[j].averageCons * 1 > 0) {
                                        cons += ((param.mpSizeDefCons[j].averageCons * 1) * (param.totalAssorts[i].quantity * 1));
                                    }
                                } else {
                                    if (param.mpSizeDefCons[j].sizeCons * 1 > 0) {
                                        cons += ((param.mpSizeDefCons[j].sizeCons * 1) * (param.totalAssorts[i].quantity * 1));
                                    }
                                }
                            }
                        }
                    }
                }

                param.material.markerPlanAreaConsumption = cons;

                var widthParam = { "material": param.material, "code": 'width', "enqConsMaterialDef": param.enqConsMaterialDef };
                var width = getCuttingMaterialDetail(widthParam);
                if (width * 1 > 0) {
                    param.material.markerPlanConsumption = cons / (width * 1);
                } else {
                    param.material.markerPlanConsumption = 0;
                }
                return param.material.markerPlanConsumption;
            }
        }

        function getMarkerPlanConsumption(param) {
            if (param) {
                param.material.totalMarkerPlanConsumption = (param.material.markerPlanConsumption + (param.material.markerPlanConsumption * (param.material.wastage / 100)));
                return param.material.totalMarkerPlanConsumption;
            }
        }


        return services;
    }
})();
