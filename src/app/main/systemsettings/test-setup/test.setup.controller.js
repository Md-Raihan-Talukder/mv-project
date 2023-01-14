(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller("TestSetupController", TestSetupController);

    function TestSetupController(msbCommonApiService, msbUtilService, PRIMARY_COLUMN_NAME,
        SERIAL_COLUMN_NAME, testSetupService, TESTING_UNITS, $scope) {

        var vm = this;
        vm.testingUnits = TESTING_UNITS;
        vm.getTestUnit = getTestUnit;
        vm.save = save;
        vm.updateTestVM = updateTestVM;

        vm.createTest = createTest;
        vm.addTest = addTest;
        vm.selectTest = selectTest;
        vm.deleteTest = deleteTest;
        vm.editTest = editTest;
        vm.selectColorDependentTest = selectColorDependentTest;

        // vm.updateMethodVM = updateMethodVM;
        vm.createMethod = createMethod;
        vm.addMethod = addMethod;
        vm.selectMethod = selectMethod;
        vm.editMethod = editMethod;
        vm.deleteMethod = deleteMethod;

        vm.createAttribute = createAttribute;
        vm.addAttribute = addAttribute;
        vm.selectAttribute = selectAttribute;
        vm.editAttribute = editAttribute;
        vm.deleteAttribute = deleteAttribute;

        vm.addEnvironmentSet = addEnvironmentSet;

        init();

        function init() {
            $scope.Math = window.Math;
            getAllTestDefinition();
            createTest();
            createMethod();
            createAttribute();
            // getTestAttributesWhereTestId();
            // getTestMethodsWhereTestId();
            // getTestEnvironmentsWhereTestIdMethodId();
        }

        function save() {
            var param = {
                "testList": vm.testList
            }
            console.log(vm.testList);
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    console.log(data);
                }
            }, "testSetupService", "saveTestDefinition", param);
        }

        function getAllTestDefinition() {
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    vm.testList = data;
                    console.log(vm.testList);
                    selectTest(vm.testList[0]);
                    selectMethod(vm.testList[0].methods[0]);
                }

            }, "testSetupService", "getAllTestDefinition", null);
        }

        // function getTestAttributesWhereTestId() {
        //     var param = { "testId": "LabTest2"}
        //     msbCommonApiService.interfaceManager(function (attributeData) {
        //         if (attributeData) {
        //             console.log(attributeData);
        //         }
        //
        //     }, "testSetupService", "getTestAttributesWhereTestId", param);
        // }

        // function getTestMethodsWhereTestId() {
        //     var param = { "testId": "LabTest1"}
        //     msbCommonApiService.interfaceManager(function (methodData) {
        //         if (methodData) {
        //             console.log(methodData);
        //         }
        //
        //     }, "testSetupService", "getTestMethodsWhereTestId", param);
        // }

        // function getTestEnvironmentsWhereTestIdMethodId() {
        //     var param = { "testId": "LabTest1", "methodId": "Test_Method2" }
        //     msbCommonApiService.interfaceManager(function (environmentData) {
        //         if (environmentData) {
        //             console.log(environmentData);
        //         }
        //
        //     }, "testSetupService", "getTestEnvironmentsWhereTestIdMethodId", param);
        // }

        function createTest() {

            msbCommonApiService.getIdFromServer("TEST_SETUP", function (data) {
                if (data) {
                    vm.labTest = {
                        "TECHDISER_ID": data.id,
                        "SERIAL_COLUMN_NAME": data.slNo,
                        "title": "",
                        "description": "",
                        "colorDependent": false,
                        "attributes": [],
                        "methods": []
                    }
                    vm.isNewTest = true;
                }
            }, "clientUrl");
        }

        function selectColorDependentTest(test) {
            if (test) {
                test.colorDependent = !test.colorDependent;
            }
        }

        function addTest() {
            if (vm.isNewTest) {
                if (vm.labTest.title && vm.testList) {
                    for (var index = 0; index < vm.testList.length; index++) {
                        if (vm.testList[index].title == vm.labTest.title) {
                            msbUtilService.showToast(
                                'The Test is already exists.',
                                'error-toast',
                                3000
                            );
                            vm.found = true;
                        }
                    }
                    if (!vm.found) {

                        if (vm.testList && angular.isArray(vm.testList)) {
                            vm.testList.unshift(vm.labTest);
                        } else {
                            vm.testList = [];
                            vm.testList.unshift(vm.labTest);
                        }

                        createTest();
                        selectTest(vm.labTest);
                    }
                    vm.found = false;
                }
            }
            else {
                if (vm.labTest.title && vm.testList) {
                    for (var index = 0; index < vm.testList.length; index++) {
                        if (vm.testList[index].title == vm.labTest.title && vm.testList[index].description == vm.labTest.description && vm.testList[index].colorDependent == vm.labTest.colorDependent) {
                            msbUtilService.showToast(
                                'The Test is already exists.',
                                'error-toast',
                                3000
                            );
                            vm.found = true;
                            break;
                        }
                    }
                    if (!vm.found) {
                        var testIndex = msbUtilService.getIndex(vm.testList, PRIMARY_COLUMN_NAME, vm.labTest[PRIMARY_COLUMN_NAME]);
                        if (testIndex > -1) {
                            vm.testList[testIndex] = vm.labTest;
                            createTest();
                            selectTest(vm.testList[testIndex]);
                        }
                    }
                    vm.found = false;
                }
            }
        }

        function editTest(test) {
            if (test) {
                vm.labTest = angular.copy(test);
                vm.isNewTest = false;
            }
        }

        function selectTest(test) {
            if (test) {
                vm.selectedTest = test;
                if (vm.selectedTest.methods.length > 0) {
                    selectMethod(vm.selectedTest.methods[0]);
                } else {
                    vm.selectedMethod = {}
                }
            }
        }

        function deleteTest(test) {
            if (test && vm.testList && vm.testList.length > 0) {
                var testIndex = msbUtilService.getIndex(vm.testList, PRIMARY_COLUMN_NAME, test[PRIMARY_COLUMN_NAME]);
                if (testIndex > -1) {
                    vm.testList.splice(testIndex, 1);
                }
            }
        }

        function createMethod() {

            msbCommonApiService.getIdFromServer("TEST_SETUP", function (data) {
                if (data) {
                    vm.method = {
                        "TECHDISER_ID": data.id,
                        "SERIAL_COLUMN_NAME": data.slNo,
                        "title": "",
                        "environments": createEnvironment()
                    }
                    vm.isNewMethod = true;
                    console.log(vm.method);
                }
            }, "clientUrl");
        }

        function createEnvironment() {
            var environments = [];
            for (var i = 0; i < 5; i++) {
                msbCommonApiService.getIdFromServer("TEST_SETUP", function (data) {
                    if (data) {
                        var environment = {
                            "TECHDISER_ID": data.id,
                            "SERIAL_COLUMN_NAME": data.slNo,
                            "title": ""
                        }
                        environments.push(environment);
                    }
                }, "clientUrl");
            }
            return environments;
        }

        function addEnvironmentSet() {
            if (vm.selectedMethod.environments) {
                for (var i = 0; i < 5; i++) {
                    var environment = {
                        "TECHDISER_ID": msbUtilService.generateId(),
                        "SERIAL_COLUMN_NAME": vm.selectedMethod.environments.length + 1,
                        "title": ""
                    }
                    vm.selectedMethod.environments.push(environment);
                }
                console.log(vm.selectedMethod.environments);
            }
        }

        function addMethod() {
            if (vm.isNewMethod) {
                if (vm.method.title && vm.selectedTest.methods) {
                    for (var index = 0; index < vm.selectedTest.methods.length; index++) {
                        if (vm.selectedTest.methods[index].title == vm.method.title) {
                            msbUtilService.showToast(
                                'The Method is already exists.',
                                'error-toast',
                                3000
                            );
                            vm.methodFound = true;
                        }
                    }
                    if (!vm.methodFound) {

                        if (vm.selectedTest.methods && angular.isArray(vm.selectedTest.methods)) {
                            vm.selectedTest.methods.unshift(vm.method);
                        } else {
                            vm.selectedTest.methods = [];
                            vm.selectedTest.methods.unshift(vm.method);
                        }

                        createMethod();
                        selectMethod(vm.method);
                        updateTestVM();
                    }
                    vm.methodFound = false;
                }
            }
            else {
                if (vm.method.title && vm.selectedTest.methods) {
                    for (var index = 0; index < vm.selectedTest.methods.length; index++) {
                        if (vm.selectedTest.methods[index].title == vm.method.title) {
                            msbUtilService.showToast(
                                'The Method is already exists.',
                                'error-toast',
                                3000
                            );
                            vm.methodFound = true;
                            break;
                        }
                    }
                    if (!vm.methodFound) {
                        var methodIndex = msbUtilService.getIndex(vm.selectedTest.methods, PRIMARY_COLUMN_NAME, vm.method[PRIMARY_COLUMN_NAME]);
                        if (methodIndex > -1) {
                            vm.selectedTest.methods[methodIndex] = vm.method;
                            createMethod();
                            selectMethod(vm.selectedTest.methods[methodIndex]);
                            updateTestVM();
                        }
                    }
                    vm.methodFound = false;
                }
            }
        }

        function selectMethod(method) {
            if (method) {
                vm.selectedMethod = method;
            }
        }

        function editMethod(method) {
            if (method) {
                vm.method = angular.copy(method);
                vm.isNewMethod = false;
            }
        }

        function deleteMethod(method) {
            if (method && vm.selectedTest.methods && vm.selectedTest.methods.length > 0) {
                var methodIndex = msbUtilService.getIndex(vm.selectedTest.methods, PRIMARY_COLUMN_NAME, method[PRIMARY_COLUMN_NAME]);
                if (methodIndex > -1) {
                    vm.selectedTest.methods.splice(methodIndex, 1);
                }
            }
        }

        function updateTestVM() {
            if (vm.selectedTest && vm.testList && vm.testList.length > 0) {
                var index = msbUtilService.getIndex(vm.testList, PRIMARY_COLUMN_NAME, vm.selectedTest[PRIMARY_COLUMN_NAME]);
                if (index > -1) {
                    vm.testList[index] = vm.selectedTest;
                }
            }
        }

        // function updateMethodVM(){
        //     if (vm.selectedMethod && vm.selectedTest.methods && vm.selectedTest.methods.length > 0) {
        //         var index = msbUtilService.getIndex(vm.selectedTest.methods, PRIMARY_COLUMN_NAME, vm.selectedMethod[PRIMARY_COLUMN_NAME]);
        //         if (index > -1) {
        //             vm.selectedTest.methods[index] = vm.selectedMethod;
        //         }
        //     }
        // }

        function createAttribute() {

            msbCommonApiService.getIdFromServer("TEST_SETUP", function (data) {
                if (data) {
                    vm.attribute = {
                        "TECHDISER_ID": data.id,
                        "SERIAL_COLUMN_NAME": data.slNo,
                        "title": "",
                    }
                    vm.isNewAttribute = true;
                }
            }, "clientUrl");
        }


        function addAttribute() {
            if (vm.isNewAttribute) {
                if (vm.attribute.title && vm.selectedTest.attributes) {
                    for (var index = 0; index < vm.selectedTest.attributes.length; index++) {
                        if (vm.selectedTest.attributes[index].title == vm.attribute.title) {
                            msbUtilService.showToast(
                                'The Attribute is already exists.',
                                'error-toast',
                                3000
                            );
                            vm.attributeFound = true;
                        }
                    }
                    if (!vm.attributeFound) {

                        if (vm.selectedTest.attributes && angular.isArray(vm.selectedTest.attributes)) {
                            vm.selectedTest.attributes.unshift(vm.attribute);
                        } else {
                            vm.selectedTest.attributes = [];
                            vm.selectedTest.attributes.unshift(vm.attribute);
                        }

                        createAttribute();
                        selectAttribute(vm.attribute);
                        updateTestVM();
                    }
                    vm.attributeFound = false;
                }
            }
            else {
                if (vm.attribute.title && vm.selectedTest.attributes) {
                    for (var index = 0; index < vm.selectedTest.attributes.length; index++) {
                        if (vm.selectedTest.attributes[index].title == vm.attribute.title && vm.selectedTest.attributes[index].testUnitId == vm.attribute.testUnitId) {
                            msbUtilService.showToast(
                                'The Attribute is already exists.',
                                'error-toast',
                                3000
                            );
                            vm.attributeFound = true;
                            break;
                        }
                    }
                    if (!vm.attributeFound) {
                        var attributeIndex = msbUtilService.getIndex(vm.selectedTest.attributes, PRIMARY_COLUMN_NAME, vm.attribute[PRIMARY_COLUMN_NAME]);
                        if (attributeIndex > -1) {
                            vm.selectedTest.attributes[attributeIndex] = vm.attribute;
                            createAttribute();
                            selectAttribute(vm.selectedTest.attributes[attributeIndex]);
                            updateTestVM();
                        }
                    }
                    vm.attributeFound = false;
                }
            }
        }

        function selectAttribute(attribute) {
            if (attribute) {
                vm.selectedAttribute = attribute;
            }
        }

        function editAttribute(attribute) {
            if (attribute) {
                vm.attribute = angular.copy(attribute);
                vm.isNewAttribute = false;
            }
        }

        function deleteAttribute(attribute) {
            if (attribute && vm.selectedTest.attributes && vm.selectedTest.attributes.length > 0) {
                var attributeIndex = msbUtilService.getIndex(vm.selectedTest.attributes, PRIMARY_COLUMN_NAME, attribute[PRIMARY_COLUMN_NAME]);
                if (attributeIndex > -1) {
                    vm.selectedTest.attributes.splice(attributeIndex, 1);
                }
            }
        }


        function getTestUnit(testUnitId) {
            if (testUnitId && vm.testingUnits && vm.testingUnits.length > 0) {
                var unitIndex = msbUtilService.getIndex(vm.testingUnits, "key", testUnitId);
                if (unitIndex > -1) {
                    return vm.testingUnits[unitIndex].value;
                }
            }
        }



    }
})();
