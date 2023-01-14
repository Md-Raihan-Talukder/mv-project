(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('StitchSetupController', StitchSetupController);

    /** @ngInject */
    function StitchSetupController($mdDialog, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME,
        commonApiService, msbUtilService, msbCommonApiService, consumptionCalculationService, msbMeasurementService) {

        debugger;

        var vm = this;
        vm.selectStitch = selectStitch;
        vm.addStitch = addStitch;
        vm.saveStitch = saveStitch;
        // vm.deleteStitch = deleteStitch;
        vm.addThread = addThread;
        vm.deleteThread = deleteThread;
        vm.saveStitchDef = saveStitchDef;

        vm.setThreadQtyUnit = setThreadQtyUnit;
        vm.setThreadHostUnit = setThreadHostUnit;

        vm.loadViewComponents = false;

        init();

        function init() {
            // commonApiService.getItems(vm, "STITCHES", "stitches", false);
            asynchCallHandler();

        }

        function asynchCallHandler() {
            function getSuppliyItemSetupDef() {
                var param = [
                    { "key": "TECHDISER_SEARCH_PATH", "value": "/[materialType=$supplyCategory]" },
                    { "key": "supplyCategory", "value": "thread" }
                ];
                msbCommonApiService.interfaceManager(function (data) {
                    if (data) {
                        vm.supplyCategory = (data && data.length > 0) ? data[0] : null;;
                    }
                    getStitchDef();
                }, "supplyDefinitionService", "getSupplyDefinition", param);
            }
            function getStitchDef() {
                msbCommonApiService.interfaceManager(function (data) {
                    vm.stitches = data;
                    callNextHandler();
                }, "costingHeadsService", "getStitchDef", null);
            }

            function callNextHandler() {
                postAsynchHandler();
            }
            getSuppliyItemSetupDef();
        }

        function postAsynchHandler() {

            setUnitDef();

            vm.sortableOptions = {
                handle: '.handle',
                forceFallback: true,
                ghostClass: 'td-item-placeholder',
                fallbackClass: 'td-item-ghost',
                fallbackOnBody: true
            };

            vm.loadViewComponents = true;

        }



        function setThreadQtyUnit(thread) {
            if (thread && thread.selectedQtyUnit) {
                thread.qtyUnit = thread.selectedQtyUnit.id;
            }
        }

        function setThreadHostUnit(thread) {
            if (thread && thread.selectedHostUnit) {
                thread.hostUnitId = thread.selectedHostUnit.id;
            }
        }

        function setUnitDef() {

            vm.unitDef = consumptionCalculationService.getSetupUnitDefinitions(vm.supplyCategory, msbMeasurementService.getThreadItemDefinition, msbMeasurementService.getThreadHostDefinition);

            consumptionCalculationService.setSetupUnitDefForStitches(vm.unitDef, vm.stitches);

        }

        function selectStitch(stitch) {
            vm.selectedStitch = angular.copy(stitch);
            vm.isNewStitch = false;
        }

        function addStitch() {
            msbCommonApiService.getIdFromServer('STITCHES', function (data) {
                if (data) {
                    vm.selectedStitch = {
                        "TECHDISER_ID": data.id,
                        "TECHDISER_SERIAL_NO": data.slNo,
                        "title": "",
                        "description": "",
                        "stitchImage": [],
                        "threads": []
                    }
                }
            }, "clientUrl");
        }

        function saveStitch(selectedStitch, isNew) {
            if (isNew) {
                if (selectedStitch && vm.stitches) {
                    vm.stitches.unshift(angular.copy(selectedStitch));
                }
            }
            else {
                if (selectedStitch && vm.stitches) {
                    var stitchIndex = msbUtilService.getIndex(vm.stitches, PRIMARY_COLUMN_NAME, selectedStitch.TECHDISER_ID);
                    if (stitchIndex > -1) {
                        vm.stitches[stitchIndex] = angular.copy(selectedStitch);
                    }
                }
            }

        }

        function addThread(stitch) {
            if (stitch) {
                var maxNumber = 0;
                if (stitch.threads) {
                    for (var i = 0; i < stitch.threads.length; i++) {
                        if (stitch.threads[i].TECHDISER_SERIAL_NO > maxNumber) {
                            maxNumber = stitch.threads[i].TECHDISER_SERIAL_NO;
                        }
                    }
                }
                var thread = {
                    "TECHDISER_ID": msbUtilService.generateId(),
                    "TECHDISER_SERIAL_NO": maxNumber + 1,
                    "position": "",
                    "consumptionPerMeter": "",
                    "description": "",
                    "consumption": 0,
                    "stichLength": 0
                };
                consumptionCalculationService.setSetupUnitDefForThread(vm.unitDef, thread);
                stitch.threads.unshift(thread);
            }
        }

        function deleteThread(stitch, thread) {
            if (stitch.threads && thread) {
                var threadIndex = msbUtilService.getIndex(stitch.threads, "TECHDISER_ID", thread.TECHDISER_ID);
                if (threadIndex > -1) {
                    stitch.threads.splice(threadIndex, 1);
                }
            }

        }

        function removeThreadUnits(stichInfo) {

            if (stichInfo) {
                stichInfo.forEach(function (stitch) {
                    if (stitch && stitch.threads) {
                        stitch.threads.forEach(function (thread) {
                            if (thread) {
                                delete thread["selectedHostUnit"];
                                delete thread["selectedQtyUnit"];
                                delete thread["qtyUnits"];
                                delete thread["hostUnits"];
                            }
                        });
                    }
                });
            }

        }

        function setConsumptionPerMeter(stichInfo) {

            var consUnit = consumptionCalculationService.getThreadConsumptionUnit(vm.supplyCategory);

            if (stichInfo && consUnit) {
                stichInfo.forEach(function (stitch) {
                    if (stitch && stitch.threads) {
                        stitch.threads.forEach(function (thread) {
                            if (thread) {
                                var consQty = 0;
                                var consHost = 0;
                                if (thread.qtyUnitId) {
                                    consQty = msbMeasurementService.unitConvertion(thread.consumption, thread.qtyUnitId, consUnit);
                                }
                                if (thread.hostUnitId) {
                                    consHost = msbMeasurementService.unitConvertion(thread.stichLength, thread.hostUnitId, consUnit);
                                }
                                thread.consumptionPerMeter = (consHost) ? consQty / consHost : 0;
                            }
                        });
                    }
                });
            }

        }

        // Save function will implemented later
        function saveStitchDef() {

            var stichInfo = angular.copy(vm.stitches);

            removeThreadUnits(stichInfo);

            setConsumptionPerMeter(stichInfo);

            var param = {
                "stitches": stichInfo
            }
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    console.log(data);
                }
            }, "testSetupService", "saveStitchDefinition", param);
        }

    }

})();
