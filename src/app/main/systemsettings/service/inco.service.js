(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('inCoService', inCoService);

    /** @ngInject */
    function inCoService(msbUtilService, msbCommonApiService,
        PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME, BILL_POLICY, $mdDialog) {


        var services = {
            interfaceDef: interfaceDef,
            getIncoTypeDefinition: fetchIncoTypeDefinition,
            saveImportIncoType: saveImportIncoType,
            getExportIncoDefinition: fetchExportIncoDefinition,
            saveExportIncoType: saveExportIncoType,
            getExportInCoTypes: getExportInCoTypes,
            getStakeholders: getStakeholders,
            getInCoTypes: getInCoTypes,
            getInCoStepsDefinition: getInCoStepsDefinition,
            getBillPolicy: getBillPolicy,
            makeMatWiseBills: makeMatWiseBills,
            getImportsBillsByInCoTypes: getImportsBillsByInCoTypes,
            getExportsBillsByInCoTypes: getExportsBillsByInCoTypes,
            calculateMatBill: calculateMatBill,

        };


        function interfaceDef(callBack, taskCode, param) {
            if (taskCode) {
                services[taskCode](callBack, param);
            }
        }

        function fetchIncoTypeDefinition(callBack, param) {
            msbCommonApiService.getItems("IMPORT_INCO", null, function (data) {
                if (data) {
                    callBack(data);
                }
            });
        }

        function saveImportIncoType(callBack, param) {

            if (param) {
                msbCommonApiService.saveInnerItem(param.itemId, param.data, "IMPORT_INCO", "clientUrl", param.path, param.pathParam, function (data) {
                    if (data && callBack) {
                        callBack(data);
                    }
                }, null, null, true);
            }

        }

        function saveExportIncoType(callBack, param) {

            if (param) {
                msbCommonApiService.saveInnerItem(param.itemId, param.data, "EXPORT_INCO", "clientUrl", param.path, param.pathParam, function (data) {
                    if (data && callBack) {
                        callBack(data);
                    }
                }, null, null, true);
            }

        }

        function fetchExportIncoDefinition(callBack, param) {
            msbCommonApiService.getItems("EXPORT_INCO", null, function (data) {
                if (data) {
                    callBack(data);
                }
            });
        }

        // get Export InCo Types
        function getExportInCoTypes(callBack, param) {
            msbCommonApiService.getItems("EXPORT_INCO", null, function (data) {
                if (callBack) {
                    callBack(data);
                }
            }, null, null, null, "clientUrl", "/typeDefinition", []);
        }

        // service to get stakeholders
        function getStakeholders(callBack, param) {
            msbCommonApiService.getItems("IMPORT_INCO", null, function (data) {
                if (callBack) {
                    callBack(data);
                }
            }, null, null, null, "clientUrl", "/stakeholderDefinition", []);
        }

        // get InCo Types
        function getInCoTypes(callBack, param) {
            if (param && param.length > 0) {
                var path = "/typeDefinition/[TECHDISER_ID=$inCoId]";
                var params = param;
            }
            else {
                var path = "/typeDefinition";
                var params = [];
            }
            msbCommonApiService.getItems("IMPORT_INCO", null, function (data) {
                if (callBack) {
                    callBack(data);
                }
            }, null, null, null, "clientUrl", path, params);
        }

        // get InCo Steps Definition
        function getInCoStepsDefinition(callBack, param) {
            msbCommonApiService.getItems("IMPORT_INCO", null, function (data) {
                if (callBack) {
                    callBack(data);
                }
            }, null, null, null, "clientUrl", "/stepDefinition", []);
        }

        // get Bill policy
        function getBillPolicy(callBack, param) {
            if (callBack && BILL_POLICY) {
                callBack(BILL_POLICY);
            }
        }

        function getImportsBillsByInCoTypes(callBack, params) {
            if (msbUtilService.checkUndefined(callBack, params)) {
                var path = "/typeDefinition";
                var inCoIds = msbUtilService.searchFromParam(params, "inCoIds");
                msbCommonApiService.getItems("IMPORT_INCO", null, function (typeDef) {
                    if (typeDef && typeDef.length > 0 && inCoIds && inCoIds.length > 0) {
                        var importersBills = [];
                        for (var i = 0; i < inCoIds.length; i++) {
                            if (inCoIds[i]) {
                                var typeIndex = msbUtilService.getIndex(typeDef, PRIMARY_COLUMN_NAME, inCoIds[i]);
                                if (typeIndex > -1) {
                                    if (typeDef[typeIndex] && typeDef[typeIndex].importers && typeDef[typeIndex].importers.length > 0) {
                                        for (var j = 0; j < typeDef[typeIndex].importers.length; j++) {
                                            if (typeDef[typeIndex].importers[j]) {
                                                var stkIndex = msbUtilService.getIndex(importersBills, "stakeholderId", typeDef[typeIndex].importers[j].stakeholderId);
                                                if (stkIndex === -1) {
                                                    importersBills.push(typeDef[typeIndex].importers[j]);
                                                } else if (stkIndex > -1) {
                                                    if (importersBills[stkIndex] && importersBills[stkIndex].bills &&
                                                        importersBills[stkIndex].bills.length > 0 && typeDef[typeIndex].importers[j].bills &&
                                                        typeDef[typeIndex].importers[j].bills.length > 0) {
                                                        for (var k = 0; k < typeDef[typeIndex].importers[j].bills.length; k++) {
                                                            if (typeDef[typeIndex].importers[j].bills[k] && typeDef[typeIndex].importers[j].bills[k].TD_IS_DELETED == 0) {
                                                                var billIndex = msbUtilService.getIndex(importersBills[stkIndex].bills, PRIMARY_COLUMN_NAME, typeDef[typeIndex].importers[j].bills[k][PRIMARY_COLUMN_NAME]);
                                                                if (billIndex === -1) {
                                                                    importersBills[stkIndex].bills.push(typeDef[typeIndex].importers[j].bills[k]);
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
                            // callBack(importers, param);

                        }
                        console.log(typeDef);
                        callBack(importersBills, params);
                        // if (data.importers && data.steps) {
                        //   var importers = [];
                        //   for (var i = 0; i < data.importers.length; i++) {
                        //     var params = [{"key": "stakeholderId", "value":  data.importers[i].stakeholderId},
                        //     {"key": "isSelected", "value": true},
                        //     {"key": "isImportPayment", "value": true}];
                        //
                        //     var index = msbUtilService.getIndexByValues(data.steps, params);
                        //     if (index > -1) {
                        //       importers.push(data.importers[i]);
                        //     }
                        //   }
                        //   callBack(importers);
                        // }

                    }
                }, null, false, null, "clientUrl", path, params);
            }
        }

        function getExportsBillsByInCoTypes(callBack, params) {
            if (msbUtilService.checkUndefined(callBack, params)) {
                var path = "/typeDefinition";
                var inCoIds = msbUtilService.searchFromParam(params, "inCoIds");
                msbCommonApiService.getItems("IMPORT_INCO", null, function (typeDef) {
                    if (typeDef && typeDef.length > 0 && inCoIds && inCoIds.length > 0) {
                        var exportersBills = [];
                        for (var i = 0; i < inCoIds.length; i++) {
                            if (inCoIds[i]) {
                                var typeIndex = msbUtilService.getIndex(typeDef, PRIMARY_COLUMN_NAME, inCoIds[i]);
                                if (typeIndex > -1) {
                                    if (typeDef[typeIndex] && typeDef[typeIndex].exporters && typeDef[typeIndex].exporters.length > 0) {
                                        for (var j = 0; j < typeDef[typeIndex].exporters.length; j++) {
                                            if (typeDef[typeIndex].exporters[j]) {
                                                var stkIndex = msbUtilService.getIndex(exportersBills, "stakeholderId", typeDef[typeIndex].exporters[j].stakeholderId);
                                                if (stkIndex === -1) {
                                                    exportersBills.push(typeDef[typeIndex].exporters[j]);
                                                } else if (stkIndex > -1) {
                                                    if (exportersBills[stkIndex] && exportersBills[stkIndex].bills &&
                                                        exportersBills[stkIndex].bills.length > 0 && typeDef[typeIndex].exporters[j].bills &&
                                                        typeDef[typeIndex].exporters[j].bills.length > 0) {
                                                        for (var k = 0; k < typeDef[typeIndex].exporters[j].bills.length; k++) {
                                                            if (typeDef[typeIndex].exporters[j].bills[k] && typeDef[typeIndex].exporters[j].bills[k].TD_IS_DELETED == 0) {
                                                                var billIndex = msbUtilService.getIndex(exportersBills[stkIndex].bills, PRIMARY_COLUMN_NAME, typeDef[typeIndex].exporters[j].bills[k][PRIMARY_COLUMN_NAME]);
                                                                if (billIndex === -1) {
                                                                    exportersBills[stkIndex].bills.push(typeDef[typeIndex].exporters[j].bills[k]);
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
                            callBack(exportersBills);
                        }
                        callBack(exportersBills);
                    }
                }, null, false, null, "clientUrl", path, params);
            }
        }

        function makeMatWiseBills(callBack, param) {
            if (msbUtilService.checkUndefined(callBack, param)) {
                if (param.shipments) {
                    param.shipments.forEach(function (ship, ind) {
                        if (ship && ship.materialId) {
                            var incoPar = [{ "key": "ind", "value": ind }, { "key": "inCoIds", "value": getMatIncoId(ship.materialId, param.incoDef) }]
                            getImportsBillsByInCoTypes(function (data, params) {
                                var cInd = msbUtilService.searchFromParam(params, "ind");
                                if (data) {
                                    param.matBills[param.shipments[cInd].materialId] = data;
                                    param.shipments[cInd].bills = makeBillsInMat(param.shipments[cInd], data);
                                    if (cInd == param.shipments.length - 1) {
                                        callBack(param)
                                    }
                                }
                            }, incoPar)
                        }
                    });
                }
            }
        }

        function makeBillsInMat(shipment, bills) {
            if (shipment && bills) {
                bills.forEach(function (stk) {
                    if (stk) {
                        stk.bills.forEach(function (bill) {
                            if (bill) {
                                bill.stepIds.forEach(function (stpId) {
                                    if (stpId) {
                                        var shpObj = msbUtilService.getObjectByParams(shipment.bills, [
                                            { "key": "billId", "value": bill.TECHDISER_ID },
                                            { "key": "stakeId", "value": stk.TECHDISER_ID },
                                            { "key": "stepId", "value": stpId }
                                        ]);
                                        if (!shpObj) {
                                            shipment.bills.push(
                                                {
                                                    'TECHDISER_ID': msbUtilService.generateId(),
                                                    'stakeId': stk.TECHDISER_ID,
                                                    'billId': bill.TECHDISER_ID,
                                                    'stepId': stpId,
                                                    'cost': 0
                                                }
                                            )
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
                return shipment.bills;
            }
        }

        function getMatIncoId(id, incoDef) { // multiple incoId
            if (id && incoDef) {
                var incoObj = msbUtilService.getItemsByProperties(incoDef, [{ "key": "itemId", "value": id }]);
                if (incoObj) {
                    return incoObj.map(function (obj) {
                        return obj.defId
                    })
                }
            }
        }

        function calculateMatBill(callBack, params) {
            if (msbUtilService.checkUndefined(callBack, params)) {
                $mdDialog.show({
                    controller: 'MaterialShipmentStepBillsDC', // DC means Dialog Controller
                    controllerAs: 'vm',
                    templateUrl: 'app/main/inquiry/directives/mat-ship-cost/mat-ship-shipment/dialog/mat-ship-bills-dialog.html',
                    locals: {
                        Params: params
                    }
                })
                    .then(function (answer) {
                        console.log(answer);
                        if (answer) {
                            callBack(answer)
                        }
                    });
            }
        }



        return services;
    }
})();
