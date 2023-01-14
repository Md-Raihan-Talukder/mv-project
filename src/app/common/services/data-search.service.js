(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('dataSearchService', dataSearchService);

    /** @ngInject */
    function dataSearchService(PRIMARY_COLUMN_NAME, msbUtilService, msbCommonApiService) {

        var service = {
            searchKeyValue: searchKeyValue,
            getAndJoin: getAndJoin
        };

        function getAndJoin(items, definition, callBack) {
            getIdRefs("item", definition, items);
            getJoinItem(definition, 0, items, callBack);
        }

        function getJoinItem(definition, index, items, callBack) {
            if (index >= definition.length) {
                if (callBack) {
                    callBack(items);
                }
                return;
            }

            getIdRefs(definition[index].idRef.from, definition, items);

            var searchParams = [],
                def = definition[index],
                idRef = definition[index].idRef;
            var searchKey = def.searchKey ? def.searchKey : PRIMARY_COLUMN_NAME;
            var getParams = [
                { "key": searchKey, "value": idRef.values }
            ];

            if (def.data) {
                if (def.data.length) {
                    fillJoinValues(items, def, def.data);
                }
                index++;
                getJoinItem(definition, index, items, callBack);

            } else {
                msbCommonApiService.getItems(def.service, getParams, function (data) {
                    if (data && data.length) {
                        fillJoinValues(items, def, data);
                    }
                    index++;
                    getJoinItem(definition, index, items, callBack);

                }, function (err) {
                    index++;
                    getJoinItem(definition, index, items, callBack);
                }, false, null, def.task);
            }

        }

        function fillJoinValues(items, def, joinItems) {
            var joinKey = def.joinKey ? def.joinKey : PRIMARY_COLUMN_NAME;
            for (var i = 0; i < items.length; i++) {
                if (def.idRef.isArray) {
                    for (var j = 0; j < items[i][def.idRef.key].length; j++) {
                        var key = items[i][def.idRef.key][j];
                        var index = msbUtilService.getIndex(joinItems, joinKey, key);
                        if (index > -1) {
                            fillActualJoinValue(joinItems[index], def, items[i], true);
                        }
                    }
                } else {
                    var index = msbUtilService.getIndex(joinItems, joinKey, items[i][def.idRef.key]);
                    if (index > -1) {
                        fillActualJoinValue(joinItems[index], def, items[i]);
                    }
                }

            }
        }

        function fillActualJoinValue(source, def, item, isArray) {
            for (var j = 0; j < def.info.length; j++) {
                if (def.info[j].path) {
                    if (!def.info[j].params) {
                        def.info[j].params = [];
                    }

                    source = msbUtilService.jsonManipulator(source, def.info[j].params, def.info[j].path);
                }
                if (isArray) {
                    if (!item[def.info[j].as]) {
                        item[def.info[j].as] = [];
                    }
                    if (item[def.info[j].as].indexOf(source[def.info[j].key]) === -1) {
                        item[def.info[j].as].push(source[def.info[j].key]);
                    }
                } else {
                    item[def.info[j].as] = def.info[j].isCount ? 1 : source[def.info[j].key];
                }

            }
        }

        function getIdRefs(from, def, items) {
            for (var i = 0; i < def.length; i++) {
                if (def[i].idRef.from === from) {
                    def[i].idRef.values = [];
                    for (var j = 0; j < items.length; j++) {
                        var id = items[j][def[i].idRef.key];
                        if (!id) continue;
                        if (angular.isArray(id)) {
                            for (var k = 0; k < id.length; k++) {
                                if (def[i].idRef.values.indexOf(id[k]) === -1) {
                                    def[i].idRef.values.push(id[k]);
                                }
                            }
                        } else if (def[i].idRef.values.indexOf(id) === -1) {
                            def[i].idRef.values.push(id);
                        }
                    }
                }
            }
        }

        function searchKeyValue(definition, callBack) {

            for (var i = 0; i < definition.length; i++) {
                if (definition[i].id === 'item') {
                    getKeyValItem(definition[i], definition, callBack)
                }
            }

        }

        function getKeyValItem(def, definition, callBack) {

            var pathParams = def.pathParams ? def.pathParams : [];

            msbCommonApiService.getItem(def.service, def.idRef.value, null, function (data) {
                fillKeyValue(data, definition, callBack)
            }, function (err) {

            }, null, def.task, def.path, pathParams);
        }

        function fillKeyValue(item, header, callBack) {
            var keyValues = [];
            if (!item) {
                if (callBack) {
                    callBack(keyValues);
                }
                return;
            }

            var otherHeaders = [];

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
                    callBack(keyValues);
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