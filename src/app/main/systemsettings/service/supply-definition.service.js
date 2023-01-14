(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .factory('supplyDefinitionService', supplyDefinitionService);

    /** @ngInject */
    function supplyDefinitionService($mdDialog, msbUtilService, msbCommonApiService,
        PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME, SOURCING_TYPE, SEARCH_PATH_PARAM, MAT_TYPES) {
        var services = {
            interfaceDef: interfaceDef
        };

        function interfaceDef(callBack, taskCode, param) {
            var functions = {
                getSupplyDefinition: fetchSupplyDefinition,
                saveSupplyDefinition: saveSupplyDefinition,
                getCostingHeads: fetchCostingHeads,
                getCostingHeadById: fetchCostingHeadById,
                getLeafNodesOfCostingHeads: fetchLeafNodesOfCostingHeads,
                getLeafNodesOfAllSupplyCategory: fetchLeafNodesOfAllSupplyCategory,
                getLeafNodesOfAllSupplyCategoryForContext: fetchLeafNodesOfAllSupplyCategoryForContext,
                getAllCuttableCategories: fetchAllCuttableCategories,
                getAllCountableCategories: fetchAllCountableCategories,
                getAllStitches: fetchAllStitches,
                getAllTests: fetchAllTests,
                selectTestDialog: selectTestDialog,
                getAllCategoriesByType: fetchAllCategoriesByType,
                getProductionTimeWhereCategoryTypeAndQuantity: getProductionTimeWhereCategoryTypeAndQuantity,
                getTestAttributesMaxMinWhereCategoryIdTypeIdTestId: getTestAttributesMaxMinWhereCategoryIdTypeIdTestId,
                getPackagingContainers: getPackagingContainers,
                getPackagingMaterials: getPackagingMaterials,
                getMaterialContainers: getMaterialContainers,
                getTypeWiseMaterials: getTypeWiseMaterials,
                getPresentationsForStakeholderService: getPresentationsForStakeholderService,
                getPresentationsForJobDefinition: getPresentationsForJobDefinition,
                getSourcingTypes: getSourcingTypes,
                getMaterialDefects: getMaterialDefects,
                getAllDefectTypes: getAllDefectTypes,
                getMaterialDefectsByDefectType: getMaterialDefectsByDefectType,
                getTypesByCategoryId: getTypesByCategoryId,
                getCategoryTypeSpecificDefects: getCategoryTypeSpecificDefects,
                getCategoryMaterialTypeById: getCategoryMaterialTypeById,
                getMaterialsDefectList: getMaterialsDefectList,
                getCategoryByConsTypes: getCategoryByConsTypes,
                getCategoryByMatTypes: getCategoryByMatTypes,
                makeMaterialGroupBySourcingType: makeMaterialGroupBySourcingType
            }
            if (taskCode && functions[taskCode]) {
                functions[taskCode](callBack, param);
            } else {
                console.log("Undefined Taskcode: " + taskCode);
            }
        }

        function makeMaterialGroupBySourcingType(callBack, param) {
            if (param && param.materials) {
                var materials = param.materials;
                var needPres = param.needPres;
                fetchLeafNodesOfAllSupplyCategoryForContext(function (data) {
                    if (data) {
                        data.sort(function (a, b) {
                            return a.TECHDISER_SERIAL_NO - b.TECHDISER_SERIAL_NO;
                        });
                        var allCat = [];
                        data.forEach(function (cat) {
                            if (needPres == 1) {
                                if (cat.typeId == 'garmentMaterials' || cat.typeId == 'presentation') {
                                    var newCat = {
                                        "TECHDISER_ID": msbUtilService.generateId(),
                                        "TECHDISER_SERIAL_NO": allCat.length + 1,
                                        "title": cat.title,
                                        "categoryId": cat.TECHDISER_ID,
                                        "categoryTypeId": cat.typeId,
                                        "materialType": cat.materialType,
                                        "sourcingTypeId": cat.sourcingTypeId,
                                        "materials": getCatMats(cat.TECHDISER_ID, materials)
                                    }
                                    allCat.push(newCat);
                                }
                            }
                            else {
                                if (cat.typeId == 'garmentMaterials') {
                                    var newCat = {
                                        "TECHDISER_ID": msbUtilService.generateId(),
                                        "TECHDISER_SERIAL_NO": allCat.length + 1,
                                        "title": cat.title,
                                        "categoryId": cat.TECHDISER_ID,
                                        "materialType": cat.materialType,
                                        "categoryTypeId": cat.typeId,
                                        "sourcingTypeId": cat.sourcingTypeId,
                                        "materials": getCatMats(cat.TECHDISER_ID, materials)
                                    }
                                    allCat.push(newCat);
                                }
                            }

                        });
                        if (callBack) {
                            allCat.sort(function (a, b) {
                                return b.TECHDISER_SERIAL_NO - a.TECHDISER_SERIAL_NO;
                            });
                            callBack(allCat);
                        }
                    }
                }, null);
            }
        }



        function getCatMats(catId, mats) {
            if (catId && mats) {
                var items = msbUtilService.getItemsByProperties(mats, [{ "key": "categoryId", "value": catId }]);
                return items;
            }
        }

        function getCategoryByConsTypes(callback, params) {
            if (params && callback) {
                var categories = [];
                var consTypes = msbUtilService.searchFromParam(params, "consTypes");
                if (consTypes) {
                    MAT_TYPES.forEach(function (item) {
                        if (item && item.key && item.consType && consTypes.indexOf(item.consType) >= 0) {
                            categories.push(item.key);
                        }
                    });
                }
                callback(categories);
            }
        }

        function getCategoryByMatTypes(callback, params) {
            if (params && callback) {
                var categories = [];
                var consTypes = msbUtilService.searchFromParam(params, "matTypes");
                if (consTypes) {
                    MAT_TYPES.forEach(function (item) {
                        if (item && item.key && item.consType && consTypes.indexOf(item.consType) >= 0) {
                            categories.push(item.key);
                        }
                    });
                }
                callback(categories);
            }
        }

        function saveSupplyDefinition(callBack, param) {

            if (param) {
                // msbCommonApiService.saveItems("SUPPLY_DEFINITION", param.supplyData, function (data) {
                //     if (data) {
                //         if(callBack){
                //             callBack(data);
                //         }
                //     }
                //
                // });
                msbCommonApiService.saveItem(param.supplyData, param.isNew, "SUPPLY_DEFINITION", function (data) {
                    if (data && callBack) {
                        callBack(data);
                    }

                }, null, false, null, "clientUrl", true);
            }

        }

        function fetchSupplyDefinition(callBack, param) {

            var path_param = msbUtilService.searchFromParam(param, SEARCH_PATH_PARAM);

            msbCommonApiService.getItems("SUPPLY_DEFINITION", null, function (data) {
                if (data) {
                    callBack(data);
                }
            }, null, null, null, null, path_param, param
            );

        }

        function fetchCostingHeads(callBack, param) {
            msbCommonApiService.getItems("COSTING_HEADS", null, function (data) {
                if (data) {
                    callBack(data);
                }
            });
        }

        function fetchCostingHeadById(callBack, param) {
            if (param && param.length > 0) {
                // var headId = msbUtilService.searchFromParam(param, "headId");
                // if (headId) {
                msbCommonApiService.getItems("COSTING_HEADS", null, function (data) {
                    if (data) {
                        callBack(data);
                    }
                }, null, false, null, "clientUrl", "/[TECHDISER_ID=$headId]", param);
                // }
            }
        }

        function fetchLeafNodesOfCostingHeads(callBack, param) {
            msbCommonApiService.getItems("COSTING_HEADS", null, function (data) {
                if (data) {
                    var costingHeads = data;
                    var leafNodeList = [];
                    if (costingHeads) {
                        for (var i = 0; i < costingHeads.length; i++) {
                            var catId = msbUtilService.getIndex(costingHeads, "parentId", costingHeads[i].TECHDISER_ID);
                            if (catId < 0) {
                                leafNodeList.push(costingHeads[i]);
                            }
                        }
                    }
                    callBack(leafNodeList);
                }
            });
        }

        function fetchLeafNodesOfAllSupplyCategory(callBack, param) {
            // this service for style-enquiry
            msbCommonApiService.getItems("SUPPLY_DEFINITION", null, function (data) {
                if (data) {
                    var supplies = data;
                    var suppliyCategories = [];
                    if (supplies && supplies.length > 0) {
                        for (var i = 0; i < supplies.length; i++) {
                            var catId = msbUtilService.getIndex(supplies, "parentId", supplies[i].TECHDISER_ID);
                            if (catId < 0) {
                                var catObj = {
                                    "TECHDISER_ID": supplies[i].TECHDISER_ID,
                                    "title": supplies[i].title
                                };
                                suppliyCategories.unshift(catObj);
                            }
                        }
                    }
                    callBack(suppliyCategories);
                }
            });
        }

        function fetchLeafNodesOfAllSupplyCategoryForContext(callBack, param) {
            // this service for style-context
            msbCommonApiService.getItems("SUPPLY_DEFINITION", null, function (data) {
                if (data) {
                    var supplies = data;
                    var suppliyCategories = [];
                    if (supplies && supplies.length > 0) {
                        for (var i = 0; i < supplies.length; i++) {
                            var catId = msbUtilService.getIndex(supplies, "parentId", supplies[i].TECHDISER_ID);
                            if (catId < 0) {
                                suppliyCategories.push(supplies[i]);
                            }
                        }
                    }
                    callBack(suppliyCategories);
                }
            });
        }

        function fetchAllCuttableCategories(callBack) {
            // this service for cuttable category
            msbCommonApiService.getItems("SUPPLY_DEFINITION", null, function (cuttableData) {
                if (cuttableData) {

                    var cuttableItems = msbUtilService.getItemsByProperties(cuttableData, [{
                        "key": "cuttable",
                        "value": true
                    }]);
                    if (cuttableItems && cuttableItems.length > 0) {

                        callBack(cuttableItems);
                    }
                }
            });
        }

        function fetchAllCountableCategories(callBack) {
            // this service for countable category
            msbCommonApiService.getItems("SUPPLY_DEFINITION", null, function (countableData) {
                if (countableData) {

                    var countableItems = msbUtilService.getItemsByProperties(countableData, [{
                        "key": "countable",
                        "value": true
                    }]);
                    if (countableItems && countableItems.length > 0) {

                        callBack(countableItems);
                    }
                }
            });
        }

        function fetchAllStitches(callBack) {
            msbCommonApiService.getItems("STITCHES", null, function (data) {
                if (data) {
                    callBack(data);
                }
            });
        }

        function fetchAllTests(callBack) {
            // this service for all tests [out dated]
            msbCommonApiService.getItems("SUPPLY_DEFINITION", null, function (data) {
                if (data) {
                    var supplies = data;
                    var allTests = [];
                    if (supplies && supplies.length > 0) {
                        for (var i = 0; i < supplies.length; i++) {
                            if (supplies[i].tests && supplies[i].tests.length > 0) {
                                for (var j = 0; j < supplies[i].tests.length; j++) {
                                    allTests.push(supplies[i].tests[j]);
                                }
                            }
                        }
                    }
                    callBack(allTests);
                }
            });
        }

        function selectTestDialog(callBack, param) {
            $mdDialog.show({
                controller: 'SelectTestController',
                controllerAs: 'vm',
                templateUrl: 'app/main/purchaseorders/dialogs/test-selection/select-test-selection-dailog.html',
                skipHide: true,
                locals: {
                    TestIds: param.testIds,
                    IsTestMethod: param.isTestMethod
                }
            })
                .then(function (answer) {
                    if (answer && callBack) {
                        callBack(answer);
                    }
                });
        }


        function fetchAllCategoriesByType(callBack, param) {
            // this service for countable category
            msbCommonApiService.getItems("SUPPLY_DEFINITION", null, function (data) {
                if (data) {

                    var typeItems = msbUtilService.getItemsByProperties(data, [{
                        "key": "typeId",
                        "value": param.typeId
                    }]);
                    if (typeItems && typeItems.length > 0) {

                        callBack(typeItems);
                    }
                }
            });
        }

        // function getAllCategory(vm){
        //     commonApiService.getItems(vm, "SUPPLY_DEFINITION", "supplies", false, function(){
        //         commonApiService.getItems(vm, "SUPPLY_SERVICE", "supplyServices", false, function(){
        //             vm.catList = [];
        //             if(vm && vm.supplies && vm.supplyServices){
        //                 for (var i = 0; i < vm.supplies.length; i++) {
        //                     var catId = utilService.getIndex(vm.supplies, "parentId", vm.supplies[i].TECHDISER_ID);
        //                     if(catId < 0){
        //                         vm.category = {
        //                             "TECHDISER_ID": vm.supplies[i].TECHDISER_ID,
        //                             "title": vm.supplies[i].title,
        //                             "type": "Material"
        //                         };
        //                         vm.catList.push(vm.category);
        //                     }
        //                 }
        //                 for (var i = 0; i < vm.supplyServices.length; i++) {
        //                     var catId = utilService.getIndex(vm.supplyServices, "parentId", vm.supplyServices[i].TECHDISER_ID);
        //                     if(catId < 0){
        //                         vm.category = {
        //                             "TECHDISER_ID": vm.supplyServices[i].TECHDISER_ID,
        //                             "title": vm.supplyServices[i].title,
        //                             "type": "Service"
        //                         };
        //                         vm.catList.push(vm.category);
        //                     }
        //                 }
        //             }
        //             console.log(vm.catList);
        //         });
        //     });
        //     return vm.catList;
        // }

        /* To get Production Time where we have to pass materialCategoryId, typeId and quantity */

        function getProductionTimeWhereCategoryTypeAndQuantity(callBack, param) {
            if (callBack && param) {
                msbCommonApiService.interfaceManager(function (data) {
                    if (data) {
                        var supplies = data;

                        var materialCategoryId = param.materialCategoryId;
                        var materialTypeId = param.materialTypeId;
                        var materialQuantity = param.materialQuantity;

                        var matIndex = msbUtilService.getIndex(supplies, PRIMARY_COLUMN_NAME, materialCategoryId);
                        if (matIndex > -1) {
                            if (supplies[matIndex].productionTimes && supplies[matIndex].productionTimes.length > 0) {
                                var typeQuantity = [];
                                for (var i = 0; i < supplies[matIndex].productionTimes.length; i++) {
                                    var typeIds = supplies[matIndex].productionTimes[i].materialTypeIds;
                                    if (typeIds && typeIds.length > 0) {
                                        var tupeIndex = typeIds.indexOf(materialTypeId);
                                        if (tupeIndex > -1) {
                                            typeQuantity.push(supplies[matIndex].productionTimes[i]);
                                        }
                                    }
                                }
                                if (typeQuantity && typeQuantity.length > 0) {
                                    typeQuantity.sort(function (a, b) {
                                        return a - b;
                                    });
                                    for (var m = 0; m < typeQuantity.length; m++) {
                                        if (callBack) {
                                            if (typeQuantity[m] && typeQuantity[m].quantity * 1 === materialQuantity) {
                                                callBack(typeQuantity[m].timeDays);
                                                break;
                                            } else if ((typeQuantity[m].quantity * 1 != materialQuantity) && (typeQuantity[m].quantity * 1 > materialQuantity)) {
                                                callBack(typeQuantity[m].timeDays);
                                                break;
                                            } else {
                                                callBack(null);
                                            }
                                        }

                                    }

                                }
                            }
                        }
                    }
                }, "supplyDefinitionService", "getSupplyDefinition", null);

            }
        }

        // get Attributes Max Min where categoryId, testId and typeId
        function getTestAttributesMaxMinWhereCategoryIdTypeIdTestId(callBack, param) {
            if (callBack && param) {
                msbCommonApiService.interfaceManager(function (data) {
                    if (data) {
                        var supplies = data;

                        var categoryId = param.categoryId;
                        var typeId = param.typeId;
                        var testId = param.testId;

                        var categoryIndex = msbUtilService.getIndex(supplies, PRIMARY_COLUMN_NAME, categoryId);
                        if (categoryIndex > -1) {
                            if (supplies[categoryIndex].tests && supplies[categoryIndex].tests.length > 0) {
                                var testIndex = msbUtilService.getIndex(supplies[categoryIndex].tests, "testId", testId);
                                if (testIndex > -1) {
                                    if (supplies[categoryIndex].tests[testIndex].materialTypes && supplies[categoryIndex].tests[testIndex].materialTypes.length > 0) {
                                        var typeIndex = msbUtilService.getIndex(supplies[categoryIndex].tests[testIndex].materialTypes, "materialTypeId", typeId);
                                        if (typeIndex > -1) {
                                            if (supplies[categoryIndex].tests[testIndex].materialTypes[typeIndex].attributes) {
                                                callBack(supplies[categoryIndex].tests[testIndex].materialTypes[typeIndex].attributes);
                                            } else {
                                                callBack([]);
                                            }
                                        } else {
                                            callBack([]);
                                        }

                                    }
                                }
                            }
                        }
                    }
                }, "supplyDefinitionService", "getSupplyDefinition", null);

            }
        }

        // get Packaging Container
        function getPackagingContainers(callBack, param) {
            if (callBack) {
                msbCommonApiService.interfaceManager(function (data) {
                    if (data) {
                        var supplies = data;

                        var param = [{
                            "key": "typeId",
                            "value": "packContainer"
                        }];

                        var containerItems = msbUtilService.getItemsByProperties(supplies, param);
                        if (containerItems && containerItems.length > 0) {
                            callBack(containerItems);
                        } else {
                            callBack([]);
                        }

                    }
                }, "supplyDefinitionService", "getSupplyDefinition", null);

            }
        }

        function getPackagingMaterials(callBack, param) {
            if (callBack) {
                msbCommonApiService.interfaceManager(function (data) {
                    if (data) {
                        var supplies = data;

                        var param = [{
                            "key": "typeId",
                            "value": "packingMaterials"
                        }];

                        var containerItems = msbUtilService.getItemsByProperties(supplies, param);
                        if (containerItems && containerItems.length > 0) {
                            callBack(containerItems);
                        } else {
                            callBack([]);
                        }

                    }
                }, "supplyDefinitionService", "getSupplyDefinition", null);

            }
        }

        // get Material Containers
        function getMaterialContainers(callBack, param) {
            if (callBack && param) {

                msbCommonApiService.interfaceManager(function (containerData) {
                    if (containerData) {
                        var containers = containerData;

                        msbCommonApiService.interfaceManager(function (data) {
                            if (data) {
                                var supplies = data;


                                var categoryId = param.categoryId;
                                var isUnitType = param.isUnitType;
                                var isContainerType = param.isContainerType;

                                var categoryIndex = msbUtilService.getIndex(supplies, PRIMARY_COLUMN_NAME, categoryId);
                                if (categoryIndex > -1) {
                                    if (supplies[categoryIndex].containers && supplies[categoryIndex].containers.length > 0) {
                                        var containersArr = [];
                                        if (isUnitType === true) {

                                            for (var i = 0; i < supplies[categoryIndex].containers.length; i++) {
                                                var conIndex = msbUtilService.getIndex(containers, PRIMARY_COLUMN_NAME, supplies[categoryIndex].containers[i].containerId);
                                                if (conIndex > -1) {
                                                    if (containers[conIndex].isUnitType === true) {
                                                        containersArr.push(supplies[categoryIndex].containers[i]);
                                                    }
                                                }
                                            }
                                        } else if (isContainerType === true) {
                                            for (var i = 0; i < supplies[categoryIndex].containers.length; i++) {
                                                var conIndex = msbUtilService.getIndex(containers, PRIMARY_COLUMN_NAME, supplies[categoryIndex].containers[i].containerId);
                                                if (conIndex > -1) {
                                                    if (containers[conIndex].isContainerType === true) {
                                                        containersArr.push(supplies[categoryIndex].containers[i]);
                                                    }
                                                }
                                            }
                                        }
                                        callBack(containersArr);
                                    }
                                } else {
                                    callBack([]);
                                }
                            }
                        }, "supplyDefinitionService", "getSupplyDefinition", null);
                    }

                }, "supplyDefinitionService", "getPackagingContainers", null);


            }
        }

        // get type wise materials
        function getTypeWiseMaterials(callBack, param) {

            if (callBack && param) {
                msbCommonApiService.interfaceManager(function (data) {
                    if (data) {
                        var supplies = data;

                        var containerItems = msbUtilService.getItemsByProperties(supplies, param);
                        if (containerItems && containerItems.length > 0) {
                            callBack(containerItems);
                        } else {
                            callBack([]);
                        }

                    }
                }, "supplyDefinitionService", "getSupplyDefinition", null);
            }

        }

        // get presentation types for Stakeholders Service
        function getPresentationsForStakeholderService(callBack, param) {

            if (callBack) {
                msbCommonApiService.interfaceManager(function (data) {
                    if (data) {
                        var supplies = data;
                        var param = [{
                            "key": "typeId",
                            "value": "presentation"
                        }];

                        var presentationItems = msbUtilService.getItemsByProperties(supplies, param);
                        if (presentationItems && presentationItems.length > 0) {
                            for (var i = 0; i < presentationItems.length; i++) {
                                presentationItems[i].isSupply = 1;
                            }
                            callBack(presentationItems);
                        } else {
                            callBack([]);
                        }

                    }
                }, "supplyDefinitionService", "getSupplyDefinition", null);
            }
        }

        // get presentation types for Job Definition
        function getPresentationsForJobDefinition(callBack, param) {

            if (callBack && param) {
                msbCommonApiService.interfaceManager(function (data) {
                    if (data) {
                        var supplies = data;
                        var catelogId = param.catelogId;
                        var materialTypeId = param.materialTypeId;
                        var paramSrc = [{
                            "key": "typeId",
                            "value": materialTypeId
                        }];

                        var presentationItems = msbUtilService.getItemsByProperties(supplies, paramSrc);
                        var presentationArr = [];
                        if (presentationItems && presentationItems.length > 0) {

                            for (var i = 0; i < presentationItems.length; i++) {
                                var presentationObj = {
                                    "TECHDISER_ID": presentationItems[i][PRIMARY_COLUMN_NAME] + "|" + catelogId,
                                    "title": presentationItems[i].title
                                }
                                presentationArr.push(presentationObj);
                                // presentationItems[i][PRIMARY_COLUMN_NAME] = presentationItems[i][PRIMARY_COLUMN_NAME] +"|"+ catelogId;
                            }
                            callBack(presentationArr);
                        } else {
                            callBack([]);
                        }

                    }
                }, "supplyDefinitionService", "getSupplyDefinition", null);
            }
        }

        // get Sourcing types
        function getSourcingTypes(callBack, param) {

            if (callBack) {
                callBack(SOURCING_TYPE);
            }
        }

        // get Material Defects
        function getMaterialDefects(callBack, param) {
            if (callBack) {
                msbCommonApiService.interfaceManager(function (data) {
                    if (data) {
                        var supplies = data;

                        var materialCategoryId = param.materialCategoryId;

                        var matIndex = msbUtilService.getIndex(supplies, PRIMARY_COLUMN_NAME, materialCategoryId);
                        if (matIndex > -1) {
                            if (supplies[matIndex] && supplies[matIndex].defectDef && supplies[matIndex].defectDef.length > 0) {
                                callBack(supplies[matIndex].defectDef);
                            }
                        } else {
                            callBack([]);
                        }

                    }
                }, "supplyDefinitionService", "getSupplyDefinition", null);
            }
        }

        function getAllDefectTypes(callBack, param) {
            msbCommonApiService.getItems("DEFECT_DEFINITION", null, function (data) {
                if (data) {
                    var piHeads = data;
                    callBack(piHeads);
                }
            });
        }

        function getMaterialDefectsByDefectType(callBack, param) {
            if (callBack) {
                msbCommonApiService.interfaceManager(function (data) {
                    if (data) {
                        var supplies = data;

                        var materialCategoryId = param.materialCategoryId;
                        var materialTypeId = param.materialTypeId;
                        var defectTypeId = param.defectTypeId;

                        var matIndex = msbUtilService.getIndex(supplies, PRIMARY_COLUMN_NAME, materialCategoryId);
                        if (matIndex > -1) {
                            if (supplies[matIndex] && supplies[matIndex].defectDef && supplies[matIndex].defectDef.length > 0) {
                                var defecItems = msbUtilService.getItemsByProperties(supplies[matIndex].defectDef, [{ "key": "defectTypeId", "value": defectTypeId }]);
                                if (defecItems && defecItems.length > 0) {
                                    var defects = [];
                                    for (var i = 0; i < defecItems.length; i++) {
                                        var matTypeIndex = defecItems[i].materialTypeIds.indexOf(materialTypeId);
                                        if (matTypeIndex > -1) {
                                            defects.push(defecItems[i]);
                                        }
                                    }
                                }

                                callBack(defects);
                            }
                        } else {
                            callBack([]);
                        }

                    }
                }, "supplyDefinitionService", "getSupplyDefinition", null);
            }
        }

        function getTypesByCategoryId(callBack, param) {
            if (callBack) {
                msbCommonApiService.interfaceManager(function (data) {
                    if (data) {
                        var supplies = data;

                        var materialCategoryId = param.categoryId;

                        var matIndex = msbUtilService.getIndex(supplies, PRIMARY_COLUMN_NAME, materialCategoryId);
                        if (matIndex > -1) {
                            if (supplies[matIndex] && supplies[matIndex].types &&
                                supplies[matIndex].types.length > 0) {
                                callBack(supplies[matIndex].types);
                            } else {
                                callBack([]);
                            }
                        } else {
                            callBack([]);
                        }

                    }
                }, "supplyDefinitionService", "getSupplyDefinition", null);
            }
        }

        function getCategoryTypeSpecificDefects(callBack, param) {
            if (callBack) {
                msbCommonApiService.interfaceManager(function (data) {
                    if (data) {
                        var supplies = data;

                        var materialCategoryId = param.categoryId;
                        var materialTypeId = param.typeId;
                        var isTypeSpecific = param.isTypeSpecific;

                        var matIndex = msbUtilService.getIndex(supplies, PRIMARY_COLUMN_NAME, materialCategoryId);
                        if (matIndex > -1 && isTypeSpecific == 0) {
                            if (supplies[matIndex] && supplies[matIndex].genericDefectIds &&
                                supplies[matIndex].genericDefectIds.length > 0) {
                                callBack(supplies[matIndex].genericDefectIds);
                            } else {
                                callBack([]);
                            }
                        } else if (matIndex > -1 && isTypeSpecific == 1) {
                            var defectIds = [];
                            if (supplies[matIndex].defectDef && supplies[matIndex].defectDef.length > 0) {
                                for (var i = 0; i < supplies[matIndex].defectDef.length; i++) {
                                    if (supplies[matIndex].defectDef[i] && supplies[matIndex].defectDef[i].materialTypeIds &&
                                        supplies[matIndex].defectDef[i].materialTypeIds.length > 0) {
                                        var typeIndex = supplies[matIndex].defectDef[i].materialTypeIds.indexOf(materialTypeId);
                                        if (typeIndex > -1) {
                                            defectIds.push(supplies[matIndex].defectDef[i][PRIMARY_COLUMN_NAME]);
                                        }
                                    }
                                }
                            }
                            if (supplies[matIndex] && supplies[matIndex].genericDefectIds &&
                                supplies[matIndex].genericDefectIds.length > 0) {
                                // defectIds = defectIds.concat(supplies[matIndex].genericDefectIds);
                                for (var j = 0; j < supplies[matIndex].genericDefectIds.length; j++) {
                                    var defectIndex = defectIds.indexOf(supplies[matIndex].genericDefectIds[j]);
                                    if (defectIndex == -1) {
                                        defectIds.push(supplies[matIndex].genericDefectIds[j]);
                                    }
                                }
                            }
                            callBack(defectIds);
                        }

                    }
                }, "supplyDefinitionService", "getSupplyDefinition", null);
            }
        }

        function getCategoryMaterialTypeById(callBack, param) {
            if (callBack) {
                msbCommonApiService.interfaceManager(function (data) {
                    if (data) {
                        var supplies = data;

                        var materialCategoryId = param.categoryId;

                        var matIndex = msbUtilService.getIndex(supplies, PRIMARY_COLUMN_NAME, materialCategoryId);
                        if (matIndex > -1) {
                            if (supplies[matIndex] && supplies[matIndex].materialType) {
                                callBack(supplies[matIndex].materialType);
                            } else {
                                callBack(null);
                            }
                        } else {
                            callBack(null);
                        }

                    }
                }, "supplyDefinitionService", "getSupplyDefinition", null);
            }
        }

        // get Material Defects
        function getMaterialsDefectList(callBack, param) {
            if (callBack) {
                msbCommonApiService.interfaceManager(function (data) {
                    if (data) {
                        var supplies = data;

                        var jobIds = param.jobIds;
                        var defectList = [];
                        for (var i = 0; i < jobIds.length; i++) {
                            if (jobIds[i]) {
                                var defectObj = {};
                                defectObj.jobId = jobIds[i];
                                defectObj.defects = [];
                                var matIndex = msbUtilService.getIndex(supplies, PRIMARY_COLUMN_NAME, jobIds[i]);
                                if (matIndex > -1) {
                                    if (supplies[matIndex] && supplies[matIndex].defectDef && supplies[matIndex].defectDef.length > 0) {
                                        defectObj.defects = supplies[matIndex].defectDef;
                                    }
                                }
                                defectList.push(defectObj);
                            }
                        }
                        callBack(defectList);

                    }
                }, "supplyDefinitionService", "getSupplyDefinition", null);
            }
        }

        return services;
    }
})();
