(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('testSetupService', testSetupService);

    /** @ngInject */
    function testSetupService(msbUtilService, msbCommonApiService,
        UNIT, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME) {


        var services = {
            interfaceDef: interfaceDef,
            getAllTestDefinition: getAllTestDefinition,
            saveTestDefinition: saveTestDefinition,
            getTestAttributesWhereTestId: getTestAttributesWhereTestId,
            getTestMethodsWhereTestId: getTestMethodsWhereTestId,
            getTestEnvironmentsWhereTestIdMethodId: getTestEnvironmentsWhereTestIdMethodId,
            saveStitchDefinition: saveStitchDefinition,
            saveCostingHead: saveCostingHead,

        };


        function interfaceDef(callBack, taskCode, param) {
            if (taskCode) {
                services[taskCode](callBack, param);
            }
        }

        // get Test List
        function getAllTestDefinition(callBack, param) {
            if (!param) {
                param = [];
                var path = "/";
            }
            else {
                var path = "/[TECHDISER_ID=$testId]";
            }
            msbCommonApiService.getItems("TEST_SETUP", null, function (data) {
                callBack(data);
            }, null, false, null, "clientUrl", path, param);
        }

        function saveTestDefinition(callBack, param) {
            msbCommonApiService.saveItems("TEST_SETUP", param.testList, function (data) {
                callBack(data);

            }, null);
        }

        // get Attributes where testId
        function getTestAttributesWhereTestId(callBack, param) {
            msbCommonApiService.interfaceManager(function (data) {
                if (data && param) {
                    var testList = data;
                    var testId = param.testId;
                    var testIndex = msbUtilService.getIndex(testList, PRIMARY_COLUMN_NAME, testId);
                    if (testIndex > -1) {
                        if (testList[testIndex].attributes) {
                            callBack(testList[testIndex].attributes);
                        }
                    }
                }

            }, "testSetupService", "getAllTestDefinition", null);
        }

        // get Methods where testId
        function getTestMethodsWhereTestId(callBack, param) {
            msbCommonApiService.interfaceManager(function (data) {
                if (data && param) {
                    var testList = data;
                    var testId = param.testId;
                    var testIndex = msbUtilService.getIndex(testList, PRIMARY_COLUMN_NAME, testId);
                    if (testIndex > -1) {
                        if (testList[testIndex].methods) {
                            callBack(testList[testIndex].methods);
                        }
                    }
                }

            }, "testSetupService", "getAllTestDefinition", null);
        }

        // get Environments where testId and methodId
        function getTestEnvironmentsWhereTestIdMethodId(callBack, param) {
            msbCommonApiService.interfaceManager(function (data) {
                if (data && param) {
                    var testList = data;
                    var testId = param.testId;
                    var methodId = param.methodId;
                    var testIndex = msbUtilService.getIndex(testList, PRIMARY_COLUMN_NAME, testId);
                    if (testIndex > -1) {
                        if (testList[testIndex].methods && testList[testIndex].methods.length > 0) {
                            var methodIndex = msbUtilService.getIndex(testList[testIndex].methods, PRIMARY_COLUMN_NAME, methodId);
                            if (methodIndex > -1) {
                                if (testList[testIndex].methods[methodIndex].environments) {
                                    callBack(testList[testIndex].methods[methodIndex].environments);
                                }
                            }
                        }
                    }
                }

            }, "testSetupService", "getAllTestDefinition", null);
        }

        function saveStitchDefinition(callBack, param) {
            msbCommonApiService.saveItems("STITCHES", param.stitches, function (data) {
                callBack(data);

            }, null);
        }

        function saveCostingHead(callBack, param) {

            if (param) {
                msbCommonApiService.saveItem(param.costingHeadData, param.isNew, "COSTING_HEADS", function (data) {
                    if (data && callBack) {
                        callBack(data);
                    }

                }, null, false, null, "clientUrl", true);
            }

        }



        return services;
    }
})();
