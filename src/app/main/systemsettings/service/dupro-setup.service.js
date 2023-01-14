(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .factory('duproSetupService', duproSetupService);

    /** @ngInject */
    function duproSetupService(msbCommonApiService, msbUtilService, $mdDialog,
        PRIMARY_COLUMN_NAME, deptDirService, workOrderService, goodsReceiveService,
        shipmentTimeService) {

        var services = {
            interfaceDef: interfaceDef,
            getPath: getPath,
            getDuproInspections: getDuproInspections,
            getDuproQcs: getDuproQcs,
            addDuproInspection: addDuproInspection,
            getJobProcessOperations: getJobProcessOperations,
            getCatalogTitle: getCatalogTitle,
            getJobProcessTitle: getJobProcessTitle,
            saveDuproInspection: saveDuproInspection,
            saveDuproQc: saveDuproQc,
            getTypesByCategoryId: getTypesByCategoryId,
            getCategoryTypeSpecificDefects: getCategoryTypeSpecificDefects,
            checkDefectDefInCheckPointDefects: checkDefectDefInCheckPointDefects,
            getMaterialCheckPointDefects: getMaterialCheckPointDefects,
            getCategoryDefect: getCategoryDefect,
            getDefectTitle: getDefectTitle,
            addDefectDeproInspection: addDefectDeproInspection,
            getDuproInspectionDetail: getDuproInspectionDetail,
            addDefectQcInspection: addDefectQcInspection,
            getDuproQcDetail: getDuproQcDetail,
            getMaterialApprovalDefs: getMaterialApprovalDefs,
            getCategoryMaterialTypeById: getCategoryMaterialTypeById,
            checkDefectApprovals: checkDefectApprovals,
            getApprovalTitle: getApprovalTitle,
            saveMaterialCheckPointDefects: saveMaterialCheckPointDefects,
            getDuproInspectionProcessIdByDuproId: getDuproInspectionProcessIdByDuproId,
            getCategoryTitle: getCategoryTitle,
            getCategoryTypeTitle: getCategoryTypeTitle,
            getDuproDefinition: fetchDuproDefinition,

        };

        var paths = {
            duproInspectionPath: "/duproInspections",
            duproQcPath: "/duproQualityControls",
            checkPointDefectsPath: "/[categoryId=$categoryId]/[typeId=$typeId]",
            duproInspectionItemPath: "/duproInspections/[TECHDISER_ID=$duproInspectionDefId]",


        }

        function getPath() {
            return paths;
        }

        function interfaceDef(callBack, taskCode, param) {
            var functions = {

            }
            if (taskCode) {
                functions[taskCode](callBack, param);
            }
        }

        function getDuproInspections(callBack, params) {
            if (msbUtilService.checkUndefined(callBack, params)) {
                msbCommonApiService.getItems("DUPRO_SETUP", null, function (data) {
                    (data) ? callBack(data) : callBack(null);
                }, null, false, null, "clientUrl", paths.duproInspectionPath, params);
            }
        }

        function getDuproQcs(callBack, params) {
            if (msbUtilService.checkUndefined(callBack, params)) {
                msbCommonApiService.getItems("DUPRO_SETUP", null, function (data) {
                    (data) ? callBack(data) : callBack(null);
                }, null, false, null, "clientUrl", paths.duproQcPath, params);
            }
        }

        function addDuproInspection(callBack, param) {
            $mdDialog
                .show({
                    controller: "AddDuproInspectionDialogController",
                    controllerAs: "vm",
                    clickOutsideToClose: false,
                    preserveScope: true,
                    templateUrl: "app/main/systemsettings/dupro-setup/dialog/dupro-inspection-dialog/dupro-inspection-dialog.html",
                    locals: {
                        DuproInspections: param.duproInspections,
                        DuproInspection: param.duproInspection,
                        Catalogs: param.catalogs,
                        mode: param.mode
                    }
                })
                .then(function (inspection) {
                    if (inspection) {
                        if (param.duproInspections) {
                            var inspectionIndex = msbUtilService.getIndex(param.duproInspections, PRIMARY_COLUMN_NAME, inspection.TECHDISER_ID);
                            if (inspectionIndex > -1) {
                                param.duproInspections[inspectionIndex] = inspection;
                            } else {
                                param.duproInspections.push(inspection);
                            }
                            if (callBack) {
                                callBack(param.duproInspections);
                            }
                        }
                    }
                });
        }

        function getJobProcessOperations(jobId, jobWiseOperations) {
            if (jobId, jobWiseOperations) {
                var jobIndex = msbUtilService.getIndex(jobWiseOperations, PRIMARY_COLUMN_NAME, jobId);
                if (jobIndex > -1) {
                    return jobWiseOperations[jobIndex].jobOperations;
                }
            }
        }

        function getCatalogTitle(catalogId, catalogs) {
            var catalogIndex = msbUtilService.getIndex(catalogs, PRIMARY_COLUMN_NAME, catalogId);
            if (catalogIndex > -1) {
                return catalogs[catalogIndex].title;
            }
        }

        function getJobProcessTitle(duproInspection, jobWiseOperations, code) {
            if (code == 'job' && duproInspection.jobId) {
                var jobIndex = msbUtilService.getIndex(jobWiseOperations, PRIMARY_COLUMN_NAME, duproInspection.jobId);
                if (jobIndex > -1) {
                    return jobWiseOperations[jobIndex].title;
                }
            } else if (code == 'process' && duproInspection.jobId && duproInspection.processId) {
                var jobIndex = msbUtilService.getIndex(jobWiseOperations, PRIMARY_COLUMN_NAME, duproInspection.jobId);
                if (jobIndex > -1) {
                    if (jobWiseOperations[jobIndex] && jobWiseOperations[jobIndex].jobOperations &&
                        jobWiseOperations[jobIndex].jobOperations.length > 0) {
                        var processIndex = msbUtilService.getIndex(jobWiseOperations[jobIndex].jobOperations, PRIMARY_COLUMN_NAME, duproInspection.processId);
                        if (processIndex > -1) {
                            return jobWiseOperations[jobIndex].jobOperations[processIndex].title;
                        }
                    }
                }
            }
        }

        function saveDuproInspection(callBack, params) {
            if (msbUtilService.checkUndefined(callBack, params)) {
                var itemId = msbUtilService.searchFromParam(params, "itemId");
                var newData = msbUtilService.searchFromParam(params, "dataInstruction");
                msbCommonApiService.saveInnerItem(itemId, newData, "DUPRO_SETUP",
                    "clientUrl", paths.duproInspectionPath, params, function (data) {
                        (data) ? callBack(data) : callBack(null);
                    }, null, null, false);
            }
        }

        function saveDuproQc(callBack, params) {
            if (msbUtilService.checkUndefined(callBack, params)) {
                var itemId = msbUtilService.searchFromParam(params, "itemId");
                var newData = msbUtilService.searchFromParam(params, "dataQc");
                msbCommonApiService.saveInnerItem(itemId, newData, "DUPRO_SETUP",
                    "clientUrl", paths.duproQcPath, params, function (data) {
                        (data) ? callBack(data) : callBack(null);
                    }, null, null, false);
            }
        }

        function getMaterialCheckPointDefects(callBack, params) {
            if (msbUtilService.checkUndefined(callBack, params)) {
                msbCommonApiService.getItems("MATERIAL_CHECK_POINT", null, function (data) {
                    (data) ? callBack(data) : callBack(null);
                }, null, false, null, "clientUrl", paths.checkPointDefectsPath, params);
            }
        }

        function getTypesByCategoryId(callBack, param) {
            msbCommonApiService.interfaceManager(function (typesData) {
                if (typesData) {
                    callBack(typesData);
                } else {
                    callBack([]);
                }
            }, "supplyDefinitionService", "getTypesByCategoryId", param);
        }

        function getCategoryTypeSpecificDefects(callBack, param) {
            msbCommonApiService.interfaceManager(function (defectIdsData) {
                if (defectIdsData) {
                    callBack(defectIdsData);
                }
            }, "supplyDefinitionService", "getCategoryTypeSpecificDefects", param);
        }

        function checkDefectDefInCheckPointDefects(callBack, param) {
            if (param) {
                if (param.defectDefIds && param.defectDefIds.length > 0) {
                    for (var i = 0; i < param.defectDefIds.length; i++) {
                        var index = msbUtilService.getIndex(param.checkPointDefectDefs, "defectId", param.defectDefIds[i]);
                        if (index === -1) {
                            var defectObj = {
                                "TECHDISER_ID": msbUtilService.generateId(),
                                "TECHDISER_SERIAL_NO": param.checkPointDefectDefs.length + 1,
                                "categoryId": param.categoryId,
                                "typeId": param.typeId,
                                "isTypeSpecific": param.isTypeSpecific,
                                "defectId": param.defectDefIds[i],
                                "inspection": {},
                                "qualityControls": [],
                                "approvals": []
                            }
                            defectObj.inspection.TECHDISER_ID = msbUtilService.generateId();
                            defectObj.inspection.isPreProduction = 0;
                            defectObj.inspection.isPreShipmentInspection = 0;
                            defectObj.inspection.duproInspections = [];
                            param.checkPointDefectDefs.push(defectObj);
                        }
                    }
                    if (callBack) {
                        callBack(param.checkPointDefectDefs);
                    }
                }
            }
        }

        function getCategoryDefect(callBack, param) {
            msbCommonApiService.interfaceManager(function (defectIdsData) {
                if (defectIdsData) {
                    callBack(defectIdsData);
                }
            }, "supplyDefinitionService", "getMaterialDefects", param);
        }

        function getDefectTitle(defectId, materialDefects) {
            if (defectId && materialDefects) {
                var defectIndex = msbUtilService.getIndex(materialDefects, PRIMARY_COLUMN_NAME, defectId);
                if (defectIndex > -1) {
                    return materialDefects[defectIndex].title;
                }
            }
        }

        function addDefectDeproInspection(callBack, param) {
            if (param && param.duproInspections) {
                var selectedDuproIds = getSelectedDuproInspectionIds(param.checkPointDuproInspection);
                var params = {
                    data: param.duproInspections,
                    checkAttr: 'TECHDISER_ID',
                    showAttrs: [{
                        "key": "title",
                        "value": "Title"
                    },
                    {
                        "key": "description",
                        "value": "Description"
                    }],
                    selectionType: 'multiple',
                    selected: selectedDuproIds,
                    returnType: 'reference',
                    dialogTitle: 'Select DUPRO Inspection',
                    filterParams: []
                }
                msbCommonApiService.interfaceManager(function (duproIdsData) {
                    if (duproIdsData && duproIdsData.length > 0) {
                        if (!param.checkPointDuproInspection) {
                            param.checkPointDuproInspection = [];
                        }

                        for (var i = 0; i < duproIdsData.length; i++) {
                            var index = msbUtilService.getIndex(param.checkPointDuproInspection, "duproInspectionId", duproIdsData[i]);
                            if (index === -1) {
                                var duproInspObj = {
                                    "TECHDISER_ID": msbUtilService.generateId(),
                                    "duproInspectionId": duproIdsData[i]
                                }
                                param.checkPointDuproInspection.push(duproInspObj);
                            }
                        }
                        for (var j = param.checkPointDuproInspection.length - 1; j >= 0; j--) {
                            var insIndex = duproIdsData.indexOf(param.checkPointDuproInspection[j].duproInspectionId);
                            if (insIndex === -1) {
                                var dupInsIndex = msbUtilService.getIndex(param.checkPointDuproInspection, "duproInspectionId", param.checkPointDuproInspection[j].duproInspectionId);
                                if (dupInsIndex > -1) {
                                    param.checkPointDuproInspection.splice(dupInsIndex, 1);
                                }
                            }
                        }

                        if (callBack) {
                            callBack(param.checkPointDuproInspection);
                        }

                    }
                }, "organizationsDataService", "commonSelector", params);

            }
        }

        function getSelectedDuproInspectionIds(checkPointDuproInspection) {
            if (checkPointDuproInspection && checkPointDuproInspection.length > 0) {
                var duproInspectionIds = [];
                for (var i = 0; i < checkPointDuproInspection.length; i++) {
                    duproInspectionIds.push(checkPointDuproInspection[i].duproInspectionId);
                }
                return duproInspectionIds;
            }
        }

        function getDuproInspectionDetail(duproInspectionId, duproInspections) {
            var insIndex = msbUtilService.getIndex(duproInspections, PRIMARY_COLUMN_NAME, duproInspectionId);
            if (insIndex > -1) {
                return duproInspections[insIndex];
            }
        }


        function addDefectQcInspection(callBack, param) {
            if (param && param.duproQcs) {
                var selectedDuproIds = getSelectedDuproQcIds(param.checkPointDuproQc);
                var params = {
                    data: param.duproQcs,
                    checkAttr: 'TECHDISER_ID',
                    showAttrs: [{
                        "key": "title",
                        "value": "Title"
                    },
                    {
                        "key": "description",
                        "value": "Description"
                    }],
                    selectionType: 'multiple',
                    selected: selectedDuproIds,
                    returnType: 'reference',
                    dialogTitle: 'Select DUPRO Qc',
                    filterParams: []
                }
                msbCommonApiService.interfaceManager(function (duproIdsData) {
                    if (duproIdsData && duproIdsData.length > 0) {
                        if (!param.checkPointDuproQc) {
                            param.checkPointDuproQc = [];
                        }

                        for (var i = 0; i < duproIdsData.length; i++) {
                            var index = msbUtilService.getIndex(param.checkPointDuproQc, "duproQcId", duproIdsData[i]);
                            if (index === -1) {
                                var duproQcObj = {
                                    "TECHDISER_ID": msbUtilService.generateId(),
                                    "duproQcId": duproIdsData[i]
                                }
                                param.checkPointDuproQc.push(duproQcObj);
                            }
                        }
                        for (var j = param.checkPointDuproQc.length - 1; j >= 0; j--) {
                            var qcIndex = duproIdsData.indexOf(param.checkPointDuproQc[j].duproQcId);
                            if (qcIndex === -1) {
                                var dupQcIndex = msbUtilService.getIndex(param.checkPointDuproQc, "duproQcId", param.checkPointDuproQc[j].duproQcId);
                                if (dupQcIndex > -1) {
                                    param.checkPointDuproQc.splice(dupQcIndex, 1);
                                }
                            }
                        }

                        if (callBack) {
                            callBack(param.checkPointDuproQc);
                        }

                    }
                }, "organizationsDataService", "commonSelector", params);

            }
        }

        function getSelectedDuproQcIds(checkPointDuproInspection) {
            if (checkPointDuproInspection && checkPointDuproInspection.length > 0) {
                var duproInspectionIds = [];
                for (var i = 0; i < checkPointDuproInspection.length; i++) {
                    duproInspectionIds.push(checkPointDuproInspection[i].duproQcId);
                }
                return duproInspectionIds;
            }
        }

        function getDuproQcDetail(duproQcId, duproQcs) {
            var qcIndex = msbUtilService.getIndex(duproQcs, PRIMARY_COLUMN_NAME, duproQcId);
            if (qcIndex > -1) {
                return duproQcs[qcIndex];
            }
        }

        function getMaterialApprovalDefs(callBack, params) {
            if (msbUtilService.checkUndefined(callBack, params)) {
                msbCommonApiService.interfaceManager(function (data) {
                    if (data) {
                        callBack(data);
                    }
                }, "matTestDefService", "getMatAllAppDefs", params);
            }
        }

        function getCategoryMaterialTypeById(callBack, param) {
            msbCommonApiService.interfaceManager(function (typeValue) {
                if (typeValue) {
                    callBack(typeValue);
                } else {
                    callBack(null);
                }
            }, "supplyDefinitionService", "getCategoryMaterialTypeById", param);
        }

        function checkDefectApprovals(callBack, param) {
            if (param) {
                if (param.approvalDefs && param.approvalDefs.length > 0) {
                    for (var i = 0; i < param.approvalDefs.length; i++) {
                        var index = msbUtilService.getIndex(param.approvals, "materialApprovalId", param.approvalDefs[i][PRIMARY_COLUMN_NAME]);
                        if (index === -1) {
                            var approvalObj = {
                                "TECHDISER_ID": msbUtilService.generateId(),
                                "TECHDISER_SERIAL_NO": param.approvals.length + 1,
                                "materialApprovalId": param.approvalDefs[i][PRIMARY_COLUMN_NAME],
                                "isSelected": 0
                            }
                            param.approvals.push(approvalObj);
                        }
                    }
                    if (callBack) {
                        callBack(param.approvals);
                    }
                }
            }
        }

        function getApprovalTitle(materialApprovalId, materialApprovalDefs, materialTestTypes) {
            var approvalIndex = msbUtilService.getIndex(materialApprovalDefs, PRIMARY_COLUMN_NAME, materialApprovalId);
            if (approvalIndex > -1) {
                if (materialApprovalDefs[approvalIndex].testType) {
                    var testTypeIndex = msbUtilService.getIndex(materialTestTypes, "key", materialApprovalDefs[approvalIndex].testType);
                    if (testTypeIndex > -1) {
                        return materialTestTypes[testTypeIndex].value;
                    }
                }
            }
        }

        function saveMaterialCheckPointDefects(callBack, param) {
            if (param) {
                msbCommonApiService.saveItems("MATERIAL_CHECK_POINT", param.dataDefects, function (data) {
                    if (data && callBack) {
                        callBack(data);
                    }
                }, null, null, false, "clientUrl");
            }
        }

        // service to get dupro inspection
        // function getDuproInspections(callBack, param) {
        //   msbCommonApiService.getItems("DUPRO_SETUP", null, function(data) {
        //     if (callBack) {
        //       callBack(data);
        //     }
        //   }, null, false, null, "clientUrl", "/duproInspections", param);
        // }



        function getDuproInspectionProcessIdByDuproId(callBack, params) {
            if (msbUtilService.checkUndefined(callBack, params)) {
                // var duproInspectionDefId = msbUtilService.searchFromParam(params, "duproInspectionDefId");
                msbCommonApiService.getItems("DUPRO_SETUP", null, function (data) {
                    console.log(data);
                    (data && data.processId) ? callBack(data.processId) : callBack(null);
                }, null, false, null, "clientUrl", paths.duproInspectionItemPath, params);
            }
        }

        function getCategoryTitle(categoryId, categoryMaterials) {
            var categoryIndex = msbUtilService.getIndex(categoryMaterials, PRIMARY_COLUMN_NAME, categoryId);
            if (categoryIndex > -1) {
                return categoryMaterials[categoryIndex].title;
            }
        }

        function getCategoryTypeTitle(typeId, materialTypes) {
            var typeIndex = msbUtilService.getIndex(materialTypes, PRIMARY_COLUMN_NAME, typeId);
            if (typeIndex > -1) {
                return materialTypes[typeIndex].title;
            }
        }

        function fetchDuproDefinition(callBack, param) {
            msbCommonApiService.getItems("DUPRO_SETUP", null, function (data) {
                if (data) {
                    callBack(data);
                }
            });
        }


        return services;
    }
})();
