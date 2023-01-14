(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('MaterialCheckPointController', MaterialCheckPointController);

    /** @ngInject */
    function MaterialCheckPointController(PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME, $mdDialog,
        msbCommonApiService, duproSetupService, msbUtilService, organizationsDataService,
        MAT_TEST_TYPES) {

        var vm = this;

        vm.materialTestTypes = MAT_TEST_TYPES;
        vm.getTypesByCategoryId = getTypesByCategoryId;
        vm.selectTypeSpecific = selectTypeSpecific;
        vm.getCategoryTypeSpecificDefects = getCategoryTypeSpecificDefects;
        vm.getDefectTitle = getDefectTitle;
        vm.selectDefect = selectDefect;
        vm.selectPreProduction = selectPreProduction;
        vm.selectPreShipmentInspection = selectPreShipmentInspection;
        vm.addDefectDeproInspection = addDefectDeproInspection;
        vm.getDuproInspectionDetail = getDuproInspectionDetail;
        vm.getJobProcessTitle = getJobProcessTitle;
        vm.removeDuproInspection = removeDuproInspection;
        vm.addDefectQcInspection = addDefectQcInspection;
        vm.getDuproQcDetail = getDuproQcDetail;
        vm.removeDuproQc = removeDuproQc;
        vm.selectDefectApproval = selectDefectApproval;
        vm.getApprovalTitle = getApprovalTitle;
        vm.saveMaterialCheckPointDefects = saveMaterialCheckPointDefects;
        vm.getCatalogTitle = getCatalogTitle;
        vm.getCategoryTitle = getCategoryTitle;
        vm.getCategoryTypeTitle = getCategoryTypeTitle;

        init();

        function init() {
            vm.orgId = msbUtilService.getOrganizationId();
            getOrgProductCatalogs();
            vm.isTypeSpecific = 0;
            // getDuproInspections();
            getJobWiseOperations();
            getAllSupplyCategory();
            getDuproInspections();
            getDuproQcs();
            vm.categoryId = "SupplyDefinitionMaterialCategory1";
            vm.typeId = "SupplyDefinitionMaterialType1";
            vm.isTypeSpecific = 1;
        }

        function getAllSupplyCategory() {
            msbCommonApiService.interfaceManager(function (supplyData) {
                if (supplyData) {
                    vm.categoryMaterials = supplyData;
                    getTypesByCategoryId(); // unnecessary
                }
            }, "supplyDefinitionService", "getLeafNodesOfAllSupplyCategory", null);
        }

        function getTypesByCategoryId() {
            var param = { "categoryId": vm.categoryId };
            if (vm.categoryId) {
                duproSetupService.getTypesByCategoryId(function (typeData) {
                    if (typeData) {
                        vm.materialTypes = typeData;
                        getCategoryTypeSpecificDefects(); // unnecessary
                    }
                }, param);
                getCategoryMaterialTypeById();
            }
        }

        function getCategoryMaterialTypeById() {
            var param = { "categoryId": vm.categoryId };
            if (vm.categoryId) {
                duproSetupService.getCategoryMaterialTypeById(function (materialTypeData) {
                    if (materialTypeData) {
                        vm.materialTypeValue = materialTypeData;

                        getMaterialApprovalDefs();
                    } else {
                        vm.materialTypeValue = null;
                    }
                }, param);
            }
        }

        function selectTypeSpecific() {
            if (vm.isTypeSpecific == 0) {
                vm.isTypeSpecific = 1;
            } else {
                vm.isTypeSpecific = 0;
            }
        }

        function getCategoryTypeSpecificDefects() {
            if (vm.categoryId && vm.typeId) {
                var param = { "categoryId": vm.categoryId, "typeId": vm.typeId, "isTypeSpecific": vm.isTypeSpecific };
                duproSetupService.getCategoryTypeSpecificDefects(function (defectDefData) {
                    if (defectDefData) {
                        vm.defectDefIds = defectDefData;
                        getMaterialCheckPointDefects();
                    } else {
                        msbUtilService.showToast("data not found", "warning-toast", 2000);
                    }
                }, param);
            }
            var defectParam = { "materialCategoryId": vm.categoryId };
            duproSetupService.getCategoryDefect(function (defectData) {
                if (defectData) {
                    vm.materialDefects = defectData;
                }
            }, defectParam);

        }

        function getMaterialCheckPointDefects() {
            var checkPointParams = [{ "key": "categoryId", "value": vm.categoryId },
            { "key": "typeId", "value": vm.typeId },
            { "key": "isTypeSpecific", "value": vm.isTypeSpecific }];
            duproSetupService.getMaterialCheckPointDefects(function (defectData) {
                if (defectData) {
                    vm.checkPointDefectDefs = defectData;
                    checkDefectDefInCheckPointDefects();
                }
            }, checkPointParams);
        }

        function checkDefectDefInCheckPointDefects() {
            if (vm.defectDefIds && vm.defectDefIds.length > 0 && vm.checkPointDefectDefs) {
                var checkParam = { "defectDefIds": vm.defectDefIds, "checkPointDefectDefs": vm.checkPointDefectDefs, "categoryId": vm.categoryId, "typeId": vm.typeId, "isTypeSpecific": vm.isTypeSpecific };
                duproSetupService.checkDefectDefInCheckPointDefects(function (cpDefectData) {
                    if (cpDefectData) {
                        vm.checkPointDefects = cpDefectData;
                        selectDefect(vm.checkPointDefects[0]);
                    }
                }, checkParam);
            }
        }

        function getDefectTitle(defectId) {
            if (defectId && vm.materialDefects && vm.materialDefects.length > 0) {
                return duproSetupService.getDefectTitle(defectId, vm.materialDefects);
            }
        }

        function selectDefect(cpDefect) {
            if (cpDefect) {
                updateDefect();
                vm.selectedDefect = angular.copy(cpDefect);

                checkDefectApprovals();
            }
        }

        function selectPreProduction() {
            if (vm.selectedDefect.inspection.isPreProduction == 0) {
                vm.selectedDefect.inspection.isPreProduction = 1;
            } else {
                vm.selectedDefect.inspection.isPreProduction = 0;
            }
        }


        function selectPreShipmentInspection() {
            if (vm.selectedDefect.inspection.isPreShipmentInspection == 0) {
                vm.selectedDefect.inspection.isPreShipmentInspection = 1;
            } else {
                vm.selectedDefect.inspection.isPreShipmentInspection = 0;
            }
        }

        function getDuproInspections() {
            duproSetupService.getDuproInspections(function (inspectionData) {
                if (inspectionData) {
                    vm.duproInspections = inspectionData;
                }
            }, []);
        }

        function addDefectDeproInspection(duproInspection) {
            var param = {
                "duproInspections": vm.duproInspections,
                "checkPointDuproInspection": vm.selectedDefect.inspection.duproInspections
            };
            duproSetupService.addDefectDeproInspection(function (duproInspectionData) {
                if (duproInspectionData) {
                    vm.selectedDefect.inspection.duproInspections = duproInspectionData;
                }
            }, param);
        }

        function getDuproInspectionDetail(duproInspectionId) {
            if (duproInspectionId && vm.duproInspections &&
                vm.duproInspections.length > 0) {
                return duproSetupService.getDuproInspectionDetail(duproInspectionId, vm.duproInspections);
            }
        }

        function getJobProcessTitle(duproInspection, code) {
            if (duproInspection && duproInspection.jobId && vm.jobWiseOperations && vm.jobWiseOperations.length > 0) {
                return duproSetupService.getJobProcessTitle(duproInspection, vm.jobWiseOperations, code);
            }
        }

        function getJobWiseOperations() {
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    vm.jobWiseOperations = data;
                }
            }, "organizationsDataService", "getJobWiseOperations", []);
        }

        function removeDuproInspection(duproInspection, duproInsDefTitle) {
            if (duproInspection && duproInsDefTitle && vm.selectedDefect && vm.selectedDefect.inspection &&
                vm.selectedDefect.inspection.duproInspections && vm.selectedDefect.inspection.duproInspections.length > 0) {
                msbUtilService.confirmAndDelete(null, [{ 'DUPRO Inspection': duproInsDefTitle }], function () {
                    msbUtilService.removeItems(vm.selectedDefect.inspection.duproInspections, duproInspection.TECHDISER_ID);
                });
            }
        }

        function updateDefect() {
            if (vm.selectedDefect && vm.checkPointDefects && vm.checkPointDefects.length > 0) {
                var defectIndex = msbUtilService.getIndex(vm.checkPointDefects, PRIMARY_COLUMN_NAME, vm.selectedDefect[PRIMARY_COLUMN_NAME]);
                if (defectIndex > -1) {
                    vm.checkPointDefects[defectIndex] = vm.selectedDefect;
                }
            }
        }

        function getDuproQcs() {
            duproSetupService.getDuproQcs(function (qcData) {
                if (qcData) {
                    vm.duproQcs = qcData;
                }
            }, []);
        }

        function addDefectQcInspection(duproQc) {
            var param = {
                "duproQcs": vm.duproQcs,
                "checkPointDuproQc": vm.selectedDefect.qualityControls
            };
            duproSetupService.addDefectQcInspection(function (duproQcData) {
                if (duproQcData) {
                    vm.selectedDefect.qualityControls = duproQcData;
                }
            }, param);
        }

        function getDuproQcDetail(duproQcId) {
            if (duproQcId && vm.duproQcs &&
                vm.duproQcs.length > 0) {
                return duproSetupService.getDuproQcDetail(duproQcId, vm.duproQcs);
            }
        }

        function removeDuproQc(duproQc, duproQcDefTitle) {
            if (duproQc && duproQcDefTitle && vm.selectedDefect && vm.selectedDefect.qualityControls &&
                vm.selectedDefect.qualityControls.length > 0) {
                msbUtilService.confirmAndDelete(null, [{ 'DUPRO Qc': duproQcDefTitle }], function () {
                    msbUtilService.removeItems(vm.selectedDefect.qualityControls, duproQc.TECHDISER_ID);
                });
            }
        }

        function getMaterialApprovalDefs() {
            var param = [{ "key": "materialType", "value": vm.materialTypeValue }];
            duproSetupService.getMaterialApprovalDefs(function (materialApprovalData) {
                if (materialApprovalData) {
                    vm.materialApproval = materialApprovalData[0];
                }
            }, param);
        }

        function checkDefectApprovals() {
            if (vm.selectedDefect && vm.materialApproval && vm.materialApproval.defs &&
                vm.materialApproval.defs.length > 0) {
                if (!vm.selectedDefect.approvals) {
                    vm.selectedDefect.approvals = [];
                }
                var checkParam = { "approvals": vm.selectedDefect.approvals, "approvalDefs": vm.materialApproval.defs };
                duproSetupService.checkDefectApprovals(function (approvalData) {
                    if (approvalData) {
                        vm.selectedDefect.approvals = approvalData;
                    }
                }, checkParam);
            }
        }

        function selectDefectApproval(defectApproval) {
            if (defectApproval) {
                if (defectApproval.isSelected == 0) {
                    defectApproval.isSelected = 1;
                } else {
                    defectApproval.isSelected = 0;
                }
            }
        }

        function getApprovalTitle(materialApprovalId) {
            if (materialApprovalId && vm.materialApproval && vm.materialApproval.defs &&
                vm.materialApproval.defs.length > 0 && vm.materialTestTypes &&
                vm.materialTestTypes.length > 0) {
                return duproSetupService.getApprovalTitle(materialApprovalId, vm.materialApproval.defs, vm.materialTestTypes);
            }
        }

        function saveMaterialCheckPointDefects() {
            updateDefect();
            var defectParams = { "dataDefects": vm.checkPointDefects };
            if (vm.checkPointDefects) {
                duproSetupService.saveMaterialCheckPointDefects(function (data) {
                }, defectParams);
            }
        }

        function getOrgProductCatalogs() {
            if (vm.orgId) {
                var catParam = [{ "key": "orgId", "value": vm.orgId }];
                msbCommonApiService.interfaceManager(function (cats) {
                    if (cats) {
                        vm.catalogs = cats;
                    }
                }, "organizationsDataService", "getOrgProductCatalogs", catParam);
            }
        }

        function getCatalogTitle(catalogId) {
            if (catalogId && vm.catalogs && vm.catalogs.length > 0) {
                return duproSetupService.getCatalogTitle(catalogId, vm.catalogs);
            }
        }

        function getCategoryTitle(categoryId) {
            if (categoryId && vm.categoryMaterials && vm.categoryMaterials.length > 0) {
                return duproSetupService.getCategoryTitle(categoryId, vm.categoryMaterials);
            }
        }

        function getCategoryTypeTitle(typeId) {
            if (typeId && vm.materialTypes && vm.materialTypes.length > 0) {
                return duproSetupService.getCategoryTypeTitle(typeId, vm.materialTypes);
            }
        }



    }
})();
