(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller("MaterialPackagingController", MaterialPackagingController);

    function MaterialPackagingController(msbCommonApiService, $mdDialog, msbUtilService,
        PRIMARY_COLUMN_NAME, BLANK_IMAGE, LABEL_POSITION, materialPackagingService) {
        var vm = this;
        vm.materialPackaging = [];
        vm.primaryColumnName = PRIMARY_COLUMN_NAME;
        vm.imgHolder = BLANK_IMAGE;
        vm.labelPositions = LABEL_POSITION;
        vm.selectCategory = selectCategory;
        vm.selectSupplyType = selectSupplyType;
        vm.addUnitContainer = addUnitContainer;
        vm.getUnitContainer = getUnitContainer;
        vm.getContainerTitle = getContainerTitle;
        vm.getContainer = getContainer;
        vm.addContainer = addContainer;
        vm.getSpec = getSpec;
        vm.setAsDefault = setAsDefault;
        vm.setAsDefaultContainer = setAsDefaultContainer;
        vm.save = save;
        vm.getMaterialAttributes = getMaterialAttributes;
        vm.getUnitPackagingAttributes = getUnitPackagingAttributes;
        vm.getContainerPackagingAttributes = getContainerPackagingAttributes;
        vm.getUnitContainers = getUnitContainers;
        vm.getContainers = getContainers;
        vm.addBarcode = addBarcode;
        vm.getBarCodes = getBarCodes;
        vm.removeBarcode = removeBarcode;
        vm.getCautionMark = getCautionMark;
        vm.addLabel = addLabel;
        vm.defineLabelLayout = defineLabelLayout;
        vm.selectLabel = selectLabel;
        vm.getSize = getSize;
        vm.addLevel = addLevel;
        vm.removeLevel = removeLevel;
        vm.setAssortToLevel = setAssortToLevel;
        vm.setCheckAtUnload = setCheckAtUnload;

        init();

        function init() {
            getMaterialPackaging();
        }

        function save() {
            // msbUtilService.downLoadJson(vm.materialPackaging, "materialPackaging");
            var param = {
                "materialPackaging": vm.materialPackaging
            }
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    // vm.materialPackaging = data;
                }
            }, "materialPackagingService", "saveMaterialPackaging", param);
        }

        function getMaterialPackaging() {
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    vm.materialPackaging = data;
                    getSupplyDefinition();
                }
            }, "materialPackagingService", "getMaterialPackaging", null);
        }

        function getSupplyDefinition() {
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    vm.supplies = data;
                    if (vm.supplies && angular.isArray(vm.supplies) && vm.supplies.length > 0) {
                        for (var i = 0; i < vm.supplies.length; i++) {
                            if (vm.supplies[i].typeId == "garmentMaterials") {
                                selectCategory(vm.supplies[i]);
                                break;
                            }
                        }

                    }
                }
            }, "supplyDefinitionService", "getSupplyDefinition", null);
        }

        function selectCategory(supply) {
            vm.selectedSupply = supply;
            vm.supplyTypes = supply.types;
            if (vm.supplyTypes && angular.isArray(vm.supplyTypes) && vm.supplyTypes.length > 0) {
                selectSupplyType(vm.supplyTypes[0]);
            }
        }

        function selectSupplyType(supplyType) {
            vm.selectedSupplyType = supplyType;
            createPackagingObject();
            makeAttributes();
        }

        function createPackagingObject() {
            var index = msbUtilService.getIndex(vm.materialPackaging, "typeId", vm.selectedSupplyType[PRIMARY_COLUMN_NAME]);
            vm.selectedMatPacking = vm.materialPackaging[index];
            if (index < 0) {
                var packagingObj = {
                    "categoryId": vm.selectedSupply[PRIMARY_COLUMN_NAME],
                    "typeId": vm.selectedSupplyType[PRIMARY_COLUMN_NAME],
                    "levels": [{
                        "TECHDISER_ID": msbUtilService.generateId(),
                        "TECHDISER_SERIAL_NO": 1,
                        "levelNo": 1,
                        "isAssort": 1,
                        "containers": []
                    }],
                    "attributes": {
                        "unitPackagingAttributes": [],
                        "containerPackagingAttributes": [],
                        "materialAttributes": [],
                        "packageMarkAttributes": []
                    },
                    "barCodes": [],
                    "labels": []
                };
                packagingObj[PRIMARY_COLUMN_NAME] = msbUtilService.generateId();
                vm.materialPackaging.push(packagingObj);
                vm.selectedMatPacking = vm.materialPackaging[vm.materialPackaging.length - 1];
            }
        }

        function addUnitContainer(level) {
            $mdDialog.show({
                controller: 'UnitContainerDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/main/systemsettings/material-packaging/dialogs/unit/add-unit-container-dialog.html',
                locals: {
                    MaterialCategoryId: vm.selectedSupply.TECHDISER_ID,
                    Supplies: vm.supplies,
                    IsUnitType: true,
                    isContainerType: false,
                    SelectedContainers: level.containers
                }
            })
                .then(function (answer) {
                    if (answer) {
                        for (var i = 0; i < answer.length; i++) {
                            if (answer[i].title == undefined) {
                                answer[i].title = getContainerTitle(answer[i].containerId);
                                answer[i].isdefault = 0;
                                var supplyIndex = msbUtilService.getIndex(vm.supplies, PRIMARY_COLUMN_NAME, answer[i].containerId);
                                if (supplyIndex > -1) {
                                    var dataSheet = vm.supplies[supplyIndex].dataSheet;
                                    answer[i].specs = dataSheet;
                                }
                            }
                        }
                        level.containers = answer;
                        // var index = msbUtilService.getIndex(vm.materialPackaging, "typeId", vm.selectedSupplyType[PRIMARY_COLUMN_NAME]);
                        // if (index > -1) {
                        //   for (var i = 0; i < answer.length; i++) {
                        //     if (!answer[i].unitSize) {
                        //       answer[i].capacity = 0;
                        //     }
                        //     answer[i].title = getContainerTitle(answer[i].containerId);
                        //     var supplyIndex = msbUtilService.getIndex(vm.supplies, PRIMARY_COLUMN_NAME, answer[i].containerId);
                        //     if (supplyIndex > -1) {
                        //       var dataSheet = vm.supplies[supplyIndex].dataSheet;
                        //       answer[i].specs = dataSheet;
                        //     }
                        //   }
                        //   vm.materialPackaging[index].unitPackaging = answer;
                        //   console.log(answer);
                        // }
                        // materialPackagingService.generateContainerAttribute(vm.materialPackaging[index].unitPackaging, vm.materialPackaging[index].attributes.unitPackagingAttributes, "unitPackaging", vm.supplies);

                    }
                });
        }

        function addContainer() {
            $mdDialog.show({
                controller: 'UnitContainerDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/main/systemsettings/material-packaging/dialogs/unit/add-unit-container-dialog.html',
                locals: {
                    MaterialCategoryId: vm.selectedSupply.TECHDISER_ID,
                    Supplies: vm.supplies,
                    IsUnitType: false,
                    isContainerType: true,
                    SelectedContainers: getContainer()
                }
            })
                .then(function (answer) {
                    if (answer) {
                        var index = msbUtilService.getIndex(vm.materialPackaging, "typeId", vm.selectedSupplyType[PRIMARY_COLUMN_NAME]);
                        if (index > -1) {
                            for (var i = 0; i < answer.length; i++) {
                                answer[i].title = getContainerTitle(answer[i].containerId);
                                var supplyIndex = msbUtilService.getIndex(vm.supplies, PRIMARY_COLUMN_NAME, answer[i].containerId);
                                if (supplyIndex > -1) {
                                    var dataSheet = vm.supplies[supplyIndex].dataSheet;
                                    answer[i].specs = dataSheet;
                                }
                            }
                            vm.materialPackaging[index].containerPackaging = answer;
                        }
                        materialPackagingService.generateContainerAttribute(vm.materialPackaging[index].containerPackaging, vm.materialPackaging[index].attributes.containerPackagingAttributes, "containerPackaging", vm.supplies);
                    }
                });
        }

        function getUnitContainer() {
            if (vm.materialPackaging && vm.selectedSupplyType) {
                var index = msbUtilService.getIndex(vm.materialPackaging, "typeId", vm.selectedSupplyType[PRIMARY_COLUMN_NAME]);
                if (index > -1) {
                    console.log(vm.materialPackaging[index].unitPackaging);
                    return vm.materialPackaging[index].unitPackaging;
                }
            }
        }

        function getContainer() {
            if (vm.materialPackaging && vm.selectedSupplyType) {
                var index = msbUtilService.getIndex(vm.materialPackaging, "typeId", vm.selectedSupplyType[PRIMARY_COLUMN_NAME]);
                if (index > -1) {
                    return vm.materialPackaging[index].containerPackaging;
                }
            }
        }

        function getContainerTitle(categoryId) {
            var index = msbUtilService.getIndex(vm.supplies, PRIMARY_COLUMN_NAME, categoryId);
            if (index > -1) {
                return vm.supplies[index].title;
            }
        }

        function getSpec(containerId) {
            var index = msbUtilService.getIndex(vm.supplies, PRIMARY_COLUMN_NAME, containerId);
            if (index > -1) {
                return vm.supplies[index].dataSheet;
            }
        }

        function setAsDefault(containers, container) {
            container.isdefault = 1;
            for (var i = 0; i < containers.length; i++) {
                if (container[PRIMARY_COLUMN_NAME] != containers[i][PRIMARY_COLUMN_NAME]) {
                    containers[i].isdefault = 0;
                }
            }
        }

        function setAsDefaultContainer(container) {
            var containers = getContainer();
            for (var i = 0; i < containers.length; i++) {
                if (container[PRIMARY_COLUMN_NAME] != containers[i][PRIMARY_COLUMN_NAME]) {
                    containers[i].isdefault = false;
                }
            }
            container.isdefault = !container.isdefault;
        }

        function makeAttributes() {
            makePackageMarkingAttributes();
            makeMaterialAttributes();
            //     makeUnitPackingAttributes();
            //     makeContainerPackingAttributes();
        }

        function makePackageMarkingAttributes() {
            if (vm.selectedMatPacking && vm.selectedMatPacking.attributes && vm.selectedMatPacking.attributes.packageMarkAttributes.length < 1) {
                vm.packageMarkAttributes = [];
                var cautionObj = {
                    "TECHDISER_ID": msbUtilService.generateId(),
                    "fromWhere": "caution",
                    "sourceId": "",
                    "attributeKey": "CautionMark",
                    "attributeTitle": "Caution Mark"
                };
                vm.packageMarkAttributes.push(cautionObj);

                var indentificationObj = {
                    "TECHDISER_ID": msbUtilService.generateId(),
                    "fromWhere": "identificationMark",
                    "sourceId": "",
                    "attributeKey": "IdentificationMark",
                    "attributeTitle": "Identification Mark"
                };
                vm.packageMarkAttributes.push(indentificationObj);
                var param = [{
                    "key": "categoryId",
                    "value": vm.selectedSupply[PRIMARY_COLUMN_NAME]
                },
                {
                    "key": "typeId",
                    "value": vm.selectedSupplyType[PRIMARY_COLUMN_NAME]
                }
                ];
                var index = msbUtilService.getIndexByValues(vm.materialPackaging, param);
                if (index > -1) {
                    if (vm.materialPackaging[index].attributes) {
                        vm.materialPackaging[index].attributes.packageMarkAttributes = vm.packageMarkAttributes;
                    } else {
                        vm.materialPackaging[index].attributes = {
                            "packageMarkAttributes": vm.packageMarkAttributes
                        }
                    }
                }
            }
        }

        function makeMaterialAttributes() {
            if (vm.selectedMatPacking && vm.selectedMatPacking.attributes && vm.selectedMatPacking.attributes.materialAttributes.length < 1) {
                if (vm.selectedSupply && vm.selectedSupplyType) {
                    if (vm.selectedSupply.dataSheet) {
                        vm.materialAttributes = [];
                        for (var i = 0; i < vm.selectedSupply.dataSheet.length; i++) {
                            var attributeObj = {
                                "TECHDISER_ID": msbUtilService.generateId(),
                                "fromWhere": "material",
                                "sourceId": vm.selectedSupply[PRIMARY_COLUMN_NAME],
                                "attributeKey": msbUtilService.replaceSpaces(vm.selectedSupply.dataSheet[i]),
                                "attributeTitle": vm.selectedSupply.dataSheet[i]
                            };
                            vm.materialAttributes.push(attributeObj);
                        }
                        var colorAttributeObj = {
                            "TECHDISER_ID": msbUtilService.generateId(),
                            "fromWhere": "material",
                            "sourceId": vm.selectedSupply[PRIMARY_COLUMN_NAME],
                            "attributeKey": "Color",
                            "attributeTitle": "Color"
                        };
                        vm.materialAttributes.push(colorAttributeObj);
                        var sizeAttributeObj = {
                            "TECHDISER_ID": msbUtilService.generateId(),
                            "fromWhere": "material",
                            "sourceId": vm.selectedSupply[PRIMARY_COLUMN_NAME],
                            "attributeKey": "Size",
                            "attributeTitle": "Size"
                        };
                        vm.materialAttributes.push(sizeAttributeObj);
                        var param = [{
                            "key": "categoryId",
                            "value": vm.selectedSupply[PRIMARY_COLUMN_NAME]
                        },
                        {
                            "key": "typeId",
                            "value": vm.selectedSupplyType[PRIMARY_COLUMN_NAME]
                        }
                        ];
                        var index = msbUtilService.getIndexByValues(vm.materialPackaging, param);
                        if (index > -1) {
                            if (vm.materialPackaging[index].attributes) {
                                vm.materialPackaging[index].attributes.materialAttributes = vm.materialAttributes;

                            }
                        }
                    }
                }
            }

        }

        function makeUnitPackingAttributes() {
            if (vm.selectedSupply && vm.selectedSupplyType) {
                var param = [{
                    "key": "categoryId",
                    "value": vm.selectedSupply[PRIMARY_COLUMN_NAME]
                },
                {
                    "key": "typeId",
                    "value": vm.selectedSupplyType[PRIMARY_COLUMN_NAME]
                }
                ];
                var index = msbUtilService.getIndexByValues(vm.materialPackaging, param);
                if (index > -1) {
                    if (vm.materialPackaging[index].unitPackaging) {
                        vm.unitPackagingAttributes = [];
                        for (var i = 0; i < vm.materialPackaging[index].unitPackaging.length; i++) {
                            var attIndex = msbUtilService.getIndex(vm.materialPackaging[index].attributes.unitPackagingAttributes, "unitContainerId", vm.materialPackaging[index].unitPackaging[i].containerId);
                            if (true) {
                                var supplyIndex = msbUtilService.getIndex(vm.supplies, PRIMARY_COLUMN_NAME, vm.materialPackaging[index].unitPackaging[i].containerId);
                                if (supplyIndex > -1) {
                                    for (var j = 0; j < vm.supplies[supplyIndex].dataSheet.length; j++) {
                                        var attributeObj = {
                                            "TECHDISER_ID": msbUtilService.generateId(),
                                            "fromWhere": "unitPackaging",
                                            "sourceId": vm.materialPackaging[index].unitPackaging[i][PRIMARY_COLUMN_NAME],
                                            "attributeKey": msbUtilService.replaceSpaces(vm.supplies[supplyIndex].dataSheet[j]),
                                            "attributeTitle": vm.supplies[supplyIndex].dataSheet[j]
                                        };
                                        if (vm.materialPackaging[index].unitPackaging[i][attributeObj.attributeTitle]) {
                                            attributeObj.attributeValue = vm.materialPackaging[index].unitPackaging[i][attributeObj.attributeTitle];
                                        }
                                        vm.unitPackagingAttributes.push(attributeObj);
                                    }
                                }
                                if (vm.materialPackaging[index].unitPackaging[i].unitSize) {
                                    var attributeObj = {
                                        "TECHDISER_ID": msbUtilService.generateId(),
                                        "fromWhere": "unitPackaging",
                                        "sourceId": vm.materialPackaging[index].unitPackaging[i][PRIMARY_COLUMN_NAME],
                                        "attributeKey": "unitPackUnitSize",
                                        "attributeTitle": "Unit Size",
                                        "attributeValue": vm.materialPackaging[index].unitPackaging[i].unitSize
                                    };
                                    vm.unitPackagingAttributes.push(attributeObj);
                                }
                                if (vm.materialPackaging[index].unitPackaging[i].noOfItemsPerUnit) {
                                    var attributeObj = {
                                        "TECHDISER_ID": msbUtilService.generateId(),
                                        "fromWhere": "unitPackaging",
                                        "sourceId": vm.materialPackaging[index].unitPackaging[i][PRIMARY_COLUMN_NAME],
                                        "attributeKey": "unitPackNoOfItemsPreUnit",
                                        "attributeTitle": "No of Items pre Unit",
                                        "attributeValue": vm.materialPackaging[index].unitPackaging[i].noOfItemsPerUnit
                                    };
                                    vm.unitPackagingAttributes.push(attributeObj);
                                }
                            }
                        }

                        if (vm.materialPackaging[index].attributes) {
                            vm.materialPackaging[index].attributes.unitPackagingAttributes = vm.unitPackagingAttributes;

                        }
                    }
                }
            }

        }

        function makeContainerPackingAttributes() {
            if (vm.selectedSupply && vm.selectedSupplyType) {
                var param = [{
                    "key": "categoryId",
                    "value": vm.selectedSupply[PRIMARY_COLUMN_NAME]
                },
                {
                    "key": "typeId",
                    "value": vm.selectedSupplyType[PRIMARY_COLUMN_NAME]
                }
                ];
                var index = msbUtilService.getIndexByValues(vm.materialPackaging, param);
                if (index > -1) {
                    if (vm.materialPackaging[index].containerPackaging) {
                        vm.containerPackagingAttributes = [];
                        for (var i = 0; i < vm.materialPackaging[index].containerPackaging.length; i++) {
                            var supplyIndex = msbUtilService.getIndex(vm.supplies, PRIMARY_COLUMN_NAME, vm.materialPackaging[index].containerPackaging[i].containerId);
                            if (supplyIndex > -1) {
                                for (var j = 0; j < vm.supplies[supplyIndex].dataSheet.length; j++) {
                                    var attributeObj = {
                                        "TECHDISER_ID": msbUtilService.generateId(),
                                        "fromWhere": "containerPackaging",
                                        "attributeKey": msbUtilService.replaceSpaces(vm.supplies[supplyIndex].dataSheet[j]),
                                        "sourceId": vm.materialPackaging[index].containerPackaging[i][PRIMARY_COLUMN_NAME],
                                        "attributeTitle": vm.supplies[supplyIndex].dataSheet[j]
                                    };
                                    if (vm.materialPackaging[index].containerPackaging[i][attributeObj.attributeTitle]) {
                                        attributeObj.attributeValue = vm.materialPackaging[index].containerPackaging[i][attributeObj.attributeTitle];
                                    }
                                    vm.containerPackagingAttributes.push(attributeObj);
                                }
                            }
                            if (vm.materialPackaging[index].containerPackaging[i].unitSize) {
                                var attributeObj = {
                                    "TECHDISER_ID": msbUtilService.generateId(),
                                    "fromWhere": "containerPackaging",
                                    "sourceId": vm.materialPackaging[index].containerPackaging[i][PRIMARY_COLUMN_NAME],
                                    "attributeKey": "contUnitSize",
                                    "attributeTitle": "Unit Size",
                                    "attributeValue": vm.materialPackaging[index].containerPackaging[i].unitSize
                                };
                                vm.containerPackagingAttributes.push(attributeObj);
                            }
                            if (vm.materialPackaging[index].containerPackaging[i].noOfItemsPerUnit) {
                                var attributeObj = {
                                    "TECHDISER_ID": msbUtilService.generateId(),
                                    "fromWhere": "containerPackaging",
                                    "sourceId": vm.materialPackaging[index].containerPackaging[i][PRIMARY_COLUMN_NAME],
                                    "attributeKey": "contNoOfItemsPreUnit",
                                    "attributeTitle": "No of Items pre Unit",
                                    "attributeValue": vm.materialPackaging[index].containerPackaging[i].noOfItemsPerUnit
                                };
                                vm.containerPackagingAttributes.push(attributeObj);
                            }
                        }

                        if (vm.materialPackaging[index].attributes) {
                            vm.materialPackaging[index].attributes.containerPackagingAttributes = vm.containerPackagingAttributes;

                        }
                    }
                }
            }
        }

        function getMaterialAttributes() {
            if (vm.selectedSupply && vm.selectedSupplyType) {
                var param = [{
                    "key": "categoryId",
                    "value": vm.selectedSupply[PRIMARY_COLUMN_NAME]
                },
                {
                    "key": "typeId",
                    "value": vm.selectedSupplyType[PRIMARY_COLUMN_NAME]
                }
                ];
                var index = msbUtilService.getIndexByValues(vm.materialPackaging, param);
                if (index > -1) {
                    return vm.materialPackaging[index].attributes.materialAttributes;
                }
            }
        }

        function getUnitPackagingAttributes() {
            if (vm.selectedSupply && vm.selectedSupplyType) {
                var param = [{
                    "key": "categoryId",
                    "value": vm.selectedSupply[PRIMARY_COLUMN_NAME]
                },
                {
                    "key": "typeId",
                    "value": vm.selectedSupplyType[PRIMARY_COLUMN_NAME]
                }
                ];
                var index = msbUtilService.getIndexByValues(vm.materialPackaging, param);
                if (index > -1) {
                    return vm.materialPackaging[index].attributes.unitPackagingAttributes;
                }
            }
        }

        function getContainerPackagingAttributes() {
            if (vm.selectedSupply && vm.selectedSupplyType) {
                var param = [{
                    "key": "categoryId",
                    "value": vm.selectedSupply[PRIMARY_COLUMN_NAME]
                },
                {
                    "key": "typeId",
                    "value": vm.selectedSupplyType[PRIMARY_COLUMN_NAME]
                }
                ];
                var index = msbUtilService.getIndexByValues(vm.materialPackaging, param);
                if (index > -1) {
                    return vm.materialPackaging[index].attributes.containerPackagingAttributes;
                }
            }
        }

        function getUnitContainers() {
            if (vm.selectedSupply && vm.selectedSupplyType) {
                var param = [{
                    "key": "categoryId",
                    "value": vm.selectedSupply[PRIMARY_COLUMN_NAME]
                },
                {
                    "key": "typeId",
                    "value": vm.selectedSupplyType[PRIMARY_COLUMN_NAME]
                }
                ];
                var index = msbUtilService.getIndexByValues(vm.materialPackaging, param);
                if (index > -1) {
                    return vm.materialPackaging[index].unitPackaging;
                }
            }
        }

        function getContainers() {
            if (vm.selectedSupply && vm.selectedSupplyType) {
                var param = [{
                    "key": "categoryId",
                    "value": vm.selectedSupply[PRIMARY_COLUMN_NAME]
                },
                {
                    "key": "typeId",
                    "value": vm.selectedSupplyType[PRIMARY_COLUMN_NAME]
                }
                ];
                var index = msbUtilService.getIndexByValues(vm.materialPackaging, param);
                if (index > -1) {
                    return vm.materialPackaging[index].containerPackaging;
                }
            }
        }

        function addBarcode(isNew, barcode) {
            $mdDialog.show({
                controller: 'AddBarCodeDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/main/systemsettings/material-packaging/dialogs/add-barcode/add-barcode-dialog.html',
                locals: {
                    Barcode: barcode,
                    GetMaterialAttributes: vm.getMaterialAttributes,
                    GetUnitContainers: vm.getUnitContainers,
                    GetContainerTitle: vm.getContainerTitle,
                    GetUnitPackagingAttributes: vm.getUnitPackagingAttributes,
                    GetContainers: vm.getContainers,
                    GetContainerPackagingAttributes: vm.getContainerPackagingAttributes,
                    GetCautionMark: getCautionMark,
                    GetPackageMarkAttributes: getPackageMarkAttributes
                }
            })
                .then(function (answer) {
                    if (answer) {
                        var param = [{
                            "key": "categoryId",
                            "value": vm.selectedSupply[PRIMARY_COLUMN_NAME]
                        },
                        {
                            "key": "typeId",
                            "value": vm.selectedSupplyType[PRIMARY_COLUMN_NAME]
                        }
                        ];
                        var index = msbUtilService.getIndexByValues(vm.materialPackaging, param);
                        if (index > -1 && isNew) {
                            answer[PRIMARY_COLUMN_NAME] = msbUtilService.generateId();
                            vm.materialPackaging[index].barCodes.unshift(answer);
                            makeBarcodeAttribute(answer);
                        } else if (index > -1 && !isNew) {
                            var barIndex = msbUtilService.getIndex(vm.materialPackaging[index].barCodes, PRIMARY_COLUMN_NAME, answer[PRIMARY_COLUMN_NAME]);
                            if (barIndex > -1) {
                                vm.materialPackaging[index].barCodes[barIndex] = answer;
                            }
                        }
                    }
                });
        }

        function makeBarcodeAttribute(barcode) {
            var barcodeAttributeObj = {
                "TECHDISER_ID": msbUtilService.generateId(),
                "fromWhere": "barcode",
                "barcodeId": barcode[PRIMARY_COLUMN_NAME],
                "attributeKey": msbUtilService.replaceSpaces(barcode.title),
                "attributeTitle": barcode.title
            };
            if (!vm.selectedMatPacking.attributes.barcodeAttributes) {
                vm.selectedMatPacking.attributes.barcodeAttributes = [];
            }
            vm.selectedMatPacking.attributes.barcodeAttributes.push(barcodeAttributeObj);
        }

        function getBarCodes() {
            if (vm.selectedSupply && vm.selectedSupplyType) {
                var param = [{
                    "key": "categoryId",
                    "value": vm.selectedSupply[PRIMARY_COLUMN_NAME]
                },
                {
                    "key": "typeId",
                    "value": vm.selectedSupplyType[PRIMARY_COLUMN_NAME]
                }
                ];
                var index = msbUtilService.getIndexByValues(vm.materialPackaging, param);
                if (index > -1) {
                    return vm.materialPackaging[index].barCodes;
                }
            }
        }

        function removeBarcode(barcode) {
            if (vm.selectedSupply && vm.selectedSupplyType) {
                var param = [{
                    "key": "categoryId",
                    "value": vm.selectedSupply[PRIMARY_COLUMN_NAME]
                },
                {
                    "key": "typeId",
                    "value": vm.selectedSupplyType[PRIMARY_COLUMN_NAME]
                }
                ];
                var index = msbUtilService.getIndexByValues(vm.materialPackaging, param);
                if (index > -1) {
                    var barIndex = msbUtilService.getIndex(vm.materialPackaging[index].barCodes, PRIMARY_COLUMN_NAME, barcode[PRIMARY_COLUMN_NAME]);
                    if (barIndex > -1) {
                        vm.materialPackaging[index].barCodes.splice(barIndex, 1);
                    }
                }
            }
        }

        function getCautionMark() {
            if (vm.supplies && vm.selectedSupply && vm.selectedSupplyType) {
                var index = msbUtilService.getIndex(vm.supplies, PRIMARY_COLUMN_NAME, vm.selectedSupply[PRIMARY_COLUMN_NAME]);
                if (index > -1) {
                    var cautionMark = vm.supplies[index].preCautionMarks;
                    var cautionMarkArr = [];
                    if (angular.isArray(cautionMark)) {
                        for (var i = 0; i < cautionMark.length; i++) {
                            var isExist = false;
                            for (var j = 0; j < cautionMark[i].materialTypeIds.length; j++) {
                                if (cautionMark[i].materialTypeIds[j] == vm.selectedSupplyType[PRIMARY_COLUMN_NAME]) {
                                    isExist = true;
                                    break;
                                }
                            }
                            if (isExist) {
                                cautionMarkArr.push(cautionMark[i]);
                            }
                        }
                    }
                    return cautionMarkArr;
                }
            }
        }

        function getPackageMarkAttributes() {
            if (vm.selectedSupply && vm.selectedSupplyType) {
                var param = [{
                    "key": "categoryId",
                    "value": vm.selectedSupply[PRIMARY_COLUMN_NAME]
                },
                {
                    "key": "typeId",
                    "value": vm.selectedSupplyType[PRIMARY_COLUMN_NAME]
                }
                ];
                var index = msbUtilService.getIndexByValues(vm.materialPackaging, param);
                if (index > -1) {
                    return vm.materialPackaging[index].attributes.packageMarkAttributes;
                }
            }
        }

        function addLabel() {
            var labelObj = {
                "TECHDISER_ID": msbUtilService.generateId(),
                "title": ""
            };
            var param = [{
                "key": "categoryId",
                "value": vm.selectedSupply[PRIMARY_COLUMN_NAME]
            },
            {
                "key": "typeId",
                "value": vm.selectedSupplyType[PRIMARY_COLUMN_NAME]
            }
            ];
            var index = msbUtilService.getIndexByValues(vm.materialPackaging, param);
            if (index > -1) {
                labelObj.title = "Label " + (vm.materialPackaging[index].labels.length + 1)
                vm.materialPackaging[index].labels.push(labelObj);
            } else {
                vm.materialPackaging[index].labels = [];
                labelObj.title = "Label " + (vm.materialPackaging[index].labels.length + 1)
                vm.materialPackaging[index].labels.push(labelObj);
            }
        }

        function defineLabelLayout(label) {
            var param = {
                "label": label,
                "attributes": vm.selectedMatPacking.attributes
            }
            msbCommonApiService.interfaceManager(function (label) {
                if (label) {

                }
            }, "materialPackagingService", "defineLabelLayout", param);
        }

        function selectLabel(container) {
            materialPackagingService.selectLabel(function (labels) {
                if (labels) {
                    container.labels = angular.copy(labels);
                    console.log(labels);
                }
            }, vm.selectedMatPacking.labels, container.labels)
        }

        function getSize(containerId) {
            return materialPackagingService.getSize(vm.supplies, vm.selectedMatPacking.categoryId, containerId);
            // if (vm.supplies && vm.selectedMatPacking) {
            //     var index = msbUtilService.getIndex(vm.supplies, PRIMARY_COLUMN_NAME, vm.selectedMatPacking.categoryId);
            //     if (index > -1) {
            //          var contIndex = msbUtilService.getIndex(vm.supplies[index].containers, "containerId", containerId);
            //          if (contIndex > -1) {
            //              return vm.supplies[index].containers[contIndex].sizes;
            //          }
            //     }
            // }

        }

        function addLevel(levels) {
            var newLevel = {
                "TECHDISER_ID": msbUtilService.generateId(),
                "TECHDISER_SERIAL_NO": levels.length + 1,
                "levelNo": levels.length + 1,
                "isAssort": 0,
                "containers": []
            }
            levels.push(newLevel);
        }

        function removeLevel(level, levels) {
            var index = msbUtilService.getIndex(levels, PRIMARY_COLUMN_NAME, level[PRIMARY_COLUMN_NAME]);
            if (index > -1) {
                levels.splice(index, 1);
            }
        }

        function setAssortToLevel(index, levels) {
            if (index == 0) {
                levels[0].isAssort = 1;
                if (levels.length > 1) {
                    levels[1].isAssort = 0;
                }
            } else if (index == 1) {
                levels[1].isAssort = 1;
                levels[0].isAssort = 0;
            }
        }

        function setCheckAtUnload(selectedMatPacking) {
            if (selectedMatPacking.isCheckAtUnload == 1) {
                selectedMatPacking.isCheckAtUnload = 0;
            } else if (selectedMatPacking.isCheckAtUnload == 0 || selectedMatPacking.isCheckAtUnload == undefined) {
                selectedMatPacking.isCheckAtUnload = 1;
            }
        }
    }
})();
