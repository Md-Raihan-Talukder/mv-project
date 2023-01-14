(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('SupplyDefinitionTreeController', SupplyDefinitionTreeController);

    /** @ngInject */
    function SupplyDefinitionTreeController(organizationsDataService,
        garmentMaterialSpecProfileService,
        msbCommonApiService, supplyDefinitionService,
        supplyTypeTestService, costingHeadsService, $mdDialog, PRIMARY_COLUMN_NAME,
        SERIAL_COLUMN_NAME, commonApiService, SUPPLY_TYPE, msbUtilService,
        MEASUREMENT_UNITS, DIMENSION_TYPE, TESTING_UNITS, $document, $rootScope,
        BLANK_IMAGE, testSetupService, SOURCING_TYPE, $timeout, INSPECTION_TOOL, MATRIC_POLICIES,
        MATRIC_APPLICATIONS, MATRIC_HANDLES, MATRIC_CASES, MATRIC_HANDLE_UNITS, msbMeasurementService) {

        debugger;

        var vm = this;

        var DATA_TYPE_PRIMITIVE_STRING = "S";

        vm.imgHolder = BLANK_IMAGE;

        vm.saveSupplyDefinition = saveSupplyDefinition;
        vm.supplyTypesCons = SUPPLY_TYPE;
        vm.sourcingTypes = SOURCING_TYPE;
        vm.measUnits = MEASUREMENT_UNITS;
        vm.dimensionTypes = DIMENSION_TYPE;
        vm.testingUnits = TESTING_UNITS;
        vm.containerType = {};
        vm.isNewCategory = false;
        vm.isParentCategory = false;
        vm.addCategory = true;
        vm.isCategoryFormReady = false;
        vm.addNewCategory = addNewCategory;
        vm.saveCategory = saveCategory;
        vm.selectCategory = selectCategory;
        vm.deleteCategory = deleteCategory;
        vm.isNewType = true;
        vm.isNewPreCaution = true;
        vm.saveType = saveType;
        vm.saveSummaryType = saveSummaryType;
        vm.selectType = selectType;
        vm.deleteType = deleteType;
        vm.addPreCautionMark = addPreCautionMark;
        vm.selectPreCautionMark = selectPreCautionMark;
        vm.deletePreCautionMark = deletePreCautionMark;
        vm.checkPreCautionTypeExist = checkPreCautionTypeExist;
        vm.selectTypeForPreCaution = selectTypeForPreCaution;
        vm.getPreCautionsType = getPreCautionsType;
        vm.checkLeafNodes = checkLeafNodes;
        vm.getTypeNameForPreCaution = getTypeNameForPreCaution;
        vm.selectDataSheet = selectDataSheet;
        vm.saveDataSheet = saveDataSheet;
        vm.isNewDataSheet = true;
        vm.deleteDataSheet = deleteDataSheet;
        vm.selectTestItem = selectTestItem;
        // vm.saveTestItem = saveTestItem;
        vm.getTestUnit = getTestUnit;
        vm.checkTestTypeExist = checkTestTypeExist;
        vm.selectTypeForTest = selectTypeForTest;
        // vm.isNewTestItem = true;
        vm.deleteTestItem = deleteTestItem;
        vm.getTypeNameForTestItem = getTypeNameForTestItem;
        // vm.updateTestMaxMinValue = updateTestMaxMinValue;
        // vm.getInitialTestMaxMinValue = getInitialTestMaxMinValue;
        vm.saveDefectItem = saveDefectItem;
        vm.selectDefectItem = selectDefectItem;
        vm.deleteDefectItem = deleteDefectItem;
        vm.checkDefectTypeExist = checkDefectTypeExist;
        vm.selectTypeForDefect = selectTypeForDefect;
        vm.isNewDefectItem = true;
        vm.getTypeNameForDefectItem = getTypeNameForDefectItem;
        vm.savePositionItem = savePositionItem;
        vm.selectPositionItem = selectPositionItem;
        vm.deletePositionItem = deletePositionItem;
        vm.isNewPositionItem = true;
        vm.selectContainerItem = selectContainerItem;
        vm.getContainerTitle = getContainerTitle;
        // vm.saveContainerItem = saveContainerItem;
        vm.selectContainerDialog = selectContainerDialog;
        vm.deleteContainerItem = deleteContainerItem;
        vm.addContainerSize = addContainerSize;
        // vm.isNewContainerItem = true;
        vm.isNewContainerSize = true;
        vm.selectContainerSize = selectContainerSize;
        vm.deleteContainerSize = deleteContainerSize;
        // vm.addContainer = addContainer;
        vm.editContainer = editContainer;

        vm.getMeasurementUnits = getMeasurementUnits;
        vm.getDimensionTitle = getDimensionTitle;
        vm.getMeasurementUnitTitle = getMeasurementUnitTitle;
        vm.selectCostingHeadsDialog = selectCostingHeadsDialog;
        vm.selectCuttableCountableThread = selectCuttableCountableThread;
        vm.getCategoryTypeOrCategoryTypeGroup = getCategoryTypeOrCategoryTypeGroup;
        vm.expandImage = expandImage;
        vm.removeImage = removeImage;

        vm.addSizeInfoItem = addSizeInfoItem;

        // Production Time
        vm.isNewProductionTime = true;
        vm.selectProductionTime = selectProductionTime;
        vm.getProductionTimeType = getProductionTimeType;
        vm.deleteProductionTime = deleteProductionTime;
        vm.saveProductionTime = saveProductionTime;
        vm.checkProductionTimeTypeExist = checkProductionTimeTypeExist;
        vm.selectTypeForProductionTime = selectTypeForProductionTime;

        // Lump Sum Cost
        // vm.isNewLumpSumCost = true;
        // vm.selectLumpSumCost = selectLumpSumCost;
        // vm.getLumpSumCostType = getLumpSumCostType;
        // vm.deleteLumpSumCost = deleteLumpSumCost;
        // vm.saveLumpSumCost = saveLumpSumCost;
        // vm.checkLumpSumCostTypeExist = checkLumpSumCostTypeExist;
        // vm.selectTypeForLumpSumCost = selectTypeForLumpSumCost;


        vm.selectTestDialog = selectTestDialog;
        vm.getTestTitle = getTestTitle;
        vm.getTestDescription = getTestDescription;
        vm.getMaterialTypeTitle = getMaterialTypeTitle;
        vm.getTestAttributeTitle = getTestAttributeTitle;
        vm.selectTestMethods = selectTestMethods;

        vm.selectMenu = selectMenu;
        vm.selectTestDefinitionDialog = selectTestDefinitionDialog;
        // vm.selectUnitOrContainerType = selectUnitOrContainerType;
        vm.defectTypeTitile = defectTypeTitile;
        vm.selectGenericDefect = selectGenericDefect;
        vm.newDefectModel = newDefectModel;
        vm.isItemGenericDefect = isItemGenericDefect;
        vm.getMaterialProfileSummaryId = getMaterialProfileSummaryId;
        vm.inspectionTools = INSPECTION_TOOL;

        var policyHandler = matricPolicyHandler();
        vm.getPolicies = policyHandler.getPolicies;
        vm.getHandleUnits = policyHandler.getHandleUnits;
        vm.getDimensions = policyHandler.getDimensions;
        vm.getCases = policyHandler.getCases;
        vm.getUnits = policyHandler.getUnits;
        vm.addMatricInfo = policyHandler.addMatricInfo;
        vm.removeMatricInfo = policyHandler.removeMatricInfo;
        vm.getDimensionDef = policyHandler.getDimensionDef;
        vm.setDimensionPolicy = policyHandler.setDimensionPolicy;

        init();

        function init() {
            vm.isReborn = 1;
            vm.applications = MATRIC_APPLICATIONS;
            vm.matricApplication = (vm.applications && vm.applications.length > 0) ? vm.applications[0] : "";
            vm.sizeSeperator = msbMeasurementService.getSizeSeperator();
            vm.categoryTreeOptions = {
                showUserBtn: false,
                showAddBtn: true,
                showRemoveBtn: true,
                maxLevel: 4
            };

            handlePreAssyncOperation();

            handleAssynchronousCalls();

        }

        function handlePreAssyncOperation() {

            getMeasurementUnits();

        }

        function handleAssynchronousCalls() {

            function getSupplyDefinition() {
                msbCommonApiService.interfaceManager(function (data) {
                    if (data) {
                        vm.supplies = data;
                    }
                    getCostingHeads();
                }, "supplyDefinitionService", "getSupplyDefinition", null);
            }

            function getCostingHeads() {
                msbCommonApiService.interfaceManager(function (data) {
                    if (data) {
                        vm.costingHeads = data;
                    }
                    getProductionTimeWhereCategoryTypeAndQuantity();
                }, "supplyDefinitionService", "getCostingHeads", null);

            }


            function getProductionTimeWhereCategoryTypeAndQuantity() {
                var materialCategory = "SupplyDefinitionMaterialCategory1";
                var materialType = "SupplyDefinitionMaterialType2";
                var materialQuantity = 1001;
                if (materialCategory && materialType) {

                    var param = {
                        "materialCategoryId": materialCategory,
                        "materialTypeId": materialType,
                        "materialQuantity": materialQuantity
                    };
                    msbCommonApiService.interfaceManager(function (data) {
                        if (data) {
                            console.log(data);
                        } else {

                        }
                        getMaterialGroup();
                    }, "supplyDefinitionService", "getProductionTimeWhereCategoryTypeAndQuantity", param);

                }

            }

            function getMaterialGroup() {
                msbCommonApiService.interfaceManager(function (data) {
                    vm.materialGroups = data;
                    getAllTestDefinition();
                }, "bomSetupService", "getMaterialGroup", null);
            }

            function getAllTestDefinition() {
                msbCommonApiService.interfaceManager(function (data) {
                    if (data) {
                        vm.testList = data;
                    }
                    getTestAttributesMaxMinWhereCategoryIdTypeIdTestId();
                }, "testSetupService", "getAllTestDefinition", null);
            }

            function getTestAttributesMaxMinWhereCategoryIdTypeIdTestId() {
                var param = {
                    "categoryId": "SupplyDefinitionMaterialCategory1",
                    "typeId": "SupplyDefinitionMaterialType2",
                    "testId": "LabTest1"
                };
                msbCommonApiService.interfaceManager(function (attributeData) {
                    if (attributeData) {
                        console.log(attributeData);
                    }
                    getPackagingContainers();
                }, "supplyDefinitionService", "getTestAttributesMaxMinWhereCategoryIdTypeIdTestId", param);
            }

            function getPackagingContainers() {
                msbCommonApiService.interfaceManager(function (containerData) {
                    if (containerData) {
                        vm.packContainers = containerData;
                    }
                    getMaterialContainers();
                }, "supplyDefinitionService", "getPackagingContainers", null);
            }

            function getMaterialContainers() {
                // var param = { "categoryId": "SupplyDefinitionMaterialCategory1", "isUnitType": true};
                var param = {
                    "categoryId": "SupplyDefinitionMaterialCategory2",
                    "isUnitType": true
                };
                msbCommonApiService.interfaceManager(function (containerData) {
                    if (containerData) {
                        vm.containers = containerData;
                    }
                    getTypeWiseMaterials();
                }, "supplyDefinitionService", "getMaterialContainers", param);
            }

            function getTypeWiseMaterials() {

                var param = [{
                    "key": "typeId",
                    "value": "packingMaterials"
                }];
                msbCommonApiService.interfaceManager(function (typeMaterialData) {
                    if (typeMaterialData) {
                        vm.typeMaterials = typeMaterialData;
                    }
                    getPresentationsForStakeholderService();
                }, "supplyDefinitionService", "getTypeWiseMaterials", param);
            }

            function getPresentationsForStakeholderService() {
                msbCommonApiService.interfaceManager(function (presentationData) {
                    if (presentationData) {
                    }
                    getPresentationsForJobDefinition();
                }, "supplyDefinitionService", "getPresentationsForStakeholderService", null);
            }

            function getPresentationsForJobDefinition() {

                var param = {
                    "catelogId": "catelogId",
                    "materialTypeId": "presentation"
                };
                msbCommonApiService.interfaceManager(function (data) {
                    if (data) {
                    }
                    getMaterialDefects();
                }, "supplyDefinitionService", "getPresentationsForJobDefinition", param);

            }

            function getMaterialDefects() {

                var param = {
                    "materialCategoryId": "SupplyDefinitionMaterialCategory17"
                };
                msbCommonApiService.interfaceManager(function (defectsData) {
                    if (defectsData) {
                        vm.defects = defectsData;
                        console.log(vm.defects);
                    }
                    getAllDefectTypes();
                }, "supplyDefinitionService", "getMaterialDefects", param);
            }

            function getAllDefectTypes() {

                msbCommonApiService.interfaceManager(function (data) {
                    if (data) {
                        vm.defectTypeDefs = data;
                    }
                    getMaterialDefectsByDefectType();
                }, "supplyDefinitionService", "getAllDefectTypes", null);
            }

            function getMaterialDefectsByDefectType() {

                var param = {
                    "materialCategoryId": "SupplyDefinitionMaterialCategory1",
                    "materialTypeId": "SupplyDefinitionMaterialType1",
                    "defectTypeId": "Defect_Type_1"
                };
                msbCommonApiService.interfaceManager(function (defectsData) {
                    if (defectsData) {
                        console.log(defectsData);
                    }
                    handlePostAssyncOperations();
                }, "supplyDefinitionService", "getMaterialDefectsByDefectType", param);
            }

            getSupplyDefinition();

        }

        function handlePostAssyncOperations() {
            vm.getPolicies()
        }


        function matricPolicyHandler() {

            var policyObj = {
                getPolicies: getPolicies,
                getDimensions: getDimensions,
                getCases: getCases,
                getUnits: getUnits,
                getHandleUnits: getHandleUnits,
                addMatricInfo: addMatricInfo,
                removeMatricInfo: removeMatricInfo,
                getMatricPolicyInfo: getMatricPolicyInfo,
                initiateSizeDef: initiateSizeDef,
                getDimensionDef: getDimensionDef,
                initiateContainerDef: initiateContainerDef,
                setDimensionPolicy: setDimensionPolicy
            };

            function getDimensionDef(dimentionExpression) {
                if (dimentionExpression) {
                    return msbMeasurementService.getDimensionDef(dimentionExpression);
                }
            }

            function initiateContainerDef(category) {

                function updateContainerDef(containers, containerDefUnitInfo) {

                    if (containerDefUnitInfo && containers && containerDefUnitInfo.matricDimension) {

                        var targetUnitDef = msbMeasurementService.getDimensionDef(containerDefUnitInfo.matricDimension);

                        if (targetUnitDef) {

                            containers.forEach(function (containerItem) {

                                if (containerItem && containerItem.sizes) {

                                    containerItem.sizes = msbMeasurementService.getConvetedContainerDefInfo(containerItem.sizes, containerDefUnitInfo.matricDimension);

                                }

                            });

                        }

                    }

                }

                function initContainerDef(category) {

                    var application = "setup";
                    var handleUnit = "item";
                    var appCase = "containerDef";

                    var itemDimension = msbMeasurementService.getMeasurementDefInfo(category, application, handleUnit, appCase);

                    if (itemDimension && category && category.containers) {
                        updateContainerDef(category.containers, itemDimension);
                    }

                    return itemDimension;

                }

                return initContainerDef(category);

            }

            function initiateSizeDef(category) {

                function updateSizeDef(item, sizeDefUnitInfo) {

                    if (sizeDefUnitInfo && item && sizeDefUnitInfo.matricDimension) {

                        if (item && item.dimentionType && item.sizeInfo && item.dimentionType != sizeDefUnitInfo.matricDimension) {

                            var existingUnitDef = msbMeasurementService.getDimensionDef(item.dimentionType);

                            var targetUnitDef = msbMeasurementService.getDimensionDef(sizeDefUnitInfo.matricDimension);

                            item.dimentionType = sizeDefUnitInfo.matricDimension;

                            item.measurementUnitId = (sizeDefUnitInfo.measurementUnitId) ? sizeDefUnitInfo.measurementUnitId : msbMeasurementService.getDimensionFromDimensionDef(item.dimentionType);

                            item.sizeInfo = (existingUnitDef && targetUnitDef)
                                ? msbMeasurementService.getConvetedSizeDefInfo(item.sizeInfo, existingUnitDef.dimentionInfo, targetUnitDef.dimentionInfo)
                                : [];

                        }

                    }

                    return item;

                }

                function initSizeDef(category) {

                    var application = "setup";
                    var handleUnit = "item";
                    var appCase = "sizeDef";

                    var itemDimension = msbMeasurementService.getMeasurementDefInfo(category, application, handleUnit, appCase);

                    if (itemDimension && category && category.sizeDef) {
                        var sizeDef = angular.copy(category.sizeDef);
                        category.sizeDef = updateSizeDef(sizeDef, itemDimension);
                    }

                    return itemDimension;

                }

                return initSizeDef(category);

            }


            function getMatricPolicyInfo(categoryObj, matricApplication) {
                if (categoryObj && categoryObj.TECHDISER_ID) {
                    var policyType = msbMeasurementService.getPolicType(categoryObj);
                    if (policyType) {
                        msbMeasurementService.policyDetails(categoryObj, matricApplication, policyType);
                    }
                }
            }

            function getPolicies(application, isAdded) {
                vm.matricPolicies = angular.copy(MATRIC_HANDLES);
                vm.matricApplication = (application) ? application : MATRIC_APPLICATIONS[0];
                if (application && vm.category) {
                    getMatricPolicyInfo(vm.category, vm.matricApplication);
                    getHandleUnits(isAdded);
                }
            }

            function getHandleUnits(isAdded) {
                if (vm.matricPolicy) {
                    vm.matricHandleUnits = angular.copy(MATRIC_HANDLE_UNITS);
                } else {
                    vm.matricHandleUnits = [];
                }
                vm.matricHandleUnit = "";
                getCases(isAdded);
            }

            function getCases(isAdded) {
                if (vm.matricHandleUnit) {
                    vm.matricCases = angular.copy(MATRIC_CASES);
                } else {
                    vm.matricCases = [];
                }
                vm.matricCase = "";
                getDimensions(isAdded);

            }

            function getDimensions(isAdded) {
                if (!vm.dimentionInfo) {
                    vm.dimentionInfo = {};
                }
                vm.dimentionInfo.dimentionDef = (isAdded) ? []
                    : (vm.matricCase) ? msbMeasurementService.getMatricDimensions()
                        : [];
                vm.matricDimension = "";
                getUnits("", isAdded);
            }

            function getUnits(dimentionType, isAdded) {
                var unitInfo = [];
                dimentionType = (dimentionType)
                    ? dimentionType
                    : (vm.dimentionInfo)
                        ? vm.dimentionInfo.matricDimension
                        : "";
                if (dimentionType) {
                    unitInfo = msbMeasurementService.getDimensionUnits(dimentionType);
                }

                vm.dimentionInfo.matricUnits = (isAdded) ? []
                    : (unitInfo && unitInfo.length > 0 && unitInfo[0].units)
                        ? angular.copy(unitInfo[0].units)
                        : [];
                vm.dimentionInfo.measurementUnitId = (isAdded) ? "" : vm.dimentionInfo.measurementUnitId;
                vm.dimentionInfo.matricDimension = dimentionType;
                vm.dimentionInfo.unitDef = unitInfo;
                return unitInfo;
            }

            function setDimensionPolicy() {

                var dimentionInfo = "";
                var separator = msbMeasurementService.getDimensionSeperator();

                var measurementUnitId = vm.dimentionInfo.measurementUnitId;

                if (vm.dimentionInfo && vm.dimentionInfo.matricDimension) {
                    if (vm.dimentionInfo.matricDimension == "volume") {
                        dimentionInfo = vm.dimentionInfo.matricDimension + separator
                            + measurementUnitId + separator
                            + measurementUnitId + separator
                            + measurementUnitId;
                    } else if (vm.dimentionInfo.matricDimension == "area") {
                        dimentionInfo = vm.dimentionInfo.matricDimension + separator
                            + measurementUnitId + separator
                            + measurementUnitId;
                    } else {
                        dimentionInfo = vm.dimentionInfo.matricDimension + separator + measurementUnitId;
                    }
                }

                vm.dimentionInfo.dimentionType = dimentionInfo;

            }

            function addMatricInfo() {
                var isAdded = true;
                if (vm.category && vm.matricPolicy && vm.matricApplication && vm.matricHandleUnit && vm.matricCase && vm.dimentionInfo && vm.dimentionInfo.matricDimension && vm.dimentionInfo.dimentionType && vm.dimentionInfo.measurementUnitId) {
                    if (!vm.category.measurementMatricInfo) {
                        vm.category.measurementMatricInfo = [];
                    }
                    var isSystemPolicy = false;
                    // var dimentionExpressoin =  msbMeasurementService.prepareDimensionExpression(vm.dimentionInfo.matricDimension, vm.dimentionInfo.unitDef); ""
                    msbMeasurementService.addMatricInfoItem(
                        vm.category.TECHDISER_ID, vm.matricPolicy, vm.matricApplication, vm.matricHandleUnit,
                        vm.matricCase, vm.dimentionInfo.dimentionType,
                        vm.category.measurementMatricInfo, vm.dimentionInfo.measurementUnitId, isSystemPolicy
                    );
                    vm.getPolicies(vm.matricApplication, isAdded);
                }
            }

            function removeMatricInfo(matricInfoItem) {
                if (matricInfoItem && matricInfoItem.idPrefix && !matricInfoItem.isSystemPolicy) {
                    msbMeasurementService.removeMatricInfo(matricInfoItem, vm.category.measurementMatricInfo);
                }
            }

            return policyObj;

        }


        function saveSupplyDefinition(isNew) {
            updateVM();
            var param = {
                "supplyData": vm.category,
                "isNew": isNew
            };
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    console.log(data);
                }
            }, "supplyDefinitionService", "saveSupplyDefinition", param);
        }

        function updateVM() {
            if (vm.supplies && vm.supplies.length > 0 && vm.category) {
                var matIndex = msbUtilService.getIndex(vm.supplies, PRIMARY_COLUMN_NAME, vm.category.TECHDISER_ID);
                if (matIndex > -1) {
                    vm.supplies[matIndex] = vm.category;
                }
            }
        }

        // vm.catList = supplyDefinitionService.getAllCategory(vm);
        supplyTypeTestService.getAllCategoryTestType(function (data) { });

        // costingHeadsService.getAllCostingHeads(function (data) {
        //     vm.costingHeads = data;
        // });

        function getCategoryTypeOrCategoryTypeGroup() {
            var types = [];
            if (vm.category && vm.category.parentId) {
                if (vm.supplyTypesCons && vm.supplyTypesCons.length > 0) {
                    var param = [{
                        "key": "isGroup",
                        "value": false
                    }];
                    var items = msbUtilService.getItemsByProperties(vm.supplyTypesCons, param);
                    if (items.length > 0) {
                        types = items;
                    }
                }
                return types;
            } else if (vm.category && !vm.category.parentId) {
                if (vm.supplyTypesCons && vm.supplyTypesCons.length > 0) {
                    var param = [{
                        "key": "isGroup",
                        "value": true
                    }];
                    var items = msbUtilService.getItemsByProperties(vm.supplyTypesCons, param);
                    if (items.length > 0) {
                        types = items;
                    }
                }
                return types;
            }
        }

        // START SUPPLY CATEGORY AND ITS TYPE

        // Dailog for Selection Test
        function selectTestDialog() {
            // var param = {"testIds": ["LabTest2"], "isTestMethod": false};  // Only Test
            var param = {
                "testIds": [{
                    "testId": "LabTest1",
                    "methodId": "Test_Method2"
                },
                {
                    "testId": "LabTest2",
                    "methodId": "Test_Method4"
                }
                ],
                "isTestMethod": true
            }; // Test with method

            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    console.log(data);
                }
            }, "supplyDefinitionService", "selectTestDialog", param);
        }

        // Get Specific Categories to provide typeKey
        function getCateriesByType() {
            var param = {
                "typeId": "packingMaterials"
            };
            msbCommonApiService.interfaceManager(function (data) {
                if (data) { }
            }, "supplyDefinitionService", "getAllCategoriesByType", param);
        }

        function addNewCategory(item, event, callBack) {
            vm.hasCategory = item;
            vm.callBack = callBack;
            vm.isSelectedCategory = false;
            vm.updateCategory = false;
            vm.addCategory = true;
            vm.isCategoryFormReady = true;
            vm.isNewCategory = true;
            vm.isExapndType = false;
            vm.isExapndDataSheet = false;
            vm.isExapndPositionItem = false;
            // vm.isExapndTestItem = false;
            vm.isExapndDefectItem = false;
            vm.isExapndContainerItem = false;
            vm.isExapndPreCaution = false;
            vm.isExapndProductionTime = false;
            // vm.isExapndLumpSumCost = false;

            if (!item) {
                vm.isParentCategory = false;
                commonApiService.getIdFromServer('SUPPLY_DEFINITION', function (data) {
                    if (data) {
                        vm.category = {
                            "TECHDISER_ID": data.id,
                            "TECHDISER_SERIAL_NO": data.slNo,
                            "level": 1,
                            "title": "",
                            "cuttable": false,
                            "countable": false,
                            "thread": false,
                            "typeId": null,
                            "sourcingTypeId": null,
                            "dimensionId": null,
                            "measurementUnitId": null,
                            "preCautionMarks": [],
                            "types": [],
                            "nodes": [],
                            "genericDefectIds": []
                        }
                    }
                });
            } else {
                vm.isParentCategory = true;
                vm.selectedItemCategory = angular.copy(item);
                console.log(vm.selectedItemCategory);
                commonApiService.getIdFromServer('SUPPLY_DEFINITION', function (data) {
                    if (data) {
                        vm.category = {
                            "TECHDISER_ID": data.id,
                            "TECHDISER_SERIAL_NO": data.slNo,
                            "level": vm.selectedItemCategory.level + 1,
                            "parentId": vm.selectedItemCategory.TECHDISER_ID,
                            "materialUniqueId": msbUtilService.generateId(),
                            "inspectionTool": null,
                            "cuttable": false,
                            "countable": false,
                            "thread": false,
                            "isSizeDependent": false,
                            "isColorDependent": false,
                            "isUnitType": false,
                            "isContainerType": false,
                            "typeId": null,
                            "sourcingTypeId": null,
                            "dimensionId": null,
                            "measurementUnitId": null,
                            "costingHeadId": "",
                            "bomHeadId": "",
                            "productionTimes": [],
                            "dataSheet": [],
                            "positions": [],
                            "defectDef": [],
                            "tests": [],
                            "preCautionMarks": [],
                            "types": [],
                            "containers": [],
                            "nodes": [],
                            "genericDefectIds": []
                        }
                    }
                });
            }
            if (vm.category) {
                policyHandler.getMatricPolicyInfo(vm.category, vm.matricApplication);
            }

        }

        function saveCategory(category, isNew) {
            if (category.title) {
                msbCommonApiService.saveItem(category, isNew, "SUPPLY_DEFINITION", function (data) {
                    if (data) {
                        if (vm.supplies && vm.supplies.length > 0) {
                            var catIndex = msbUtilService.getIndex(vm.supplies, PRIMARY_COLUMN_NAME, data.TECHDISER_ID);
                            if (catIndex > -1) {
                                vm.supplies[catIndex] = data;
                            } else if (catIndex == -1) {
                                vm.supplies.push(data);
                            }
                        }
                        vm.callBack(data);
                    }
                }, null, false, null, "clientUrl", true);
                saveSupplyDefinition(isNew);
                vm.isCategoryFormReady = false;
                vm.category = {};
                vm.category.measurementMatricInfo = [];
            }
        }

        function selectCategory(item, event, callBack) {
            // updateVM();
            vm.callBack = callBack;
            vm.isSelectedCategory = true;
            vm.item = item;
            var index = msbUtilService.getIndex(vm.supplies, PRIMARY_COLUMN_NAME, item[PRIMARY_COLUMN_NAME]);
            vm.category = angular.copy(vm.supplies[index]);
            // vm.category = angular.copy(item);
            vm.addCategory = false;
            vm.updateCategory = true;
            vm.isNewCategory = false;
            vm.isCategoryFormReady = true;

            vm.type = {};
            vm.updateType = false;
            vm.isNewType = true;
            vm.isExapndType = false;

            vm.dataSheet = {};
            vm.updateDataSheet = false;
            vm.isNewDataSheet = true;
            vm.isExapndDataSheet = false;

            vm.testItem = {};
            // vm.updateTestItem = false;
            // vm.isNewTestItem = true;
            // vm.isExapndTestItem = false;
            // if (item.types) {
            //     getTypesForTestColumnDef(item.types);
            // }

            vm.defectItem = {};
            vm.updateDefectItem = false;
            vm.isNewDefectItem = true;
            vm.isExapndDefectItem = false;
            if (item.defectDef && item.types) {
                getTypesForDefectColumnDef(item.types);
            }

            vm.positionItem = {};
            vm.updatePositionItem = false;
            vm.isNewPositionItem = true;
            vm.isExapndPositionItem = false;

            // vm.containerItem = {};
            // vm.updateContainerItem = false;
            // // vm.isNewContainerItem = true;
            // vm.isExapndContainerItem = false;

            vm.preCaution = {};
            vm.updatePreCaution = false;
            vm.isNewPreCaution = true;
            vm.isExapndPreCaution = false;
            if (item.types) {
                getTypesForPreCautions(item.types);
            }

            vm.productionTime = {};
            vm.updateProductionTime = false;
            vm.isNewProductionTime = true;
            vm.isExapndProductionTime = false;
            if (item.productionTimes && item.types) {
                getTypesForProductionTimeColumnDef(item.types);
            }

            // vm.lumpSumCost = {};
            // vm.updateLumpSumCost = false;
            // vm.isNewLumpSumCost = true;
            // vm.isExapndLumpSumCost = false;
            // if (item.lumpSumCosts && item.types){
            //     getTypesForLumpSumCostColumnDef(item.types);
            // }

            checkLeafNodes(item);

            getCategoryTypeOrCategoryTypeGroup();

            selectMenu('type');

            if (vm.category) {
                policyHandler.getMatricPolicyInfo(vm.category, vm.matricApplication);
            }

        }

        function deleteCategory(category, event, callBack) {
            vm.callBack = callBack;
            if (category.nodes.length > 0 && category.level == 1) {
                msbUtilService.showToast(
                    'This Supply Type has a Category.',
                    'error-toast',
                    5000
                );
            } else if (category.nodes.length > 0 && category.level == 2) {
                msbUtilService.showToast(
                    'This Category has a Type.',
                    'error-toast',
                    5000
                );
            } else {
                var index = msbUtilService.getIndex(vm.supplies, PRIMARY_COLUMN_NAME, category[PRIMARY_COLUMN_NAME]);
                if (index < 0) {
                    return;
                }

                // commonApiService.confirmAndDelete(null, function(){
                //     category.deleted = !category.deleted;
                //     commonApiService.saveItem(vm, category, false, "SUPPLY_DEFINITION", "supplies", false, function(){
                //         vm.callBack(category);
                //     });
                // });
                msbUtilService.confirmAndDelete(null, category, function () {
                    msbCommonApiService.saveItem(category, false, "SUPPLY_DEFINITION", function (data) {
                        if (data && callBack) {
                            callBack(data);
                        }

                    }, null, false, null, "clientUrl", true);
                });
            }
            // if we want to blank all fields of deleted item
            vm.category = {};
            vm.updateCategory = false;
            vm.isNewCategory = true;
            vm.category.measurementMatricInfo = [];
        }

        function getMaterialProfileSummaryId() {
            if (vm.category && vm.category.materialType && vm.type) {
                msbCommonApiService.interfaceManager(function (proSmryId) {
                    if (proSmryId) {
                        vm.type.profileSummaryId = proSmryId;
                        console.log(vm.type);
                    }
                }, "materialProfileMatch", "getProfileSummaryId", [{ "key": "type", "value": vm.category.materialType }, { "key": "material", "value": vm.type }]);
            }
        }

        function saveType(category, type, isNewType) {
            if (category && type) {
                if (isNewType) {
                    var typeObj = {
                        "TECHDISER_ID": msbUtilService.generateId(),
                        "TECHDISER_SERIAL_NO": category.types.length + 1,
                        "title": type.title,
                        "description": type.description,
                        "wastage": type.wastage
                    }
                    category.types.unshift(typeObj);
                } else {
                    var typeIndex = msbUtilService.getIndex(category.types, "TECHDISER_ID", type.TECHDISER_ID);
                    if (typeIndex > -1) {
                        category.types[typeIndex] = type;
                    }
                }
                vm.updateType = false;
                vm.isNewType = true;
                saveSupplyDefinition(isNewType);
            }
        }

        function saveSummaryType(category, type, isNewType) {
            if (category && type) {
                if (!category.types) {
                    category.types = [];
                }
                console.log(type);
                if (isNewType) {
                    var profileSummaryIndex = msbUtilService.getIndex(category.types, "profileSummaryId", type.profileSummaryId);
                    if (profileSummaryIndex === -1) {
                        type.TECHDISER_ID = msbUtilService.generateId();
                        type.TECHDISER_SERIAL_NO = category.types.length + 1;
                        category.types.unshift(type);
                    } else {
                        msbUtilService.showToast("Item already exist", "warning-toast", 2000);
                    }
                } else {
                    var profileSummaryIndex = msbUtilService.getIndex(category.types, "profileSummaryId", type.profileSummaryId);
                    var typeIndex = msbUtilService.getIndex(category.types, "TECHDISER_ID", type.TECHDISER_ID);
                    if (typeIndex > -1 && (typeIndex == profileSummaryIndex || profileSummaryIndex === -1)) {
                        category.types[typeIndex] = type;
                    } else if (typeIndex > -1 && (typeIndex != profileSummaryIndex || profileSummaryIndex > -1)) {
                        msbUtilService.showToast("Item already exist", "warning-toast", 2000);
                    }
                }
                vm.updateType = false;
                vm.isNewType = true;
                vm.type = {};
                reborn();
                saveSupplyDefinition(isNewType);
            }
        }

        function reborn() {
            vm.isReborn = 0;
            $timeout(function () {
                vm.isReborn = 1;
            }, 100);
        }

        function selectType(item) {
            if (item) {
                vm.type = angular.copy(item);
                vm.selectedType = item;
                vm.updateType = true;
                vm.isNewType = false;
                reborn();
            }
        }

        function deleteType(category, type) {
            var typeIndex = msbUtilService.getIndex(category.types, "TECHDISER_ID", type.TECHDISER_ID);
            if (typeIndex > -1) {
                category.types.splice(typeIndex, 1);

                vm.type = {};
                vm.updateType = false;
                vm.isNewType = true;

            }
        }



        function checkLeafNodes(category) {
            // if(category){
            //     return true;
            // }
            // else {
            //     return false;
            // }
            /*tree view have a problem while creating a new item or deleting
            [Cannot read property 'length' of undefined] while we checking nodes.length */

            if (category) {
                var catId = msbUtilService.getIndex(vm.supplies, "parentId", category.TECHDISER_ID);
                if (catId < 0) {
                    var param = [{
                        "key": "headId",
                        "value": category.costingHeadId
                    }];
                    msbCommonApiService.interfaceManager(function (data) {
                        if (data) {
                            vm.leafCostingHead = data;
                        }
                    }, "supplyDefinitionService", "getCostingHeadById", param);
                    // return true;
                    vm.showLeafNode = true;
                } else {
                    // return false;
                    vm.showLeafNode = false;
                }
            } else {
                // return false;
                vm.showLeafNode = false;
            }
        }

        function makeData(type) {
            if (type) {
                switch (type) {
                    case "Fabrics":
                        return garmentMaterialSpecProfileService.getFlattenedAttributes(type);
                        break;
                    case "Button":
                        return garmentMaterialSpecProfileService.getFlattenedAttributes(type);
                        break;
                    case "Zipper":
                        return garmentMaterialSpecProfileService.getFlattenedAttributes(type);
                        break;
                    case "Labels":
                        return garmentMaterialSpecProfileService.getFlattenedAttributes(type);
                        break;
                    case "Thread":
                        return garmentMaterialSpecProfileService.getFlattenedAttributes(type);
                        break;
                    default:
                        return [];
                }
            }
        }
        vm.getMaterialAttTitle = function (att, type) {
            if (att && type) {
                switch (type) {
                    case "Fabrics":
                        return garmentMaterialSpecProfileService.getMatAttTitle(type, att);
                        break;
                    case "Button":
                        return garmentMaterialSpecProfileService.getMatAttTitle(type, att);
                        break;
                    case "Zipper":
                        return garmentMaterialSpecProfileService.getMatAttTitle(type, att);
                        break;
                    case "Labels":
                        return garmentMaterialSpecProfileService.getMatAttTitle(type, att);
                        break;
                    case "Thread":
                        return garmentMaterialSpecProfileService.getMatAttTitle(type, att);
                        break;
                    default:
                        return msbUtilService.makeTitleFromCamel(att);
                }
            }
        }
        vm.selectDataSheet = function (type) {
            var params = {
                data: makeData(type),
                isGroup: 0,
                checkAttr: 'attName',
                showAttrs: [{
                    "key": "attTitle",
                    "value": null
                }],
                selectionType: 'multiple',
                selected: vm.category.dataSheet,
                returnType: 'reference',
                dialogTitle: 'Select Spec Sheet',
                filterParams: []
            }
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    vm.category.dataSheet = data;
                }
            }, "organizationsDataService", "commonSelector", params);
        }

        //-------End Select Data Sheet--------//
        function selectDataSheet(item) {
            if (item) {
                vm.dataSheet.title = angular.copy(item);
                vm.selectedDataSheet = item;
                vm.updateDataSheet = true;
                vm.isNewDataSheet = false;
            }
        }

        function saveDataSheet(category, dataSheet, isNewDataSheet) {
            if (category && dataSheet) {
                if (isNewDataSheet) {
                    var dataSheetStr = dataSheet.title;
                    category.dataSheet.unshift(dataSheetStr);
                } else {
                    var sheetIndex = category.dataSheet.indexOf(vm.selectedDataSheet);
                    if (sheetIndex > -1) {
                        category.dataSheet[sheetIndex] = dataSheet.title;
                    }
                }
                vm.updateDataSheet = false;
                vm.isNewDataSheet = true;
                saveSupplyDefinition(isNewDataSheet);
            }
        }

        function deleteDataSheet(category, dataSheet) {
            if (category && dataSheet) {
                var sheetIndex = category.dataSheet.indexOf(dataSheet);
                if (sheetIndex > -1) {
                    category.dataSheet.splice(sheetIndex, 1);

                    vm.dataSheet = {};
                    vm.updateDataSheet = false;
                    vm.isNewDataSheet = true;
                }
            }
        }

        function selectTestItem(item) {
            if (item) {
                vm.testItem = angular.copy(item);
                vm.selectedTestItem = item;
                // vm.updateTestItem = true;
                // vm.isNewTestItem = false;
            }
            // getTestMaxMinValue();
            getTestAttributes(item);
            getTestMethods(item);
            getTypeWiseTestDefinition();
        }

        function getTestUnit(testUnitId) {
            if (testUnitId && vm.testingUnits && vm.testingUnits.length > 0) {
                var unitIndex = msbUtilService.getIndex(vm.testingUnits, "key", testUnitId);
                if (unitIndex > -1) {
                    return vm.testingUnits[unitIndex].value;
                }
            }
        }

        function deleteTestItem(category, testItem) {
            var testIndex = msbUtilService.getIndex(category.tests, "TECHDISER_ID", testItem.TECHDISER_ID);
            if (testIndex > -1) {
                category.tests.splice(testIndex, 1);

                vm.testItem = {};
                selectTestItem(category.tests[0]);
                // vm.updateTestItem = false;
                // vm.isNewTestItem = true;
            }
        }

        function checkTestTypeExist(type) {
            if (type) {
                if (!vm.selectedTestItem.materialTypes) {
                    return;
                }
                var typePos = msbUtilService.getIndex(vm.selectedTestItem.materialTypes, PRIMARY_COLUMN_NAME, type[PRIMARY_COLUMN_NAME]);
                if (typePos > -1) {
                    if (vm.selectedTestItem.materialTypes[typePos].isSelectedType) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }

        }

        function selectTypeForTest(type) {
            if (type && vm.selectedTestItem.materialTypes) {
                var index = msbUtilService.getIndex(vm.selectedTestItem.materialTypes, PRIMARY_COLUMN_NAME, type[PRIMARY_COLUMN_NAME]);
                if (index > -1) {
                    vm.selectedTestItem.materialTypes[index].isSelectedType = !vm.selectedTestItem.materialTypes[index].isSelectedType;
                }
            }
        }


        function getTypeNameForTestItem(category, testItem) {
            var typeForTest = [];
            if (category && testItem) {
                if (testItem.materialTypeIds) {
                    for (var i = 0; i < testItem.materialTypeIds.length; i++) {
                        var typeIdx = msbUtilService.getIndex(category.types, "TECHDISER_ID", testItem.materialTypeIds[i]);
                        if (typeIdx > -1) {
                            typeForTest.push(category.types[typeIdx].title);
                        }
                    }
                }

            }
            return typeForTest;
        }

        function newDefectModel() {
            vm.defectItem = {};
            vm.defectItem.TECHDISER_ID = msbUtilService.generateId();
            vm.defectItem.isGenericDefect = 0;
            vm.defectItem.materialTypeIds = [];
        }

        function saveDefectItem(category, defectItem, isNewDefectItem) {
            if (category && defectItem) {
                console.log(defectItem);
                if (isNewDefectItem) {
                    var defectObj = {
                        "TECHDISER_ID": msbUtilService.generateId(),
                        "TECHDISER_SERIAL_NO": category.defectDef.length * 1 + 1,
                        "title": defectItem.title,
                        "description": defectItem.description,
                        "defectTypeId": defectItem.defectTypeId,
                        "materialTypeIds": defectItem.materialTypeIds,
                        "code": defectItem.code,
                        "isRecoverable": defectItem.isRecoverable,
                        "guideLine": defectItem.guideLine,
                        "requireTime": defectItem.requireTime,
                        "isGenericDefect": defectItem.isGenericDefect
                    }
                    category.defectDef.unshift(defectObj);
                } else {
                    var defectIndex = msbUtilService.getIndex(category.defectDef, "TECHDISER_ID", defectItem.TECHDISER_ID);
                    if (defectIndex > -1) {
                        category.defectDef[defectIndex] = defectItem;
                    }
                }
                vm.updateDefectItem = false;
                vm.isNewDefectItem = true;
                saveSupplyDefinition(isNewDefectItem);
            }
        }

        function isItemGenericDefect(defectItem) {
            if (vm.category && vm.category.genericDefectIds && vm.category.genericDefectIds.length > 0 && defectItem) {
                var defIndex = vm.category.genericDefectIds.indexOf(defectItem[PRIMARY_COLUMN_NAME]);
                if (defIndex > -1) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        function selectGenericDefect() {
            if (vm.defectItem) {
                if (vm.defectItem.isGenericDefect == 0) {
                    vm.defectItem.isGenericDefect = 1;
                } else {
                    vm.defectItem.isGenericDefect = 0;
                }
                if (vm.category) {
                    if (!vm.category.genericDefectIds) {
                        vm.category.genericDefectIds = [];
                    }
                    var defIndex = vm.category.genericDefectIds.indexOf(vm.defectItem[PRIMARY_COLUMN_NAME]);
                    if (defIndex > -1) {
                        vm.category.genericDefectIds.splice(defIndex, 1);
                    } else {
                        vm.category.genericDefectIds.push(vm.defectItem[PRIMARY_COLUMN_NAME]);
                    }
                }
            }
        }

        function selectDefectItem(item) {
            if (item) {
                vm.defectItem = angular.copy(item);
                vm.selectedDefectItem = item;
                vm.updateDefectItem = true;
                vm.isNewDefectItem = false;
            }
        }

        function deleteDefectItem(category, defectItem) {
            if (category && category.defectDef && category.defectDef.length > 0) {
                var defectIndex = msbUtilService.getIndex(category.defectDef, "TECHDISER_ID", defectItem.TECHDISER_ID);
                if (defectIndex > -1) {
                    category.defectDef.splice(defectIndex, 1);

                    vm.defectItem = {};
                    vm.updateDefectItem = false;
                    vm.isNewDefectItem = true;
                }
            }
        }

        function getTypeNameForDefectItem(category, defectItem) {
            var typeForDefect = [];
            if (category && defectItem) {
                if (defectItem.materialTypeIds) {
                    for (var i = 0; i < defectItem.materialTypeIds.length; i++) {
                        var typeIndex = msbUtilService.getIndex(category.types, "TECHDISER_ID", defectItem.materialTypeIds[i]);
                        if (typeIndex > -1) {
                            typeForDefect.push(category.types[typeIndex].title);
                        }
                    }
                }

            }
            return typeForDefect;
        }

        function checkDefectTypeExist(typeId) {
            if (typeId) {
                if (!vm.defectItem.materialTypeIds) {
                    return;
                }
                var typePos = vm.defectItem.materialTypeIds.indexOf(typeId);
                return typePos > -1;
            }

        }

        function selectTypeForDefect(typeId) {
            if (typeId && vm.defectItem.materialTypeIds) {
                var i = vm.defectItem.materialTypeIds.indexOf(typeId);
                if (i > -1) {
                    vm.defectItem.materialTypeIds.splice(i, 1);
                } else {
                    vm.defectItem.materialTypeIds.push(typeId);
                }
            }
            getTypeNameForDefectItem(vm.category, vm.defectItem);
        }

        function getTypesForDefectColumnDef(item) {
            if (item && item.length > 0) {
                var types = [];
                for (var i = 0; i < item.length; i++) {
                    if (item[i]) {
                        var typeObj = {
                            "id": item[i].TECHDISER_ID,
                            "text": item[i].title
                        };
                        types.push(typeObj);
                    }
                }
                vm.defectTypes = types;
                // if (vm.supplyDefCatDefectColumns) {
                //     var columnIdx = msbUtilService.getIndex(vm.supplyDefCatDefectColumns, "type", "multidropDown");
                //     if (columnIdx > -1) {
                //         vm.supplyDefCatDefectColumns[columnIdx].items = types;
                //     }
                // }
            }
        }


        function savePositionItem(category, positionItem, isNewPositionItem) {
            if (category && category.positions && positionItem) {
                if (isNewPositionItem) {
                    var positionObj = {
                        "TECHDISER_ID": msbUtilService.generateId(),
                        "TECHDISER_SERIAL_NO": category.positions.length + 1,
                        "title": positionItem.title
                    }
                    category.positions.unshift(positionObj);
                } else {
                    var positionIndex = msbUtilService.getIndex(category.positions, "TECHDISER_ID", positionItem.TECHDISER_ID);
                    if (positionIndex > -1) {
                        category.positions[positionIndex] = positionItem;
                    }
                }
                vm.updatePositionItem = false;
                vm.isNewPositionItem = true;
                saveSupplyDefinition(isNewPositionItem);
            }
        }

        function selectPositionItem(item) {
            if (item) {
                vm.positionItem = angular.copy(item);
                vm.selectedPositionItem = item;
                vm.updatePositionItem = true;
                vm.isNewPositionItem = false;
            }
        }

        function deletePositionItem(category, positionItem) {
            if (category && category.positions && positionItem) {
                var positionIndex = msbUtilService.getIndex(category.positions, "TECHDISER_ID", positionItem.TECHDISER_ID);
                if (positionIndex > -1) {
                    category.positions.splice(positionIndex, 1);

                    vm.positionItem = {};
                    vm.updatePositionItem = false;
                    vm.isNewPositionItem = true;
                }
            }
        }

        function selectContainerItem(item) {
            if (item) {
                vm.containerItem = angular.copy(item);
                vm.selectedContainerItem = item;
                // vm.updateContainerItem = true;
                // vm.isNewContainerItem = false;

                vm.containerType = {};
            }
        }

        function selectContainerSize(item) {
            if (item) {
                vm.containerType = angular.copy(item);
                vm.selectedContainerType = item;
                vm.updateContainerSize = true;
                vm.isNewContainerSize = false;
            }
        }

        function deleteContainerSize(sizes, containerType) {
            if (sizes && sizes.length > 0 && containerType) {
                var containerTypeIndex = msbUtilService.getIndex(sizes, PRIMARY_COLUMN_NAME, containerType.TECHDISER_ID);
                if (containerTypeIndex > -1) {
                    sizes.splice(containerTypeIndex, 1);

                    vm.containerType = {};
                    vm.updateContainerSize = false;
                    vm.isNewContainerSize = true;
                }
            }
        }

        function selectContainerDialog() {
            $mdDialog
                .show({
                    controller: "SelectContainerDialogController",
                    controllerAs: "vm",
                    clickOutsideToClose: false,
                    preserveScope: true,
                    templateUrl: "app/main/systemsettings/supply-definition/dialog/select-container/select-container.dialog.html",
                    locals: {
                        Containers: getSelectedContainer()
                    }
                })
                .then(function (answerContainerIds) {
                    if (answerContainerIds && vm.category && vm.category.containers) {
                        for (var i = 0; i < answerContainerIds.length; i++) {
                            if (answerContainerIds[i]) {
                                var containerIndex = msbUtilService.getIndex(vm.category.containers, "containerId", answerContainerIds[i]);
                                if (containerIndex === -1) {
                                    var container = {
                                        "TECHDISER_ID": msbUtilService.generateId(),
                                        "TECHDISER_SERIAL_NO": vm.category.containers.length + 1,
                                        "containerId": answerContainerIds[i],
                                        "sizes": []
                                    }
                                    vm.category.containers.unshift(container);
                                    selectContainerItem(container);
                                    saveSupplyDefinition(true);
                                }
                            }

                        }
                    }
                });
        }

        function getSelectedContainer() {
            if (vm.category && vm.category.containers && vm.category.containers.length > 0) {
                var selectedContainerIds = [];
                for (var i = 0; i < vm.category.containers.length; i++) {
                    if (vm.category.containers[i]) {
                        selectedContainerIds.push(vm.category.containers[i].containerId);
                    }
                }
                return selectedContainerIds;
            }
        }

        function getContainerTitle(containerId) {
            if (containerId && vm.packContainers && vm.packContainers.length > 0) {
                var containerIndex = msbUtilService.getIndex(vm.packContainers, PRIMARY_COLUMN_NAME, containerId);
                if (containerIndex > -1) {
                    return vm.packContainers[containerIndex].title;
                }
            }
        }

        function editContainer(containerItem) {
            if (containerItem) {
                vm.item = containerItem;
                vm.updateContainerItem = true;
                vm.isNewContainerItem = false;
                vm.containerItem = angular.copy(containerItem);

            }
        }

        function deleteContainerItem(category, containerItem) {
            if (category && category.containers && category.containers.length > 0 && containerItem) {
                var containerIndex = msbUtilService.getIndex(category.containers, PRIMARY_COLUMN_NAME, containerItem.TECHDISER_ID);
                if (containerIndex > -1) {
                    category.containers.splice(containerIndex, 1);

                    vm.containerItem = {};
                    vm.updateContainerItem = false;
                    vm.isNewContainerItem = true;

                    vm.containerType = {};
                    vm.updateContainerSize = false;
                    vm.isNewContainerSize = true;
                }
            }
        }

        function getTypesForPreCautions(item) {
            if (item && item.length > 0) {
                var types = [];
                for (var i = 0; i < item.length; i++) {
                    if (item[i]) {
                        var typeObj = {
                            "id": item[i].TECHDISER_ID,
                            "text": item[i].title
                        };
                        types.push(typeObj);
                    }
                }
                vm.preCautionTypes = types;
            }
        }

        function selectPreCautionMark(item) {
            if (item) {
                vm.preCaution = angular.copy(item);
                vm.selectedPreCaution = item;
                vm.updatePreCaution = true;
                vm.isNewPreCaution = false;
            }
        }

        function addPreCautionMark(category, preCaution, isNewPreCaution) {
            if (category && category.preCautionMarks && preCaution) {
                if (isNewPreCaution) {
                    var preCautionObj = {
                        "TECHDISER_ID": msbUtilService.generateId(),
                        "TECHDISER_SERIAL_NO": category.preCautionMarks.length + 1,
                        "title": preCaution.title,
                        "image": preCaution.image,
                        "materialTypeIds": preCaution.materialTypeIds
                    }
                    category.preCautionMarks.unshift(preCautionObj);
                } else {
                    var preCautionIndex = msbUtilService.getIndex(category.preCautionMarks, PRIMARY_COLUMN_NAME, preCaution.TECHDISER_ID);
                    if (preCautionIndex > -1) {
                        category.preCautionMarks[preCautionIndex] = preCaution;
                    }
                }
                vm.updatePreCaution = false;
                vm.isNewPreCaution = true;
                saveSupplyDefinition(isNewPreCaution);
            }
        }

        function deletePreCautionMark(category, preCaution) {
            if (category && category.preCautionMarks && category.preCautionMarks.length > 0 && preCaution) {
                var preCautionIndex = msbUtilService.getIndex(category.preCautionMarks, "TECHDISER_ID", preCaution.TECHDISER_ID);
                if (preCautionIndex > -1) {
                    category.preCautionMarks.splice(preCautionIndex, 1);

                    vm.preCaution = {};
                    vm.updatePreCaution = false;
                    vm.isNewPreCaution = true;
                }
            }
        }

        function checkPreCautionTypeExist(typeId) {
            if (typeId) {
                if (!vm.preCaution.materialTypeIds) {
                    return;
                }
                var typePos = vm.preCaution.materialTypeIds.indexOf(typeId);
                return typePos > -1;
            }

        }

        function selectTypeForPreCaution(typeId) {
            if (typeId && vm.preCaution.materialTypeIds) {
                var i = vm.preCaution.materialTypeIds.indexOf(typeId);
                if (i > -1) {
                    vm.preCaution.materialTypeIds.splice(i, 1);
                } else {
                    vm.preCaution.materialTypeIds.push(typeId);
                }
            }
            getTypeNameForPreCaution(vm.category, vm.preCaution);
        }

        function getPreCautionsType(typeId) {
            if (typeId && vm.category && vm.category.types && vm.category.types.length > 0) {
                var typeIndex = msbUtilService.getIndex(vm.category.types, PRIMARY_COLUMN_NAME, typeId);
                if (typeIndex > -1) {
                    return vm.category.types[typeIndex].title;
                }
            }
        }

        function getTypeNameForPreCaution(category, preCaution) {
            var typeForPreCaution = [];
            if (category && preCaution) {
                if (preCaution.materialTypeIds) {
                    for (var i = 0; i < preCaution.materialTypeIds.length; i++) {
                        var typeIndex = msbUtilService.getIndex(category.types, "TECHDISER_ID", preCaution.materialTypeIds[i]);
                        if (typeIndex > -1) {
                            typeForPreCaution.push(category.types[typeIndex].title);
                        }
                    }
                }

            }
            return typeForPreCaution;
        }

        function selectProductionTime(item) {
            if (item) {
                vm.productionTime = angular.copy(item);
                vm.selectedProductionTime = item;
                vm.updateProductionTime = true;
                vm.isNewProductionTime = false;
            }
        }

        function getProductionTimeType(typeId) {
            if (typeId && vm.category && vm.category.types && vm.category.types.length > 0) {
                var typeIndex = msbUtilService.getIndex(vm.category.types, PRIMARY_COLUMN_NAME, typeId);
                if (typeIndex > -1) {
                    return vm.category.types[typeIndex].title;
                }
            }
        }

        function deleteProductionTime(category, productionTime) {
            if (category && category.productionTimes && category.productionTimes.length > 0) {
                var proTimeIndex = msbUtilService.getIndex(category.productionTimes, "TECHDISER_ID", productionTime.TECHDISER_ID);
                if (proTimeIndex > -1) {
                    category.productionTimes.splice(proTimeIndex, 1);

                    vm.productionTime = {};
                    vm.updateProductionTime = false;
                    vm.isNewProductionTime = true;
                    saveSupplyDefinition(false);
                }
            }
        }

        function saveProductionTime(category, productionTime, isNewProductionTime) {
            if (category && productionTime) {
                if (isNewProductionTime) {
                    msbCommonApiService.getIdFromServer("SUPPLY_DEFINITION", function (data) {
                        if (data) {

                            var productionTimeObj = {
                                "TECHDISER_ID": data.id,
                                "TECHDISER_SERIAL_NO": data.slNo,
                                "quantity": productionTime.quantity,
                                "timeDays": productionTime.timeDays,
                                "materialTypeIds": productionTime.materialTypeIds
                            }
                            category.productionTimes.unshift(productionTimeObj);

                            saveSupplyDefinition(isNewProductionTime);
                        }
                    }, "clientUrl");
                } else {
                    var proTimeIndex = msbUtilService.getIndex(category.productionTimes, "TECHDISER_ID", productionTime.TECHDISER_ID);
                    if (proTimeIndex > -1) {
                        category.productionTimes[proTimeIndex] = productionTime;
                        saveSupplyDefinition(isNewProductionTime);
                    }
                }
                vm.updateProductionTime = false;
                vm.isNewProductionTime = true;
            }
        }

        function getTypesForProductionTimeColumnDef(item) {
            if (item && item.length > 0) {
                var types = [];
                for (var i = 0; i < item.length; i++) {
                    if (item[i]) {
                        var typeObj = {
                            "id": item[i].TECHDISER_ID,
                            "text": item[i].title
                        };
                        types.push(typeObj);
                    }
                }
                vm.productionTimeTypes = types;
            }
        }

        function checkProductionTimeTypeExist(typeId) {
            if (typeId) {
                if (!vm.productionTime.materialTypeIds) {
                    return;
                }
                var typePos = vm.productionTime.materialTypeIds.indexOf(typeId);
                return typePos > -1;
            }

        }

        function selectTypeForProductionTime(typeId) {
            if (typeId && vm.productionTime.materialTypeIds) {
                var i = vm.productionTime.materialTypeIds.indexOf(typeId);
                if (i > -1) {
                    vm.productionTime.materialTypeIds.splice(i, 1);
                } else {
                    vm.productionTime.materialTypeIds.push(typeId);
                }
            }
            getTypeNameForProductionTime(vm.category, vm.productionTime);
        }

        function getTypeNameForProductionTime(category, productionTime) {
            var typeForProductionTime = [];
            if (category && productionTime) {
                if (productionTime.materialTypeIds) {
                    for (var i = 0; i < productionTime.materialTypeIds.length; i++) {
                        var typeIndex = msbUtilService.getIndex(category.types, "TECHDISER_ID", productionTime.materialTypeIds[i]);
                        if (typeIndex > -1) {
                            typeForProductionTime.push(category.types[typeIndex].title);
                        }
                    }
                }

            }
            return typeForProductionTime;
        }

        function getMeasurementUnits(key) {
            if (key && vm.measUnits && vm.measUnits.length > 0) {
                vm.measurementUnits = [];
                for (var i = 0; i < vm.measUnits.length; i++) {
                    if (vm.measUnits[i].dimensionType && vm.measUnits[i].dimensionType.length > 0) {
                        var hasKey = vm.measUnits[i].dimensionType.indexOf(key);
                        if (hasKey > -1) {
                            vm.measurementUnits.push(vm.measUnits[i]);
                        }
                    }
                }

            }
        }

        function getDimensionTitle(dimensionId) {
            if (dimensionId && vm.dimensionTypes && vm.dimensionTypes.length > 0) {
                var dimensionIndex = msbUtilService.getIndex(vm.dimensionTypes, "key", dimensionId);
                if (dimensionIndex > -1) {
                    return vm.dimensionTypes[dimensionIndex].value;
                }
            }
        }

        function getMeasurementUnitTitle(measurementUnitId) {
            if (measurementUnitId && vm.measUnits && vm.measUnits.length > 0) {
                var mUnitIndex = msbUtilService.getIndex(vm.measUnits, "key", measurementUnitId);
                if (mUnitIndex > -1) {
                    return vm.measUnits[mUnitIndex].value;
                }
            }
        }



        function selectCostingHeadsDialog(category) {
            if (vm.costingHeads && category) {
                $mdDialog
                    .show({
                        controller: "SelectCostingHeadsDialogController",
                        controllerAs: "vm",
                        clickOutsideToClose: false,
                        preserveScope: true,
                        templateUrl: "app/main/systemsettings/supply-definition/dialog/select-costing-heads-dialog.html",
                        locals: {
                            CostingHead: category.costingHeadId
                        }
                    })
                    .then(function (answer) {
                        if (answer) {
                            category.costingHeadId = answer;
                            checkLeafNodes(category);
                        }
                    });
            }
        }

        function selectCuttableCountableThread(category, code) {
            if (category && code) {
                if (code === "cuttable") {
                    category.countable = false;
                    category.thread = false;
                    category.cuttable = !category.cuttable;
                    return category.cuttable;
                } else if (code === "countable") {
                    category.cuttable = false;
                    category.thread = false;
                    category.countable = !category.countable;
                    return category.countable;
                } else if (code === "thread") {
                    category.cuttable = false;
                    category.countable = false;
                    category.thread = !category.thread;
                    return category.thread;
                }
            }
        }

        function selectMenu(code) {
            if (code) {
                if (code === "type") {
                    vm.visibleType = true;
                    vm.visibleSpecSheet = false;
                    vm.visiblePosition = false;
                    vm.visibleTest = false;
                    vm.visibleDefect = false;
                    vm.visibleMetric = false;
                    vm.visibleContainer = false;
                    vm.visiblePreCaution = false;
                    vm.visibleProductionTime = false;
                    vm.visibleMeasurementPolicy = false;
                    // vm.visibleLumpSumCost = false;
                } else if (code === "SpecSheet") {
                    vm.visibleType = false;
                    vm.visibleSpecSheet = true;
                    vm.visiblePosition = false;
                    vm.visibleTest = false;
                    vm.visibleDefect = false;
                    vm.visibleMetric = false;
                    vm.visibleContainer = false;
                    vm.visiblePreCaution = false;
                    vm.visibleProductionTime = false;
                    vm.visibleMeasurementPolicy = false;
                    // vm.visibleLumpSumCost = false;
                } else if (code === "Position") {
                    vm.visibleType = false;
                    vm.visibleSpecSheet = false;
                    vm.visiblePosition = true;
                    vm.visibleTest = false;
                    vm.visibleDefect = false;
                    vm.visibleMetric = false;
                    vm.visibleContainer = false;
                    vm.visiblePreCaution = false;
                    vm.visibleProductionTime = false;
                    vm.visibleMeasurementPolicy = false;
                    // vm.visibleLumpSumCost = false;
                } else if (code === "Test") {
                    vm.visibleType = false;
                    vm.visibleSpecSheet = false;
                    vm.visiblePosition = false;
                    vm.visibleTest = true;
                    vm.visibleDefect = false;
                    vm.visibleMetric = false;
                    vm.visibleContainer = false;
                    vm.visiblePreCaution = false;
                    vm.visibleProductionTime = false;
                    vm.visibleMeasurementPolicy = false;
                    // vm.visibleLumpSumCost = false;
                } else if (code === "Defect") {
                    vm.visibleType = false;
                    vm.visibleSpecSheet = false;
                    vm.visiblePosition = false;
                    vm.visibleTest = false;
                    vm.visibleDefect = true;
                    vm.visibleMetric = false;
                    vm.visibleContainer = false;
                    vm.visiblePreCaution = false;
                    vm.visibleProductionTime = false;
                    vm.visibleMeasurementPolicy = false;
                    // vm.visibleLumpSumCost = false;
                } else if (code === "Matric") {
                    vm.visibleType = false;
                    vm.visibleSpecSheet = false;
                    vm.visiblePosition = false;
                    vm.visibleTest = false;
                    vm.visibleDefect = false;
                    vm.visibleMetric = true;
                    vm.visibleContainer = false;
                    vm.visiblePreCaution = false;
                    vm.visibleProductionTime = false;
                    vm.visibleMeasurementPolicy = false;
                    vm.itemDimension = policyHandler.initiateSizeDef(vm.category);
                    // vm.visibleLumpSumCost = false;
                } else if (code === "Container") {
                    vm.visibleType = false;
                    vm.visibleSpecSheet = false;
                    vm.visiblePosition = false;
                    vm.visibleTest = false;
                    vm.visibleDefect = false;
                    vm.visibleMetric = false;
                    vm.visibleContainer = true;
                    vm.visiblePreCaution = false;
                    vm.visibleProductionTime = false;
                    vm.visibleMeasurementPolicy = false;
                    vm.containerDimension = policyHandler.initiateContainerDef(vm.category);
                    // vm.visibleLumpSumCost = false;
                } else if (code === "PreCaution") {
                    vm.visibleType = false;
                    vm.visibleSpecSheet = false;
                    vm.visiblePosition = false;
                    vm.visibleTest = false;
                    vm.visibleDefect = false;
                    vm.visibleMetric = false;
                    vm.visibleContainer = false;
                    vm.visiblePreCaution = true;
                    vm.visibleProductionTime = false;
                    vm.visibleMeasurementPolicy = false;
                    // vm.visibleLumpSumCost = false;
                } else if (code === "ProductionTime") {
                    vm.visibleType = false;
                    vm.visibleSpecSheet = false;
                    vm.visiblePosition = false;
                    vm.visibleTest = false;
                    vm.visibleDefect = false;
                    vm.visibleMetric = false;
                    vm.visibleContainer = false;
                    vm.visiblePreCaution = false;
                    vm.visibleProductionTime = true;
                    vm.visibleMeasurementPolicy = false;
                    // vm.visibleLumpSumCost = false;
                } else if (code === "MeasurementPolicy") {
                    vm.visibleType = false;
                    vm.visibleSpecSheet = false;
                    vm.visiblePosition = false;
                    vm.visibleTest = false;
                    vm.visibleDefect = false;
                    vm.visibleMetric = false;
                    vm.visibleContainer = false;
                    vm.visiblePreCaution = false;
                    vm.visibleProductionTime = false;
                    vm.visibleMeasurementPolicy = true;
                    // vm.visibleLumpSumCost = false;
                }
                // else if (code === "LumpSumCost") {
                //     vm.visibleType = false;
                //     vm.visibleSpecSheet = false;
                //     vm.visiblePosition = false;
                //     vm.visibleTest = false;
                //     vm.visibleDefect = false;
                //     vm.visibleMetric = false;
                //     vm.visibleContainer = false;
                //     vm.visiblePreCaution = false;
                //     vm.visibleProductionTime = false;
                //     vm.visibleLumpSumCost = true;
                // }
            }
        }

        function expandImage(imageItem) {
            if (!imageItem) {
                return;
            }

            var image = {
                src: imageItem.data,
                alt: imageItem.file,
                info: {
                    title: imageItem.file
                }
            };

            $mdDialog.show({
                controller: "MaxImageDialogController",
                controllerAs: 'vm',
                templateUrl: 'app/common/dialogs/maximize-image/maximize-image-dialog.html',
                parent: angular.element($document.body),
                clickOutsideToClose: true,
                locals: {
                    image: image
                }
            });
        }


        function removeImage(image, images) {
            var index = msbUtilService.getIndex(images, "data", image.data);
            if (index > -1) {
                images.splice(index, 1);
            }
        }

        function selectTestDefinitionDialog() {
            $mdDialog
                .show({
                    controller: "SelectTestMethodDialogController",
                    controllerAs: "vm",
                    clickOutsideToClose: false,
                    preserveScope: true,
                    templateUrl: "app/main/systemsettings/supply-definition/dialog/test-def/select-test.dialog.html",
                    locals: {
                        Tests: getSelectedTest()
                    }
                })
                .then(function (answerTestIds) {
                    if (answerTestIds && vm.category && vm.category.tests) {
                        for (var i = 0; i < answerTestIds.length; i++) {
                            if (answerTestIds[i]) {
                                var testIndex = msbUtilService.getIndex(vm.category.tests, "testId", answerTestIds[i]);
                                if (testIndex === -1) {
                                    var test = {
                                        "TECHDISER_ID": msbUtilService.generateId(),
                                        "testId": answerTestIds[i],
                                        "materialTypes": []
                                    }
                                    vm.category.tests.unshift(test);
                                    selectTestItem(test);
                                    saveSupplyDefinition(true);
                                }
                            }

                        }
                    }
                });
        }

        function getSelectedTest() {
            if (vm.category && vm.category.tests && vm.category.tests.length > 0) {
                var selectedTestIds = [];
                for (var i = 0; i < vm.category.tests.length; i++) {
                    if (vm.category.tests[i]) {
                        selectedTestIds.push(vm.category.tests[i].testId);
                    }
                }
                return selectedTestIds;
            }
        }



        function getTestTitle(testItem) {
            if (testItem && vm.testList && vm.testList.length > 0) {
                var testIndex = msbUtilService.getIndex(vm.testList, PRIMARY_COLUMN_NAME, testItem.testId);
                if (testIndex > -1) {
                    return vm.testList[testIndex].title;
                }
            }
        }

        function getTestDescription(testItem) {
            if (testItem && vm.testList && vm.testList.length > 0) {
                var testIndex = msbUtilService.getIndex(vm.testList, PRIMARY_COLUMN_NAME, testItem.testId);
                if (testIndex > -1) {
                    return vm.testList[testIndex].description;
                }
            }
        }

        function getTestAttributes(testItem) {
            if (testItem && vm.testList && vm.testList.length > 0) {
                var testIndex = msbUtilService.getIndex(vm.testList, PRIMARY_COLUMN_NAME, testItem.testId);
                if (testIndex > -1) {
                    vm.attributes = vm.testList[testIndex].attributes;
                }
            }
        }

        function getTestMethods(testItem) {
            if (testItem && vm.testList && vm.testList.length > 0) {
                var testIndex = msbUtilService.getIndex(vm.testList, PRIMARY_COLUMN_NAME, testItem.testId);
                if (testIndex > -1) {
                    vm.testMethods = vm.testList[testIndex].methods;
                }
            }
        }

        function getTypeWiseTestDefinition() {
            if (vm.category && vm.category.types && vm.selectedTestItem && vm.selectedTestItem.materialTypes) {
                for (var i = 0; i < vm.category.types.length; i++) {
                    var typeIndex = msbUtilService.getIndex(vm.selectedTestItem.materialTypes, "materialTypeId", vm.category.types[i][PRIMARY_COLUMN_NAME]);
                    if (typeIndex === -1) {
                        var materialType = {
                            "TECHDISER_ID": msbUtilService.generateId(),
                            "materialTypeId": vm.category.types[i][PRIMARY_COLUMN_NAME],
                            "isSelectedType": false,
                            "methodIds": [],
                            "attributes": getTestAttributeDefinition()
                        }
                        vm.selectedTestItem.materialTypes.push(materialType);

                    }
                }
            }
        }

        function getTestAttributeDefinition() {
            if (vm.attributes && vm.attributes.length > 0) {
                var attributeList = [];
                for (var j = 0; j < vm.attributes.length; j++) {
                    var attribute = {
                        "TECHDISER_ID": msbUtilService.generateId(),
                        "attributeId": vm.attributes[j][PRIMARY_COLUMN_NAME],
                        "testUnitId": vm.attributes[j].testUnitId,
                        "minRange": 0,
                        "maxRange": 0
                    }
                    attributeList.push(attribute);
                }
                return attributeList;
            }
        }

        function getMaterialTypeTitle(typeId) {
            if (typeId && vm.category && vm.category.types && vm.category.types.length > 0) {
                var typeIdx = msbUtilService.getIndex(vm.category.types, PRIMARY_COLUMN_NAME, typeId);
                if (typeIdx > -1) {
                    return vm.category.types[typeIdx].title;
                }
            }
        }

        function getTestAttributeTitle(attributeId) {
            if (attributeId && vm.attributes && vm.attributes.length > 0) {
                var attributeIndex = msbUtilService.getIndex(vm.attributes, PRIMARY_COLUMN_NAME, attributeId);
                if (attributeIndex > -1) {
                    return vm.attributes[attributeIndex].title;
                }
            }
        }

        function selectTestMethods(type) {
            if (type && type.methodIds && vm.selectedTestItem && vm.selectedTestItem.materialTypes && vm.selectedTestItem.materialTypes.length > 0) {
                var typeIndex = msbUtilService.getIndex(vm.selectedTestItem.materialTypes, PRIMARY_COLUMN_NAME, type[PRIMARY_COLUMN_NAME]);
                if (typeIndex > -1) {
                    if (vm.selectedTestItem.materialTypes[typeIndex]) {
                        vm.selectedTestItem.materialTypes[typeIndex].methodIds = type.methodIds;
                    }
                }
            }
        }

        function defectTypeTitile(defectTypeId) {
            if (defectTypeId && vm.defectTypeDefs && vm.defectTypeDefs.length > 0) {
                var defectTypeIndex = msbUtilService.getIndex(vm.defectTypeDefs, PRIMARY_COLUMN_NAME, defectTypeId);
                if (defectTypeIndex > -1) {
                    return vm.defectTypeDefs[defectTypeIndex].title;
                }
            }
        }

        function addContainerSize() {
            if (vm.selectedContainerItem && vm.containerDimension) {

                if (!vm.selectedContainerItem.sizes) {
                    vm.selectedContainerItem.sizes = [];
                }

                if (vm.containerDimension.unitInfo && vm.containerDimension.matricDimension) {
                    var sizeItemExp = msbMeasurementService.getSizeExpression(vm.containerDimension);
                    var itemIndex = -1;
                    vm.selectedContainerItem.sizes.forEach(function (item, containerItemIndex) {
                        if (item && item.unitSize == sizeItemExp && item.noOfUnits == vm.containerDimension.noOfUnits) {
                            itemIndex = containerItemIndex;
                        }
                    });

                    if (itemIndex < 0) {
                        var info = {};
                        info.TECHDISER_ID = msbUtilService.generateId();
                        info.noOfUnits = vm.containerDimension.noOfUnits;
                        info.unitSize = sizeItemExp;
                        info.dimentionInfo = vm.containerDimension.matricDimension;
                        info.measurementUnitId = msbMeasurementService.getDimensionFromDimensionDef(vm.containerDimension.matricDimension);
                        vm.selectedContainerItem.sizes.unshift(info);
                    }
                }

            }
        }

        function addSizeInfoItem() {
            if (vm.category && vm.itemDimension) {
                if (!vm.category.sizeDef) {
                    vm.category.sizeDef = {};
                    vm.category.sizeDef.TECHDISER_ID = "setupSizeDef" + vm.category.TECHDISER_ID;
                }
                vm.category.sizeDef.dimentionType = vm.itemDimension.matricDimension;
                vm.category.sizeDef.measurementUnitId = msbMeasurementService.getDimensionFromDimensionDef(vm.itemDimension.matricDimension);
                if (!vm.category.sizeDef.sizeInfo) vm.category.sizeDef.sizeInfo = [];
                if (vm.itemDimension.unitInfo) {
                    var sizeItemExp = msbMeasurementService.getSizeExpression(vm.itemDimension);
                    if (vm.category.sizeDef.sizeInfo.indexOf(sizeItemExp) < 0) {
                        vm.category.sizeDef.sizeInfo.unshift(sizeItemExp);
                    }
                }
            }
        }

    }
})();
