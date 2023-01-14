(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('materialPackagingService', materialPackagingService);

    /** @ngInject */
    function materialPackagingService(msbUtilService, msbCommonApiService, $mdDialog,
        UNIT, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME) {


        var services = {
            interfaceDef: interfaceDef,
            getMaterialPackaging: getMaterialPackaging,
            saveMaterialPackaging: saveMaterialPackaging,
            defineLabelLayout: defineLabelLayout,
            generateContainerAttribute: generateContainerAttribute,
            selectLabel: selectLabel,
            addOrRemoveLabel: addOrRemoveLabel,
            checkLabelExist: checkLabelExist,
            closeDialog: closeDialog,
            selectLabelDialogOk: selectLabelDialogOk,
            getSize: getSize
        };


        function interfaceDef(callBack, taskCode, param) {
            if (taskCode) {
                services[taskCode](callBack, param);
            }
        }

        function getSize(supplies, categoryId, containerId) {
            if (supplies) {
                var index = msbUtilService.getIndex(supplies, PRIMARY_COLUMN_NAME, categoryId);
                if (index > -1) {
                    var contIndex = msbUtilService.getIndex(supplies[index].containers, "containerId", containerId);
                    if (contIndex > -1) {
                        return supplies[index].containers[contIndex].sizes;
                    }
                }
            }
        }

        function selectLabelDialogOk(labels) {
            $mdDialog.hide(labels);
        }

        function closeDialog() {
            $mdDialog.hide();
        }

        function checkLabelExist(labels, label) {
            var index = msbUtilService.getIndex(labels, PRIMARY_COLUMN_NAME, label[PRIMARY_COLUMN_NAME]);
            if (index > -1) {
                return true;
            } else {
                return false;
            }
        }

        function addOrRemoveLabel(labels, label) {
            var index = msbUtilService.getIndex(labels, PRIMARY_COLUMN_NAME, label[PRIMARY_COLUMN_NAME]);
            if (index > -1) {
                labels.splice(index, 1);
            } else {
                labels.push(label);
            }
        }

        function selectLabel(callBack, labels, selectedLabels) {
            $mdDialog.show({
                controller: 'SelectPackageLabelDialogController',
                controllerAs: 'vm',
                skipHide: true,
                templateUrl: 'app/main/systemsettings/material-packaging/dialogs/select-label/select-label.html',
                locals: {
                    Labels: labels,
                    SelectedLabels: selectedLabels
                }
            })
                .then(function (answer) {
                    if (answer) {
                        callBack(answer);
                    }
                });
        }

        function generateContainerAttribute(containers, contAttributes, packageType, supplies) {
            if (containers && angular.isArray(containers)) {
                for (var i = 0; i < containers.length; i++) {
                    var index = msbUtilService.getIndex(contAttributes, "containerId", containers[i].containerId);
                    if (index < 0) {
                        for (var j = 0; j < containers[i].specs.length; j++) {
                            var attributeObj = {
                                "TECHDISER_ID": msbUtilService.generateId(),
                                "fromWhere": packageType,
                                "sourceId": containers[i][PRIMARY_COLUMN_NAME],
                                "containerId": containers[i].containerId,
                                "attributeKey": msbUtilService.replaceSpaces(containers[i].specs[j]),
                                "attributeTitle": containers[i].specs[j]
                            };
                            contAttributes.push(attributeObj);
                        }
                        if (containers[i].capacity != undefined) {
                            var attributeObj = {
                                "TECHDISER_ID": msbUtilService.generateId(),
                                "fromWhere": packageType,
                                "sourceId": containers[i][PRIMARY_COLUMN_NAME],
                                "containerId": containers[i].containerId,
                                "attributeKey": "capacity",
                                "attributeTitle": "Capacity",
                                "attributeValue": containers[i].capacity
                            };
                            contAttributes.push(attributeObj);
                        }
                    }
                }
            }
            removeContAttribute(containers, contAttributes);
        }

        function removeContAttribute(containers, contAttributes) {
            if (contAttributes && angular.isArray(contAttributes)) {
                for (var i = 0; i < contAttributes.length; i++) {
                    var index = msbUtilService.getIndex(containers, "containerId", contAttributes[i].containerId);
                    if (index < 0) {
                        contAttributes.splice(i, 1);
                        i = i - 1;
                    }
                }
            }
        }

        function defineLabelLayout(callBack, param) {
            $mdDialog.show({
                controller: 'LabelLayoutController',
                controllerAs: 'vm',
                templateUrl: 'app/main/systemsettings/material-packaging/dialogs/label-layout/label-layout.html',
                locals: {
                    Label: param.label,
                    Attributes: param.attributes
                }
            })
                .then(function (answer) {
                    if (answer) {
                        callBack(answer);
                    }
                });
        }

        function getMaterialPackaging(callBack, param) {
            msbCommonApiService.getItems("MATERIAL_PACKAGING_SETUP", null, function (data) {
                callBack(data);
            });
        }

        function saveMaterialPackaging(callBack, param) {
            msbCommonApiService.saveItems("MATERIAL_PACKAGING_SETUP", param.materialPackaging, function (data) {
                callBack(data);

            }, null);
        }

        return services;
    }
})();
