(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('consumptionCalculationService', consumptionCalculationService);

    /** @ngInject */
    function consumptionCalculationService(msbUtilService, msbMeasurementService, MEASUREMENT_CALCULATION_TYPES) {

        var methods = this;

        methods.quantityDefOperation = quantityDefOperation();
        methods.stitchDefHandler = stitchDefHandler();
        methods.calculateConsumption = calculateConsumption();
        methods.consumptionPersistor = consumptionPersistor();
        methods.countableHandler = countableHandler();
        methods.cuttableHandler = cuttableHandler();
        methods.quickMarkerDataHandler = quickMarkerDataHandler();
        methods.panelDataHandler = panelDataHandler();
        methods.pomDataHandler = pomDataHandler();
        methods.prodMarkerHandler = prodMarkerHandler();
        methods.consPolicies = consPolicies();
        methods.packingConsumptionHandler = packingConsumptionHandler();
        methods.foldingConsumptionHandler = foldingConsumptionHandler();
        methods.assortDefHandler = assortDefHandler();



        var services = {

            consPolicies: methods.consPolicies,

            calculateTotalGarmentQuantity: methods.quantityDefOperation.calculateTotalGarmentQuantity,
            calculateComboSizeWiseTotalQuantityDef: methods.quantityDefOperation.calculateComboSizeWiseTotalQuantityDef,
            calculateComboeWiseTotalQuantityDef: methods.quantityDefOperation.calculateComboeWiseTotalQuantityDef,
            calculateComboSizeEtdQuantityDef: methods.quantityDefOperation.calculateComboSizeEtdQuantityDef,
            calculateComboWiseEtdQuantityDef: methods.quantityDefOperation.calculateComboWiseEtdQuantityDef,
            calculateEtdWiseQuantity: methods.quantityDefOperation.calculateEtdWiseQuantity,

            prepareNewAssortInfo: methods.assortDefHandler.prepareNewAssortInfo,
            prepareAssortInfoForDisplay: methods.assortDefHandler.prepareAssortInfoForDisplay,
            prepareAssortInfoForPersist: methods.assortDefHandler.prepareAssortInfoForPersist,
            prepareAssortQuantityInfoForDisplay: methods.assortDefHandler.prepareAssortQuantityInfoForDisplay,


            preparePomInfo: methods.pomDataHandler.preparePomInfo,

            getNewPom: methods.pomDataHandler.getNewPom,
            calculatePomComboSizeWiseConsumption: methods.pomDataHandler.calculateComboSizeWiseConsumption,
            initPomInfo: methods.pomDataHandler.initPomInfo,
            loadSelectedPomUnits: methods.pomDataHandler.loadSelectedPomUnits,
            updatePartSizeInfo: methods.pomDataHandler.updatePartSizeInfo,
            initiatePomDef: methods.pomDataHandler.initiatePomDef,

            prepareConatinerInfo: methods.packingConsumptionHandler.prepareConatinerInfo,
            preparePackingMaterialInfo: methods.packingConsumptionHandler.preparePackingMaterials,
            calculateEtdWisePackingContainerConsumption: methods.packingConsumptionHandler.calculateEtdWiseContainerConsumption,
            calculateEtdWisePackingMaterialConsumption: methods.packingConsumptionHandler.calculateEtdWiseMaterialConsumption,
            calculatePackingMaterialConsumption: methods.packingConsumptionHandler.calculateMaterialConsumption,
            preparePackingMaterialConsumptionInfo: methods.packingConsumptionHandler.preparePackingMaterialConsumptionInfo,
            preparePackingItemConsumptionInfo: methods.packingConsumptionHandler.preparePackingItemConsumptionInfo,
            calculatePackingAndMaterialConsumption: methods.packingConsumptionHandler.calculatePackingAndMaterialConsumption,

            prepareFoldingInfo: methods.foldingConsumptionHandler.prepareFoldingInfo,
            prepareEtdWiseFoldingMaterialInfo: methods.foldingConsumptionHandler.prepareEtdWiseFoldingMaterialInfo,
            prepareEtdWiseFoldingTypeInfo: methods.foldingConsumptionHandler.prepareEtdWiseFoldingTypeInfo,
            calculateMaterialTotlaConsumption: methods.foldingConsumptionHandler.calculateMaterialTotlaConsumption,

            prepareQuickMarkerMaterialAssortForCombo: methods.quickMarkerDataHandler.prepareMaterialAssortForCombo,
            prepareQuickMarkerComboWiseConsumption: methods.quickMarkerDataHandler.prepareComboWiseConsumption,
            prepareQuickMarkerConsumptionOfAMaterialForComboSize: methods.quickMarkerDataHandler.prepareConsumptionOfAMaterialForComboSize,
            prepareQuickMarkerEtdWiseConsumption: methods.quickMarkerDataHandler.prepareEtdWiseConsumption,
            prepareQuickMarkerTotalConsumption: methods.quickMarkerDataHandler.preparTotalConsumption,
            calculateQuickMarkerEtdMaterialConsumption: methods.quickMarkerDataHandler.calculateEtdMaterialConsumption,

            calculatePanelMaterialConsumptionForAComboSize: methods.panelDataHandler.calculateMaterialConsumptionForAComboSize,
            setPanelSizeUnit: methods.panelDataHandler.setPanelSizeUnit,
            setPanelUnitDefinitions: methods.panelDataHandler.setPanelUnitDefinitions,

            getMaterialComboMarker: methods.prodMarkerHandler.getMaterialComboMarker,
            addNewMarker: methods.prodMarkerHandler.addNewMarker,
            calculateMarkerInfo: methods.prodMarkerHandler.calculateMarkerInfo,
            adjustBeginingQuantity: methods.prodMarkerHandler.adjustBeginingQuantity,
            calculateProdMarkerComboSizeConsumptionOfAMaterial: methods.prodMarkerHandler.calculateComboSizeConsumptionOfAMaterial,

            getSetupUnitDefinitions: methods.stitchDefHandler.getSetupUnitDefinitions,
            setSetupUnitDefForStitches: methods.stitchDefHandler.setSetupUnitDefForStitches,
            setSetupUnitDefForThread: methods.stitchDefHandler.setSetupUnitDefForThread,
            setUnitDefForProcessStitch: methods.stitchDefHandler.setUnitDefForProcessStitch,
            getProcessStitchUnitDef: methods.stitchDefHandler.getProcessStitchUnitDef,
            setTotalStitchProcessLength: methods.stitchDefHandler.setTotalProcessLength,
            getThreadConsumptionUnit: getThreadConsumptionUnit,
            calculateSizeWiseThreadPositionConsumption: methods.stitchDefHandler.calculateSizeWiseThreadPositionConsumption,
            calculateThreadConsumptionOfAMaterialForComboSize: methods.stitchDefHandler.calculateConsumptionOfAMaterialForComboSize,

            prepareComboSizeWiseMaterialList: methods.cuttableHandler.prepareComboSizeWiseMaterialList,

            calculateCountableConsumptionOfAMaterialForComboSize: methods.countableHandler.calculateConsumptionOfAMaterialForComboSize,



            calculateMaterialConsumption: methods.calculateConsumption.calculateMaterialConsumption,
            calculateEtdwiseConsumption: methods.calculateConsumption.calculateEtdwiseConsumption,
            calculateComboWiseConsumption: methods.calculateConsumption.calculateComboWiseConsumption,

            preparePersistableData: methods.consumptionPersistor.preparePersistableData,

            getCuttableConsumptionUnit: getCuttableConsumptionUnit

        }

        function consPolicies() {
            var detailsConsPolicies = {
                QM_CONS_POLICY: "QuickMarkerDetailsCons",
                PACK_CONSPOLICY_BY_DEF: "def",
                PACK_CONSPOLICY_BY_QTY: "qty",
                CONSUMPTION_DETAILS_PREFIX: "DetailCons",
                POM_SELECTED_PREFIX_LENGTH: "PomLengthSelected",
                POM_SELECTED_PREFIX_WIDTH: "PomWidthSelected",
                COSTING_POLICY_POM: "pomCosting",
                COSTING_POLICY_PANEL: "panelCosting",
                COSTING_POLICY_PROD_MARKER: "markerPlanCosting",
                COSTING_POLICY_QM_MARKER: "qmCosting",

            };
            return detailsConsPolicies;
        }

        function getCuttableConsumptionUnit(supplyCategory) {

            var measurementUnits = msbMeasurementService.getUnitDefinitions(supplyCategory, msbMeasurementService.getFabricOrderDimentionDef);

            var consUnit = (measurementUnits && measurementUnits.lengthDef && measurementUnits.lengthDef.defaultUnit)
                ? measurementUnits.lengthDef.defaultUnit
                : "";
            return consUnit;
        }

        function getPackingMaterialConsumptionUnit(supplyCategory) {

            var measurementUnits = msbMeasurementService.getUnitDefinitions(supplyCategory, msbMeasurementService.getPackingMaterialOrderConsumptionDef);

            var consUnit = (measurementUnits && measurementUnits.lengthDef && measurementUnits.lengthDef.defaultUnit)
                ? measurementUnits.lengthDef.defaultUnit
                : "";
            return consUnit;
        }

        function getThreadConsumptionUnit(supplyCategory) {

            var measurementUnits = msbMeasurementService.getUnitDefinitions(supplyCategory, msbMeasurementService.getThreadOrderDimentionDef);

            var consUnit = (measurementUnits.lengthDef.defaultUnit)
                ? measurementUnits.lengthDef.defaultUnit
                : "";
            return consUnit;
        }

        function prodMarkerHandler() {
            var opDef = {
                addNewMarker: addNewMarker,
                getMaterialComboMarker: getMaterialComboMarker,
                calculateMarkerInfo: calculateMarkerInfo,
                adjustBeginingQuantity: adjustBeginingQuantity,
                calculateComboSizeConsumptionOfAMaterial: calculateComboSizeConsumptionOfAMaterial
            }

            function calculateNumberOfPlies(marker) {

                var minimumNoOfPlies = -1;

                if (marker && marker.markerSizeInfo) {
                    marker.markerSizeInfo.forEach(function (item) {
                        if (item && item.beginningQty && item.garmentQty) {
                            var noOfReqPiles = parseInt(item.beginningQty / item.garmentQty);
                            if (minimumNoOfPlies <= 0) {
                                minimumNoOfPlies = noOfReqPiles;
                            } else if (minimumNoOfPlies > noOfReqPiles) {
                                minimumNoOfPlies = noOfReqPiles;
                            }
                        }
                    })
                }

                return (minimumNoOfPlies > 0) ? minimumNoOfPlies : 1;

            }


            function calculateNumberOfCutGarments(marker, noOfPlies) {

                if (marker && marker.markerSizeInfo) {
                    marker.markerSizeInfo.forEach(function (item) {
                        if (item && item.garmentQty != undefined) {
                            item.cutQty = noOfPlies * item.garmentQty;
                        }
                    })
                }

            }

            function calculateNumberOfGarments(marker) {

                var totalCutQty = 0;

                if (marker && marker.markerSizeInfo) {
                    marker.markerSizeInfo.forEach(function (item) {
                        if (item) {
                            totalCutQty += item.cutQty;
                        }
                    })
                }

                return totalCutQty;

            }

            function calculateRunningPlies(marker, materialComboMarker) {

                var prevQty = (materialComboMarker.length > 1 && materialComboMarker[materialComboMarker.length - 2] && materialComboMarker[materialComboMarker.length - 2].runningPly)
                    ? materialComboMarker[materialComboMarker.length - 2].runningPly : 0;

                var currentMarkerPly = (marker && marker.noOfPly) ? marker.noOfPly : 0;

                return prevQty + currentMarkerPly;


            }

            function checkIfNewMarkerRequired(marker) {

                var newMarkerRequired = 0;

                if (marker && marker.markerSizeInfo) {
                    marker.markerSizeInfo.forEach(function (item) {
                        if (item) {
                            var begQty = (item.beginningQty) ? item.beginningQty : 0;
                            var cutQty = (item.cutQty) ? item.cutQty : 0;
                            if (begQty > cutQty) {
                                newMarkerRequired = 1;
                            }
                        }
                    })
                }

                return newMarkerRequired;

            }

            function getMarkerIndex(marker, materialComboMarker) {
                var index = -1;
                if (materialComboMarker && marker) {
                    index = msbUtilService.getIndex(materialComboMarker, "TECHDISER_ID", marker.TECHDISER_ID);
                }
                return index;
            }

            function adjustMarkerInfo(marker, materialComboMarker, index) {

                if (!materialComboMarker || !marker) {
                    return;
                }

                marker.noOfPly = calculateNumberOfPlies(marker);

                calculateNumberOfCutGarments(marker, marker.noOfPly);

                marker.garmentQuantity = calculateNumberOfGarments(marker);

                marker.runningPly = calculateRunningPlies(marker, materialComboMarker);

                marker.newMarkerRequired = checkIfNewMarkerRequired(marker);

                if (materialComboMarker.length > index) {
                    materialComboMarker[index] = marker;
                }

            }

            function adjustBeginingQuantity(marker, materialComboMarker, previousItemIndex) {

                if (!marker || !marker.markerSizeInfo || !materialComboMarker) {
                    return;
                }
                marker.markerSizeInfo.forEach(function (size) {
                    if (size) {
                        size.beginningQty = getBeginningQty(materialComboMarker, [], marker.comboId, size.sizeId, previousItemIndex);
                    }
                });

            }

            function calculateMarkerInfo(marker, materialComboMarker) {

                if (marker && materialComboMarker) {

                    var markerIndex = getMarkerIndex(marker, materialComboMarker);

                    if (markerIndex >= 0) {
                        for (var i = markerIndex; i < materialComboMarker.length; i++) {
                            if (i > markerIndex) {
                                adjustBeginingQuantity(materialComboMarker[i], materialComboMarker, i - 1);
                            }
                            adjustMarkerInfo(materialComboMarker[i], materialComboMarker, i);
                        }
                    }

                }

            }

            function getBeginningQty(materialComboMarker, comboQtyDef, comboId, sizeId, previousItemIndex) {

                var beginningQty = 0;

                if (!materialComboMarker || !comboQtyDef) {
                    return beginningQty;
                }
                if (materialComboMarker.length <= 0) {
                    comboQtyDef.forEach(function (item) {
                        if (item && item.comboId == comboId && item.sizeId == sizeId) {
                            beginningQty = item.quantity;
                        }
                    })
                } else if (materialComboMarker.length > previousItemIndex) {
                    if (materialComboMarker[previousItemIndex] && materialComboMarker[previousItemIndex].markerSizeInfo) {
                        materialComboMarker[previousItemIndex].markerSizeInfo.forEach(function (item) {
                            if (item && item.sizeId && item.sizeId == sizeId) {
                                var begQty = (item.beginningQty) ? item.beginningQty : 0;
                                var cutQty = (item.cutQty) ? item.cutQty : 0;
                                beginningQty = begQty - cutQty;
                            }
                        })
                    }
                }

                if (beginningQty < 0) {
                    beginningQty = 0;
                }

                return parseInt(beginningQty);
            }

            function newMarkerInfo(uniqueId, comboId, materialId, sizeDefinition, colorSizeId, materialComboMarker, comboQtyDef) {

                if (!uniqueId || !comboId || !materialId || !materialComboMarker || !sizeDefinition || !sizeDefinition || !colorSizeId || !comboQtyDef) {
                    return null;
                }

                var markerSizeInfo = [];

                var techId = "MarkerDef" + uniqueId + materialId + colorSizeId + comboId + materialComboMarker.length;

                sizeDefinition.forEach(function (sizeDef) {
                    if (sizeDef && sizeDef.sizes) {
                        sizeDef.sizes.forEach(function (size) {
                            var info = {};
                            info.TECHDISER_ID = techId + size.TECHDISER_ID;
                            info.sizeId = size.TECHDISER_ID;
                            info.beginningQty = getBeginningQty(materialComboMarker, comboQtyDef, comboId, info.sizeId, materialComboMarker.length - 1);
                            info.garmentQty = 0;
                            info.cutQty = 0;
                            markerSizeInfo.push(info);
                        });

                    }
                });

                var runningPly = (materialComboMarker.length > 0 && materialComboMarker[materialComboMarker.length - 1] && materialComboMarker[materialComboMarker.length - 1].runningPly)
                    ? materialComboMarker[materialComboMarker.length - 1].runningPly : 0;

                var markerLength = (materialComboMarker.length > 0 && materialComboMarker[materialComboMarker.length - 1] && materialComboMarker[materialComboMarker.length - 1].markerLength)
                    ? materialComboMarker[materialComboMarker.length - 1].markerLength : 0;

                var markerLengthUnit = (materialComboMarker.length > 0 && materialComboMarker[materialComboMarker.length - 1] && materialComboMarker[materialComboMarker.length - 1].markerLengthUnit)
                    ? materialComboMarker[materialComboMarker.length - 1].markerLengthUnit : "";

                var item = {
                    "TECHDISER_ID": techId,
                    "TECHDISER_SERIAL_NO": materialComboMarker.length,
                    "matItemId": materialId + colorSizeId,
                    "matItemComboId": materialId + colorSizeId + comboId,
                    "comboId": comboId,
                    "colorSizeId": colorSizeId,
                    "materialId": materialId,
                    "markerPolcyNo": "",
                    "markerLength": markerLength,
                    "markerLengthUnit": markerLengthUnit,
                    "markerSizeInfo": markerSizeInfo,
                    "noOfPly": 0,
                    "garmentQuantity": 0,
                    "runningPly": runningPly,
                    "newMarkerRequired": 0
                };

                return item;


            }

            function needToAddMarker(materialComboMarker) {
                debugger
                if (!materialComboMarker) {
                    return false;
                }
                if (materialComboMarker.length <= 0) {
                    return true;
                } else {
                    var dataFound = false;
                    if (materialComboMarker[materialComboMarker.length - 1].markerSizeInfo) {
                        materialComboMarker[materialComboMarker.length - 1].markerSizeInfo.forEach(function (szData) {
                            if (szData.garmentQty > 0) {
                                dataFound = true;
                            }
                        });
                    }
                    if (!dataFound) {
                        return false;
                    }
                    if (materialComboMarker[materialComboMarker.length - 1].newMarkerRequired && materialComboMarker[materialComboMarker.length - 1].newMarkerRequired == 1) {
                        return true;
                    }
                }
                return false;
            }

            function addNewMarker(uniqueId, comboId, materialId, sizeDefinition, colorSizeId, materialComboMarker, comboQtyDef) {

                if (!materialComboMarker) {
                    materialComboMarker = [];
                }

                if (needToAddMarker(materialComboMarker)) {
                    var neItem = newMarkerInfo(uniqueId, comboId, materialId, sizeDefinition, colorSizeId, materialComboMarker, comboQtyDef);
                    if (neItem) {
                        materialComboMarker.push(neItem);
                    }
                }

            }

            function calculateComboSizeConsumptionOfAMaterial(uniqueId, materialComboMarker, material, supplyCategory) {

                var fn = this;

                fn.calculateConsumption = calculateConsumption;
                fn.calTotalGamentsOfMarker = calTotalGamentsOfMarker;
                fn.calculateSiseWiseConsumptionOfMarker = calculateSiseWiseConsumptionOfMarker;
                fn.calulateSizeWiseConsumption = calulateSizeWiseConsumption;
                fn.calculateSizewiseAverageConsumprion = calculateSizewiseAverageConsumprion;
                fn.calculateSizewiseTotalConsumprion = calculateSizewiseTotalConsumprion;
                fn.calSizewiseAverageConsumprion = calSizewiseAverageConsumprion;

                function calTotalGamentsOfMarker(marker) {
                    var totalGamentsOfMarker = 0;
                    if (marker && marker.markerSizeInfo) {
                        marker.markerSizeInfo.forEach(function (size) {
                            if (size && size.garmentQty) {
                                totalGamentsOfMarker += size.garmentQty;
                            }
                        })
                    }
                    return totalGamentsOfMarker;
                }

                function calculateSiseWiseConsumptionOfMarker(markerArea, totalGamentsOfMarker, marker, consUnit) {

                    var sizeWiseConsumption = [];

                    if (!markerArea || !totalGamentsOfMarker || !marker) {
                        return sizeWiseConsumption;
                    }

                    if (marker.markerSizeInfo) {
                        marker.markerSizeInfo.forEach(function (size) {
                            if (size && size.garmentQty) {
                                var info = {};
                                info.markerId = marker.TECHDISER_ID;
                                info.sizeId = size.sizeId;
                                info.garmentQty = size.garmentQty;
                                info.comboId = marker.comboId;
                                info.comboSizeId = size.sizeId + marker.comboId;
                                info.TKDR_MEASUREMENT_AREA = consUnit;
                                info.consumption = markerArea * (size.garmentQty / totalGamentsOfMarker);
                                sizeWiseConsumption.push(info);
                            }
                        });
                    }

                    return sizeWiseConsumption;

                }

                function calulateSizeWiseConsumption(materialComboMarker, material, consUnit) {

                    var sizeWiseConsumptionInfo = [];

                    if (materialComboMarker && material && material.width) {
                        materialComboMarker.forEach(function (marker) {
                            if (marker && marker.markerLength) {
                                var matUnit = (material.widthUnit)
                                    ? material.widthUnit
                                    : (material.TKDR_MEASUREMENT_UNIT)
                                        ? material.TKDR_MEASUREMENT_UNIT
                                        : "";
                                var markerAreaCons = msbMeasurementService.calculateArea(marker.markerLength, marker.markerLengthUnit
                                    , (material.effectiveWidth) ? material.effectiveWidth : material.width
                                    , matUnit, consUnit);
                                var markerArea = (markerAreaCons) ? markerAreaCons.dt : 0;
                                var totalGamentsOfMarker = fn.calTotalGamentsOfMarker(marker);
                                var sizeWiseConsumption = fn.calculateSiseWiseConsumptionOfMarker(markerArea, totalGamentsOfMarker, marker, consUnit);
                                sizeWiseConsumptionInfo = sizeWiseConsumptionInfo.concat(sizeWiseConsumption);
                            }
                        })
                    }

                    return sizeWiseConsumptionInfo;
                }

                function calculateSizewiseTotalConsumprion(sizeWiseConsumptionInfo) {

                    var sizewiseTotalConsumprion = [];

                    if (sizeWiseConsumptionInfo) {

                        sizeWiseConsumptionInfo.forEach(function (sizeInfo) {
                            if (sizeInfo && sizeInfo.sizeId) {
                                var index = msbUtilService.getIndex(sizewiseTotalConsumprion, "sizeId", sizeInfo.sizeId);
                                if (index < 0) {
                                    var info = {};
                                    info.sizeId = sizeInfo.sizeId;
                                    info.comboId = sizeInfo.comboId;
                                    info.comboSizeId = sizeInfo.comboId + sizeInfo.sizeId;
                                    info.garmentQty = (sizeInfo.garmentQty) ? sizeInfo.garmentQty : 0;
                                    info.consumption = (sizeInfo.consumption) ? sizeInfo.consumption : 0;
                                    info.TKDR_MEASUREMENT_AREA = sizeInfo.TKDR_MEASUREMENT_AREA;
                                    sizewiseTotalConsumprion.push(info);
                                } else {
                                    sizewiseTotalConsumprion[index].garmentQty += (sizeInfo.garmentQty) ? sizeInfo.garmentQty : 0;
                                    sizewiseTotalConsumprion[index].consumption += (sizeInfo.consumption) ? sizeInfo.consumption : 0;
                                }
                            }
                        });

                    }

                    return sizewiseTotalConsumprion;

                }

                function calSizewiseAverageConsumprion(uniqueId, sizewiseTotalConsumprion, material) {

                    var sizewiseAverageConsumprion = [];

                    if (sizewiseTotalConsumprion && material) {

                        sizewiseTotalConsumprion.forEach(function (sizeInfo) {
                            if (sizeInfo && sizeInfo.sizeId) {

                                var info = {};
                                info.title = material.title;
                                info.description = material.description;
                                info.color = material.color;
                                info.matSize = material.width;
                                info.sizeId = sizeInfo.sizeId;
                                info.comboId = sizeInfo.comboId;
                                info.comboSizeID = sizeInfo.comboId + sizeInfo.sizeId;
                                info.materialId = material.materialId;
                                info.materialCatId = material.materialCatId;
                                info.matItemId = material.matItemId;
                                info.matItemComboId = material.matItemId + sizeInfo.comboId;
                                info.matItemComboSizeID = material.matItemId + sizeInfo.comboId + sizeInfo.sizeId;

                                info.TECHDISER_ID = uniqueId + info.matItemComboSizeID;

                                info.perGarmentConsumption = 0;

                                info.TKDR_MEASUREMENT_AREA = sizeInfo.TKDR_MEASUREMENT_AREA;
                                info.TKDR_MEASUREMENT_UNIT = (material.widthUnit)
                                    ? material.widthUnit
                                    : (material.TKDR_MEASUREMENT_UNIT)
                                        ? material.TKDR_MEASUREMENT_UNIT
                                        : "";

                                if (sizeInfo.garmentQty && sizeInfo.consumption) {
                                    info.perGarmentConsumption = sizeInfo.consumption / sizeInfo.garmentQty;
                                }

                                sizewiseAverageConsumprion.push(info);
                            }
                        });

                    }

                    return sizewiseAverageConsumprion;

                }

                function calculateSizewiseAverageConsumprion(uniqueId, sizeWiseConsumptionInfo, material) {

                    var sizewiseTotalConsumprion = fn.calculateSizewiseTotalConsumprion(sizeWiseConsumptionInfo);

                    var sizewiseAverageConsumprion = fn.calSizewiseAverageConsumprion(uniqueId, sizewiseTotalConsumprion, material);


                    return sizewiseAverageConsumprion;

                }

                function calculateConsumption(uniqueId, materialComboMarker, material, supplyCategory) {

                    var measurementUnits = msbMeasurementService.getUnitDefinitions(supplyCategory, msbMeasurementService.getFabricOrderDimentionDef);

                    var consUnit = (measurementUnits.lengthDef.defaultUnit)
                        ? measurementUnits.lengthDef.defaultUnit
                        : "";

                    var sizeWiseConsumptionInfo = fn.calulateSizeWiseConsumption(materialComboMarker, material, consUnit);

                    var sizewiseConsumprion = calculateSizewiseAverageConsumprion(uniqueId, sizeWiseConsumptionInfo, material);

                    return sizewiseConsumprion;

                }

                return fn.calculateConsumption(uniqueId, materialComboMarker, material, supplyCategory);

            }

            function orderInfoAsPerSerialNumber(materialComboMarker) {
                if (materialComboMarker) {
                    return materialComboMarker.sort(function (a, b) {
                        return a.TECHDISER_SERIAL_NO - b.TECHDISER_SERIAL_NO;
                    })
                }
                return [];
            }

            function getMaterialComboMarker(comboId, matItemId, markerInfo) {
                var materialComboMarker = [];
                if (!comboId || !matItemId || !markerInfo) {
                    return materialComboMarker;
                }
                var matItemComboId = matItemId + comboId;
                markerInfo.forEach(function (item) {
                    if (item && item.matItemComboId && item.matItemComboId == matItemComboId) {
                        materialComboMarker.push(item);
                    }
                });
                return orderInfoAsPerSerialNumber(materialComboMarker);
            }

            return opDef;
        }

        function panelDataHandler() {

            var opDef = {
                calculateMaterialConsumptionForAComboSize: calculateMaterialConsumptionForAComboSize,
                setPanelSizeUnit: setPanelSizeUnit,
                setPanelUnitDefinitions: setPanelUnitDefinitions
            }

            function getPanelKey(panel) {
                var pnlKey = "";
                if (panel) {
                    pnlKey = (panel.TKDR_MEASUREMENT_UNIT)
                        ? panel.TKDR_MEASUREMENT_UNIT
                        : (panel.measurementUnitId)
                            ? panel.measurementUnitId
                            : "";
                }

                return pnlKey;

            }

            function getPanelWidthDefinitions(supplyCategory) {

                var measurementUnits = msbMeasurementService.getUnitDefinitions(supplyCategory, msbMeasurementService.getPanelUnitDefinition);
                return (measurementUnits && measurementUnits.widthDef && measurementUnits.widthDef.defaultUnit) ? measurementUnits.widthDef.defaultUnit : "";

            }

            function setPanelUnitDefinitions(panel, supplyCategory) {

                function setDefaultMeasurementUnit(measurementUnits, panel) {

                    var selectedUnitDef = null;

                    var pnlKey = getPanelKey(panel);

                    if (measurementUnits && measurementUnits.lengthDef) {

                        measurementUnits.lengthDef.defaultUnit = (pnlKey)
                            ? pnlKey
                            : (measurementUnits.lengthDef.defaultUnit)
                                ? measurementUnits.lengthDef.defaultUnit
                                : "";

                        if (measurementUnits.lengthDef.units && measurementUnits.lengthDef.defaultUnit) {
                            measurementUnits.lengthDef.units.forEach(function (item) {
                                if (item && item.id && item.id == measurementUnits.lengthDef.defaultUnit) {
                                    selectedUnitDef = item;
                                }
                            });
                        }

                    }

                    return selectedUnitDef;
                }

                function intMeasurementInfo(panel, supplyCategory) {
                    var measurementUnits = msbMeasurementService.getUnitDefinitions(supplyCategory, msbMeasurementService.getPanelUnitDefinition);
                    var selectedUnitDef = setDefaultMeasurementUnit(measurementUnits, panel);
                    return {
                        "measurementUnits": (measurementUnits && measurementUnits.lengthDef && measurementUnits.lengthDef.units) ? measurementUnits.lengthDef.units : [],
                        "selectedUnitDef": selectedUnitDef
                    };
                }

                return intMeasurementInfo(panel, supplyCategory);

            }

            function setPanelSizeUnit(selectedUnitDef, panel, sizeInfo) {

                var pnlKey = getPanelKey(panel);

                var selectUnitKey = (pnlKey)
                    ? pnlKey
                    : (selectedUnitDef && selectedUnitDef.id)
                        ? selectedUnitDef.id
                        : "";

                if (sizeInfo) {

                    sizeInfo.forEach(function (item) {
                        if (item) {
                            var untKey = (item.TKDR_MEASUREMENT_UNIT)
                                ? item.TKDR_MEASUREMENT_UNIT
                                : (item.sizeUnit)
                                    ? item.sizeUnit
                                    : selectUnitKey;
                            item.sizeUnit = untKey;
                            item.TKDR_MEASUREMENT_UNIT = untKey;
                        }
                    });
                }

                if (panel) {
                    panel.measurementUnitId = selectUnitKey;
                    panel.TKDR_MEASUREMENT_UNIT = selectUnitKey;
                }

            }

            function initPanelInfo(panelDef, supplyCategory) {

                if (panelDef) {
                    panelDef.forEach(function (panel) {
                        if (panel) {
                            var measuremntInfo = setPanelUnitDefinitions(panel, supplyCategory);
                            if (measuremntInfo && measuremntInfo.selectedUnitDef) {
                                setPanelSizeUnit(measuremntInfo.selectedUnitDef, panel, panel.sizeDef)

                            }
                        }
                    });
                }

            }

            function prepareSizePositionWiseConsumption(panelDef, defaultUnit) {

                var sizePositionWiseConsumption = [];

                if (panelDef) {
                    panelDef.forEach(function (panel) {
                        if (panel && panel.sizeDef && panel.position) {
                            panel.sizeDef.forEach(function (size) {
                                if (size && size.sizeId) {

                                    var length = ((size.length) ? size.length : 0) + ((size.lengthAllowance) ? size.lengthAllowance : 0);
                                    var width = ((size.width) ? size.width : 0) + ((size.widthAllowance) ? size.widthAllowance : 0);

                                    var consumptionInfo = msbMeasurementService.calculateArea(
                                        length,
                                        size.TKDR_MEASUREMENT_UNIT,
                                        width,
                                        size.TKDR_MEASUREMENT_UNIT,
                                        defaultUnit
                                    );

                                    var consumption = (consumptionInfo) ? consumptionInfo.dt : 0;
                                    var consKey = (consumptionInfo) ? consumptionInfo.unitKey : "";

                                    var sizePositionId = size.sizeId + panel.position;
                                    var index = msbUtilService.getIndex(sizePositionWiseConsumption, "sizePositionId", sizePositionId);
                                    if (index < 0) {
                                        var info = {};
                                        info.sizePositionId = sizePositionId;
                                        info.sizeId = size.sizeId;
                                        info.positionId = panel.position;
                                        info.consumption = consumption;
                                        info.TKDR_MEASUREMENT_UNIT = size.TKDR_MEASUREMENT_UNIT;
                                        info.TKDR_MEASUREMENT_AREA = consKey;
                                        sizePositionWiseConsumption.push(info);
                                    } else {
                                        sizePositionWiseConsumption[index].consumption += consumption;
                                    }
                                }

                            })
                        }
                    })
                }

                return sizePositionWiseConsumption;

            }


            function combineMaterialToSizePositionConsumption(sizePositionWiseConsumption, materialDef, deafultWidth) {

                var materialSizePositionConsumption = [];

                if (sizePositionWiseConsumption && materialDef) {
                    materialDef.forEach(function (material) {
                        if (material && material.comboId && material.positionId) {
                            sizePositionWiseConsumption.forEach(function (sizePosCons) {
                                if (sizePosCons) {
                                    var comboSizePosId = material.comboId + sizePosCons.sizePositionId;
                                    var index = msbUtilService.getIndex(materialSizePositionConsumption, "comboSizePosId", comboSizePosId);
                                    if (index < 0) {
                                        var info = {};
                                        info.comboSizePosId = comboSizePosId;
                                        info.matItemComboSizeID = material.matItemId + material.comboId;
                                        info.matItemId = material.matItemId;
                                        info.materialCatId = material.materialCatId;
                                        info.materialId = material.materialId;
                                        info.title = material.materialTitle;
                                        info.description = material.materialDescription;
                                        info.color = material.color;
                                        info.matSize = material.matSize;
                                        info.effectiveMatWidth = material.effectiveWidth;
                                        info.comboId = material.comboId;
                                        info.sizeId = sizePosCons.sizeId;
                                        info.consType = material.matType;
                                        info.consMatType = material.materialTypeId;
                                        info.comboSizeID = material.comboId + sizePosCons.sizeId;
                                        info.comboSizeConsumption = (sizePosCons.consumption) ? sizePosCons.consumption : 0;
                                        info.TKDR_MEASUREMENT_UNIT_WIDTH = sizePosCons.TKDR_MEASUREMENT_UNIT;
                                        info.TKDR_MEASUREMENT_UNIT_LENGTH = sizePosCons.TKDR_MEASUREMENT_UNIT;
                                        info.TKDR_MEASUREMENT_UNIT = (material.TKDR_MEASUREMENT_UNIT) ? material.TKDR_MEASUREMENT_UNIT : deafultWidth;
                                        info.TKDR_MEASUREMENT_AREA = sizePosCons.TKDR_MEASUREMENT_AREA;
                                        materialSizePositionConsumption.push(info);
                                    } else {
                                        materialSizePositionConsumption[index].comboSizeConsumption += (sizePosCons.consumption) ? sizePosCons.consumption : 0;
                                    }
                                }
                            })
                        }
                    })
                }

                return materialSizePositionConsumption;

            }

            function calculateComboSizeWiseConsumption(uniqueId, materialSizePositionConsumption) {

                var comboSizeWiseConsumption = [];

                if (materialSizePositionConsumption) {

                    materialSizePositionConsumption.forEach(function (material) {

                        if (material && material.comboSizeID) {

                            var index = msbUtilService.getIndex(comboSizeWiseConsumption, "comboSizeID", material.comboSizeID);
                            if (index < 0) {
                                var info = {};
                                info.TECHDISER_ID = uniqueId + material.matItemComboSizeID;
                                info.matItemComboSizeID = material.matItemComboSizeID;
                                info.matItemId = material.matItemId;
                                info.materialCatId = material.materialCatId;
                                info.materialId = material.materialId;
                                info.title = material.title;
                                info.description = material.description;
                                info.color = material.color;
                                info.matSize = material.matSize;
                                info.effectiveMatWidth = material.effectiveMatWidth;
                                info.comboId = material.comboId;
                                info.matComboId = material.matItemId + material.comboId;
                                info.sizeId = material.sizeId;
                                info.consType = material.consType;
                                info.consMatType = material.consMatType;
                                info.comboSizeID = material.comboSizeID;
                                info.perGarmentConsumption = (material.comboSizeConsumption) ? material.comboSizeConsumption : 0;
                                info.TKDR_MEASUREMENT_UNIT_WIDTH = material.TKDR_MEASUREMENT_UNIT_WIDTH;
                                info.TKDR_MEASUREMENT_UNIT_LENGTH = material.TKDR_MEASUREMENT_UNIT_LENGTH;
                                info.TKDR_MEASUREMENT_UNIT = material.TKDR_MEASUREMENT_UNIT;
                                info.TKDR_MEASUREMENT_AREA = material.TKDR_MEASUREMENT_AREA;
                                comboSizeWiseConsumption.push(info);
                            } else {
                                comboSizeWiseConsumption[index].perGarmentConsumption += (material.comboSizeConsumption) ? material.comboSizeConsumption : 0;
                            }
                        }
                    })
                }

                return comboSizeWiseConsumption;

            }

            function calculateMaterialConsumptionForAComboSize(uniqueId, panelDef, materialDef, supplyCategory) {

                initPanelInfo(panelDef, supplyCategory);

                var measurementUnits = msbMeasurementService.getUnitDefinitions(supplyCategory, msbMeasurementService.getFabricOrderDimentionDef);

                var defaultUnit = (measurementUnits.lengthDef.defaultUnit)
                    ? measurementUnits.lengthDef.defaultUnit
                    : "";

                var deafultWidth = getPanelWidthDefinitions(supplyCategory);

                var sizePositionWiseConsumption = prepareSizePositionWiseConsumption(panelDef, defaultUnit);

                var materialSizePositionConsumption = combineMaterialToSizePositionConsumption(sizePositionWiseConsumption, materialDef, deafultWidth);

                var comboSizeWiseConsumption = calculateComboSizeWiseConsumption(uniqueId, materialSizePositionConsumption);

                return comboSizeWiseConsumption;

            }

            return opDef;

        }

        function foldingConsumptionHandler() {

            var opDef = {
                prepareFoldingInfo: prepareFoldingInfo,
                prepareEtdWiseFoldingMaterialInfo: prepareEtdWiseFoldingMaterialInfo,
                prepareEtdWiseFoldingTypeInfo: prepareEtdWiseFoldingTypeInfo,
                calculateMaterialTotlaConsumption: calculateMaterialTotlaConsumption
            }

            function calculateMaterialTotlaConsumption(uniqueId, etdWiseQty, etdMaterialConsumption) {

                var matConsumption = [];

                if (uniqueId, etdWiseQty, etdMaterialConsumption) {

                    etdMaterialConsumption.forEach(function (etdMatCons) {

                        if (etdMatCons && etdMatCons.etdId && etdMatCons.consumptionValue && etdMatCons.materialId) {
                            var etdIndex = msbUtilService.getIndex(etdWiseQty, "etdId", etdMatCons.etdId);
                            if (etdIndex >= 0) {
                                var garmentQty = (etdWiseQty[etdIndex].quantity) ? etdWiseQty[etdIndex].quantity : 0;
                                var etdConsumption = etdMatCons.consumptionValue * garmentQty;
                                if (etdConsumption > 0) {
                                    var index = msbUtilService.getIndex(matConsumption, "matItemId", etdMatCons.materialId);
                                    if (index < 0) {
                                        var info = {};
                                        info.TECHDISER_ID = "foldMat" + uniqueId + etdMatCons.materialId;
                                        info.materialId = etdMatCons.materialId;
                                        info.matItemId = etdMatCons.materialId;
                                        info.materialCatId = etdMatCons.materialId;
                                        info.title = etdMatCons.foldingMaterialTitle;
                                        info.description = (etdMatCons.foldingMaterialDscription) ? etdMatCons.foldingMaterialDscription : '';
                                        info.consType = etdMatCons.consType;
                                        info.consMatType = etdMatCons.consMatType;
                                        info.color = '';
                                        info.matSize = '';
                                        info.consumption = etdConsumption;
                                        matConsumption.push(info);
                                    } else {
                                        matConsumption[index].consumption += etdConsumption;
                                    }
                                }
                            }
                        }

                    });
                }

                matConsumption.forEach(function (item) {
                    if (item) {
                        item.orderConsumption = item.consumption;
                    }
                });

                return matConsumption;

            }

            function prepareFoldingInfo(foldingConsumptionDef, foldingSetupInfo) {

                var foldingInfoHandler = this;

                foldingInfoHandler.addFoldingSetupInfo = addFoldingSetupInfo;
                foldingInfoHandler.getFoldingInfo = getFoldingInfo;

                function addFoldingSetupInfo(foldingConsumptionDef, foldingSetupInfo) {

                    var foldingConsumptionInfo = [];

                    if (foldingConsumptionDef && foldingSetupInfo) {
                        foldingConsumptionDef.forEach(function (foldinDef) {
                            if (foldinDef && foldinDef.typeId) {
                                var index = msbUtilService.getIndex(foldingSetupInfo, "TECHDISER_ID", foldinDef.typeId);
                                if (index >= 0) {
                                    var info = angular.copy(foldinDef);
                                    info.foldingTypeTitle = foldingSetupInfo[index].title;
                                    foldingConsumptionInfo.push(info);
                                }
                            }
                        });
                    }

                    return foldingConsumptionInfo;

                }

                function getFoldingInfo(foldingConsumptionDef, foldingSetupInfo) {

                    var foldingConsumptionInfo = foldingInfoHandler.addFoldingSetupInfo(foldingConsumptionDef, foldingSetupInfo);

                    return foldingConsumptionInfo;

                }

                return foldingInfoHandler.getFoldingInfo(foldingConsumptionDef, foldingSetupInfo);

            }

            function prepareEtdWiseFoldingMaterialInfo(foldingConsumptionInfo, foldingMaterialInfo, etdFolderInfo, etds) {

                var etdWiseFoldingInfoHandler = this;

                etdWiseFoldingInfoHandler.addFoldingMaterialInfo = addFoldingMaterialInfo;
                etdWiseFoldingInfoHandler.flattenMaterialConsumptionInfo = flattenMaterialConsumptionInfo;
                etdWiseFoldingInfoHandler.getFoldingMaterialInfo = getFoldingMaterialInfo;
                etdWiseFoldingInfoHandler.addEtdFoldingInfo = addEtdFoldingInfo;
                etdWiseFoldingInfoHandler.addEtdInfo = addEtdInfo;
                etdWiseFoldingInfoHandler.getEtdWiseFoldingMaterialInfo = getEtdWiseFoldingMaterialInfo;

                function addFoldingMaterialInfo(materialConsumptionInfo, foldingMaterialInfo) {

                    var materialInfo = [];

                    if (materialConsumptionInfo, foldingMaterialInfo) {
                        materialConsumptionInfo.forEach(function (matCons) {
                            if (matCons && matCons.materialId) {
                                var index = msbUtilService.getIndex(foldingMaterialInfo, "TECHDISER_ID", matCons.materialId);
                                if (index >= 0) {
                                    var info = angular.copy(matCons);
                                    info.foldingMaterialTitle = foldingMaterialInfo[index].title;
                                    info.foldingMaterialDscription = foldingMaterialInfo[index].description;
                                    info.consType = foldingMaterialInfo[index].sourcingTypeId;
                                    info.consMatType = foldingMaterialInfo[index].sourcingTypeId;
                                    materialInfo.push(info);
                                }
                            }
                        })
                    }

                    return materialInfo;

                }

                function flattenMaterialConsumptionInfo(foldingConsumptionInfo) {

                    var falttenedMaterialConsumptionInfo = [];

                    if (foldingConsumptionInfo) {
                        foldingConsumptionInfo.forEach(function (foldingConsInfo) {
                            if (foldingConsInfo && foldingConsInfo.materials) {
                                foldingConsInfo.materials.forEach(function (material) {
                                    if (material && material.materialId) {
                                        var info = angular.copy(material);
                                        info.foldingTypeId = foldingConsInfo.typeId;
                                        info.foldingConsId = foldingConsInfo.TECHDISER_ID;
                                        info.foldingTypeTitle = foldingConsInfo.foldingTypeTitle;
                                        info.foldingTypeDescription = foldingConsInfo.foldingTypeDescription;
                                        info.foldingTypeMaterialId = foldingConsInfo.typeId + material.materialId;
                                        falttenedMaterialConsumptionInfo.push(info);
                                    }
                                });
                            }
                        });
                    }

                    return falttenedMaterialConsumptionInfo;

                }

                function getFoldingMaterialInfo(foldingConsumptionInfo, foldingMaterialInfo) {

                    var materialConsumptionInfo = etdWiseFoldingInfoHandler.flattenMaterialConsumptionInfo(foldingConsumptionInfo);

                    var foldingMaterialInfo = etdWiseFoldingInfoHandler.addFoldingMaterialInfo(materialConsumptionInfo, foldingMaterialInfo);

                    return foldingMaterialInfo;

                }

                function addEtdFoldingInfo(foldingMaterialInfo, etdFolderInfo) {

                    var materialEtdFoldingInfo = [];

                    if (foldingMaterialInfo, etdFolderInfo) {
                        foldingMaterialInfo.forEach(function (foldingMat) {
                            if (foldingMat && foldingMat.foldingTypeId) {
                                var index = msbUtilService.getIndex(etdFolderInfo, "typeId", foldingMat.foldingTypeId);
                                if (index >= 0) {
                                    var info = angular.copy(foldingMat);
                                    info.etdFoldingTile = etdFolderInfo[index].title;
                                    info.etdFolderInfoId = etdFolderInfo[index].TECHDISER_ID;
                                    materialEtdFoldingInfo.push(info);
                                }
                            }
                        });
                    }

                    return materialEtdFoldingInfo;

                }

                function addEtdInfo(materialEtdFoldingInfo, etds) {

                    var materialEtdInfo = [];

                    if (materialEtdFoldingInfo, etds) {
                        etds.forEach(function (etd) {
                            if (etd && etd.foldingId) {
                                var index = msbUtilService.getIndex(materialEtdFoldingInfo, "etdFolderInfoId", etd.foldingId);
                                if (index >= 0) {
                                    var info = angular.copy(materialEtdFoldingInfo[index]);
                                    info.TECHDISER_ID = etd.TECHDISER_ID + info.foldingTypeId + materialEtdFoldingInfo[index].materialId;
                                    info.etdDate = etd.date;
                                    info.etdId = etd.TECHDISER_ID;
                                    info.matConsumptionInfoId = materialEtdFoldingInfo[index].TECHDISER_ID;
                                    info.consType = materialEtdFoldingInfo[index].consType;
                                    info.consMatType = materialEtdFoldingInfo[index].consMatType;
                                    info.consumption = ((info.consumptionValue) ? info.consumptionValue : 0) * ((etd.quantity) ? etd.quantity : 0);
                                    info.etdMatConsumptionInfoId = etd.TECHDISER_ID + materialEtdFoldingInfo[index].TECHDISER_ID;
                                    materialEtdInfo.push(info);
                                }
                            }
                        });
                    }

                    return materialEtdInfo;

                }

                function getEtdWiseFoldingMaterialInfo(foldingConsumptionInfo, foldingMaterialInfo, etdFolderInfo, etds) {

                    var updateFoldingMaterialInfo = etdWiseFoldingInfoHandler.getFoldingMaterialInfo(foldingConsumptionInfo, foldingMaterialInfo);
                    var materialEtdFoldingInfo = etdWiseFoldingInfoHandler.addEtdFoldingInfo(updateFoldingMaterialInfo, etdFolderInfo);
                    var materialEtdInfo = etdWiseFoldingInfoHandler.addEtdInfo(materialEtdFoldingInfo, etds);

                    return materialEtdInfo;
                }

                return etdWiseFoldingInfoHandler.getEtdWiseFoldingMaterialInfo(foldingConsumptionInfo, foldingMaterialInfo, etdFolderInfo, etds);

            }

            function prepareEtdWiseFoldingTypeInfo(foldingConsumptionInfo, etdFolderInfo, etds) {

                var etdWiseFoldingHandler = this;

                etdWiseFoldingHandler.getEtdWiseFoldingTypeInfo = getEtdWiseFoldingTypeInfo;
                etdWiseFoldingHandler.prepareInfo = prepareInfo;

                function getEtdWiseFoldingTypeInfo(foldingConsumptionInfo, etdFolderInfo, etds) {

                    var etdWiseFoldingTypeInfo = [];

                    if (foldingConsumptionInfo, etdFolderInfo, etds) {
                        etds.forEach(function (etd) {
                            if (etd && etd.foldingId) {
                                var index = msbUtilService.getIndex(etdFolderInfo, "TECHDISER_ID", etd.foldingId);
                                if (index >= 0 && etdFolderInfo[index].typeId) {
                                    var consIndex = msbUtilService.getIndex(foldingConsumptionInfo, "typeId", etdFolderInfo[index].typeId);
                                    if (consIndex >= 0) {
                                        var info = angular.copy(etdFolderInfo[index]);
                                        info.etdId = etd.TECHDISER_ID;
                                        info.etdDate = etd.date;
                                        info.foldingTypeTitle = foldingConsumptionInfo[consIndex].foldingTypeTitle;
                                        info.foldingTypeDescription = etdFolderInfo[index].description;
                                        info.foldingTypeId = foldingConsumptionInfo[consIndex].typeId;
                                        etdWiseFoldingTypeInfo.push(info);
                                    }
                                }
                            }
                        });
                    }

                    return etdWiseFoldingTypeInfo;

                }

                function prepareInfo(foldingConsumptionInfo, etdFolderInfo, etds) {
                    var etdWiseFoldingTypeInfo = etdWiseFoldingHandler.getEtdWiseFoldingTypeInfo(foldingConsumptionInfo, etdFolderInfo, etds);
                    return etdWiseFoldingTypeInfo;
                }

                return etdWiseFoldingHandler.prepareInfo(foldingConsumptionInfo, etdFolderInfo, etds);

            }

            return opDef;

        }

        function packingConsumptionHandler() {

            var opDef = {
                prepareConatinerInfo: prepareConatinerInfo,
                preparePackingMaterials: preparePackingMaterials,
                calculateEtdWiseContainerConsumption: calculateEtdWiseContainerConsumption,
                calculateEtdWiseMaterialConsumption: calculateEtdWiseMaterialConsumption,
                calculateMaterialConsumption: calculateMaterialConsumption,
                preparePackingItemConsumptionInfo: preparePackingItemConsumptionInfo,
                preparePackingMaterialConsumptionInfo: preparePackingMaterialConsumptionInfo,
                calculatePackingAndMaterialConsumption: calculatePackingAndMaterialConsumption
            };

            function calculatePackingConsumptionOnQuantity(requiredQty, forQty, qty) {

                if (forQty) {
                    return (requiredQty / forQty) * qty;
                }

                return 0;

            }

            function calculatePackingAndMaterialConsumption(etdPositionWisePackingConsumptions, packingContainers) {

                function calMaterialConsumption(etdPositionWisePackingConsumptions, packingContainers) {
                    if (etdPositionWisePackingConsumptions && packingContainers) {
                        etdPositionWisePackingConsumptions.forEach(function (etdCons) {
                            if (etdCons && etdCons.etdId && etdCons.packingTypeId) {
                                var index = msbUtilService.getIndex(packingContainers, "typeId", etdCons.packingTypeId);
                                if (index >= 0 && packingContainers[index].materialInfo) {
                                    packingContainers[index].materialInfo.forEach(function (matItem) {
                                        if (matItem && matItem.materialId) {
                                            var consumption = calculatePackingConsumptionOnQuantity(
                                                (matItem.sizeInfo && matItem.sizeInfo.matQty) ? matItem.sizeInfo.matQty : 0,
                                                (matItem.sizeInfo && matItem.sizeInfo.forContainers) ? matItem.sizeInfo.forContainers : 0,
                                                etdCons.consumption
                                            );
                                            matItem.consumption = (matItem.consumption) ? matItem.consumption : 0;
                                            matItem.consumption += (consumption) ? consumption : 0;
                                        }
                                    });
                                }
                            }
                        });
                    }
                    if (packingContainers) {
                        packingContainers.forEach(function (packingItem) {
                            if (packingItem && packingItem.materialInfo) {
                                packingItem.materialInfo.forEach(function (item) {
                                    if (item) {
                                        var itemUnit = (item && item.sizeInfo && item.sizeInfo.matUnitId) ? item.sizeInfo.matUnitId : "";
                                        var cons = (item.orderMaterialUnitId && itemUnit && item.orderMaterialUnitId != itemUnit && item.consumption)
                                            ? msbMeasurementService.unitConvertion(item.consumption, itemUnit, item.orderMaterialUnitId)
                                            : item.consumption;
                                        item.orderConsumption = (cons) ? parseInt(cons) : 0;
                                    }
                                });
                            }
                        });
                    }
                }

                function calPackingConsumption(etdPositionWisePackingConsumptions, packingContainers) {

                    if (etdPositionWisePackingConsumptions && packingContainers) {

                        etdPositionWisePackingConsumptions.forEach(function (etdCons) {
                            if (etdCons && etdCons.etdId && etdCons.packingTypeId) {
                                var index = msbUtilService.getIndex(packingContainers, "typeId", etdCons.packingTypeId);
                                if (index >= 0) {
                                    packingContainers[index].noOfPackages = (packingContainers[index].noOfPackages) ? packingContainers[index].noOfPackages : 0;
                                    packingContainers[index].noOfPackages += (etdCons.consumption) ? etdCons.consumption : 0;
                                }
                            }
                        })

                    }
                }

                function initMaterialConsInfo(etdPositionWisePackingConsumptions, packingContainers) {

                    calPackingConsumption(etdPositionWisePackingConsumptions, packingContainers);
                    calMaterialConsumption(etdPositionWisePackingConsumptions, packingContainers);

                }

                initMaterialConsInfo(etdPositionWisePackingConsumptions, packingContainers);

            }

            function prepareConatinerInfo(packingInfo, containerInfo, packingMaterialInfo) {

                var containerPeparator = this;

                containerPeparator.getContainerDataSetSet = getContainerDataSetSet;
                containerPeparator.preparePackingInfo = preparePackingInfo;
                containerPeparator.getContainerInfo = getContainerInfo;

                function getContainerDataSetSet(packingInfo, containerInfo) {
                    var containers = [];
                    if (packingInfo && containerInfo) {
                        containerInfo.forEach(function (container) {
                            if (container && container.TECHDISER_ID) {
                                var isRequired = msbUtilService.getIndex(packingInfo, "typeId", container.TECHDISER_ID);
                                if (isRequired >= 0) {
                                    var isIncluded = msbUtilService.getIndex(containers, "TECHDISER_ID", container.TECHDISER_ID);
                                    if (isIncluded < 0) {
                                        var info = {};
                                        info.TECHDISER_ID = container.TECHDISER_ID;
                                        info.title = container.title;
                                        containers.push(info);
                                    }
                                }
                            }
                        })
                    }
                    return containers;
                }

                function preparePackingInfo(packingInfo, containerInfo) {
                    var requiredContainers = [];
                    if (packingInfo && containerInfo) {
                        packingInfo.forEach(function (pack) {
                            if (pack && pack.typeId) {
                                var index = msbUtilService.getIndex(containerInfo, "TECHDISER_ID", pack.typeId);
                                if (index >= 0) {
                                    var info = angular.copy(pack);
                                    info.containerTitle = containerInfo[index].title;
                                    info.requiredContainers = 1;
                                    requiredContainers.push(info);
                                }
                            }
                        });
                    }
                    return requiredContainers;
                }

                function setSizeInfo(matItem, pack) {
                    var sizeInfo = null;
                    if (matItem.sizeInfo) {
                        var defaultIndex = msbUtilService.getIndex(matItem.sizeInfo, "isDefault", 1);
                        var packSizeIndex = msbUtilService.getIndex(matItem.sizeInfo, "containerSize", pack.packingSize);
                        var sizeDef = (packSizeIndex >= 0)
                            ? matItem.sizeInfo[packSizeIndex]
                            : (defaultIndex >= 0)
                                ? matItem.sizeInfo[defaultIndex]
                                : null;
                        if (sizeDef) {
                            sizeInfo = angular.copy(sizeDef);
                            sizeInfo.sizeInfoId = sizeDef.TECHDISER_ID;
                            sizeInfo.TECHDISER_ID = pack.TECHDISER_ID + sizeInfo.sizeInfoId;
                            sizeInfo.packageId = pack.TECHDISER_ID;
                            sizeInfo.measurementUnitId = (sizeDef.matDimensionInfo) ? sizeDef.matDimensionInfo : "";
                            sizeInfo.matUnitId = (sizeDef.matDimensionInfo) ? msbMeasurementService.getDimensionFromDimensionDef(sizeDef.matDimensionInfo) : "";
                            sizeInfo.containerUnitId = (sizeDef.containerSizeInfo) ? msbMeasurementService.getDimensionFromDimensionDef(sizeDef.containerSizeInfo) : "";
                        }
                    }
                    return sizeInfo;
                }


                function updateMatInfo(pack, packingMaterialInfo) {

                    if (pack && pack.typeId && packingMaterialInfo) {
                        packingMaterialInfo.forEach(function (item) {
                            if (item && item.packingTypeId && item.materialId && item.packingTypeId == pack.typeId) {
                                if (!pack.materialInfo) {
                                    pack.materialInfo = [];
                                }
                                var matIndex = msbUtilService.getIndex(pack.materialInfo, "materialId", item.materialId);
                                if (matIndex < 0) {
                                    var matData = angular.copy(item);
                                    if (matData.sizeInfo) {
                                        delete matData["sizeInfo"];
                                    }
                                    matData.sizeInfo = setSizeInfo(item, pack);
                                    pack.materialInfo.push(matData);
                                }
                            }
                        });
                    }

                }

                function updateMaterialInfo(packingInfo, packingMaterialInfo) {

                    if (packingInfo && packingMaterialInfo) {

                        packingInfo.forEach(function (pack) {
                            updateMatInfo(pack, packingMaterialInfo)
                        });

                    }

                }

                function getContainerInfo(packingInfo, containerInfo, packingMaterialInfo) {

                    var requiredContainers = containerPeparator.getContainerDataSetSet(packingInfo, containerInfo);

                    var packingInfo = containerPeparator.preparePackingInfo(packingInfo, requiredContainers);

                    updateMaterialInfo(packingInfo, packingMaterialInfo);

                    return packingInfo;
                }

                return containerPeparator.getContainerInfo(packingInfo, containerInfo, packingMaterialInfo);

            }

            function preparePackingMaterials(packingConsumptionDef, containerMaterials) {

                var packingMatPreparator = this;

                packingMatPreparator.flattenPackingMaterialInfo = flattenPackingMaterialInfo;
                packingMatPreparator.getContainerMaterialDataSetSet = getContainerMaterialDataSetSet;
                packingMatPreparator.prepareConsumptionInfo = prepareConsumptionInfo;
                packingMatPreparator.getPackingMaterials = getPackingMaterials;

                function flattenPackingMaterialInfo(packingConsumptionDef) {

                    var packingMaterials = [];

                    if (packingConsumptionDef) {
                        packingConsumptionDef.forEach(function (packingMaterial) {
                            if (packingMaterial && packingMaterial.categoryId && packingMaterial.materials) {
                                if (packingMaterial.materials) {
                                    packingMaterial.materials.forEach(function (item) {
                                        if (item && item.TECHDISER_ID) {
                                            var info = angular.copy(item);
                                            info.TECHDISER_ID = item.TECHDISER_ID + packingMaterial.categoryId;
                                            info.packingTypeId = packingMaterial.categoryId;
                                            info.materialCatId = item.TECHDISER_ID;
                                            info.containermatConsumptionForQty = 0;
                                            info.matConsumptionForQty = 0;
                                            info.consuptionPolicy = "qty";
                                            info.description = "";
                                            info.sizeInfo = (item.sizeInfo) ? item.sizeInfo : [];
                                            packingMaterials.push(info);
                                        }
                                    })
                                }
                            }
                        })
                    }
                    return packingMaterials;

                }

                function getContainerMaterialDataSetSet(packingConsumptionDef, containerMaterials) {
                    var materials = [];
                    if (packingConsumptionDef && containerMaterials) {
                        packingConsumptionDef.forEach(function (packingMaterial) {
                            if (packingMaterial && packingMaterial.materials) {
                                if (packingMaterial.materials) {
                                    packingMaterial.materials.forEach(function (item) {
                                        if (item && item.TECHDISER_ID && item.materialId) {
                                            var index = msbUtilService.getIndex(materials, "TECHDISER_ID", item.TECHDISER_ID);
                                            if (index < 0) {
                                                var matIndex = msbUtilService.getIndex(containerMaterials, "TECHDISER_ID", item.materialId);
                                                if (matIndex >= 0) {
                                                    var info = {};
                                                    info.TECHDISER_ID = containerMaterials[matIndex].TECHDISER_ID;
                                                    info.title = containerMaterials[matIndex].title;
                                                    info.consType = containerMaterials[matIndex].sourcingTypeId;
                                                    info.consMatType = containerMaterials[matIndex].sourcingTypeId;
                                                    info.orderMaterialUnitId = getPackingMaterialConsumptionUnit(containerMaterials[matIndex]);
                                                    materials.push(info);
                                                }
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    }
                    return materials;
                }

                function prepareConsumptionInfo(flattenedPackingMaterialInfo, materialDataSet) {
                    var packinMaterialInfo = [];
                    if (flattenedPackingMaterialInfo && materialDataSet) {
                        flattenedPackingMaterialInfo.forEach(function (item) {
                            if (item && item.materialId) {
                                var index = msbUtilService.getIndex(materialDataSet, "TECHDISER_ID", item.materialId);
                                if (index >= 0) {
                                    var info = angular.copy(item);
                                    info.materialTitle = materialDataSet[index].title;
                                    info.consType = materialDataSet[index].consType;
                                    info.consMatType = materialDataSet[index].consMatType;
                                    info.orderMaterialUnitId = materialDataSet[index].orderMaterialUnitId;
                                    packinMaterialInfo.push(info);
                                }
                            }
                        })
                    }
                    return packinMaterialInfo;
                }

                function getPackingMaterials(packingConsumptionDef, containerMaterials) {

                    var flattenedPackingMaterialInfo = packingMatPreparator.flattenPackingMaterialInfo(packingConsumptionDef);

                    var materialDataSet = packingMatPreparator.getContainerMaterialDataSetSet(packingConsumptionDef, containerMaterials);

                    var packinMaterialInfo = packingMatPreparator.prepareConsumptionInfo(flattenedPackingMaterialInfo, materialDataSet);

                    return packinMaterialInfo;
                }

                return packingMatPreparator.getPackingMaterials(packingConsumptionDef, containerMaterials);

            }

            function calculateEtdWiseContainerConsumption(uniqueId, etds, etdAssort, packingContainers) {

                var etdConsHandler = this;

                etdConsHandler.getEtdGarmentQuantity = getEtdGarmentQuantity;
                etdConsHandler.calculateEtdPackingCons = calculateEtdPackingCons;
                etdConsHandler.getEtdWiseContainerConsumption = getEtdWiseContainerConsumption;
                etdConsHandler.addPackingInfo = addPackingInfo;

                function addPackingInfo(etds, etdAssort) {
                    if (etdAssort) {
                        etdAssort.forEach(function (assort) {
                            if (assort && assort.etdId) {
                                var index = msbUtilService.getIndex(etds, "TECHDISER_ID", assort.etdId);
                                if (index >= 0 && etds[index].packingIds) {
                                    assort.packingIds = etds[index].packingIds;
                                    assort.etdDate = etds[index].date;
                                }

                            }
                        })
                    }

                }

                function getEtdGarmentQuantity(etdAssort) {

                    var etdWiseQuantity = [];

                    if (etdAssort) {
                        etdAssort.forEach(function (etd) {
                            if (etd && etd.etdId) {
                                var index = msbUtilService.getIndex(etdWiseQuantity, "etdId", etd.etdId);
                                if (index < 0) {
                                    var info = {};
                                    info.etdId = etd.etdId;
                                    info.quantity = (etd.quantity) ? etd.quantity : 0;
                                    info.packingIds = etd.packingIds;
                                    info.etdDate = etd.etdDate;
                                    etdWiseQuantity.push(info);
                                } else {
                                    etdWiseQuantity[index].quantity += (etd.quantity) ? etd.quantity : 0;
                                }

                            }
                        })
                    }

                    return etdWiseQuantity;
                }

                function calculateEtdPackingCons(uniqueId, etdWiseQuantity, packingContainers) {
                    var etdPositionWisePackingConsumptions = [];
                    if (etdWiseQuantity && packingContainers) {
                        etdWiseQuantity.forEach(function (etdAssort) {
                            if (etdAssort && etdAssort.packingIds && packingContainers) {
                                packingContainers.forEach(function (item) {
                                    if (etdAssort.packingIds.indexOf(item.TECHDISER_ID) >= 0) {
                                        var info = {};
                                        info.TECHDISER_ID = uniqueId + etdAssort.etdId + item.TECHDISER_ID;
                                        info.etdId = etdAssort.etdId;
                                        info.etdDate = etdAssort.etdDate;
                                        info.positionId = item.positionId;
                                        info.packingTypeId = item.typeId;
                                        info.packingTypePositionId = item.typeId + item.positionId;
                                        info.packingTypeTitle = item.containerTitle;
                                        info.description = item.description;
                                        info.height = (item.height) ? item.height : 0;
                                        info.width = (item.width) ? item.width : 0;
                                        info.length = (item.length) ? item.length : 0;
                                        info.packingTypePosTechId = item.TECHDISER_ID;
                                        info.measurementUnitId = item.measurementUnitId;
                                        info.description = item.description;
                                        info.packingTitle = item.title;
                                        info.packingType = item.type;
                                        info.consType = item.type;
                                        info.consMatType = item.type;
                                        info.packingSize = item.packingSize;
                                        info.consumption = 0;
                                        info.etdGarmentQty = (etdAssort.quantity) ? etdAssort.quantity : 0;
                                        info.numberOfGmt = (item.numberOfGmt) ? item.numberOfGmt : 0;
                                        info.requiredContainers = (item.requiredContainers) ? item.requiredContainers : 0;
                                        info.dimentionInfo = item.dimentionInfo;
                                        if (info.numberOfGmt > 0) {
                                            var cons = (info.requiredContainers / info.numberOfGmt) * info.etdGarmentQty;
                                            info.consumption = parseInt(cons);
                                        }
                                        etdPositionWisePackingConsumptions.push(info);
                                    }
                                })
                            }
                        })
                    }
                    return etdPositionWisePackingConsumptions;
                }

                function getEtdWiseContainerConsumption(uniqueId, etds, etdAssort, packingContainers) {
                    etdConsHandler.addPackingInfo(etds, etdAssort);
                    var etdWiseQuantity = etdConsHandler.getEtdGarmentQuantity(etdAssort);
                    var etdPositionWisePackingConsumptions = etdConsHandler.calculateEtdPackingCons(uniqueId, etdWiseQuantity, packingContainers);
                    return etdPositionWisePackingConsumptions;
                }

                return etdConsHandler.getEtdWiseContainerConsumption(uniqueId, etds, etdAssort, packingContainers);

            }

            function calculateEtdWiseMaterialConsumption(etdPositionWisePackingConsumptions, packingContainers) {

                var calOperations = this;

                calOperations.calEtdWiseMaterialConsumption = calEtdWiseMaterialConsumption;

                function calEtdWiseMaterialConsumption(etdPositionWisePackingConsumptions, packingContainers) {

                    var etdWiseMaterialConsumption = [];

                    if (etdPositionWisePackingConsumptions && packingContainers) {

                        etdPositionWisePackingConsumptions.forEach(function (etdCons) {
                            if (etdCons && etdCons.etdId && etdCons.packingTypeId) {
                                var index = msbUtilService.getIndex(packingContainers, "typeId", etdCons.packingTypeId);
                                if (index >= 0 && packingContainers[index].materialInfo) {
                                    packingContainers[index].materialInfo.forEach(function (matItem) {
                                        if (matItem && matItem.materialId) {
                                            var consumption = calculatePackingConsumptionOnQuantity(
                                                (matItem.sizeInfo && matItem.sizeInfo.matQty) ? matItem.sizeInfo.matQty : 0,
                                                (matItem.sizeInfo && matItem.sizeInfo.forContainers) ? matItem.sizeInfo.forContainers : 0,
                                                etdCons.consumption
                                            );
                                            var opId = etdCons.etdId + matItem.materialId;
                                            var etdMatIndex = msbUtilService.getIndex(etdWiseMaterialConsumption, "TECHDISER_ID", opId);
                                            if (etdMatIndex < 0) {
                                                var info = {};
                                                info.TECHDISER_ID = opId;
                                                info.materialId = matItem.materialId;
                                                info.etdId = etdCons.etdId;
                                                info.materialTitle = matItem.materialTitle;
                                                info.description = matItem.description;
                                                info.consType = matItem.consType;
                                                info.consMatType = matItem.consMatType;
                                                info.containerSize = (matItem.sizeInfo && matItem.sizeInfo.containerSize) ? matItem.sizeInfo.containerSize : "";
                                                info.containerSizeInfo = (matItem.sizeInfo && matItem.sizeInfo.containerSizeInfo) ? matItem.sizeInfo.containerSizeInfo : "";
                                                info.containerUnitId = (matItem.sizeInfo && matItem.sizeInfo.containerUnitId) ? matItem.sizeInfo.containerUnitId : "";
                                                info.forContainers = (matItem.sizeInfo && matItem.sizeInfo.forContainers) ? matItem.sizeInfo.forContainers : "";
                                                info.matDimensionInfo = (matItem.sizeInfo && matItem.sizeInfo.matDimensionInfo) ? matItem.sizeInfo.matDimensionInfo : "";
                                                info.matQty = (matItem.sizeInfo && matItem.sizeInfo.matQty) ? matItem.sizeInfo.matQty : "";
                                                info.matUnitId = (matItem.sizeInfo && matItem.sizeInfo.matUnitId) ? matItem.sizeInfo.matUnitId : "";
                                                info.orderMaterialUnitId = (matItem.orderMaterialUnitId) ? matItem.orderMaterialUnitId : info.matUnitId;
                                                info.consumption = 0;
                                                etdWiseMaterialConsumption.push(info);
                                                etdMatIndex = etdWiseMaterialConsumption.length - 1;
                                            }
                                            etdWiseMaterialConsumption[etdMatIndex].consumption += consumption;
                                        }
                                    });

                                }
                            }
                        })

                    }

                    etdWiseMaterialConsumption.forEach(function (item) {
                        if (item) {
                            var cons = (item.orderMaterialUnitId && item.matUnitId && item.orderMaterialUnitId != item.matUnitId && item.consumption)
                                ? msbMeasurementService.unitConvertion(item.consumption, item.matUnitId, item.orderMaterialUnitId)
                                : item.consumption;
                            item.consumption = (cons) ? parseInt(cons) : 0;
                            item.orderConsumption = (cons) ? parseInt(cons) : 0;
                            item.TKDR_MEASUREMENT_ORDER = item.orderMaterialUnitId;
                        }
                    });

                    return etdWiseMaterialConsumption;
                }

                return calOperations.calEtdWiseMaterialConsumption(etdPositionWisePackingConsumptions, packingContainers);

            }

            function calculateMaterialConsumption(uniqeId, etdWiseMaterialConsumption) {

                var materialConsumptions = [];
                if (uniqeId && etdWiseMaterialConsumption) {
                    etdWiseMaterialConsumption.forEach(function (etdMat) {
                        if (etdMat && etdMat.materialId) {
                            var matIndex = msbUtilService.getIndex(materialConsumptions, "materialId", etdMat.materialId);
                            if (matIndex < 0) {
                                var info = {};
                                info.TECHDISER_ID = uniqeId + etdMat.materialId;
                                info.materialTitle = etdMat.materialTitle;
                                info.description = etdMat.description;
                                info.consType = etdMat.consType;
                                info.consMatType = etdMat.consMatType;
                                info.orderMaterialUnitId = etdMat.orderMaterialUnitId;
                                info.materialId = etdMat.materialId;
                                info.containerSize = etdMat.containerSize;
                                info.containerSizeInfo = etdMat.containerSizeInfo;
                                info.containerUnitId = etdMat.containerUnitId;
                                info.forContainers = etdMat.forContainers;
                                info.matDimensionInfo = etdMat.matDimensionInfo;
                                info.matQty = etdMat.matQty;
                                info.matUnitId = etdMat.matUnitId;
                                info.consumption = (etdMat.consumption) ? etdMat.consumption : 0;
                                materialConsumptions.push(info);
                            } else {
                                materialConsumptions[matIndex].consumption += (etdMat.consumption) ? etdMat.consumption : 0;
                            }
                        }
                    });
                }

                materialConsumptions.forEach(function (material) {
                    if (material) {
                        var cons = (material.orderMaterialUnitId && material.matUnitId && material.orderMaterialUnitId != material.matUnitId && material.consumption)
                            ? msbMeasurementService.unitConvertion(material.consumption, material.matUnitId, material.orderMaterialUnitId)
                            : material.consumption;
                        material.consumption = (cons) ? parseInt(cons) : 0;
                        material.orderConsumption = (cons) ? parseInt(cons) : 0;
                        material.TKDR_MEASUREMENT_ORDER = material.orderMaterialUnitId;
                    }
                });

                return materialConsumptions;
            }

            function preparePackingItemConsumptionInfo(etdPositionWisePackingConsumptions) {

                var etdWiseConsumption = [];

                if (etdPositionWisePackingConsumptions) {
                    etdPositionWisePackingConsumptions.forEach(function (item) {
                        if (item) {
                            var info = {};
                            info.TECHDISER_ID = item.TECHDISER_ID;
                            info.matItemId = item.packingTypeId;
                            info.materialId = item.packingTypeId;
                            info.materialCatId = item.packingTypeId;
                            info.title = item.packingTitle;
                            info.description = item.description + ", Size: " + item.width + ", " + item.length + ", " + item.height;
                            info.consType = item.consType;
                            info.measurementUnitId = item.measurementUnitId;
                            info.packingSize = item.packingSize;
                            info.containerSize = item.packingSize;
                            info.requiredContainers = item.requiredContainers;
                            info.numberOfGmt = item.numberOfGmt;
                            info.matDimensionInfo = item.dimentionInfo;
                            info.etdDate = item.etdDate;
                            info.position = item.positionId;
                            info.consumption = item.consumption;
                            info.orderConsumption = item.consumption;
                            info.TKDR_MEASUREMENT_ORDER = item.measurementUnitId;
                            etdWiseConsumption.push(info);
                        }
                    });
                }

                return etdWiseConsumption;

            }

            function preparePackingMaterialConsumptionInfo(materialConsumption) {

                var matConsumption = [];

                if (materialConsumption) {
                    materialConsumption.forEach(function (item) {
                        if (item) {
                            var info = {};
                            info.TECHDISER_ID = item.TECHDISER_ID;
                            info.materialId = item.materialId;
                            info.matItemId = item.materialId;
                            info.materialCatId = item.materialId;
                            info.title = item.materialTitle;
                            info.description = item.description;
                            info.consType = item.consType;
                            info.consMatType = item.consMatType;
                            info.orderMaterialUnitId = item.orderMaterialUnitId;
                            info.containerSize = item.containerSize;
                            info.containerSizeInfo = item.containerSizeInfo;
                            info.containerUnitId = item.containerUnitId;
                            info.forContainers = item.forContainers;
                            info.matDimensionInfo = item.matDimensionInfo;
                            info.matQty = item.matQty;
                            info.matUnitId = item.matUnitId;
                            info.color = '';
                            info.matSize = '';
                            info.consumption = item.consumption;
                            info.orderConsumption = item.consumption;
                            info.TKDR_MEASUREMENT_ORDER = item.TKDR_MEASUREMENT_ORDER;
                            matConsumption.push(info);
                        }
                    });
                }

                return matConsumption;

            }

            return opDef;


        }

        function quickMarkerDataHandler() {

            var opDef = {
                prepareMaterialAssortForCombo: prepareMaterialAssortForCombo,
                calculateEtdMaterialConsumption: calculateEtdMaterialConsumption,
                prepareComboWiseConsumption: prepareComboWiseConsumption,
                prepareConsumptionOfAMaterialForComboSize: prepareConsumptionOfAMaterialForComboSize,
                prepareEtdWiseConsumption: prepareEtdWiseConsumption,
                preparTotalConsumption: preparTotalConsumption
            }

            function prepareComboWiseConsumption(uniqueId, comboMaterialInfo) {

                var comboWiseConsumption = [];

                if (comboMaterialInfo && uniqueId) {
                    comboMaterialInfo.forEach(function (comboMaterialItem) {

                        if (comboMaterialItem && comboMaterialItem.matInfo) {

                            comboMaterialItem.matInfo.forEach(function (material) {

                                if (material && material.matItemId && material.comboId) {
                                    var avgCons = (material.averageConsumptionArea) ? material.averageConsumptionArea : 0;
                                    var qty = (material.garmentQty) ? material.garmentQty : 0;
                                    var comMat = {};
                                    comMat.TECHDISER_ID = uniqueId + material.matItemId + material.comboId;
                                    comMat.color = material.color;
                                    comMat.comboId = material.comboId;
                                    comMat.consumptionInLength = material.consumptionInLength;
                                    comMat.consumption = avgCons * qty;
                                    comMat.description = material.materialDescription;
                                    comMat.matComboId = material.comboId;
                                    comMat.matItemId = material.matItemId;
                                    comMat.matSize = material.matSize;
                                    comMat.effectiveMatWidth = (material.effectiveMatWidth) ? material.effectiveMatWidth : material.effectiveWidth;
                                    comMat.title = material.materialTitle;
                                    comMat.materialTypeId = material.materialTypeId;
                                    comMat.markerLength = material.markerLength;
                                    comMat.markerWidth = material.markerWidth;
                                    comMat.markerLengthUnit = material.markerLengthUnit;
                                    comMat.markerWidthUnit = material.markerWidthUnit;
                                    comMat.averageConsumptionArea = avgCons;
                                    comMat.TKDR_MEASUREMENT_AREA = material.TKDR_MEASUREMENT_AREA;
                                    comMat.TKDR_MEASUREMENT_UNIT_WIDTH = material.TKDR_MEASUREMENT_UNIT_WIDTH;
                                    comMat.TKDR_MEASUREMENT_UNIT_LENGTH = material.TKDR_MEASUREMENT_UNIT_LENGTH;
                                    comMat.garmentQty = qty;
                                    comMat.sizeData = material.sizeData;
                                    comboWiseConsumption.push(comMat);
                                }
                            });
                        }
                    });
                }

                return comboWiseConsumption;

            }

            function prepareConsumptionOfAMaterialForComboSize(uniqueId, comboMaterialInfo) {

                var comboSizeWiseConsumption = [];

                if (comboMaterialInfo && uniqueId) {
                    comboMaterialInfo.forEach(function (comboMaterialItem) {

                        if (comboMaterialItem && comboMaterialItem.matInfo) {

                            comboMaterialItem.matInfo.forEach(function (material) {

                                if (material && material.matItemId && material.comboId && material.sizeInfo) {

                                    material.sizeInfo.forEach(function (size) {
                                        var comMat = {};
                                        comMat.TECHDISER_ID = uniqueId + material.matItemId + material.comboId + size.TECHDISER_ID;
                                        comMat.color = material.color;
                                        comMat.comboId = material.comboId;
                                        comMat.comboSizeID = material.comboId + size.TECHDISER_ID;
                                        comMat.description = material.materialDescription;
                                        comMat.matItemComboID = material.matItemId + material.comboId;
                                        comMat.matItemComboSizeID = material.matItemId + material.comboId + size.TECHDISER_ID;
                                        comMat.matItemId = material.matItemId;
                                        comMat.matSize = material.matSize;
                                        comMat.effectiveMatWidth = material.effectiveMatWidth;
                                        comMat.markerLengthUnit = material.markerLengthUnit;
                                        comMat.markerWidthUnit = material.markerWidthUnit;
                                        comMat.perGarmentConsumption = material.averageConsumptionArea;
                                        comMat.TKDR_MEASUREMENT_AREA = material.TKDR_MEASUREMENT_AREA;
                                        comMat.TKDR_MEASUREMENT_UNIT_WIDTH = material.TKDR_MEASUREMENT_UNIT_WIDTH;
                                        comMat.TKDR_MEASUREMENT_UNIT_LENGTH = material.TKDR_MEASUREMENT_UNIT_LENGTH;
                                        comMat.sizeId = size.TECHDISER_ID
                                        comMat.title = material.materialTitle;
                                        comboSizeWiseConsumption.push(comMat);
                                    });
                                }
                            });
                        }
                    });
                }

                return comboSizeWiseConsumption;


            }

            function prepareEtdWiseConsumption(uniqueId, etdComboQty, comboMaterialInfo, etds) {

                var etdWiseConsumption = [];

                var materialComboCons = calculateEtdMaterialConsumption(etdComboQty, comboMaterialInfo, etds);

                if (materialComboCons) {
                    materialComboCons.forEach(function (material) {
                        var comMat = {};
                        comMat.TECHDISER_ID = uniqueId + material.matItemId + material.etdId;
                        comMat.color = material.color;
                        comMat.consumption = material.etdConsumption;
                        comMat.garmentQty = material.garmentQty;
                        comMat.averageConsumptionArea = material.averageConsumptionArea;
                        comMat.etdConsumptionInLength = material.etdConsumptionInLength;
                        comMat.markerLengthUnit = material.markerLengthUnit;
                        comMat.markerWidthUnit = material.markerWidthUnit;
                        comMat.TKDR_MEASUREMENT_AREA = material.TKDR_MEASUREMENT_AREA;
                        comMat.TKDR_MEASUREMENT_UNIT_WIDTH = material.TKDR_MEASUREMENT_UNIT_WIDTH;
                        comMat.TKDR_MEASUREMENT_UNIT_LENGTH = material.TKDR_MEASUREMENT_UNIT_LENGTH;
                        comMat.description = material.materialDescription;
                        comMat.etdId = material.etdId;
                        comMat.matItemEtdId = material.matItemId + material.etdId;
                        comMat.matItemId = material.matItemId;
                        comMat.materialId = material.materialId;
                        comMat.materialCatId = material.materialCatId;
                        comMat.matSize = material.matSize;
                        comMat.effectiveMatWidth = material.effectiveMatWidth;
                        comMat.title = material.materialTitle;
                        comMat.consType = material.consType;
                        comMat.consMatType = material.consMatType;
                        etdWiseConsumption.push(comMat);
                    });
                }

                return etdWiseConsumption;
            }

            function preparTotalConsumption(uniqueId, etdComboQty, comboMaterialInfo, etds, supplyCategory, getOrderConsumptionUnit) {

                var totalConsumption = [];

                var etdWiseConsumption = prepareEtdWiseConsumption(uniqueId, etdComboQty, comboMaterialInfo, etds);

                if (etdWiseConsumption) {
                    etdWiseConsumption.forEach(function (material) {

                        var opID = uniqueId + material.matItemId;
                        var index = msbUtilService.getIndex(totalConsumption, "TECHDISER_ID", opID);
                        if (index < 0) {
                            var comMat = {};
                            comMat.TECHDISER_ID = opID;
                            comMat.color = material.color;
                            comMat.consumption = material.consumption;
                            comMat.garmentQty = material.garmentQty;
                            comMat.consumptionInLength = material.etdConsumptionInLength;
                            comMat.TKDR_MEASUREMENT_AREA = material.TKDR_MEASUREMENT_AREA;
                            comMat.TKDR_MEASUREMENT_UNIT_WIDTH = material.TKDR_MEASUREMENT_UNIT_WIDTH;
                            comMat.TKDR_MEASUREMENT_UNIT_LENGTH = material.TKDR_MEASUREMENT_UNIT_LENGTH;
                            comMat.markerLengthUnit = material.markerLengthUnit;
                            comMat.markerWidthUnit = material.markerWidthUnit;
                            comMat.description = material.description;
                            comMat.matItemId = material.matItemId;
                            comMat.materialId = material.materialId;
                            comMat.materialCatId = material.materialCatId;
                            comMat.matSize = material.matSize;
                            comMat.effectiveMatWidth = material.effectiveMatWidth;
                            comMat.title = material.title;
                            comMat.consType = material.consType;
                            comMat.consMatType = material.consMatType;
                            totalConsumption.push(comMat);
                        } else {
                            totalConsumption[index].garmentQty += (material.garmentQty) ? material.garmentQty : 0;
                            totalConsumption[index].consumption += (material.consumption) ? material.consumption : 0;
                            totalConsumption[index].consumptionInLength += (material.etdConsumptionInLength) ? material.etdConsumptionInLength : 0;
                        }
                    });
                }

                if (supplyCategory && getOrderConsumptionUnit) {
                    var orderUnit = getOrderConsumptionUnit(supplyCategory);
                    if (orderUnit) {
                        totalConsumption.forEach(function (info) {
                            if (info) {
                                if (info.consumptionInLength && info.TKDR_MEASUREMENT_AREA) {
                                    var ordrUnit = msbMeasurementService.unitConvertion(info.consumptionInLength, info.TKDR_MEASUREMENT_AREA, orderUnit);
                                    info.orderConsumption = (ordrUnit) ? Math.ceil(ordrUnit) : 0;
                                    info.TKDR_MEASUREMENT_ORDER = orderUnit;
                                }
                            }
                        })
                    }
                }

                return totalConsumption;

            }

            function calculateEtdMaterialConsumption(etdComboQty, comboMaterialInfo, etds) {

                var materialComboCons = [];

                if (comboMaterialInfo && etdComboQty && etds) {

                    etds.forEach(function (etd) {

                        if (etd && etd.TECHDISER_ID) {

                            comboMaterialInfo.forEach(function (comboMaterialItem) {

                                if (comboMaterialItem && comboMaterialItem.matInfo && comboMaterialItem.comboId) {

                                    var opId = etd.TECHDISER_ID + comboMaterialItem.comboId;

                                    var index = msbUtilService.getIndex(etdComboQty, "etdComboID", opId);

                                    if (index >= 0) {

                                        var gQty = (etdComboQty[index].quantity) ? etdComboQty[index].quantity : 0;

                                        comboMaterialItem.matInfo.forEach(function (material) {

                                            if (material && material.comboId) {

                                                var matItem = JSON.parse(JSON.stringify(material));
                                                matItem.etdId = etdComboQty[index].etdId;
                                                matItem.garmentQty = gQty;

                                                var avgCons = (material.averageConsumptionArea) ? material.averageConsumptionArea : 0;
                                                matItem.etdConsumption = gQty * avgCons;
                                                var consInLength = msbMeasurementService.calculateLengthFromArea(
                                                    matItem.etdConsumption,
                                                    material.TKDR_MEASUREMENT_AREA,
                                                    (material.effectiveMatWidth) ? material.effectiveMatWidth : material.matSize,
                                                    material.TKDR_MEASUREMENT_UNIT_WIDTH,
                                                    material.TKDR_MEASUREMENT_AREA
                                                );
                                                matItem.etdConsumptionInLength = (consInLength && consInLength.dt) ? parseInt(consInLength.dt) : 0;
                                                materialComboCons.push(matItem);

                                            }

                                        })

                                    }

                                }

                            });

                        }

                    });


                }

                return materialComboCons;

            }

            function prepareMaterialAssortForCombo(uniqueId, comboDefinition, comboSizeWiseMaterial, sizeDefinition, persistableData, prefix) {

                var comboMaterails = [];

                if (comboDefinition) {

                    comboDefinition.forEach(function (combo) {
                        if (combo) {
                            var comboMat = {};
                            comboMat.comboId = combo.TECHDISER_ID;
                            comboMat.matInfo = prepareMaterialAssortInfo(uniqueId, combo, comboSizeWiseMaterial, sizeDefinition, persistableData, prefix);
                            comboMaterails.push(comboMat);
                        }
                    })
                }

                return comboMaterails;

            }

            // QuickMarkerDetailsCons


            function prepareMaterialAssortInfo(uniqueId, combo, comboSizeWiseMaterial, sizeDefinition, persistableData, prefix) {

                var matInfo = [];

                comboSizeWiseMaterial.forEach(function (material) {
                    if (material && material.comboId == combo.TECHDISER_ID) {
                        var mat = {};
                        // JSON.parse( JSON.stringify(material) );
                        mat.TECHDISER_ID = "matAssort" + material.TECHDISER_ID;
                        mat.color = material.color;
                        mat.colorId = material.colorId;
                        mat.comboId = material.comboId;
                        mat.comboTitle = material.comboTitle;
                        mat.gsm = material.gsm;
                        mat.matItemComboSizeId = material.matItemComboSizeId;
                        mat.matItemId = material.matItemId;
                        mat.matSize = material.matSize;
                        mat.effectiveMatWidth = material.effectiveWidth;
                        mat.matType = material.matType;
                        mat.consType = material.matType;
                        mat.consMatType = material.materialTypeId;
                        mat.materialCatId = material.materialCatId;
                        mat.materialDescription = material.materialDescription;
                        mat.materialId = material.materialId;
                        mat.materialTitle = material.materialTitle;
                        mat.materialTypeId = material.materialTypeId;
                        mat.materialWidth = material.materialWidth;


                        var existingInfo = getExistinfInfo(uniqueId, material, persistableData, prefix);

                        mat.markerLength = (existingInfo && existingInfo.markerLength) ? existingInfo.markerLength : 0;
                        mat.markerWidth = (existingInfo && existingInfo.markerWidth) ? existingInfo.markerWidth : 0;
                        mat.averageConsumptionArea = (existingInfo && existingInfo.averageConsumptionArea) ? existingInfo.averageConsumptionArea : 0;
                        mat.consumptionInLength = (existingInfo && existingInfo.consumptionInLength) ? existingInfo.consumptionInLength : 0;
                        mat.TKDR_MEASUREMENT_UNIT_WIDTH = (existingInfo && existingInfo.TKDR_MEASUREMENT_UNIT_WIDTH) ? existingInfo.TKDR_MEASUREMENT_UNIT_WIDTH : material.TKDR_MEASUREMENT_UNIT;
                        mat.TKDR_MEASUREMENT_AREA = (existingInfo && existingInfo.TKDR_MEASUREMENT_AREA) ? existingInfo.TKDR_MEASUREMENT_AREA : "";
                        mat.markerLengthUnit = (existingInfo && existingInfo.markerLengthUnit) ? existingInfo.markerLengthUnit : "";
                        mat.markerWidthUnit = (existingInfo && existingInfo.markerWidthUnit) ? existingInfo.markerWidthUnit : "";

                        matInfo.push(mat);

                        var index = matInfo.length - 1;

                        matInfo[index].sizeInfo = JSON.parse(JSON.stringify(sizeDefinition));

                        matInfo[index].sizeData = (existingInfo && existingInfo.sizeData) ? prepareSizeInfo(matInfo[index], prefix, existingInfo.sizeData) : prepareSizeInfo(matInfo[index]);
                        var garmentQty = (existingInfo && existingInfo.garmentQty) ? existingInfo.garmentQty : 0;
                        matInfo[index].garmentQty = (garmentQty) ? garmentQty : calculateComboGarmentQty(matInfo[index]);
                        matInfo[index].consumption = matInfo[index].averageConsumptionArea * garmentQty;

                    }
                });
                return matInfo;
            }

            function getExistinfInfo(uniqueId, material, persistableData, prefix) {

                if (material && persistableData && persistableData.comboWiseConsumption) {

                    var opId = prefix + uniqueId + material.matItemId + material.comboId;

                    var index = msbUtilService.getIndex(persistableData.comboWiseConsumption, "TECHDISER_ID", opId);
                    if (index >= 0) {
                        return persistableData.comboWiseConsumption[index];
                    }

                }

                return null;

            }

            function calculateComboGarmentQty(material) {

                var garmentQuantity = 0;

                if (material && material.sizeData) {
                    for (var i = 0; i < material.sizeData.length; i++) {
                        if (material.sizeData[i] && material.sizeData[i].quantity) {
                            garmentQuantity += (material.sizeData[i].quantity) ? parseInt(material.sizeData[i].quantity) : 0;
                        }
                    }
                }

                return garmentQuantity;

            }

            function prepareSizeInfo(material, prefix, existingSizeData) {

                var sizeItems = [];

                if (material && material.sizeInfo) {
                    for (var i = 0; i < material.sizeInfo.length; i++) {
                        if (material.sizeInfo[i] && material.sizeInfo[i].sizes) {
                            for (var j = 0; j < material.sizeInfo[i].sizes.length; j++) {
                                if (material.sizeInfo[i].sizes[j]) {

                                    var szData = {};
                                    szData.TECHDISER_ID = material.TECHDISER_ID + material.sizeInfo[i].TECHDISER_ID + material.sizeInfo[i].sizes[j].TECHDISER_ID;
                                    szData.matSizeInfoId = material.TECHDISER_ID + material.sizeInfo[i].TECHDISER_ID + material.sizeInfo[i].sizes[j].TECHDISER_ID;
                                    szData.quantity = 0;
                                    szData.sizeInfo = material.sizeInfo[i].TECHDISER_ID;
                                    szData.sizeId = material.sizeInfo[i].sizes[j].TECHDISER_ID;

                                    if (existingSizeData) {
                                        var index = msbUtilService.getIndex(existingSizeData, "TECHDISER_ID", prefix + szData.TECHDISER_ID);
                                        if (index >= 0 && existingSizeData[index] && existingSizeData[index].quantity) {
                                            szData.quantity = existingSizeData[index].quantity;
                                        }
                                    }

                                    sizeItems.push(szData);
                                }
                            }
                        }
                    }
                }

                return sizeItems;

            }

            return opDef;

        }

        function consumptionPersistor() {

            var opDef = {
                preparePersistableData: preparePersistableData
            }

            function setUnitInfo(info, infoSource) {
                if (infoSource.TKDR_MEASUREMENT_UNIT_WIDTH) {
                    info.TKDR_MEASUREMENT_UNIT_WIDTH = infoSource.TKDR_MEASUREMENT_UNIT_WIDTH;
                }
                if (infoSource.TKDR_MEASUREMENT_UNIT_LENGTH) {
                    info.TKDR_MEASUREMENT_UNIT_LENGTH = infoSource.TKDR_MEASUREMENT_UNIT_LENGTH;
                }
                if (infoSource.TKDR_MEASUREMENT_UNIT) {
                    info.TKDR_MEASUREMENT_UNIT = infoSource.TKDR_MEASUREMENT_UNIT;
                }
                if (infoSource.TKDR_MEASUREMENT_AREA) {
                    info.TKDR_MEASUREMENT_AREA = infoSource.TKDR_MEASUREMENT_AREA;
                }
                if (!infoSource.TKDR_MEASUREMENT_UNIT && infoSource.TKDR_MEASUREMENT_AREA) {
                    info.TKDR_MEASUREMENT_UNIT = infoSource.TKDR_MEASUREMENT_AREA;
                }
                if (infoSource.TKDR_MEASUREMENT_ORDER) {
                    info.TKDR_MEASUREMENT_ORDER = infoSource.TKDR_MEASUREMENT_ORDER;
                }
                if (infoSource.markerLengthUnit) {
                    info.markerLengthUnit = infoSource.markerLengthUnit;
                }
                if (infoSource.markerWidthUnit) {
                    info.markerWidthUnit = infoSource.markerWidthUnit;
                }
            }

            function getcomboSizeCons(consPolicy, consumptionOfAMaterialForComboSize) {
                var comboSizeCons = [];
                consumptionOfAMaterialForComboSize.forEach(function (comboSizeComb) {
                    if (comboSizeComb) {
                        var info = {};
                        info.TECHDISER_ID = getConsDetailsIdPrefix(consPolicy, comboSizeComb.TECHDISER_ID);
                        info.comboId = comboSizeComb.comboId;
                        info.sizeId = comboSizeComb.sizeId;
                        info.comboSizeID = comboSizeComb.comboSizeID;
                        info.matItemComboID = comboSizeComb.matItemComboID;
                        if (!info.matItemComboID) {
                            info.matItemComboID = comboSizeComb.matComboId;
                        }
                        if (!info.matItemComboID) {
                            info.matItemComboID = comboSizeComb.matItemId + comboSizeComb.comboId;
                        }
                        info.matItemComboSizeID = comboSizeComb.matItemComboSizeID;
                        info.matItemId = comboSizeComb.matItemId;
                        info.perGarmentConsumption = comboSizeComb.perGarmentConsumption;

                        setUnitInfo(info, comboSizeComb);

                        comboSizeCons.push(info);
                    }
                });
                return comboSizeCons;
            }

            function getComboWiseCons(consPolicy, comboWiseConsumption) {
                var comboCons = [];
                if (comboWiseConsumption) {
                    comboWiseConsumption.forEach(function (comboConsItem) {
                        if (comboConsItem) {
                            var info = {};
                            info.TECHDISER_ID = getConsDetailsIdPrefix(consPolicy, comboConsItem.TECHDISER_ID);
                            info.averageConsumptionArea = comboConsItem.averageConsumptionArea;
                            info.comboId = comboConsItem.comboId;
                            info.consumptionInLength = comboConsItem.consumptionInLength;
                            info.markerLength = comboConsItem.markerLength;
                            info.markerWidth = comboConsItem.markerWidth;
                            info.matComboId = comboConsItem.matComboId;
                            info.matItemId = comboConsItem.matItemId;
                            setUnitInfo(info, comboConsItem);
                            if (comboConsItem.sizeData) {
                                info.sizeData = [];
                                comboConsItem.sizeData.forEach(function (szDef) {
                                    if (szDef) {
                                        var def = {};
                                        def.TECHDISER_ID = getConsDetailsIdPrefix(consPolicy, szDef.TECHDISER_ID);
                                        def.matSizeInfoId = szDef.matSizeInfoId;
                                        def.quantity = szDef.quantity;
                                        def.sizeId = szDef.sizeId;
                                        def.sizeInfo = szDef.sizeInfo;
                                        setUnitInfo(def, szDef);
                                        info.sizeData.push(def);
                                    }
                                });
                            }
                            comboCons.push(info);
                        }
                    })
                }
                return comboCons;
            }

            function getPomInfo(consPolicy, pomPositionInfo) {

                var pomPosInfo = [];

                if (pomPositionInfo) {
                    pomPositionInfo.forEach(function (pomPos) {

                        if (pomPos) {
                            var info = {};
                            info.TECHDISER_ID = getConsDetailsIdPrefix(consPolicy, pomPos.TECHDISER_ID);
                            info.consumption = pomPos.consumption;
                            info.title = pomPos.title;
                            info.lengthAllowance = pomPos.lengthAllowance;
                            info.description = pomPos.description;
                            info.noOfPanels = pomPos.noOfPanels;
                            info.selectedPomLengths = pomPos.selectedPomLengths;
                            info.selectedPomWidths = pomPos.selectedPomWidths;
                            info.selectedLengthPoms = pomPos.selectedLengthPoms;
                            info.selectedWidthPoms = pomPos.selectedWidthPoms;
                            info.positionId = (pomPos.positionId) ? pomPos.positionId.trim() : "";
                            setUnitInfo(info, pomPos);
                            info.sizeData = [];
                            if (pomPos.sizeData) {
                                pomPos.sizeData.forEach(function (sizeItem) {
                                    var szData = {};
                                    szData.TECHDISER_ID = getConsDetailsIdPrefix(consPolicy, sizeItem.TECHDISER_ID);
                                    szData.pomLength = sizeItem.pomLength;
                                    szData.pomSizeInfoId = sizeItem.pomSizeInfoId;
                                    szData.pomWidth = sizeItem.pomWidth;
                                    szData.sizeId = sizeItem.sizeId;
                                    szData.sizeInfo = sizeItem.sizeInfo;
                                    setUnitInfo(szData, sizeItem);
                                    info.sizeData.push(szData);
                                })


                            }
                            pomPosInfo.push(info);
                        }

                    })
                }

                return pomPosInfo;

            }

            function getProdMarkerInfo(consPolicy, prodMarkerConsumptionDetails) {

                var prodMarkerInfo = [];

                if (prodMarkerConsumptionDetails) {

                    prodMarkerConsumptionDetails.forEach(function (prodMarker) {

                        if (prodMarker) {
                            var info = {};
                            info.TECHDISER_ID = getConsDetailsIdPrefix(consPolicy, prodMarker.TECHDISER_ID);
                            info.TECHDISER_SERIAL_NO = prodMarker.TECHDISER_SERIAL_NO;
                            info.matItemId = prodMarker.matItemId;
                            info.matItemComboId = prodMarker.matItemComboId;
                            info.comboId = prodMarker.comboId;
                            info.colorSizeId = prodMarker.colorSizeId;
                            info.materialId = prodMarker.materialId;
                            info.markerPolcyNo = prodMarker.markerPolcyNo;
                            info.markerLength = prodMarker.markerLength;
                            info.noOfPly = prodMarker.noOfPly;
                            info.garmentQuantity = prodMarker.garmentQuantity;
                            info.runningPly = prodMarker.runningPly;
                            info.newMarkerRequired = prodMarker.newMarkerRequired;
                            setUnitInfo(info, prodMarker);
                            info.markerSizeInfo = [];
                            if (prodMarker.markerSizeInfo) {
                                prodMarker.markerSizeInfo.forEach(function (item) {
                                    if (item) {
                                        var sizeDef = {};
                                        sizeDef.TECHDISER_ID = getConsDetailsIdPrefix(consPolicy, item.TECHDISER_ID);
                                        sizeDef.sizeId = item.sizeId;
                                        sizeDef.beginningQty = item.beginningQty;
                                        sizeDef.garmentQty = item.garmentQty;
                                        sizeDef.cutQty = item.cutQty;
                                        setUnitInfo(sizeDef, item);
                                        info.markerSizeInfo.push(sizeDef);
                                    }
                                });
                            }
                            prodMarkerInfo.push(info);
                        }
                    })
                }

                return prodMarkerInfo;

            }

            function getConsDetailsIdPrefix(consPolicy, consDetailsId) {

                if (consDetailsId.startsWith(consPolicy)) {
                    return consDetailsId;
                }

                return consPolicy + consDetailsId;

            }

            function preparePersistableData(uniqueId, consPolicy, consumptionOfAMaterialForComboSize, totalConsumption, comboWiseConsumption, pomPositionInfo, prodMarkerConsumptionDetails) {

                var consumptionInfo = {};

                consumptionInfo.TECHDISER_ID = "DetailCons" + consPolicy + uniqueId;

                if (consumptionOfAMaterialForComboSize) {
                    consumptionInfo.consumptionOfAMaterialForComboSize = getcomboSizeCons(consPolicy, consumptionOfAMaterialForComboSize);
                }

                if (totalConsumption) {
                    consumptionInfo.totalConsumption = angular.copy(totalConsumption);
                }

                if (comboWiseConsumption) {
                    consumptionInfo.comboWiseConsumption = getComboWiseCons(consPolicy, comboWiseConsumption);
                }

                if (pomPositionInfo) {
                    consumptionInfo.pomPositionInfo = getPomInfo(consPolicy, pomPositionInfo);
                }

                if (prodMarkerConsumptionDetails) {
                    consumptionInfo.prodMarkerConsumptionDetails = getProdMarkerInfo(consPolicy, prodMarkerConsumptionDetails);
                }

                return consumptionInfo;
            }

            return opDef;

        }

        function pomDataHandler() {

            var opDef = {

                getNewPom: getNewPom,
                initPomInfo: initPomInfo,
                calculateComboSizeWiseConsumption: calculateComboSizeWiseConsumption,
                loadSelectedPomUnits: loadSelectedPomUnits,
                preparePomInfo: preparePomInfo,
                updatePartSizeInfo: updatePartSizeInfo,
                initiatePomDef: initiatePomDef

            }

            function initiatePomDef(persistablePOMData, pomDef, sizeDefinition, pomUnits) {

                function initSizeInfo(id, sizeDefinition) {

                    var sizeDefInfo = [];

                    if (sizeDefinition) {
                        sizeDefinition.forEach(function (zone) {
                            if (zone && zone.TECHDISER_ID && zone.sizes) {
                                zone.sizes.forEach(function (sz) {
                                    if (sz && sz.TECHDISER_ID) {
                                        var sizeInfo = {};
                                        sizeInfo.TECHDISER_ID = id + zone.TECHDISER_ID + sz.TECHDISER_ID;
                                        sizeInfo.zoneSizeId = zone.TECHDISER_ID + sz.TECHDISER_ID;
                                        sizeInfo.sizeId = sz.TECHDISER_ID;
                                        sizeInfo.zoneId = zone.TECHDISER_ID;
                                        sizeInfo.pomWidth = 0;
                                        sizeInfo.pomLength = 0;
                                        sizeDefInfo.push(sizeInfo);
                                    }
                                });
                            }
                        });
                    }

                    return sizeDefInfo;

                }

                function initPomInfo(persistablePOMData, pomDef, sizeDefinition) {

                    if (!persistablePOMData) {
                        persistablePOMData = [];
                    }

                    var preparedInfo = angular.copy(persistablePOMData);

                    if (preparedInfo && pomDef && pomDef.positions) {
                        pomDef.positions.forEach(function (pomItem) {
                            if (pomItem && pomItem.TECHDISER_ID) {
                                var id = "measurementPomDef" + pomItem.TECHDISER_ID;
                                var index = msbUtilService.getIndex(preparedInfo, "TECHDISER_ID", id);
                                if (index < 0) {
                                    var info = {};
                                    info.TECHDISER_ID = id;
                                    info.pomId = pomItem.TECHDISER_ID;
                                    info.title = pomItem.position;
                                    info.description = pomItem.description;
                                    info.lengthAllowance = pomItem.lengthAllowance;
                                    info.widthAllowance = pomItem.widthAllowance;
                                    info.TKDR_MEASUREMENT_UNIT_LENGTH = (pomItem.unitId)
                                        ? pomItem.unitId
                                        : (pomUnits && pomUnits.selectedLength && pomUnits.selectedLength.id)
                                            ? pomUnits.selectedLength.id
                                            : "";
                                    info.TKDR_MEASUREMENT_UNIT_WIDTH = (pomItem.unitId)
                                        ? pomItem.unitId
                                        : (pomUnits && pomUnits.selectedWidth && pomUnits.selectedWidth.id)
                                            ? pomUnits.selectedWidth.id
                                            : "";
                                    info.sizeDef = initSizeInfo(info.TECHDISER_ID, sizeDefinition);
                                    preparedInfo.push(info);
                                    index = preparedInfo.length - 1;
                                }
                                var missingSizes = [];
                                if (index >= 0 && preparedInfo[index]) {
                                    if (pomItem.widths) {
                                        pomItem.widths.forEach(function (widthItem) {
                                            if (widthItem && widthItem.sizeId && widthItem.zoneId && widthItem.value) {
                                                var id = widthItem.zoneId + widthItem.sizeId;
                                                var sizeIndex = msbUtilService.getIndex(preparedInfo[index].sizeDef, "zoneSizeId", id);
                                                if (sizeIndex >= 0) {
                                                    preparedInfo[index].sizeDef[sizeIndex].pomWidth = widthItem.value;
                                                } else if (missingSizes.indexOf(widthItem.sizeId) < 0) {
                                                    missingSizes.push(widthItem.sizeId);
                                                }
                                            }
                                        });
                                    }

                                    if (pomItem.lengths) {
                                        pomItem.lengths.forEach(function (lengthItem) {
                                            if (lengthItem && lengthItem.sizeId && lengthItem.zoneId && lengthItem.value) {
                                                var id = lengthItem.zoneId + lengthItem.sizeId;
                                                var sizeIndex = msbUtilService.getIndex(preparedInfo[index].sizeDef, "zoneSizeId", id);
                                                if (sizeIndex >= 0) {
                                                    preparedInfo[index].sizeDef[sizeIndex].pomLength = lengthItem.value;
                                                } else if (missingSizes.indexOf(lengthItem.sizeId) < 0) {
                                                    missingSizes.push(lengthItem.sizeId);
                                                }
                                            }
                                        });
                                    }
                                }

                                if (index >= 0 && preparedInfo[index] && missingSizes.length > 0) {
                                    if (!preparedInfo[index].sizeDef) {
                                        preparedInfo[index].sizeDef = [];
                                    }
                                    var sizeDefForMissingItem = angular.copy(sizeDefinition);
                                    var removeableZones = [];
                                    sizeDefForMissingItem.forEach(function (zone, zoneIndex) {
                                        if (zone && zone.sizes) {
                                            var removeableSizes = [];
                                            zone.sizes.forEach(function (size, index) {
                                                if (size && size.TECHDISER_ID && missingSizes.indexOf(size.TECHDISER_ID) < 0) {
                                                    removeableSizes.push(index);
                                                }
                                            });
                                            for (var i = removeableSizes.length - 1; i >= 0; i--) {
                                                zone.sizes.splice(removeableSizes[i], 1);
                                            }
                                            if (zone.sizes.length <= 0) {
                                                removeableZones.push(zoneIndex);
                                            }
                                        }
                                    });
                                    for (var i = removeableZones.length - 1; i >= 0; i--) {
                                        sizeDefForMissingItem.splice(removeableZones[i], 1);
                                    }
                                    var missingSizeDef = initSizeInfo(id, sizeDefForMissingItem);
                                    info.sizeDef = (missingSizeDef && missingSizeDef.length > 0)
                                        ? info.sizeDef.concat(missingSizeDef)
                                        : info.sizeDef;
                                }
                            }
                        });
                    }
                    return preparedInfo;
                }

                return initPomInfo(persistablePOMData, pomDef, sizeDefinition);

            }


            function loadSelectedPomUnits(measurementUnits) {

                var selectedLength = null;

                var selectedWidth = null;

                if (measurementUnits && measurementUnits.lengthDef && measurementUnits.lengthDef.defaultUnit) {

                    if (measurementUnits.lengthDef.units) {
                        measurementUnits.lengthDef.units.forEach(function (item) {
                            if (item && item.id && item.id == measurementUnits.lengthDef.defaultUnit) {
                                selectedLength = item;
                            }
                        });
                    }
                }

                if (measurementUnits && measurementUnits.widthDef && measurementUnits.widthDef.defaultUnit) {
                    if (measurementUnits.lengthDef.units) {
                        measurementUnits.widthDef.units.forEach(function (item) {
                            if (item && item.id && item.id == measurementUnits.lengthDef.defaultUnit) {
                                selectedWidth = item;
                            }
                        });
                    }
                }

                return {
                    "selectedLength": selectedLength,
                    "selectedWidth": selectedWidth
                }

            }

            function updatePartSizeInfo(pomPositionInfo, partPomDef, defaultUnitDef) {

                function getDeafultKey(selectedLength) {

                    return (selectedLength && selectedLength.id)
                        ? selectedLength.id
                        : "";
                }

                function getUsedKeys(leghtInfo) {

                    var usedLengths = [];

                    if (leghtInfo) {
                        leghtInfo.forEach(function (item) {
                            if (item && item.units) {
                                item.units.forEach(function (unitKey) {
                                    if (unitKey && unitKey.unitKey && usedLengths.indexOf(unitKey.unitKey) < 0) {
                                        usedLengths.push(unitKey.unitKey);
                                    }
                                });
                            }
                        });
                    }

                    return usedLengths;

                }

                function getPartUnitKey(calculableUnitInfo, defaultLength, defaultWidth) {

                    var usedLengths = (calculableUnitInfo && calculableUnitInfo.leghtInfo) ? getUsedKeys(calculableUnitInfo.leghtInfo) : [];

                    var usedWidths = (calculableUnitInfo && calculableUnitInfo.widthInfo) ? getUsedKeys(calculableUnitInfo.widthInfo) : [];

                    var lengthKey = (usedLengths && usedLengths.length == 1 && usedLengths[0]) ? usedLengths[0] : defaultLength;

                    var widthKey = (usedWidths && usedWidths.length == 1 && usedWidths[0]) ? usedWidths[0] : defaultWidth;

                    return { "defLength": lengthKey, "defWidth": widthKey };

                }

                function createLengthItem(calculableLengths, selectedPomLengths, sizeItem, defKey) {


                    if (calculableLengths, selectedPomLengths && sizeItem) {

                        var calIndex = msbUtilService.getIndex(calculableLengths, "sizeId", sizeItem.sizeId);

                        if (calIndex < 0) {
                            var cInfo = { "sizeId": sizeItem.sizeId, "units": [] };
                            calculableLengths.push(cInfo);
                            calIndex = calculableLengths.length - 1;
                        }

                        if (calculableLengths[calIndex] && calculableLengths[calIndex].units) {

                            var calculableUnits = [];

                            selectedPomLengths.forEach(function (info) {
                                if (info && info.sizeId && info.sizeId == sizeItem.sizeId) {
                                    var unitKey = (info.unitKey) ? info.unitKey : defKey;
                                    var cItem = msbMeasurementService.getCalculableUnitDef(((info.size) ? info.size : 0), unitKey);
                                    calculableUnits.push(cItem);
                                }
                            });

                            calculableLengths[calIndex].units = calculableLengths[calIndex].units.concat(calculableUnits);

                        }

                    }


                }

                function prepareCalculableMeasurementUnit(pomPositionInfo, partPomDef, defaultLength, defaultWidth) {

                    var calculableLengths = [];
                    var calculableWidths = [];

                    if (pomPositionInfo.sizeData) {

                        pomPositionInfo.sizeData.forEach(function (sizeItem) {

                            if (sizeItem && sizeItem.sizeId) {

                                if (partPomDef.selectedPomLengths) {
                                    createLengthItem(calculableLengths, partPomDef.selectedPomLengths, sizeItem, defaultLength);
                                }

                                if (partPomDef.selectedPomWidths) {
                                    createLengthItem(calculableWidths, partPomDef.selectedPomWidths, sizeItem, defaultWidth);
                                }

                            }

                        })

                    }

                    return msbMeasurementService.getCalculableInfoDef(calculableLengths, calculableWidths);

                }

                function initPartSizeInfo(pomPositionInfo) {

                    if (pomPositionInfo.sizeData) {

                        pomPositionInfo.sizeData.forEach(function (sizeItem) {
                            sizeItem.pomLength = 0;
                            sizeItem.pomWidth = 0;
                        });
                    }

                }

                function setPartSizeInfo(pomPositionInfo, calculableUnitInfo, defaultUnis) {

                    if (pomPositionInfo.sizeData) {

                        pomPositionInfo.TKDR_MEASUREMENT_UNIT_LENGTH = defaultUnis.defLength;
                        pomPositionInfo.TKDR_MEASUREMENT_UNIT_WIDTH = defaultUnis.defWidth;

                        pomPositionInfo.sizeData.forEach(function (sizeItem) {

                            if (sizeItem && sizeItem.sizeId) {

                                if (calculableUnitInfo && calculableUnitInfo.leghtInfo) {
                                    calculableUnitInfo.leghtInfo.forEach(function (info) {
                                        if (info && info.sizeId && info.units && info.units.length > 0 && info.sizeId == sizeItem.sizeId) {
                                            var unitInfo = msbMeasurementService.getCalculableInfoDef(angular.copy(info.units));
                                            var lengthInfo = msbMeasurementService.performOperationOnUnit(unitInfo, defaultUnis.defLength, MEASUREMENT_CALCULATION_TYPES[0]);
                                            sizeItem.pomLength = ((sizeItem.pomLength) ? sizeItem.pomLength : 0) + ((lengthInfo && lengthInfo.dt) ? lengthInfo.dt : 0);
                                        }
                                    });
                                }

                                if (calculableUnitInfo && calculableUnitInfo.widthInfo) {
                                    calculableUnitInfo.widthInfo.forEach(function (info) {
                                        if (info && info.sizeId && info.units && info.units.length > 0 && info.sizeId == sizeItem.sizeId) {
                                            var unitInfo = msbMeasurementService.getCalculableInfoDef(angular.copy(info.units));
                                            var widthInfo = msbMeasurementService.performOperationOnUnit(unitInfo, defaultUnis.defWidth, MEASUREMENT_CALCULATION_TYPES[0]);
                                            sizeItem.pomWidth = ((sizeItem.pomWidth) ? sizeItem.pomWidth : 0) + ((widthInfo && widthInfo.dt) ? widthInfo.dt : 0);
                                        }
                                    });
                                }
                            }
                        });
                    }

                }

                function initCalculation(pomPositionInfo, partPomDef, defaultUnitDef) {

                    var defaultLength = (defaultUnitDef && defaultUnitDef.selectedLength)
                        ? getDeafultKey(defaultUnitDef.selectedLength)
                        : "";

                    var defaultWidth = (defaultUnitDef && defaultUnitDef.selectedWidth)
                        ? getDeafultKey(defaultUnitDef.selectedWidth)
                        : "";

                    var calculableUnitInfo = prepareCalculableMeasurementUnit(pomPositionInfo, partPomDef, defaultLength, defaultWidth);

                    var defaultUnis = getPartUnitKey(calculableUnitInfo, defaultLength, defaultWidth);

                    initPartSizeInfo(pomPositionInfo);

                    setPartSizeInfo(pomPositionInfo, calculableUnitInfo, defaultUnis);

                }

                initCalculation(pomPositionInfo, partPomDef, defaultUnitDef);

            }

            function flattenPOM(pomPositionInfo) {

                var flattenedPom = [];

                if (pomPositionInfo) {
                    pomPositionInfo.forEach(function (pom) {
                        if (pom && pom.sizeData && pom.positionId) {
                            pom.sizeData.forEach(function (size) {
                                if (size && size.sizeId && size.pomSizeInfoId) {
                                    var info = {};
                                    info.pomSizeInfoId = size.pomSizeInfoId;
                                    info.positionId = pom.positionId.trim();
                                    info.sizeId = size.sizeId;
                                    info.sizePositionId = size.sizeId + pom.positionId.trim();
                                    info.pomId = pom.TECHDISER_ID;
                                    info.pomLength = (size.pomLength) ? size.pomLength : 0;
                                    info.pomWidth = (size.pomWidth) ? size.pomWidth : 0;
                                    info.widthAllowance = (pom.widthAllowance) ? pom.widthAllowance : 0;
                                    info.lengthAllowance = (pom.lengthAllowance) ? pom.lengthAllowance : 0;
                                    info.TKDR_MEASUREMENT_UNIT_LENGTH = pom.TKDR_MEASUREMENT_UNIT_LENGTH;
                                    info.TKDR_MEASUREMENT_UNIT_WIDTH = pom.TKDR_MEASUREMENT_UNIT_WIDTH;
                                    info.noOfPanels = (pom.noOfPanels) ? pom.noOfPanels : 0;
                                    flattenedPom.push(info);
                                }
                            })
                        }
                    })
                }

                return flattenedPom;

            }

            function calculateSizePositionWiseConsumption(flattenedPom, measurementUnit) {

                var sizePositionWiseConsumption = [];

                if (flattenedPom) {
                    flattenedPom.forEach(function (pom) {
                        if (pom && pom.sizePositionId) {
                            var pomLength = (pom.pomLength) ? pom.pomLength : 0;
                            var pomWidth = (pom.pomWidth) ? pom.pomWidth : 0;
                            var widthAllowance = (pom.widthAllowance) ? pom.widthAllowance : 0;
                            var lengthAllowance = (pom.lengthAllowance) ? pom.lengthAllowance : 0;
                            var noOfPanels = (pom.noOfPanels) ? pom.noOfPanels : 0;
                            var consumptionInfo = msbMeasurementService.calculateArea(
                                (pomLength + lengthAllowance) * noOfPanels,
                                pom.TKDR_MEASUREMENT_UNIT_LENGTH,
                                (pomWidth + widthAllowance) * noOfPanels,
                                pom.TKDR_MEASUREMENT_UNIT_WIDTH,
                                measurementUnit
                            );

                            var consumption = (consumptionInfo) ? consumptionInfo.dt : 0;
                            var consKey = (consumptionInfo) ? consumptionInfo.unitKey : "";
                            var index = msbUtilService.getIndex(sizePositionWiseConsumption, "sizePositionId", pom.sizePositionId);
                            if (index < 0) {
                                var info = {};
                                info.sizePositionId = pom.sizePositionId;
                                info.positionId = pom.positionId;
                                info.sizeId = pom.sizeId;
                                info.consumption = consumption;
                                info.TKDR_MEASUREMENT_UNIT = consKey;
                                sizePositionWiseConsumption.push(info);
                            } else {
                                sizePositionWiseConsumption[index].consumption += consumption;
                            }
                        }
                    })
                }

                return sizePositionWiseConsumption;

            }

            function calComboSizeWiseConsumption(uniqueId, sizePositionWiseConsumption, materials, measurementUnit) {

                var comboSizeWiseConsumption = [];

                if (materials && sizePositionWiseConsumption) {

                    materials.forEach(function (material, iteIndex) {

                        if (material && material.comboId && material.positionId) {

                            var index = msbUtilService.getIndex(sizePositionWiseConsumption, "positionId", material.positionId);

                            if (index >= 0) {

                                var consumption = (sizePositionWiseConsumption[index].consumption) ? sizePositionWiseConsumption[index].consumption : 0;

                                var opId = uniqueId + material.matItemId + material.comboId + sizePositionWiseConsumption[index].sizeId;

                                var comboMatIndex = msbUtilService.getIndex(comboSizeWiseConsumption, "TECHDISER_ID", opId);

                                if (comboMatIndex < 0) {
                                    var comMat = {};
                                    comMat.TECHDISER_ID = opId
                                    comMat.color = material.color;
                                    comMat.comboId = material.comboId;
                                    comMat.comboSizeID = material.comboId + sizePositionWiseConsumption[index].sizeId;
                                    comMat.description = material.materialDescription;
                                    comMat.matComboId = material.matItemId + material.comboId;
                                    comMat.matItemComboSizeID = material.matItemId + material.comboId + sizePositionWiseConsumption[index].sizeId;
                                    comMat.matItemId = material.matItemId;
                                    comMat.materialCatId = material.materialCatId;
                                    comMat.materialId = material.materialId;
                                    comMat.matSize = material.matSize;
                                    comMat.effectiveMatWidth = material.effectiveWidth;
                                    comMat.perGarmentConsumption = consumption;
                                    comMat.TKDR_MEASUREMENT_UNIT = material.TKDR_MEASUREMENT_UNIT;
                                    comMat.TKDR_MEASUREMENT_AREA = measurementUnit;
                                    comMat.sizeId = sizePositionWiseConsumption[index].sizeId;
                                    comMat.title = material.materialTitle;
                                    comMat.consType = material.matType;
                                    comMat.consMatType = material.materialTypeId;
                                    comboSizeWiseConsumption.push(comMat);
                                } else {
                                    comboSizeWiseConsumption[comboMatIndex].perGarmentConsumption += consumption;
                                }

                            }

                        }
                    });


                }

                return comboSizeWiseConsumption;
            }

            function calculateComboSizeWiseConsumption(uniqueId, pomPositionInfo, materials, pomUnits, measuremntUnit) {

                var measurementUnit = (measuremntUnit)
                    ? measuremntUnit
                    : (pomItem.unitId)
                        ? pomItem.unitId
                        : (pomUnits && pomUnits.selectedLength && pomUnits.selectedLength.id)
                            ? pomUnits.selectedLength.id
                            : "";

                // var orderConsumptionUnit = getCuttableConsumptionUnit(supplyCategory);

                var flattenedPom = flattenPOM(pomPositionInfo);

                var sizePositionWiseConsumption = calculateSizePositionWiseConsumption(flattenedPom, measurementUnit);

                var comboSizeWiseConsumption = calComboSizeWiseConsumption(uniqueId, sizePositionWiseConsumption, materials, measurementUnit);

                return comboSizeWiseConsumption;

            }

            function getNewPom(sizeDefinition, pomUnits) {

                var fn = this;

                fn.prepareSizeInfo = prepareSizeInfo;
                fn.getPom = getPom;

                function prepareSizeInfo(pom) {

                    var sizeItems = [];

                    if (pom && pom.sizeInfo) {
                        for (var i = 0; i < pom.sizeInfo.length; i++) {
                            if (pom.sizeInfo[i] && pom.sizeInfo[i].sizes) {
                                for (var j = 0; j < pom.sizeInfo[i].sizes.length; j++) {
                                    if (pom.sizeInfo[i].sizes[j]) {
                                        var szData = {};
                                        szData.TECHDISER_ID = pom.TECHDISER_ID + pom.sizeInfo[i].TECHDISER_ID + pom.sizeInfo[i].sizes[j].TECHDISER_ID;
                                        szData.pomSizeInfoId = pom.TECHDISER_ID + pom.sizeInfo[i].TECHDISER_ID + pom.sizeInfo[i].sizes[j].TECHDISER_ID;
                                        szData.pomLength = 0;
                                        szData.pomWidth = 0;
                                        szData.sizeInfo = pom.sizeInfo[i].TECHDISER_ID;
                                        szData.sizeId = pom.sizeInfo[i].sizes[j].TECHDISER_ID;
                                        sizeItems.push(szData);
                                    }
                                }
                            }
                        }
                    }

                    return sizeItems;

                }

                function getPom(sizeDefinition, pomUnits) {

                    var pom = {};

                    if (sizeDefinition) {

                        pom.TECHDISER_ID = msbUtilService.generateId();
                        pom.title = "";
                        pom.description = "";

                        pom.widthAllowance = 0;
                        pom.lengthAllowance = 0;
                        pom.TKDR_MEASUREMENT_UNIT_LENGTH = (pomUnits && pomUnits.selectedLength && pomUnits.selectedLength.id) ? pomUnits.selectedLength.id : "";
                        pom.TKDR_MEASUREMENT_UNIT_WIDTH = (pomUnits && pomUnits.selectedWidth && pomUnits.selectedWidth.id) ? pomUnits.selectedWidth.id : "";


                        pom.noOfPanels = 0;

                        pom.consumption = 0;

                        pom.sizeInfo = JSON.parse(JSON.stringify(sizeDefinition));

                        pom.sizeData = fn.prepareSizeInfo(pom);

                    }

                    return pom;
                }

                return fn.getPom(sizeDefinition, pomUnits);

            }

            function initPomInfo(persistableData, sizeDefinition) {

                var fn = this;

                fn.prepareSizeInfo = prepareSizeInfo;
                fn.getPom = getPom;

                function prepareSizeInfo(pom, sizes) {

                    var sizeItems = [];

                    if (pom && pom.sizeInfo) {
                        for (var i = 0; i < pom.sizeInfo.length; i++) {
                            if (pom.sizeInfo[i] && pom.sizeInfo[i].sizes) {
                                for (var j = 0; j < pom.sizeInfo[i].sizes.length; j++) {
                                    if (pom.sizeInfo[i].sizes[j]) {
                                        var szData = {};
                                        szData.TECHDISER_ID = pom.TECHDISER_ID + pom.sizeInfo[i].TECHDISER_ID + pom.sizeInfo[i].sizes[j].TECHDISER_ID;
                                        szData.pomSizeInfoId = pom.TECHDISER_ID + pom.sizeInfo[i].TECHDISER_ID + pom.sizeInfo[i].sizes[j].TECHDISER_ID;
                                        szData.pomLength = 0;
                                        szData.pomWidth = 0;
                                        szData.sizeInfo = pom.sizeInfo[i].TECHDISER_ID;
                                        szData.sizeId = pom.sizeInfo[i].sizes[j].TECHDISER_ID;
                                        var index = msbUtilService.getIndex(sizes, "sizeId", pom.sizeInfo[i].sizes[j].TECHDISER_ID);
                                        if (index >= 0) {
                                            szData.pomLength = sizes[index].pomLength;
                                            szData.pomWidth = sizes[index].pomWidth;
                                        }
                                        sizeItems.push(szData);
                                    }
                                }
                            }
                        }
                    }

                    return sizeItems;

                }

                function getPom(persistableData, sizeDefinition) {

                    var pomInfo = [];

                    if (persistableData && persistableData.pomPositionInfo) {
                        persistableData.pomPositionInfo.forEach(function (item) {
                            if (item) {
                                var pom = {};
                                pom.TECHDISER_ID = item.TECHDISER_ID;
                                pom.title = item.title;
                                pom.description = item.description;

                                pom.widthAllowance = item.widthAllowance;
                                pom.lengthAllowance = item.lengthAllowance;

                                pom.noOfPanels = item.noOfPanels;

                                pom.positionId = item.positionId;

                                pom.consumption = item.consumption;

                                pom.selectedPomLengths = (item.selectedPomLengths) ? item.selectedPomLengths : [];

                                pom.selectedPomWidths = (item.selectedPomWidths) ? item.selectedPomWidths : [];

                                pom.selectedLengthPoms = (item.selectedLengthPoms) ? item.selectedLengthPoms : [];

                                pom.selectedWidthPoms = (item.selectedWidthPoms) ? item.selectedWidthPoms : [];

                                pom.sizeInfo = JSON.parse(JSON.stringify(sizeDefinition));

                                if (item.sizeData) {
                                    pom.sizeData = fn.prepareSizeInfo(pom, item.sizeData);
                                }

                                pomInfo.push(pom);

                            }
                        })
                    }

                    return pomInfo;
                }



                return fn.getPom(persistableData, sizeDefinition);


            }

            function preparePomItemDef(sizeDefinition, flatenedSizeDefinition, pomItem, pomUnits) {

                function initSizeDef(sizeDefinition, flatenedSizeDefinition, pomId) {

                    var initiatedSizeDef = [];

                    if (sizeDefinition) {
                        sizeDefinition.forEach(function (zone) {
                            if (zone && zone.sizes) {
                                zone.sizes.forEach(function (size, ndx) {
                                    if (size) {
                                        var info = {};
                                        info.TECHDISER_ID = pomId + size.TECHDISER_ID;
                                        info.zoneId = zone.TECHDISER_ID;
                                        info.sizeId = size.TECHDISER_ID;
                                        info.zoneSizeId = zone.TECHDISER_ID + size.TECHDISER_ID;

                                        var index = msbUtilService.getIndex(flatenedSizeDefinition, "pomSizeId", info.TECHDISER_ID);

                                        info.pomLength = (index >= 0) ? flatenedSizeDefinition[index].pomLength : 0;
                                        info.pomWidth = (index >= 0) ? flatenedSizeDefinition[index].pomWidth : 0;

                                        initiatedSizeDef.push(info);
                                    }
                                });
                            }
                        })
                    }
                    return initiatedSizeDef;
                }

                function preparePomItem(sizeDefinition, flatenedSizeDefinition, pomItem, pomUnits) {

                    var assortpom = {};

                    assortpom.TECHDISER_ID = (pomItem && pomItem.TECHDISER_ID) ? pomItem.TECHDISER_ID : msbUtilService.generateId();
                    assortpom.title = (pomItem && pomItem.title) ? pomItem.title : '';
                    assortpom.description = (pomItem && pomItem.description) ? pomItem.description : '';
                    assortpom.lengthAllowance = (pomItem && pomItem.lengthAllowance) ? pomItem.lengthAllowance : 0;
                    assortpom.widthAllowance = (pomItem && pomItem.widthAllowance) ? pomItem.widthAllowance : 0;
                    assortpom.TKDR_MEASUREMENT_UNIT_LENGTH = (pomItem && pomItem.TKDR_MEASUREMENT_UNIT_LENGTH)
                        ? pomItem.TKDR_MEASUREMENT_UNIT_LENGTH
                        : (pomUnits && pomUnits.selectedLength && pomUnits.selectedLength.id)
                            ? pomUnits.selectedLength.id
                            : "";
                    assortpom.TKDR_MEASUREMENT_UNIT_WIDTH = (pomItem && pomItem.TKDR_MEASUREMENT_UNIT_WIDTH)
                        ? size.TKDR_MEASUREMENT_UNIT_WIDTH
                        : (pomUnits && pomUnits.selectedWidth && pomUnits.selectedWidth.id)
                            ? pomUnits.selectedWidth.id
                            : "";

                    assortpom.sizeDef = initSizeDef(sizeDefinition, flatenedSizeDefinition, assortpom.TECHDISER_ID);

                    return assortpom;

                }

                function initPomItem(sizeDefinition, flatenedSizeDefinition, pomItem, pomUnits) {

                    var assortPomInfo = preparePomItem(sizeDefinition, flatenedSizeDefinition, pomItem, pomUnits);

                    return assortPomInfo;

                }

                return initPomItem(sizeDefinition, flatenedSizeDefinition, pomItem, pomUnits);

            }

            function preparePomInfo(pomInfo, sizeDefinition, pomUnits, initiatedPomDef) {

                function flatenPomSizeDef(pomInfo) {

                    var flatenedSizeDefinition = [];

                    if (pomInfo) {

                        pomInfo.forEach(function (pomItem) {
                            if (pomItem && pomItem.sizeDef) {
                                pomItem.sizeDef.forEach(function (size) {
                                    if (size) {
                                        var info = {};
                                        info.pomLength = (size.pomLength) ? size.pomLength : 0;
                                        info.pomWidth = (size.pomWidth) ? size.pomWidth : 0;
                                        info.pomSizeId = pomItem.TECHDISER_ID + size.TECHDISER_ID;

                                        flatenedSizeDefinition.push(info);
                                    }
                                });
                            }
                        });

                    }

                    return flatenedSizeDefinition;
                }

                function initPomInfo(pomInfo, sizeDefinition, pomUnits) {

                    if (!pomInfo) {
                        pomInfo = [];
                    }

                    var flatenedSizeDefinition = flatenPomSizeDef(pomInfo);

                    pomInfo.forEach(function (pomItem) {
                        if (pomItem && pomItem.TECHDISER_ID) {
                            if (!pomItem.sizeDef) {
                                pomItem.sizeDef = preparePomItemDef(sizeDefinition, flatenedSizeDefinition, pomItem, pomUnits);
                            }
                        }
                    })

                    if (pomInfo.length <= 0) {

                        var newitem = preparePomItemDef(sizeDefinition, flatenedSizeDefinition, null, pomUnits);

                        if (newitem) {
                            pomInfo.push(newitem);
                        }

                    }

                    return pomInfo;

                }

                function removeDuplicateInfo(persistedInfo, initiatedPomDef) {
                    var preparedInfo = [];
                    if (persistedInfo && initiatedPomDef) {
                        persistedInfo.forEach(function (item) {
                            if (item && item.TECHDISER_ID) {
                                var index = msbUtilService.getIndex(initiatedPomDef, "TECHDISER_ID", item.TECHDISER_ID);
                                if (index < 0) {
                                    preparedInfo.push(item);
                                }
                            }
                        });
                    }
                    return preparedInfo;
                }

                function prepPomDef(pomInfo, sizeDefinition, pomUnits, initiatedPomDef) {
                    var persistedInfo = initPomInfo(pomInfo, sizeDefinition, pomUnits);
                    var preparedInfo = removeDuplicateInfo(persistedInfo, initiatedPomDef);
                    return preparedInfo;
                }

                return prepPomDef(pomInfo, sizeDefinition, pomUnits, initiatedPomDef);

            }



            return opDef;

        }

        function cuttableHandler() {

            var opDef = {
                prepareComboSizeWiseMaterialList: prepareComboSizeWiseMaterialList
            }

            function prepareComboSizeWiseMaterialList(materialList) {

                var preparedMaterial = [];

                if (materialList) {
                    materialList.forEach(function (material) {
                        if (material && material.matItemId && material.comboId && material.matSize) {
                            var matItemComboSizeId = material.matItemId + material.comboId + material.matSize;
                            var index = msbUtilService.getIndex(preparedMaterial, "matItemComboSizeId", matItemComboSizeId);
                            if (index < 0) {
                                var matIfo = JSON.parse(JSON.stringify(material));
                                matIfo.matItemComboSizeId = matItemComboSizeId;
                                preparedMaterial.push(matIfo);
                            }
                        }
                    })
                }

                return preparedMaterial;

            }

            return opDef;
        }

        function stitchDefHandler() {

            var setupUnitDefHandler = getSetupUnitDef();

            var opDef = {
                calculateSizeWiseThreadPositionConsumption: calculateSizeWiseThreadPositionConsumption,
                getSetupUnitDefinitions: getSetupUnitDefinitions,
                setSetupUnitDefForStitches: setupUnitDefHandler.setUnitDefForStitches,
                setSetupUnitDefForThread: setupUnitDefHandler.setUnitDefForThread,
                setUnitDefForProcessStitch: setUnitDefForProcessStitch,
                getProcessStitchUnitDef: getProcessStitchUnitDef,
                setTotalProcessLength: setTotalProcessLength,
                calculateConsumptionOfAMaterialForComboSize: calculateConsumptionOfAMaterialForComboSize
            }

            function getSetupUnitDefinitions(supplyCategory, getThreadItemDefinition, getThreadHostDefinition) {

                var qtyUntit = msbMeasurementService.getUnitDefinitions(supplyCategory, getThreadItemDefinition);

                var hostUnit = msbMeasurementService.getUnitDefinitions(supplyCategory, getThreadHostDefinition);;

                return {
                    "qtyUnit": (qtyUntit) ? qtyUntit : "",
                    "hostUnit": (hostUnit) ? hostUnit : ""
                }

            }

            function getProcessStitchUnitDef(supplyCategory, getThreadProcessStitchDeffinition) {

                return msbMeasurementService.getUnitDefinitions(supplyCategory, getThreadProcessStitchDeffinition);

            }

            function getProcessStitchSummaryUnitDef(supplyCategory, getThreadProcessStitchSummaryDefinition) {

                return msbMeasurementService.getUnitDefinitions(supplyCategory, getThreadProcessStitchSummaryDefinition);

            }

            function setTotalProcessLength(processes, stitchDef, sewStitches, supplyCategory, getThreadItemDefinition, getThreadHostDefinition, getThreadProcessStitchSummaryDefinition) {

                function calculateOnProcess(calculableList, calUnit) {

                    var processLength = null;

                    if (calUnit) {
                        var calDef = msbMeasurementService.getCalculableInfoDef(calculableList);
                        processLength = msbMeasurementService.performOperationOnUnit(calDef, calUnit, MEASUREMENT_CALCULATION_TYPES[0]);
                    }

                    return processLength;

                }

                function getStitcSummaryLengthUnit(supplyCategory, getThreadProcessStitchSummaryDefinition) {

                    var calUnitInfo = getProcessStitchSummaryUnitDef(supplyCategory, getThreadProcessStitchSummaryDefinition);
                    var stitchLengthSummaryUnit = (calUnitInfo && calUnitInfo.lengthDef) ? calUnitInfo.lengthDef.defaultUnit : "";
                    return stitchLengthSummaryUnit;

                }

                function getStitchDeafultUnit(supplyCategory, getThreadItemDefinition, getThreadHostDefinition) {

                    var calUnitInfo = getSetupUnitDefinitions(supplyCategory, getThreadItemDefinition, getThreadHostDefinition);
                    var stitchLengthDefaultUnit = (calUnitInfo && calUnitInfo.hostUnit && calUnitInfo.hostUnit.lengthDef) ? calUnitInfo.hostUnit.lengthDef.defaultUnit : "";
                    return stitchLengthDefaultUnit;

                }

                function getStichLengthInfo(processes, stitchDef, stitchLengthDefaultUnit) {

                    var stitchLengthInfo = [];

                    processes.forEach(function (processItem) {
                        if (processItem && processItem.TECHDISER_ID && processItem.stitchTypeId) {

                            var stitchInfoIndex = msbUtilService.getIndex(stitchLengthInfo, "stitchId", processItem.stitchId);

                            if (stitchInfoIndex < 0) {
                                stitchLengthInfo.push({ "stitchId": processItem.stitchId, "allSizes": [] });
                                stitchInfoIndex = stitchLengthInfo.length - 1;
                            }

                            var stitchUnit = (processItem && processItem.processUnitId) ? processItem.processUnitId : stitchLengthDefaultUnit;
                            var defIndex = msbUtilService.getIndex(stitchDef, "processId", processItem.TECHDISER_ID);
                            if (defIndex >= 0 && stitchDef[defIndex].stitchLength) {
                                stitchDef[defIndex].stitchLength.forEach(function (sizeItem) {
                                    if (sizeItem && sizeItem.length) {
                                        stitchLengthInfo[stitchInfoIndex].allSizes.push(msbMeasurementService.getCalculableUnitDef(sizeItem.length, stitchUnit));
                                    }
                                });
                            }
                        }
                    });

                    return stitchLengthInfo;

                }

                function calculateStitchTypeLength(stitchLengthInfo, stitchLengthSummaryUnit) {

                    if (stitchLengthInfo) {
                        stitchLengthInfo.forEach(function (stitchItem) {
                            if (stitchItem && stitchItem.allSizes) {
                                var totalStitch = calculateOnProcess(stitchItem.allSizes, stitchLengthSummaryUnit);
                                stitchItem.totalStitchLength = (totalStitch) ? totalStitch.dt : 0;
                                stitchItem.TKDR_MEASUREMENT_UNIT = (totalStitch) ? totalStitch.unitKey : "";
                            }
                        });
                    }

                }

                function setStitchLength(sewStitches, stitchLengthInfo) {

                    if (sewStitches && stitchLengthInfo) {
                        sewStitches.forEach(function (stitch) {
                            if (stitch && stitch.stitchId) {
                                var index = msbUtilService.getIndex(stitchLengthInfo, "stitchId", stitch.TECHDISER_ID);
                                if (index >= 0) {
                                    stitch.totalStitchLength = stitchLengthInfo[index].totalStitchLength;
                                    stitch.TKDR_MEASUREMENT_UNIT = stitchLengthInfo[index].TKDR_MEASUREMENT_UNIT;
                                }
                            }
                        });
                    }

                }


                function initCalculation(processes, stitchDef, sewStitches, supplyCategory, getThreadItemDefinition, getThreadHostDefinition, getThreadProcessStitchSummaryDefinition) {

                    if (processes && stitchDef && sewStitches) {

                        var stitchLengthDefaultUnit = getStitchDeafultUnit(supplyCategory, getThreadItemDefinition, getThreadHostDefinition);

                        var stitchLengthSummaryUnit = getStitcSummaryLengthUnit(supplyCategory, getThreadProcessStitchSummaryDefinition);

                        if (stitchLengthDefaultUnit && stitchLengthSummaryUnit) {

                            var stitchLengthInfo = getStichLengthInfo(processes, stitchDef, stitchLengthDefaultUnit);

                            calculateStitchTypeLength(stitchLengthInfo, stitchLengthSummaryUnit);

                            setStitchLength(sewStitches, stitchLengthInfo);

                        }

                    }

                }

                initCalculation(processes, stitchDef, sewStitches, supplyCategory, getThreadItemDefinition, getThreadHostDefinition, getThreadProcessStitchSummaryDefinition);

            }

            function setUnitDefForProcessStitch(unitDef, processes) {

                function setProcessStitchUnitDef(unitDef, processItem) {
                    if (unitDef && processItem && unitDef.lengthDef) {
                        processItem.processUnits = (unitDef.lengthDef.units) ? angular.copy(unitDef.lengthDef.units) : [];
                        var deafultProcessUnitId = (processItem.processUnitId) ? processItem.processUnitId : unitDef.lengthDef.defaultUnit;
                        processItem.processUnitId = deafultProcessUnitId;
                        if (deafultProcessUnitId) {
                            processItem.processUnits.forEach(function (item) {
                                if (item && item.id && item.id == deafultProcessUnitId) {
                                    processItem.selectedProcessUnit = item;
                                }
                            });
                        }
                    }
                }

                function initProcessDef(unitDef, processes) {

                    if (processes) {
                        processes.forEach(function (processItem) {
                            if (processItem) {
                                setProcessStitchUnitDef(unitDef, processItem);
                            }
                        });
                    }

                }

                initProcessDef(unitDef, processes);

            }

            function getSetupUnitDef() {

                var unitDefOp = {
                    setUnitDefForStitches: setUnitDefForStitches,
                    setUnitDefForThread: setUnitDefForThread
                }

                function setThreadHostUnitDef(unitDef, thread) {
                    if (unitDef && thread && unitDef.hostUnit && unitDef.hostUnit.lengthDef) {
                        thread.hostUnits = (unitDef.hostUnit.lengthDef.units) ? angular.copy(unitDef.hostUnit.lengthDef.units) : [];
                        var deafultHostUnit = (thread.hostUnitId) ? thread.hostUnitId : unitDef.hostUnit.lengthDef.defaultUnit;
                        thread.hostUnitId = deafultHostUnit;
                        if (deafultHostUnit) {
                            thread.hostUnits.forEach(function (item) {
                                if (item && item.id && item.id == deafultHostUnit) {
                                    thread.selectedHostUnit = item;
                                }
                            });
                        }
                    }
                }

                function setThreadQtyUnitDef(unitDef, thread) {
                    if (unitDef && thread && unitDef.qtyUnit && unitDef.qtyUnit.lengthDef) {
                        thread.qtyUnits = (unitDef.qtyUnit.lengthDef.units) ? angular.copy(unitDef.qtyUnit.lengthDef.units) : [];
                        var deafultQtyUnit = (thread.qtyUnitId) ? thread.qtyUnitId : unitDef.qtyUnit.lengthDef.defaultUnit;
                        thread.qtyUnitId = deafultQtyUnit;
                        if (deafultQtyUnit) {
                            thread.qtyUnits.forEach(function (item) {
                                if (item && item.id && item.id == deafultQtyUnit) {
                                    thread.selectedQtyUnit = item;
                                }
                            });
                        }
                    }
                }

                function setHostQtyFromConsPerMeter(thread) {
                    thread.stichLength = (thread && thread.consumptionPerMeter && !thread.stichLength)
                        ? 1
                        : thread.stichLength;
                }

                function setConsumptionFromConsPerMeter(thread) {
                    thread.consumption = (thread && thread.consumptionPerMeter && !thread.consumption)
                        ? thread.consumptionPerMeter
                        : thread.consumption;
                }

                function setUnitDefForThread(unitDef, thread) {

                    if (unitDef && thread) {
                        setThreadQtyUnitDef(unitDef, thread);
                        setThreadHostUnitDef(unitDef, thread);
                        setHostQtyFromConsPerMeter(thread);
                        setConsumptionFromConsPerMeter(thread);
                    }

                }

                function setUnitDefForStitches(unitDef, stitches) {

                    if (stitches) {
                        stitches.forEach(function (stitch) {
                            if (stitch && stitch.threads) {
                                stitch.threads.forEach(function (thread) {
                                    setUnitDefForThread(unitDef, thread);
                                });
                            }
                        });
                    }

                }

                return unitDefOp;

            }

            function flattenSizeWiseProcessLength(stitchDefinition, setupUnitDef, defaultStitchLengthUnitInfo) {

                var sizeWiseProcessLength = [];

                var defaultStitchLengthUnit = (defaultStitchLengthUnitInfo && defaultStitchLengthUnitInfo.lengthDef) ? defaultStitchLengthUnitInfo.lengthDef.defaultUnit : "";

                var setupUnitForStitch = (setupUnitDef && setupUnitDef.hostUnit && setupUnitDef.hostUnit.lengthDef) ? setupUnitDef.hostUnit.lengthDef.defaultUnit : "";

                if (stitchDefinition && setupUnitForStitch) {
                    stitchDefinition.forEach(function (stitch) {
                        if (stitch && stitch.stitchLength) {
                            stitch.stitchLength.forEach(function (stitchLength) {
                                if (stitchLength) {
                                    var processSizeId = stitch.processId + stitchLength.sizeId;
                                    var index = msbUtilService.getIndex(sizeWiseProcessLength, "processSizeId", processSizeId);
                                    var lengthUnit = (stitchLength.processUnitId) ? stitchLength.processUnitId : defaultStitchLengthUnit;
                                    var lngth = (stitchLength.length) ? stitchLength.length : 0;
                                    lngth = msbMeasurementService.unitConvertion(lngth, lengthUnit, setupUnitForStitch);
                                    if (index < 0) {
                                        var info = {};
                                        info.processSizeId = processSizeId;
                                        info.processId = stitch.processId;
                                        info.sizeId = stitchLength.sizeId;
                                        info.stitchLengthUnit = setupUnitForStitch;
                                        info.processSizeLength = lngth;
                                        info.consumption = parseFloat(0);
                                        sizeWiseProcessLength.push(info);
                                    } else {
                                        sizeWiseProcessLength[index].processSizeLength += lngth;
                                    }
                                }
                            })
                        }
                    })
                }

                return sizeWiseProcessLength;

            }

            function combineStitchTypeToProcess(sizeWiseProcessLength, processDefinition) {

                if (sizeWiseProcessLength) {
                    var sizeWiseProcessLengthWithStitchType = JSON.parse(JSON.stringify(sizeWiseProcessLength));
                    sizeWiseProcessLengthWithStitchType.forEach(function (stitch) {
                        if (stitch) {
                            var index = msbUtilService.getIndex(processDefinition, "TECHDISER_ID", stitch.processId);
                            if (index >= 0) {
                                stitch.stitchTypeId = processDefinition[index].stitchTypeId;
                            }
                        }
                    })
                    return sizeWiseProcessLengthWithStitchType;
                }
                return [];


            }

            function flattenThreadPositionInStitch(stitches) {

                var threadPositionInStitch = [];
                if (stitches) {
                    stitches.forEach(function (stitch) {
                        if (stitch && stitch.threads) {
                            stitch.threads.forEach(function (threadPosition) {
                                if (threadPosition) {
                                    var stitchThreadPositionId = stitch.TECHDISER_ID + threadPosition.TECHDISER_ID;
                                    var index = msbUtilService.getIndex(threadPositionInStitch, "stitchThreadPositionId", stitchThreadPositionId);
                                    if (index < 0) {
                                        var info = {};
                                        info.stitchThreadPositionId = stitchThreadPositionId;
                                        info.stitchTypeId = stitch.TECHDISER_ID;
                                        info.positionId = threadPosition.TECHDISER_ID;
                                        info.consumptionPerMeter = (threadPosition.consumptionPerMeter) ? threadPosition.consumptionPerMeter : 0;
                                        threadPositionInStitch.push(info);
                                    }
                                }
                            })
                        }
                    })
                }

                return threadPositionInStitch;

            }

            function calSizeWiseThreadPositionConsumption(threadPositionInStitch, sizeWiseProcessLengthWithStitchType, setupUnitDef, supplyCategory) {

                var sizeWiseThreadPositionConsumption = [];

                var setupUnitForThread = getThreadConsumptionUnit(supplyCategory);

                if (threadPositionInStitch && sizeWiseProcessLengthWithStitchType) {

                    threadPositionInStitch.forEach(function (threadPosition) {

                        if (threadPosition && threadPosition.stitchTypeId) {

                            var index = msbUtilService.getIndex(sizeWiseProcessLengthWithStitchType, "stitchTypeId", threadPosition.stitchTypeId);

                            if (index >= 0) {

                                var sizeStitchTypeThredPositionId = sizeWiseProcessLengthWithStitchType[index].sizeId + sizeWiseProcessLengthWithStitchType[index].stitchTypeId + threadPosition.positionId

                                var consIndex = msbUtilService.getIndex(sizeWiseThreadPositionConsumption, "sizeStitchTypeThredPositionId", sizeStitchTypeThredPositionId);

                                var consumptionPerMeter = (threadPosition.consumptionPerMeter) ? threadPosition.consumptionPerMeter : parseFloat(0);

                                var processSizeLength = (sizeWiseProcessLengthWithStitchType[index].processSizeLength) ? sizeWiseProcessLengthWithStitchType[index].processSizeLength : parseFloat(0);

                                if (consIndex >= 0) {
                                    sizeWiseThreadPositionConsumption[consIndex].consumption += consumptionPerMeter * processSizeLength;
                                } else {
                                    var info = {};
                                    info.sizeStitchTypeThredPositionId = sizeStitchTypeThredPositionId;
                                    info.sizePositionId = sizeWiseProcessLengthWithStitchType[index].sizeId + threadPosition.positionId;
                                    info.sizeId = sizeWiseProcessLengthWithStitchType[index].sizeId;
                                    info.stitchTypeId = threadPosition.stitchTypeId;
                                    info.positionId = threadPosition.positionId;
                                    info.consumption = consumptionPerMeter * processSizeLength;
                                    info.stitchLengthUnit = threadPosition.stitchLengthUnit;
                                    info.threadLengthUnit = setupUnitForThread;
                                    sizeWiseThreadPositionConsumption.push(info);
                                }
                            }
                        }

                    })
                }

                return sizeWiseThreadPositionConsumption;

            }

            function calculateSizeWiseThreadPositionConsumption(stitchDefinition, processDefinition, stitches, supplyCategory, getThreadItemDefinition, getThreadHostDefinition, getThreadProcessStitchDeffinition) {

                var setupUnitDef = getSetupUnitDefinitions(supplyCategory, getThreadItemDefinition, getThreadHostDefinition);

                var defaultStitchLengthUnitInfo = getProcessStitchUnitDef(supplyCategory, getThreadProcessStitchDeffinition);

                var sizeWiseProcessLength = flattenSizeWiseProcessLength(stitchDefinition, setupUnitDef, defaultStitchLengthUnitInfo);

                var sizeWiseProcessLengthWithStitchType = combineStitchTypeToProcess(sizeWiseProcessLength, processDefinition);

                var threadPositionInStitch = flattenThreadPositionInStitch(stitches);

                var sizeWiseThreadPositionConsumption = calSizeWiseThreadPositionConsumption(threadPositionInStitch, sizeWiseProcessLengthWithStitchType, setupUnitDef, supplyCategory);

                return sizeWiseThreadPositionConsumption;

            }

            function calculateConsumptionOfAMaterialForComboSize(uniqueId, materialDef, assortments, sizeWiseThreadPositionConsumption, supplyCategory, getThreadItemDefinition, getThreadHostDefinition) {

                function prepareComboPositionsDefOfMaterial(materialDef) {

                    var materialComboPositionDef = [];

                    if (materialDef) {
                        materialDef.forEach(function (material) {
                            if (material && material.matItemId && material.comboId) {
                                var matItemComboID = material.matItemId + material.comboId;
                                var index = msbUtilService.getIndex(materialComboPositionDef, "matItemComboID", matItemComboID);
                                if (index < 0) {
                                    var info = {};
                                    info.matItemComboID = matItemComboID;
                                    info.matItemId = material.matItemId;
                                    info.materialId = material.materialId;
                                    info.materialCatId = material.materialCatId;
                                    info.title = material.materialTitle;
                                    info.description = material.materialDescription;
                                    info.color = material.color;
                                    info.consType = material.matType;
                                    info.consMatType = material.matType;
                                    info.matSize = material.matSize;
                                    info.comboId = material.comboId;
                                    info.positions = [];
                                    if (material.positionId) {
                                        info.positions.push(material.positionId);
                                    }
                                    materialComboPositionDef.push(info);
                                } else if (material.positionId) {
                                    materialComboPositionDef[index].positions.push(material.positionId);
                                }
                            }
                        })
                    }

                    return materialComboPositionDef;
                }

                function prepareComboSizeDataForAMaterail(assortments, materialComboPositionDef) {

                    var materialComboPositionSizeDef = [];

                    if (materialComboPositionDef && assortments) {

                        if (assortments) {
                            assortments.forEach(function (assort) {
                                if (assort && assort.quantityDef) {
                                    assort.quantityDef.forEach(function (qtyDef) {
                                        if (qtyDef && qtyDef.comboId && qtyDef.sizeId) {
                                            materialComboPositionDef.forEach(function (material) {
                                                if (material && material.comboId && material.comboId == qtyDef.comboId) {
                                                    var tempObj = JSON.parse(JSON.stringify(material));
                                                    tempObj.sizeId = qtyDef.sizeId;
                                                    tempObj.comboSizeID = tempObj.comboId + qtyDef.sizeId;
                                                    tempObj.matItemComboSizeID = tempObj.matItemComboID + qtyDef.sizeId;
                                                    materialComboPositionSizeDef.push(tempObj);
                                                }
                                            });
                                        }
                                    })


                                }
                            })
                        }

                    }

                    return materialComboPositionSizeDef;

                }

                function prepareConsumptionOfAMaterialForComboSize(uniqueId, materialComboPositionSizeDef, sizeWiseThreadPositionConsumption, setupUnitDef, supplyCategory) {

                    var consumptionOfAMaterialForComboSize = [];

                    var setupUnitForThreadCons = getThreadConsumptionUnit(supplyCategory);

                    if (materialComboPositionSizeDef && setupUnitForThreadCons) {

                        materialComboPositionSizeDef.forEach(function (material) {

                            if (material && material.matItemComboSizeID && material.sizeId) {

                                consumptionOfAMaterialForComboSize.push(JSON.parse(JSON.stringify(material)));
                                var consIndex = consumptionOfAMaterialForComboSize.length - 1;

                                consumptionOfAMaterialForComboSize[consIndex].TECHDISER_ID = uniqueId + material.matItemComboSizeID;
                                consumptionOfAMaterialForComboSize[consIndex].perGarmentConsumption = parseFloat(0);

                                consumptionOfAMaterialForComboSize[consIndex].TKDR_MEASUREMENT_UNIT = setupUnitForThreadCons;

                                consumptionOfAMaterialForComboSize[consIndex].TKDR_MEASUREMENT_UNIT_LENGTH = setupUnitForThreadCons;

                                if (consumptionOfAMaterialForComboSize[consIndex].positions) {
                                    consumptionOfAMaterialForComboSize[consIndex].positions.forEach(function (position) {
                                        if (position) {
                                            var sizePositionId = consumptionOfAMaterialForComboSize[consIndex].sizeId + position;
                                            var index = msbUtilService.getIndex(sizeWiseThreadPositionConsumption, "sizePositionId", sizePositionId);
                                            if (index >= 0) {
                                                consumptionOfAMaterialForComboSize[consIndex].perGarmentConsumption += sizeWiseThreadPositionConsumption[index].consumption
                                            }
                                        }
                                    });
                                }
                            }
                        })
                    }

                    return consumptionOfAMaterialForComboSize;

                }


                function initConsumptionOfAMaterialForComboSize(uniqueId, materialDef, assortments, sizeWiseThreadPositionConsumption, supplyCategory, getThreadItemDefinition, getThreadHostDefinition) {

                    var setupUnitDef = getSetupUnitDefinitions(supplyCategory, getThreadItemDefinition, getThreadHostDefinition);

                    var materialComboPositionDef = prepareComboPositionsDefOfMaterial(materialDef);

                    var materialComboPositionSizeDef = prepareComboSizeDataForAMaterail(assortments, materialComboPositionDef);

                    var consumptionOfAMaterialForComboSize = prepareConsumptionOfAMaterialForComboSize(uniqueId, materialComboPositionSizeDef, sizeWiseThreadPositionConsumption, setupUnitDef, supplyCategory);

                    return consumptionOfAMaterialForComboSize;

                }

                return initConsumptionOfAMaterialForComboSize(uniqueId, materialDef, assortments, sizeWiseThreadPositionConsumption, supplyCategory, getThreadItemDefinition, getThreadHostDefinition);

            }

            return opDef;

        }

        function assortDefHandler() {


            var opDef = {
                prepareNewAssortInfo: newAssortHandler,
                prepareAssortInfoForDisplay: prepareAssortInfo,
                prepareAssortInfoForPersist: prepareAssortInfoForPersist,
                prepareAssortQuantityInfoForDisplay: prepareAssortQuantityInfoForDisplay
            };

            function prepareAssortQuantityInfoForDisplay(etds, etdAssort, assortments, comboDefinition, sizeDefinition) {

                var displayEtdAssorts = [];

                if (etds && etdAssort && assortments && comboDefinition && sizeDefinition) {

                    var displayAssorts = [];

                    assortments.forEach(function (assort) {
                        var info = opDef.prepareAssortInfoForDisplay(comboDefinition, sizeDefinition, assort);
                        if (info) {
                            displayAssorts.push(info);
                        }
                    });

                    etds.forEach(function (etd) {
                        if (etd && etd.assortId) {
                            var assortIndex = msbUtilService.getIndex(displayAssorts, "TECHDISER_ID", etd.assortId);
                            if (assortIndex >= 0) {
                                var info = angular.copy(displayAssorts[assortIndex]);
                                info.etdId = etd.TECHDISER_ID;
                                info.data = etd.date;
                                info.description = info.description + ' (etd: ' + etd.date + ')';
                                info.TECHDISER_ID = displayAssorts[assortIndex].TECHDISER_ID + etd.TECHDISER_ID;
                                displayEtdAssorts.push(info);
                            }
                        }
                    })

                    displayEtdAssorts.forEach(function (assort) {
                        if (assort && assort.qunantityInfo) {
                            assort.qunantityInfo.forEach(function (assortQty) {
                                if (assortQty && assortQty.sizeDef) {
                                    assortQty.sizeDef.forEach(function (size) {
                                        if (size) {
                                            var infoIndex = assort.etdId + size.assortId + assortQty.TECHDISER_ID + size.sizeId;
                                            var index = msbUtilService.getIndex(etdAssort, "etdAssortComboSizeID", infoIndex);
                                            if (index >= 0) {
                                                size.quantity = Math.ceil(etdAssort[index].quantity);
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    });

                }

                return displayEtdAssorts;

            }

            function prepareAssortInfoForPersist(assortInfoForDisplay, uniqueIdGenerator) {


                var assrtInfo = [];

                if (assortInfoForDisplay) {
                    assortInfoForDisplay.forEach(function (assort) {

                        if (assort) {
                            var persistableAssort = {};
                            persistableAssort.TECHDISER_ID = (assort.TECHDISER_ID) ? assort.TECHDISER_ID : uniqueIdGenerator();
                            persistableAssort.description = assort.description;
                            persistableAssort.quantityDef = [];
                            if (assort.qunantityInfo) {

                                assort.qunantityInfo.forEach(function (qtyInfo) {

                                    if (qtyInfo && qtyInfo.sizeDef) {
                                        qtyInfo.sizeDef.forEach(function (item) {

                                            if (item) {

                                                var info = {};
                                                info.TECHDISER_ID = persistableAssort.TECHDISER_ID + qtyInfo.TECHDISER_ID + item.sizeId;
                                                info.comboId = qtyInfo.TECHDISER_ID;
                                                info.sizeId = item.sizeId;
                                                info.quantity = item.quantity;
                                                info.zoneId = item.zoneId;
                                                persistableAssort.quantityDef.push(info);

                                            }

                                        });

                                    }

                                })

                            }
                            assrtInfo.push(persistableAssort);
                        }

                    });
                }

                return assrtInfo;

            }

            function newAssortHandler(comboDefinition, sizeDefinition) {

                function flatenSizeDef(sizeDefinition) {
                    var flatenedSizeDefinition = [];
                    if (sizeDefinition) {
                        sizeDefinition.forEach(function (zone) {
                            if (zone && zone.sizes) {
                                zone.sizes.forEach(function (size) {
                                    if (size) {
                                        var info = {};
                                        info.zoneId = zone.TECHDISER_ID;
                                        info.sizeId = size.TECHDISER_ID;
                                        info.zoneSizeId = zone.TECHDISER_ID + size.TECHDISER_ID;
                                        info.quantity = 0;
                                        flatenedSizeDefinition.push(info);
                                    }
                                });
                            }
                        })
                    }
                    return flatenedSizeDefinition;
                }

                function initAssortData(comboDefinition, flatenedSizeDefinition) {

                    var assortComboInfo = [];
                    if (comboDefinition && sizeDefinition) {
                        comboDefinition.forEach(function (comboItem) {
                            if (comboItem) {
                                var assortCombo = {};
                                assortCombo = angular.copy(comboItem);
                                assortCombo.sizeDef = angular.copy(flatenedSizeDefinition);
                                assortComboInfo.push(assortCombo);
                            }
                        })
                    }
                    return assortComboInfo;
                }

                function prepareNewAssortInfo(comboDefinition, sizeDefinition) {

                    var flatenedSizeDefinition = flatenSizeDef(sizeDefinition);

                    var assortComboInfo = initAssortData(comboDefinition, flatenedSizeDefinition);

                    return assortComboInfo;

                }

                return prepareNewAssortInfo(comboDefinition, sizeDefinition);

            }

            function prepareAssortInfo(comboDefinition, sizeDefinition, assortment) {

                var preparator = this;

                preparator.flattenAssortQuantity = flattenAssortQuantity;
                preparator.initAssortInfo = initAssortInfo;
                preparator.updateAssortQuantityInfo = updateAssortQuantityInfo;


                function flattenAssortQuantity(assort) {

                    var flatenedAssortQty = [];

                    if (assort && assort.quantityDef) {

                        assort.quantityDef.forEach(function (qtyDef) {
                            if (qtyDef) {
                                var info = {};
                                info.assortId = assort.TECHDISER_ID;
                                info.comboId = qtyDef.comboId;
                                info.sizeId = qtyDef.sizeId;
                                info.zoneId = qtyDef.zoneId;
                                info.quantity = qtyDef.quantity;
                                info.assortComboSizeId = assort.TECHDISER_ID + qtyDef.comboId + qtyDef.sizeId;
                                flatenedAssortQty.push(info);
                            }
                        });

                    }

                    return flatenedAssortQty;

                }

                function updateAssortQuantityInfo(comboQuantityData, flattenAssortQuantity, assortId) {

                    if (comboQuantityData && flattenAssortQuantity && assortId) {

                        comboQuantityData.forEach(function (comboAssortItem) {

                            if (comboAssortItem && comboAssortItem.TECHDISER_ID && comboAssortItem.sizeDef) {

                                comboAssortItem.sizeDef.forEach(function (assortItem) {

                                    if (assortItem) {

                                        assortItem.assortId = assortId;

                                        var assortComboSizeId = assortId + comboAssortItem.TECHDISER_ID + assortItem.sizeId;

                                        var index = msbUtilService.getIndex(flattenAssortQuantity, "assortComboSizeId", assortComboSizeId);

                                        if (index >= 0) {
                                            assortItem.quantity = flattenAssortQuantity[index].quantity;
                                        } else {
                                            assortItem.quantity = 0;
                                        }

                                    }

                                });

                            }



                        })
                    }

                }


                function initAssortInfo(comboDefinition, sizeDefinition, assort, flattenAssortQuantity, prepareNewAssortInfo) {

                    var assortInfo = [];

                    if (comboDefinition && sizeDefinition && assort) {

                        var assortItem = {};
                        assortItem.TECHDISER_ID = assort.TECHDISER_ID;
                        assortItem.title = assort.title;
                        assortItem.description = assort.description;
                        assortItem.qunantityInfo = prepareNewAssortInfo(comboDefinition, sizeDefinition);
                        if (flattenAssortQuantity) {
                            preparator.updateAssortQuantityInfo(assortItem.qunantityInfo, flattenAssortQuantity, assort.TECHDISER_ID);
                        }
                        return assortItem;

                    }

                    return null;

                }

                function prepareData(comboDefinition, sizeDefinition, assortment, prepareNewAssortInfo) {

                    var flattenAssortQuantity = preparator.flattenAssortQuantity(assortment);

                    var assortInfo = preparator.initAssortInfo(comboDefinition, sizeDefinition, assortment, flattenAssortQuantity, prepareNewAssortInfo);

                    return assortInfo;

                }

                return prepareData(comboDefinition, sizeDefinition, assortment, opDef.prepareNewAssortInfo);

            }

            return opDef;

        }

        function quantityDefOperation() {

            var opDef = {
                calculateTotalGarmentQuantity: calculateTotalGarmentQuantity,
                calculateComboSizeWiseTotalQuantityDef: calculateComboSizeWiseTotalQuantityDef,
                calculateComboSizeEtdQuantityDef: calculateComboSizeEtdQuantityDef,
                calculateComboeWiseTotalQuantityDef: calculateComboeWiseTotalQuantityDef,
                calculateComboWiseEtdQuantityDef: calculateComboWiseEtdQuantityDef,
                calculateEtdWiseQuantity: calculateEtdWiseQuantity
            }

            function calEtdWiseQty(etdAssortInfo) {

                var etdWiseQty = [];

                if (etdAssortInfo) {
                    etdAssortInfo.forEach(function (item) {
                        if (item && item.etdId) {
                            var index = msbUtilService.getIndex(etdWiseQty, "etdId", item.etdId);
                            if (index < 0) {
                                var info = {};
                                info.etdId = item.etdId;
                                info.quantity = (item.quantity) ? item.quantity : 0;
                                etdWiseQty.push(info);
                            } else {
                                etdWiseQty[index].quantity += (item.quantity) ? item.quantity : 0;
                            }
                        }
                    })
                }

                return etdWiseQty

            }

            function calculateEtdWiseQuantity(etds, assortments) {

                var etdAssortInfo = opDef.calculateComboSizeEtdQuantityDef(etds, assortments);

                var etdWiseQty = calEtdWiseQty(etdAssortInfo);

                return etdWiseQty;

            }

            function calculateTotalAssort(assortments) {

                var totalAssort = 0;
                if (assortments) {
                    assortments.forEach(function (assort) {
                        if (assort && assort.quantityDef) {
                            assort.quantityDef.forEach(function (qtyDef) {
                                var qty = (parseInt(qtyDef.quantity)) ? parseInt(qtyDef.quantity) : 0;
                                totalAssort += qty;
                            })
                        }
                    })
                }
                return totalAssort;

            }

            function calculateTotalGarmentQuantity(etds, assortments) {

                var totalQty = 0;
                etds.forEach(function (etd) {
                    if (etd.quantity) {
                        if (assortments) {
                            var index = msbUtilService.getIndex(assortments, "TECHDISER_ID", etd.assortId);
                            if (index >= 0) {
                                totalQty += parseFloat(etd.quantity);
                            }
                        }

                    }
                })
                return totalQty;

            }

            function calculateComboSizeWiseTotalQuantityDef(garmentQuantity, assortments) {

                var totalAssort = [];

                var totalAssortRatio = calculateTotalAssort(assortments);

                var assortQtyUnit = (!totalAssortRatio) ? 0 : garmentQuantity / totalAssortRatio;

                if (assortments) {
                    assortments.forEach(function (assort) {
                        if (assort && assort.quantityDef) {
                            assort.quantityDef.forEach(function (qtyDef) {
                                var qty = (qtyDef.quantity) ? qtyDef.quantity : 0;
                                var comboSizeID = qtyDef.comboId + qtyDef.sizeId;
                                var index = msbUtilService.getIndex(totalAssort, "comboSizeID", comboSizeID);
                                if (index < 0) {
                                    var info = {};
                                    info.comboSizeID = comboSizeID;
                                    info.comboId = qtyDef.comboId;
                                    info.sizeId = qtyDef.sizeId;
                                    info.quantity = qty * assortQtyUnit;
                                    info.quantityRatio = qty;
                                    totalAssort.push(info);
                                } else {
                                    totalAssort[index].quantity += qty * assortQtyUnit;
                                    totalAssort[index].quantityRatio += qty;
                                }
                            })
                        }
                    })
                }

                return totalAssort;
            }

            function calculateComboeWiseTotalQuantityDef(garmentQuantity, assortments) {

                var totalAssort = [];

                var totalAssortRatio = calculateTotalAssort(assortments);

                var assortQtyUnit = (!totalAssortRatio) ? 0 : garmentQuantity / totalAssortRatio;

                if (assortments) {
                    assortments.forEach(function (assort) {
                        if (assort && assort.quantityDef) {
                            assort.quantityDef.forEach(function (qtyDef) {
                                var qty = (qtyDef.quantity) ? qtyDef.quantity : 0;
                                var index = msbUtilService.getIndex(totalAssort, "comboId", qtyDef.comboId);
                                if (index < 0) {
                                    var info = {};
                                    info.comboId = qtyDef.comboId;
                                    info.quantity = qty * assortQtyUnit;
                                    info.quantityRatio = qty;
                                    totalAssort.push(info);
                                } else {
                                    totalAssort[index].quantity += qty * assortQtyUnit;
                                    totalAssort[index].quantityRatio += qty;
                                }
                            })
                        }
                    })
                }

                return totalAssort;
            }

            function calculateComboWiseEtdQuantityDef(etds, assortments) {

                var etdAssort = [];
                if (assortments && etds) {

                    etds.forEach(function (etd) {
                        if (etd && etd.quantity) {
                            if (assortments) {
                                var index = msbUtilService.getIndex(assortments, "TECHDISER_ID", etd.assortId);
                                if (index >= 0) {
                                    var assort = assortments[index];
                                    var totalAssort = calculateTotalAssort([assort]);
                                    var assortQtyUnit = (!totalAssort) ? 0 : etd.quantity / totalAssort;
                                    assort.quantityDef.forEach(function (qtyDef) {
                                        var qty = (qtyDef.quantity) ? qtyDef.quantity : 0;
                                        var gqty = qty * assortQtyUnit;
                                        var etdComboID = etd.TECHDISER_ID + qtyDef.comboId;
                                        var etdIndex = msbUtilService.getIndex(etdAssort, "etdComboID", etdComboID);
                                        if (etdIndex < 0) {
                                            var info = {};
                                            info.etdComboID = etdComboID;
                                            info.etdId = etd.TECHDISER_ID;
                                            info.comboId = qtyDef.comboId;
                                            info.quantity = gqty;
                                            info.quantityRatio = qty;
                                            etdAssort.push(info);
                                        } else {
                                            etdAssort[etdIndex].quantity += gqty;
                                            etdAssort[etdIndex].quantityRatio += qty;
                                        }
                                    })
                                }

                            }
                        }
                    })
                }
                return etdAssort;
            }

            function calculateComboSizeEtdQuantityDef(etds, assortments) {

                var etdAssort = [];
                if (assortments && etds) {

                    etds.forEach(function (etd) {
                        if (etd && etd.quantity) {
                            if (assortments) {
                                var index = msbUtilService.getIndex(assortments, "TECHDISER_ID", etd.assortId);
                                if (index >= 0) {
                                    var assort = assortments[index];
                                    var totalAssort = calculateTotalAssort([assort]);
                                    var assortQtyUnit = (!totalAssort) ? 0 : etd.quantity / totalAssort;
                                    assort.quantityDef.forEach(function (qtyDef) {
                                        var qty = (qtyDef.quantity) ? qtyDef.quantity : 0;
                                        var gqty = qty * assortQtyUnit;
                                        var etdComboSizeID = etd.TECHDISER_ID + qtyDef.comboId + qtyDef.sizeId;
                                        var etdIndex = msbUtilService.getIndex(etdAssort, "etdComboSizeID", etdComboSizeID);
                                        if (etdIndex < 0) {
                                            var info = {};
                                            info.etdComboSizeID = etdComboSizeID;
                                            info.etdAssortComboSizeID = etd.TECHDISER_ID + assortments[index].TECHDISER_ID + qtyDef.comboId + qtyDef.sizeId;
                                            info.etdId = etd.TECHDISER_ID;
                                            info.assortId = assortments[index].TECHDISER_ID;
                                            info.comboId = qtyDef.comboId;
                                            info.sizeId = qtyDef.sizeId;
                                            info.quantity = gqty;
                                            info.quantityRatio = qty;
                                            etdAssort.push(info);
                                        } else {
                                            etdAssort[etdIndex].quantity += gqty;
                                            etdAssort[etdIndex].quantityRatio += qty;
                                        }
                                    })
                                }

                            }
                        }
                    })
                }
                return etdAssort;
            }

            return opDef;

        }

        function calculateConsumption() {

            var opDef = {
                calculateMaterialConsumption: calculateMaterialConsumption,
                calculateEtdwiseConsumption: calculateEtdwiseConsumption,
                calculateComboWiseConsumption: calculateComboWiseConsumption
            }

            function calculateMaterialConsumption(uniqueId, consumptionOfAMaterialForComboSize, totalQuantityDef, supplyCategory, getOrderConsumptionUnit) {

                var matCons = [];

                if (totalQuantityDef) {
                    totalQuantityDef.forEach(function (qtyDef) {
                        if (qtyDef) {
                            var qty = (qtyDef.quantity) ? qtyDef.quantity : 0;
                            var comboSizeID = qtyDef.comboId + qtyDef.sizeId;

                            consumptionOfAMaterialForComboSize.forEach(function (material) {
                                if (material && material.comboSizeID && material.comboSizeID == comboSizeID) {
                                    var consumption = parseFloat(0);
                                    if (material.perGarmentConsumption) {
                                        consumption = material.perGarmentConsumption * qty;
                                    }
                                    var consIndex = msbUtilService.getIndex(matCons, "matItemId", material.matItemId);
                                    if (consIndex < 0) {
                                        var info = {};
                                        info.TECHDISER_ID = uniqueId + material.matItemId;
                                        info.matItemId = material.matItemId;
                                        info.materialId = material.materialId;
                                        info.materialCatId = material.materialCatId;
                                        info.title = material.title;
                                        info.description = material.description;
                                        info.color = material.color;
                                        info.matSize = material.matSize;
                                        info.effectiveMatWidth = material.effectiveMatWidth;
                                        info.consType = material.consType;
                                        if (material.TKDR_MEASUREMENT_AREA) {
                                            info.TKDR_MEASUREMENT_UNIT = material.TKDR_MEASUREMENT_AREA;
                                            info.TKDR_MEASUREMENT_AREA = material.TKDR_MEASUREMENT_AREA;
                                            info.TKDR_MEASUREMENT_UNIT_WIDTH = material.TKDR_MEASUREMENT_UNIT;
                                        } else {
                                            info.TKDR_MEASUREMENT_UNIT = material.TKDR_MEASUREMENT_UNIT;
                                        }
                                        if (material.consMatType) {
                                            info.consMatType = material.consMatType;
                                        }
                                        info.consumption = consumption;
                                        matCons.push(info);
                                    } else {
                                        matCons[consIndex].consumption += consumption;
                                    }
                                }
                            });
                        }
                    });
                }

                matCons.forEach(function (info) {
                    if (info && info.consumption) {
                        if (info.matSize) {
                            if (info.TKDR_MEASUREMENT_AREA && info.TKDR_MEASUREMENT_UNIT_WIDTH) {
                                var consInfo = msbMeasurementService.calculateLengthFromArea(
                                    info.consumption,
                                    info.TKDR_MEASUREMENT_AREA,
                                    (info.effectiveMatWidth) ? info.effectiveMatWidth : info.matSize,
                                    info.TKDR_MEASUREMENT_UNIT_WIDTH,
                                    info.TKDR_MEASUREMENT_AREA
                                );
                                info.consumptionInLength = (consInfo && consInfo.dt) ? Math.ceil(consInfo.dt) : 0;
                            } else {
                                info.consumption = (info.consumption) ? Math.ceil(info.consumption) : 0;
                            }

                        }
                    }
                })

                if (supplyCategory && getOrderConsumptionUnit) {
                    var orderUnit = getOrderConsumptionUnit(supplyCategory);
                    if (orderUnit) {
                        matCons.forEach(function (info) {
                            if (info) {
                                if (info.consumptionInLength && info.TKDR_MEASUREMENT_AREA) {
                                    var ordrUnit = msbMeasurementService.unitConvertion(info.consumptionInLength, info.TKDR_MEASUREMENT_AREA, orderUnit);
                                    info.orderConsumption = (ordrUnit) ? Math.ceil(ordrUnit) : 0;
                                    info.TKDR_MEASUREMENT_ORDER = orderUnit;
                                } else if (info.consumption && info.TKDR_MEASUREMENT_UNIT) {
                                    var ordrUnit = msbMeasurementService.unitConvertion(info.consumption, info.TKDR_MEASUREMENT_UNIT, orderUnit);
                                    info.orderConsumption = (ordrUnit) ? Math.ceil(ordrUnit) : 0;
                                    info.TKDR_MEASUREMENT_ORDER = orderUnit;
                                }
                            }
                        })
                    }
                }

                return matCons;

            }

            function calculateEtdwiseConsumption(uniqueId, consumptionOfAMaterialForComboSize, etdAssort, supplyCategory, getOrderConsumptionUnit) {

                var etdThreadCons = [];

                if (etdAssort) {
                    etdAssort.forEach(function (etdAssortItem) {
                        if (etdAssortItem) {
                            var qty = (etdAssortItem.quantity) ? etdAssortItem.quantity : 0;

                            var comboSizeID = etdAssortItem.comboId + etdAssortItem.sizeId;

                            consumptionOfAMaterialForComboSize.forEach(function (material) {

                                if (material && material.comboSizeID && material.comboSizeID == comboSizeID) {
                                    var consumption = parseFloat(0);
                                    if (material.perGarmentConsumption) {
                                        consumption = material.perGarmentConsumption * qty;
                                    }
                                    var matItemEtdId = material.matItemId + etdAssortItem.etdId;
                                    var matIndex = msbUtilService.getIndex(etdThreadCons, "matItemEtdId", matItemEtdId);
                                    if (matIndex < 0) {
                                        var info = {};
                                        info.TECHDISER_ID = uniqueId + matItemEtdId;
                                        info.matItemEtdId = matItemEtdId;
                                        info.etdId = etdAssortItem.etdId;
                                        info.matItemId = material.matItemId;
                                        info.title = material.title;
                                        info.description = material.description;
                                        info.color = material.color;
                                        info.matSize = material.matSize;
                                        info.effectiveMatWidth = material.effectiveMatWidth;
                                        if (material.TKDR_MEASUREMENT_AREA) {
                                            info.TKDR_MEASUREMENT_UNIT = material.TKDR_MEASUREMENT_AREA;
                                            info.TKDR_MEASUREMENT_AREA = material.TKDR_MEASUREMENT_AREA;
                                            info.TKDR_MEASUREMENT_UNIT_WIDTH = material.TKDR_MEASUREMENT_UNIT;
                                        } else {
                                            info.TKDR_MEASUREMENT_UNIT = material.TKDR_MEASUREMENT_UNIT;
                                        }
                                        info.consumption = consumption;
                                        etdThreadCons.push(info);
                                    } else {
                                        etdThreadCons[matIndex].consumption += consumption;
                                    }
                                }

                            })

                        }
                    });
                }

                etdThreadCons.forEach(function (info) {
                    if (info && info.consumption) {
                        if (info.matSize) {
                            if (info.TKDR_MEASUREMENT_AREA && info.TKDR_MEASUREMENT_UNIT_WIDTH) {
                                var consInfo = msbMeasurementService.calculateLengthFromArea(
                                    info.consumption,
                                    info.TKDR_MEASUREMENT_AREA,
                                    (info.effectiveMatWidth) ? info.effectiveMatWidth : info.matSize,
                                    info.TKDR_MEASUREMENT_UNIT_WIDTH,
                                    info.TKDR_MEASUREMENT_AREA
                                );
                                info.etdConsumptionInLength = (consInfo && consInfo.dt) ? Math.ceil(consInfo.dt) : 0;
                            } else {
                                info.consumption = (info.consumption) ? Math.ceil(info.consumption) : 0;
                            }

                        }
                    }
                })

                if (supplyCategory && getOrderConsumptionUnit) {
                    var orderUnit = getOrderConsumptionUnit(supplyCategory);
                    if (orderUnit) {
                        etdThreadCons.forEach(function (info) {
                            if (info) {
                                if (info.etdConsumptionInLength && info.TKDR_MEASUREMENT_AREA) {
                                    var ordrUnit = msbMeasurementService.unitConvertion(info.etdConsumptionInLength, info.TKDR_MEASUREMENT_AREA, orderUnit);
                                    info.etdOrderConsumption = (ordrUnit) ? Math.ceil(ordrUnit) : 0;
                                    info.TKDR_ETD_MEASUREMENT_ORDER = orderUnit;
                                } else if (info.consumption && info.TKDR_MEASUREMENT_UNIT) {
                                    var ordrUnit = msbMeasurementService.unitConvertion(info.consumption, info.TKDR_MEASUREMENT_UNIT, orderUnit);
                                    info.etdOrderConsumption = (ordrUnit) ? Math.ceil(ordrUnit) : 0;
                                    info.TKDR_ETD_MEASUREMENT_ORDER = orderUnit;
                                }
                            }
                        })
                    }
                }

                return etdThreadCons;


            }

            function calculateComboWiseConsumption(uniqueId, consumptionOfAMaterialForComboSize, comboSizeWiseQuantity) {

                var matCons = [];

                if (comboSizeWiseQuantity) {
                    comboSizeWiseQuantity.forEach(function (qtyDef) {
                        if (qtyDef) {
                            var qty = (qtyDef.quantity) ? qtyDef.quantity : 0;
                            var comboSizeID = qtyDef.comboId + qtyDef.sizeId

                            consumptionOfAMaterialForComboSize.forEach(function (material) {

                                if (material && material.comboSizeID && material.comboSizeID == comboSizeID) {
                                    var consumption = parseFloat(0);
                                    if (material.perGarmentConsumption) {
                                        consumption = material.perGarmentConsumption * qty;
                                    }
                                    var matComboId = material.matItemId + qtyDef.comboId;
                                    var consIndex = msbUtilService.getIndex(matCons, "matComboId", matComboId);
                                    if (consIndex < 0) {
                                        var info = {};
                                        info.TECHDISER_ID = uniqueId + matComboId;
                                        info.matComboId = matComboId;
                                        info.comboId = material.comboId;
                                        info.matItemId = material.matItemId;
                                        info.title = material.title;
                                        info.description = material.description;
                                        info.color = material.color;
                                        info.matSize = material.matSize;
                                        info.effectiveMatWidth = material.effectiveMatWidth;
                                        if (material.TKDR_MEASUREMENT_AREA) {
                                            info.TKDR_MEASUREMENT_UNIT = material.TKDR_MEASUREMENT_AREA;
                                            info.TKDR_MEASUREMENT_AREA = material.TKDR_MEASUREMENT_AREA;
                                            info.TKDR_MEASUREMENT_UNIT_WIDTH = material.TKDR_MEASUREMENT_UNIT;
                                        } else {
                                            info.TKDR_MEASUREMENT_UNIT = material.TKDR_MEASUREMENT_UNIT;
                                        }
                                        info.consumption = consumption;
                                        matCons.push(info);
                                    } else {
                                        matCons[consIndex].consumption += consumption;
                                    }
                                }

                            })
                        }
                    });
                }

                matCons.forEach(function (info) {
                    if (info && info.consumption) {
                        if (info.matSize) {
                            if (info.TKDR_MEASUREMENT_AREA && info.TKDR_MEASUREMENT_UNIT_WIDTH) {
                                var consInfo = msbMeasurementService.calculateLengthFromArea(
                                    info.consumption,
                                    info.TKDR_MEASUREMENT_AREA,
                                    (info.effectiveMatWidth) ? info.effectiveMatWidth : info.matSize,
                                    info.TKDR_MEASUREMENT_UNIT_WIDTH,
                                    info.TKDR_MEASUREMENT_AREA
                                );
                                info.consumptionInLength = (consInfo && consInfo.dt) ? Math.ceil(consInfo.dt) : 0;
                            } else {
                                info.consumption = (info.consumption) ? Math.ceil(info.consumption) : 0;
                            }

                        }
                    }
                })

                return matCons;


            }

            return opDef;

        }

        function countableHandler() {

            var opDef = {
                calculateConsumptionOfAMaterialForComboSize: calculateConsumptionOfAMaterialForComboSize
            }

            function calculateConsumptionOfAMaterialForComboSize(uniqueId, materialDef) {

                var materialComboSizeConsuption = [];

                if (materialDef) {
                    materialDef.forEach(function (material) {
                        if (material && material.matItemId && material.comboId && material.sizeQntyBreakDown) {

                            if (material.sizeQntyBreakDown) {
                                material.sizeQntyBreakDown.forEach(function (matSize) {
                                    if (matSize && matSize.sizeId) {
                                        var matItemComboSizeID = material.matItemId + material.comboId + matSize.sizeId;
                                        var index = msbUtilService.getIndex(materialComboSizeConsuption, "matItemComboSizeID", matItemComboSizeID);
                                        if (index < 0) {
                                            var info = {};
                                            info.matItemComboSizeID = matItemComboSizeID;
                                            info.matItemComboID = material.matItemId + material.comboId;
                                            info.matItemId = material.matItemId;
                                            info.materialCatId = material.materialCatId;
                                            info.materialId = material.materialId;
                                            info.title = material.materialTitle;
                                            info.description = material.materialDescription;
                                            info.color = material.color;
                                            info.matSize = material.matSize;
                                            info.comboId = material.comboId;
                                            info.sizeId = matSize.sizeId;
                                            info.consType = material.matType;
                                            info.consMatType = material.materialTypeId;
                                            info.comboSizeID = material.comboId + matSize.sizeId;
                                            info.TECHDISER_ID = uniqueId + matItemComboSizeID;
                                            info.perGarmentConsumption = (matSize.quantity) ? parseInt(matSize.quantity) : parseInt(0);
                                            materialComboSizeConsuption.push(info);
                                        }
                                        else {
                                            materialComboSizeConsuption[index].perGarmentConsumption += (matSize.quantity) ? parseInt(matSize.quantity) : parseInt(0);
                                        }
                                    }
                                })
                            }
                        }
                    })
                }

                return materialComboSizeConsuption;


            }

            return opDef;

        }

        return services;
    }
})();