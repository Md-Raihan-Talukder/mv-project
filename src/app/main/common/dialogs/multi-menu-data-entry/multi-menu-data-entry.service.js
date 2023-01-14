(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('multiMenuDialogService', multiMenuDialogService);

    /** @ngInject */
    function multiMenuDialogService(msbUtilService, msbCommonApiService,
        PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME) {

        var menuList = [
            {
                "title": "Default Menu",
                "state": "default",
                "key": "default",
                "noMerge": true,
                "url": "default"
            }
        ];

        var service = {
            fillHeaderValue: fillHeaderValue,
            interfaceDef: interfaceDef
        };

        function interfaceDef(callBack, taskCode, param) {
            var serviceFunctions = {
                getMenuList: getMenuList,
                itemFunction: itemFunction,
                saveFunction: saveFunction,
                directiveFunction: directiveFunction
            };

            if (taskCode) {
                serviceFunctions[taskCode](callBack, param);
            }
        }

        function itemFunction(callBack, param) {
            if (!param.id) {
                createNewItem(callBack, param);
            } else {
                getItem(callBack, param);
            }
        }

        function createNewItem(callBack, param) {

            msbCommonApiService.getIdFromServer(param.serviceCode, function (data) {
                if (data) {
                    var item = {};
                    item[PRIMARY_COLUMN_NAME] = data.id;
                    item[SERIAL_COLUMN_NAME] = data.slNo;
                    callBack(item);
                }
            });
        }

        function getItem(callBack, param) {
            msbCommonApiService.getItem(param.param.serviceCode, param.id, null, function (data) {
                callBack(data);
            }, null, null, param.param.taskCode);
        }

        function getMenuList(callBack) {
            callBack(menuList);
        }

        function saveFunction(callBack, param) {
            msbCommonApiService.saveItem(param.item, param.isNew, param.param.serviceCode, function (data) {
                callBack(data);
            }, null, false, null, param.param.taskCode);
        }

        function directiveFunction(callBack, param) {

            var menu = param.menu,
                html = param.param.directiveHtml ? param.param.directiveHtml[menu.key]
                    : menu.directiveHtml,
                itemId = param.id,
                item = param.item;

            var data = { "id": itemId, "item": item, onUpdate: param.onUpdate };




            if (callBack) {
                callBack({ html: html, data: data });
            }

        }

        function fillHeaderValue(item, header, keyValues, callBack) {

            if (!item) {
                if (callBack) {
                    callBack();
                }
                return;
            }

            var otherHeaders = [];
            if (!header) {
                header = []
            }
            for (var i = 0; i < header.length; i++) {
                if (header[i].id === "item") {
                    fillKeyValues(header[i], item, keyValues);
                } else {
                    otherHeaders.push(header[i]);
                }
            }

            getOtherHeaderItem(otherHeaders, 0, keyValues, callBack);
        }

        function getOtherHeaderItem(otherHeaders, index, keyValues, callBack) {
            if (index >= otherHeaders.length) {
                if (callBack) {
                    callBack();
                }
                return;
            }

            var searchParams = [],
                def = otherHeaders[index],
                idRef = otherHeaders[index].idRef;

            var getParams = [
                { "key": "id", "value": idRef.from },
                { "key": "key", "value": idRef.key }
            ];

            var valIndex = msbUtilService.getIndexByValues(keyValues, getParams);
            var pathParams = def.pathParams ? def.pathParams : [];

            msbCommonApiService.getItem(def.service, keyValues[valIndex].value, null, function (data) {
                fillKeyValues(def, data, keyValues);
                if (index < otherHeaders.length) {
                    index++;
                    getOtherHeaderItem(otherHeaders, index, keyValues, callBack);
                }
            }, function (err) {
                if (index < otherHeaders.length) {
                    index++;
                    getOtherHeaderItem(otherHeaders, index, keyValues, callBack);
                }
            }, null, def.task, def.path, pathParams);
        }

        function fillKeyValues(headerDef, item, keyValues) {

            for (var i = 0; i < headerDef.info.length; i++) {
                var source = item;
                if (headerDef.info[i].path) {
                    if (!headerDef.info[i].params) {
                        headerDef.info[i].params = [];
                    }

                    source = msbUtilService.jsonManipulator(item, headerDef.info[i].params, headerDef.info[i].path);
                }

                var value = source[headerDef.info[i].key];

                var keyValue = {
                    "id": headerDef.id,
                    "key": headerDef.info[i].key,
                    "label": headerDef.info[i].label,
                    "value": value,
                    "show": headerDef.info[i].show,
                }

                if (value) {
                    keyValues.push(keyValue);
                }
            }

        }


        return service;
    }
})();