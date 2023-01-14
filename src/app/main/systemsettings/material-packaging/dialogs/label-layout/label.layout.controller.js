(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('LabelLayoutController', LabelLayoutController);

    /** @ngInject */
    function LabelLayoutController(msbUtilService, msbCommonApiService, $scope, $mdDialog, $rootScope, $document,
        PRIMARY_COLUMN_NAME, $state, Label, Attributes) {
        var vm = this;
        vm.label = Label;
        vm.matAttributes = angular.copy(Attributes);

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
        vm.setStripDef = setStripDef;



        vm.strips = [];


        init()

        function init() {
            if (vm.label.labelColumns) {
                vm.labelColumns = vm.label.labelColumns;
            } else {
                vm.label.labelColumns = [];
                vm.labelColumns = vm.label.labelColumns;
            }
            if (vm.label.stripObject) {
                vm.stripObject = vm.label.stripObject;
            } else {
                vm.label.stripObject = {
                    "TECHDISER_ID": msbUtilService.generateId()
                };
                vm.stripObject = vm.label.stripObject;
            }
            if (vm.label.stripDef) {
                vm.stripDef = vm.label.stripDef;
            } else {
                vm.label.stripDef = {
                    "parameters": [],
                    "formTemplate": {}
                };
                vm.stripDef = vm.label.stripDef;
            }
        }

        function setStripDef() {
            vm.stripDef.formTemplate = vm.label.template;
            console.log(vm.label.template);
        }


        function onDrop(event, ui) {
            var dragInfo = ui.draggable.scope().dragInfo;
            var vSegment = $(event.target).scope().vSegment;
            if (dragInfo.type == 'static') {
                vSegment.type = dragInfo.type;
                vSegment.value = dragInfo.attr.attributeTitle;

                addLabelColumnAndStripObj(dragInfo.attr, vSegment);

            } else if (dragInfo.type == 'staticText') {
                vSegment.type = 'static';
                vSegment.value = dragInfo.staticText.text;
            }
        }

        function addLabelColumnAndStripObj(attribute, vSegment) {
            if (vSegment.attributeId) {
                var index = msbUtilService.getIndex(vm.labelColumns, "attributeId", vSegment.attributeId);
                if (index > -1) {
                    if (vm.stripObject[vm.labelColumns[index].propertyCode]) {
                        delete vm.stripObject[vm.labelColumns[index].propertyCode];
                    }
                    vm.labelColumns.splice(index, 1);

                }
            }
            vm.stripObject[attribute.attributeKey] = attribute.attributeTitle;

            vSegment.attributeId = attribute[PRIMARY_COLUMN_NAME];
            var columnObj = {
                "attributeId": attribute[PRIMARY_COLUMN_NAME],
                "controlType": "label",
                "label": attribute.attributeTitle,
                "propertyCode": attribute.attributeKey,
                "showInForm": true,
                "type": "keyVal"
            };
            vm.labelColumns.push(columnObj);
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
