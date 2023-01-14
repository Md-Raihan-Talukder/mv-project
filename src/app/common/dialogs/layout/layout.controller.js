(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('LayoutDialogController', LayoutDialogController);

    /** @ngInject */
    function LayoutDialogController(msbUtilService, msbCommonApiService, $scope, $mdDialog, $rootScope, $document,
        PRIMARY_COLUMN_NAME, $state, Label, Barcodes, Images, FromWhere) {
        var vm = this;
        vm.label = Label;
        vm.fromWhere = FromWhere;

        vm.renderData = renderData;
        vm.onDrop = onDrop;
        vm.closeDialog = closeDialog;
        vm.onOk = OK;
        vm.createNewRow = createNewRow;
        vm.addNewColumn = addNewColumn;
        vm.removeRow = removeRow;
        vm.addNewHSegment = addNewHSegment;
        vm.removeColumn = removeColumn;
        vm.addNewVSegment = addNewVSegment;
        vm.removeHsegment = removeHsegment;
        vm.addDef = addDef;
        vm.removeVsegment = removeVsegment;
        vm.addStyle = addStyle;
        $scope.staticText = { text: "" };

        init()

        function init() {
            vm.projectId = $state.params.id;
            getProject();

            getList();

            prepareBarcode();
            prepareImage();
        }

        function prepareImage() {
            if (Images && angular.isArray(Images)) {
                vm.images = [];
                for (var i = 0; i < Images.length; i++) {
                    var obj = {
                        "barcodeId": Images[i].TECHDISER_ID,
                        "label": Images[i].title,
                        "propertyCode": msbUtilService.replaceSpaces(Images[i].title),
                        "showInForm": true,
                        "imageData": { file: "", data: Images[i].data },
                        "controlType": "image",
                        "type": "barcode"
                    };
                    vm.images.push(obj);
                }
            }
        }

        function prepareBarcode() {
            if (Barcodes && angular.isArray(Barcodes)) {
                vm.barcodes = [];
                for (var i = 0; i < Barcodes.length; i++) {
                    var obj = {
                        "barcodeId": Barcodes[i].TECHDISER_ID,
                        "label": Barcodes[i].title,
                        "propertyCode": msbUtilService.replaceSpaces(Barcodes[i].title),
                        "showInForm": true,
                        "imageData": { file: "", data: Barcodes[i].imageData },
                        "controlType": "image",
                        "type": "barcode"
                    };
                    vm.barcodes.push(obj);
                }
            }
        }

        function getProject() {
            msbCommonApiService.interfaceManager(function (data) {
                vm.project = data;
                vm.projectContextRefId = data.basicInfo.projectContextRefId;
                getProjectInfoLog();
            }, "projectDataService", "getProject", vm.projectId);
        }

        function getProjectInfoLog() {
            var params = [
                { "key": "projectId", "value": vm.projectId },
                { "key": "projectInfoLogId", "value": vm.projectContextRefId }
            ];
            msbCommonApiService.interfaceManager(function (data) {
                vm.garmentPackaging = data.garmentPackaging;
                vm.assortPackets = data.garmentPackaging[0].assortPackaging.packets;
            }, "projectDataService", "getProjectInfoLogOld", params);
        }

        function getList() {
            msbCommonApiService.interfaceManager(function (data) {
                vm.labelAttributes = data;
                renderData();
            }, "packing-service", "getAttributeList", null);
        }

        function renderData() {
            //    var param = vm.label.attributes;
            var param = vm.labelAttributes;
            msbCommonApiService.interfaceManager(function (data) {
                vm.attributes = data;
                getLabelObj(data);
            }, "packing-service", "getAttributeData", param);

            console.log(vm.labelColumns);
            console.log(vm.strips);
            console.log(vm.rowHeight);
            console.log(vm.stripObject);
            console.log(vm.stripDef);
        }

        function getLabelObj(attributes) {
            var obj = { "TECHDISER_ID": "11" };
            for (var i = 0; i < attributes.length; i++) {
                obj[attributes[i].key] = attributes[i].value;
            }
            //    vm.labelColumns = vm.label.attributes;
            vm.labelColumns = vm.labelAttributes;
            vm.strips = [];
            vm.stripObject = obj;
            vm.stripDef = {
                "parameters": [],
                "formTemplate": vm.label.template
            };
        }

        function onDrop(event, ui) {
            var dragInfo = ui.draggable.scope().dragInfo;
            var vSegment = $(event.target).scope().vSegment;
            if (dragInfo.type == 'static') {
                vSegment.type = dragInfo.type;
                vSegment.value = dragInfo.attr.label;
            } else if (dragInfo.type == 'column') {
                vSegment.type = dragInfo.type;
                vSegment.colPropertyCode = dragInfo.attr.key;
            } else if (dragInfo.type == 'staticText') {
                vSegment.type = 'static';
                vSegment.value = dragInfo.staticText.text;
            } else if (dragInfo.type == 'assortSummary') {
                vSegment.type = 'static';
                vSegment.value = dragInfo.attr.summary;
            } else if (dragInfo.type == 'barcode') {
                var isExist = false;
                for (var i = 0; i < vm.labelColumns.length; i++) {
                    if (vm.labelColumns[i].propertyCode == dragInfo.attr.propertyCode) {
                        isExist = true;
                        break;
                    }
                }
                if (!isExist) {
                    vm.labelColumns.push(angular.copy(dragInfo.attr));
                    vm.stripObject[dragInfo.attr.propertyCode] = dragInfo.attr.imageData;
                }
                // var index = msbUtilService.getIndex(vm.labelColumns, "propertyCode", dragInfo.attr.propertyCode);
                // if(index < 0){
                //     vm.labelColumns.push(angular.copy(dragInfo.attr));
                //     vm.stripObject[dragInfo.attr.propertyCode] = dragInfo.attr.imageData;
                // }

                vSegment.type = 'column';
                vSegment.colPropertyCode = dragInfo.attr.propertyCode;
            }
        }

        function createNewRow() {
            if (!vm.label.template) {
                vm.label.template = {
                    "layoutType": "flat",
                    "rows": []
                }
            }
            var row = {
                columns: [createNewColumn()]
            }
            row[PRIMARY_COLUMN_NAME] = msbUtilService.generateId();

            vm.label.template.rows.push(row);
        }

        function createNewColumn() {
            var vSegment = {
                type: 'text',
                dataSource: 'static',
                dataValue: 'New segment'
            };
            vSegment[PRIMARY_COLUMN_NAME] = msbUtilService.generateId();

            var hSegment = {
                vSegments: [vSegment]
            }
            hSegment[PRIMARY_COLUMN_NAME] = msbUtilService.generateId();

            var column = {
                hSegments: [hSegment]
            }
            column[PRIMARY_COLUMN_NAME] = msbUtilService.generateId();

            return column;
        }


        function addNewVSegment(event, hSegment) {
            $rootScope.unSaveState = true;
            hSegment.vSegments.push(createVSegment());
        }

        function createVSegment() {
            var vSegment = {
                type: 'text',
                dataSource: 'static',
                dataValue: 'New segment'
            };
            vSegment[PRIMARY_COLUMN_NAME] = msbUtilService.generateId();

            return vSegment;
        }

        function addNewHSegment(event, col) {
            $rootScope.unSaveState = true;
            col.hSegments.push(createHSegment());
        }

        function createHSegment() {
            var hSegment = {
                vSegments: [createVSegment()]
            };
            hSegment[PRIMARY_COLUMN_NAME] = msbUtilService.generateId();
            return hSegment;

        }



        function addNewColumn(event, row) {
            $rootScope.unSaveState = true;
            row.columns.push(createNewColumn());
        }

        function removeRow(event, template, row) {
            if (template && angular.isArray(template.rows)) {
                var index = msbUtilService.getIndex(template.rows, PRIMARY_COLUMN_NAME, row[PRIMARY_COLUMN_NAME]);
                if (index > -1) {
                    template.rows.splice(index, 1);
                }
            }
        }

        function removeColumn(event, row, column) {
            if (row && angular.isArray(row.columns)) {
                var index = msbUtilService.getIndex(row.columns, PRIMARY_COLUMN_NAME, column[PRIMARY_COLUMN_NAME]);
                if (index > -1) {
                    row.columns.splice(index, 1);
                }
            }
        }

        function removeHsegment(event, column, hSegment) {
            if (column && angular.isArray(column.hSegments)) {
                var index = msbUtilService.getIndex(column.hSegments, PRIMARY_COLUMN_NAME, hSegment[PRIMARY_COLUMN_NAME]);
                if (index > -1) {
                    column.hSegments.splice(index, 1);
                }
            }
        }

        function addDef(event, vSegment) {

        }

        function removeVsegment(event, hSegment, vSegment) {
            if (hSegment && angular.isArray(hSegment.vSegments)) {
                var index = msbUtilService.getIndex(hSegment.vSegments, PRIMARY_COLUMN_NAME, vSegment[PRIMARY_COLUMN_NAME]);
                if (index > -1) {
                    hSegment.vSegments.splice(index, 1);
                }
            }
        }

        function addStyle(row, column, hSegment, vSegment, type) {
            $mdDialog.show({
                controller: 'AddStyleDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/common/dialogs/add-style/add-style-dialog.html',
                parent: angular.element($document.body),
                clickOutsideToClose: false,
                preserveScope: true,
                multiple: true,
                skipHide: true,
                locals: {
                    VSegment: vSegment,
                    HSegment: hSegment,
                    Column: column,
                    Row: row,
                    Type: type
                }
            }).then(function (answer) {
                if (type == 'row') {
                    row.style = answer.style;
                } else if (type == 'column') {
                    column.style = answer.style;
                } else if (type == 'hSegment') {
                    hSegment.style = answer.style;
                } else if (type == 'vSegment') {
                    vSegment.style = answer.style;
                }
            });
        }



        function OK() {
            renderData();
            vm.label.labelColumns = vm.labelColumns;
            vm.label.stripObject = vm.stripObject;
            vm.label.stripDef = vm.stripDef;
            $mdDialog.hide(vm.label);
        }

        function closeDialog() {
            $mdDialog.hide();
        }

    }

})();
