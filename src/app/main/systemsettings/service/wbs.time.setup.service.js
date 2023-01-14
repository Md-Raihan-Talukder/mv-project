(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('wbsTimeSetupService', wbsTimeSetupService);

    /** @ngInject */
    function wbsTimeSetupService(msbUtilService, msbCommonApiService,
        UNIT, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME, $mdDialog) {

        var services = {
            interfaceDef: interfaceDef,
            getWbsTimeSetup: getWbsTimeSetup,
            getWbsWorkGroups: getWbsWorkGroups,
            getWbsLifeCycleEvents: getWbsLifeCycleEvents,
            getWbsTimeDataDefinition: getWbsTimeDataDefinition,
            saveWbsTimeDef: saveWbsTimeDef,
            getWbsLeadTimes: getWbsLeadTimes,
            selectWbsEventDialog: selectWbsEventDialog,
        };

        function interfaceDef(callBack, taskCode, param) {
            if (taskCode) {
                services[taskCode](callBack, param);
            }
        }

        function getWbsTimeSetup(callBack, param) {
            msbCommonApiService.getItems("WBS_TIME_SETUP", null, function (data) {
                callBack(data);
            });
        }

        function getWbsWorkGroups(callBack, param) {
            msbCommonApiService.getItems("WBS_WORK_GROUPS", null, function (data) {
                callBack(data);
            });
        }

        function getWbsLifeCycleEvents(callBack, param) {
            msbCommonApiService.getItems("WBS_LIFE_EVENTS", null, function (data) {
                callBack(data);
            });
        }

        function getWbsLeadTimes(callBack, param) {
            msbCommonApiService.getItems("WBS_LEAD_TIMES", null, function (data) {
                callBack(data);
            });
        }

        function getWbsTimeDataDefinition(params) {
            if (msbUtilService.checkUndefined(params)) {
                var catalogs = msbUtilService.searchFromParam(params, "catalogs");
                var wbsWorkGrpDef = msbUtilService.searchFromParam(params, "wbsWorkGrpDef");
                // var wbsLifeCycleEvents = msbUtilService.searchFromParam(params, "wbsLifeCycleEvents");
                var wbsTimeDef = msbUtilService.searchFromParam(params, "wbsTimeDef");

                if (catalogs && catalogs.length > 0 && wbsWorkGrpDef && wbsWorkGrpDef.length > 0) {
                    for (var i = 0; i < catalogs.length; i++) {
                        if (catalogs[i]) {
                            for (var j = 0; j < wbsWorkGrpDef.length; j++) {
                                if (wbsWorkGrpDef[j]) {
                                    var index = msbUtilService.getIndexByValues(wbsTimeDef,
                                        [{ "key": "categoryId", "value": catalogs[i].TECHDISER_ID },
                                        { "key": "workGroupDefId", "value": wbsWorkGrpDef[j].TECHDISER_ID }]);
                                    if (index === -1) {
                                        var item = {};
                                        item.TECHDISER_ID = msbUtilService.generateId();
                                        item.TECHDISER_SERIAL_NO = wbsTimeDef.length + 1;
                                        item.categoryId = catalogs[i].TECHDISER_ID;
                                        item.workGroupDefId = wbsWorkGrpDef[j].TECHDISER_ID;
                                        item.wbsEventId = null;
                                        item.leadTimes = [];
                                        item.type = wbsWorkGrpDef[j].type;
                                        item.title = wbsWorkGrpDef[j].title;
                                        item.isSetup = wbsWorkGrpDef[j].isSetup;
                                        wbsTimeDef.push(item);
                                    }
                                }
                            }
                        }
                    }
                }

                return wbsTimeDef;
            }
        }

        function saveWbsTimeDef(callBack, param) {
            msbCommonApiService.saveItems("WBS_TIME_SETUP", param.wbsTimeDef, function (data) {
                callBack(data);
            }, null);
        }

        function selectWbsEventDialog(callBack, params) {
            if (msbUtilService.checkUndefined(callBack, params)) {
                var workGroup = msbUtilService.searchFromParam(params, "workGroup");
                var wbsLifeCycleEvents = msbUtilService.searchFromParam(params, "wbsLifeCycleEvents");
                var wbsLeadTimes = msbUtilService.searchFromParam(params, "wbsLeadTimes");
                $mdDialog.show({
                    controller: 'SelectWbsLifeCycleEventDialogController',
                    controllerAs: 'vm',
                    clickOutsideToClose: false,
                    preserveScope: true,
                    templateUrl: 'app/main/directives/wbs-time-sutup/dialog/select-wbs-life-cycle-event.html',
                    locals: {
                        WorkGroup: workGroup,
                        WbsLifeCycleEvents: wbsLifeCycleEvents,
                        WbsLeadTimes: wbsLeadTimes
                    }
                })
                    .then(function (answer) {
                        if (answer) {
                            callBack(answer);
                        }
                    });
            }
        }


        return services;
    }
})();
