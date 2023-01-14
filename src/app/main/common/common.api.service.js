(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('commonApiService', commonApiService);

    /** @ngInject */
    function commonApiService($mdDialog, utilService, commonApi,
        PARAM_NOTION, CODE_COLUMN_NAME, CONSTANT_APP_MODE, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME) {

        var service = {
            getItem: getItem,
            getItems: getItems,
            getItemsByKeys: getItemsByKeys,
            saveItem: saveItem,
            saveItems: saveItems,
            getConfirmDef: getConfirmDef,
            confirmAndDelete: confirmAndDelete,
            getIdFromServer: getIdFromServer,
            showPrompt: showPrompt,

            jsonManipulator: jsonManipulator,
            searchFromParam: searchFromParam,
            checkObject: checkObject,
            fetchVariablePart: fetchVariablePart,
        };
        var isInitiated = 0;
        var serviceKeys = [
            "DATA_ENTRY_FORM",
            "SELECT_DEF",
            "DATA_GRID_DEF",
            "PURCHASE_ORDER"
        ];

        function getIndivdualItems(index, vm, serviceKey, itemId, vmObject, callBack, itemKey, errorCallback, path, paramObj) {
            var temp = {};
            getItems(temp, serviceKeys[index], "items", false, function () {

                if (index === serviceKeys.length - 1) {
                    isInitiated = 1;
                    getJsonData(vm, serviceKey, itemId, vmObject, callBack, itemKey, errorCallback)
                    //getItemsFromMSB(0);
                    //console.log("loaded: " + serviceKeys.length + " items;");
                } else {
                    index += 1;
                    getIndivdualItems(index);
                }
            });
        }

        function showPrompt(title, textContent, placeholder, initialValue, callBack, ev) {

            var confirm = $mdDialog.prompt()
                .title(title)
                .textContent(textContent)
                .placeholder(placeholder)
                .ariaLabel(placeholder)
                .initialValue(initialValue)
                .targetEvent(ev)
                .ok('OK')
                .cancel('CANCEL');

            $mdDialog.show(confirm).then(function (result) {
                callBack(result);
            }, function () {

            });
        }

        function confirmAndDelete(message, yesCalback, noCalback, event) {
            message = message ? message : "The item will be  deleted";
            var dlg = $mdDialog.confirm()
                .title('Are you sure?')
                .content(message)
                .ariaLabel('Delete Task')
                .ok('OK')
                .cancel('Cancel')
                .targetEvent(event);

            $mdDialog.show(dlg).then(function () {
                if (yesCalback) {
                    yesCalback();
                }

            }, function () {
                if (noCalback) {
                    noCalback();
                }
            });
        }

        function getConfirmDef(message, event) {
            message = message ? message : "The item will be  deleted";
            return $mdDialog.confirm()
                .title('Are you sure?')
                .content(message)
                .ariaLabel('Delete Task')
                .ok('OK')
                .cancel('Cancel')
                .targetEvent(event);
        }

        function getIdFromServer(serviceKey, callBack) {
            commonApi.getIdFromServer(serviceKey).then(function (response) {
                if (callBack) {
                    callBack(response.data.data);
                }
            }, function (response) {
                alert(response);
            });
        }

        function initSetupInfo() {

        }

        function getJsonData(vm, serviceKey, itemId, vmObject, callBack, itemKey, errorCallback) {
            commonApi.getSingleItem(serviceKey, itemId, itemKey).then(function (response) {
                vm[vmObject] = response.data.data;
                if (callBack) {
                    callBack(response.data.data);
                }
            }, function (response) {
                if (errorCallback) {
                    errorCallback(response);
                }
            });
        }

        function getItem(vm, serviceKey, itemId, vmObject, callBack, itemKey, errorCallback) {
            if (!isInitiated) {
                isInitiated = 0;
                getIndivdualItems(isInitiated, vm, serviceKey, itemId, vmObject, callBack, itemKey, errorCallback);
            }
            else {
                getJsonData(vm, serviceKey, itemId, vmObject, callBack, itemKey, errorCallback);
            }

        }

        function getItemsByKeys(vm, serviceKey, itemKey, itemkeys, vmObject, callBack, errorCallback) {
            commonApi.getItemsByKeys(serviceKey, itemKey, itemkeys).then(function (response) {
                vm[vmObject] = response.data.data;
                if (callBack) {
                    callBack(response.data.data);
                }
            }, function (response) {
                if (errorCallback) {
                    errorCallback(response);
                }
            });
        }

        function getItems(vm, serviceKey, vmObject, params, callBack, serviceUrl, dontPreserveLocally, errorCallback, callBackParams, path, paramObj) {
            commonApi.getListItem(serviceKey, params, serviceUrl)
                .then(function successCallback(response) {
                    if (CONSTANT_APP_MODE === "1") {
                        var dt = response.data.data;
                        if (!dontPreserveLocally) {
                            if (!response.data.fromq) {
                                for (var i = 0; i < dt.length; i++) {
                                    commonApi.preserveLocally(serviceKey, dt[i], serviceUrl);
                                }
                            }
                            dt = commonApi.filterByParams(response.data.data, params);
                        }
                        if (!path) {
                            vm[vmObject] = dt;
                        }
                        else {
                            var obj = jsonManipulator(dt, paramObj, path);
                            if (angular.isArray(vm[vmObject])) {
                                vm[vmObject].push(obj);
                            }
                            else {
                                vm[vmObject] = obj;
                            }
                        }

                    }

                    if (callBack) {
                        if (callBackParams) {
                            callBack(callBackParams, response.data.data);
                        }
                        else {
                            callBack(response.data.data);
                        }
                    }

                }, function (response) {
                    if (errorCallback) {
                        errorCallback(response);
                    }
                });
        }

        function saveItem(vm, item, isNew, serviceKey, vmObject, isPageItem, callBack, serviceUrl, dontPreserveLocally) {
            if (!isNew) {
                var id = item[PRIMARY_COLUMN_NAME];
            }

            commonApi.saveItem(serviceKey, id, item, serviceUrl)
                .then(function (response) {
                    if (CONSTANT_APP_MODE === "1") {
                        commonApi.preserveLocally(serviceKey, response.data.data);
                    }
                    if (!dontPreserveLocally) {
                        if (!isPageItem) {
                            if (!isNew) {
                                var index = utilService.getIndex(vm[vmObject], PRIMARY_COLUMN_NAME, item[PRIMARY_COLUMN_NAME]);
                                if (index >= 0) {
                                    vm[vmObject][index] = item;
                                }
                            } else {
                                vm[vmObject].push(item);
                            }
                        }
                    }

                    if (callBack) {
                        callBack(item);
                    }

                }, function (response) {
                    alert(reason);
                });
        }

        function saveItems(serviceKey, items, callBack) {

            commonApi.saveItems(serviceKey, items)
                .then(function (response) {
                    if (CONSTANT_APP_MODE === "1") {
                        for (var i = 0; i < response.data.data.length; i++) {
                            commonApi.preserveLocally(serviceKey, response.data.data[i]);
                        }

                    }

                    if (callBack) {
                        callBack(response.data.data);
                    }

                }, function (response) {
                    alert(reason);
                });
        }

        //    "path": "/[TECHDISER_ID=$styleId]/materials[TECHDISER_ID=$materialId]/consumptionInfo[$consumptionType]"
        function jsonManipulator(rootObj, parameterObj, path, newObj) {
            var exploredPath = '';
            var objectPath = [];
            if (rootObj && parameterObj && path) {
                if (path == PARAM_NOTION.starterNotion) {
                    return rootObj;
                }
                var sourceJson = rootObj;
                var tagPath = PARAM_NOTION.starterNotion;
                var pathComponents = path.split(PARAM_NOTION.starterNotion);
                var i = 1;
                if (pathComponents && pathComponents.length > 1) {
                    for (; i < pathComponents.length; i++) {
                        if (pathComponents[i] && sourceJson) {
                            exploredPath += PARAM_NOTION.starterNotion;
                            if (angular.isArray(sourceJson)) {
                                var obj = fetchItemFromArray(pathComponents[i], sourceJson, parameterObj);
                                if (obj && obj.index >= 0) {
                                    //objectPath=objectPath[i];
                                    objectPath.push(obj.index);
                                    sourceJson = obj.foubdObj;
                                    exploredPath += pathComponents[i];
                                }
                            }
                            else if (checkObject(sourceJson)) {
                                var paramNotions = fetchVariablePart(pathComponents[i]);
                                if (paramNotions && paramNotions.length > 0) {
                                    var paramNotion = paramNotions[0];
                                    var attrComp = pathComponents[i].split(paramNotion);
                                    if (attrComp && attrComp[0]) {
                                        var att = attrComp[0];
                                        if (att && att.length > 0) {
                                            if (sourceJson[att] && checkObject(sourceJson[att])) {
                                                sourceJson = sourceJson[att];
                                                //objectPath=objectPath[att];
                                                objectPath.push(att);
                                                exploredPath += att;
                                            }
                                            if (paramNotion && paramNotion.length > 1) {
                                                if (angular.isArray(sourceJson)) {
                                                    var obj = fetchItemFromArray(paramNotion, sourceJson, parameterObj);
                                                    if (obj && obj.index >= 0) {
                                                        //objectPath=objectPath[i];
                                                        objectPath.push(obj.index);
                                                        sourceJson = obj.foubdObj;
                                                        exploredPath += paramNotion;
                                                    }

                                                }
                                                else if (paramNotion.charAt(1) === PARAM_NOTION.paramNotion) {
                                                    var paramKey = paramNotion.substring(2, paramNotion.length - 1);
                                                    var paramVal = searchFromParam(parameterObj, paramKey);
                                                    if (sourceJson[paramVal] && checkObject(sourceJson[paramVal])) {
                                                        //objectPath=objectPath[att];
                                                        objectPath.push(att);
                                                        //objectPath=objectPath[paramVal];
                                                        objectPath.push(paramVal)
                                                        sourceJson = sourceJson[paramVal];
                                                        exploredPath += paramVal;
                                                    }
                                                }
                                                else if (paramNotion.split('=').length > 1) {
                                                    var obj = handleKeyValAssign(paramNotion, sourceJson, parameterObj);
                                                    if (obj) {
                                                        sourceJson = obj.foubdObj;
                                                        exploredPath += paramNotion;
                                                    }

                                                }
                                            }
                                        }
                                    }
                                    else if (paramNotion.split('=').length > 1) {
                                        var obj = handleKeyValAssign(paramNotion, sourceJson, parameterObj);
                                        if (obj) {
                                            sourceJson = obj.foubdObj;
                                        }
                                        exploredPath += paramNotion;
                                    }
                                    else if (pathComponents[i]) {
                                        var obj = searchFromSourceObj(sourceJson, null, pathComponents[i]);
                                        if (obj) {
                                            var attrb = pathComponents[i];
                                            //objectPath=objectPath[attrb];
                                            objectPath.push(attrb);
                                            sourceJson = obj.foubdObj;
                                        }
                                        exploredPath += pathComponents[i];
                                    }
                                }
                                else if (pathComponents[i]) {
                                    var atr = pathComponents[i];
                                    sourceJson = sourceJson[atr];
                                    objectPath.push(atr);
                                    exploredPath += pathComponents[i];
                                }

                            }
                        }
                    }
                    if (exploredPath == path) {
                        //objectPath= newObj;
                        if (newObj) {
                            rootObj = replaceJsonContent(objectPath, rootObj, newObj, 0);
                        }
                        else {
                            return angular.copy(sourceJson);
                        }
                    }
                }
            }
            if (!newObj) {
                return null;
            }
            return rootObj;

        }
        function searchFromParam(tagParameters, paramKey) {
            if (tagParameters && tagParameters.length > 0) {
                for (var i = 0; i < tagParameters.length; i++) {
                    if (tagParameters[i] && tagParameters[i].key && tagParameters[i].key == paramKey) {
                        return tagParameters[i].value;
                    }
                }
            }
            return null;
        }
        function checkObject(obj) {
            if (!((typeof obj === 'number') || (typeof obj === 'boolean') || (typeof obj === 'string'))) {
                return true;
            }
            return false;
        }

        function fetchVariablePart(str) {
            if (str) {
                return str.match(/\[.*\]/g);
            }
            return '';
        }

        function searchFromSourceObj(obj, val, attr) {
            if (obj) {
                var i = -1;
                if (angular.isArray(obj)) {
                    if (attr == PRIMARY_COLUMN_NAME) {
                        var nV = null;
                        for (i = 0; i < obj.length; i++) {
                            if (obj[i] && obj[i][attr] && obj[i][attr] == val) {
                                nV = obj[i];
                                break;
                            }
                        }
                        obj = nV;
                    }
                    else {
                        for (i = 0; i < obj.length; i++) {
                            if (obj[i][attr] && val && obj[i][attr] != val) {
                                obj.splice(i, 1);
                                i--;
                            }
                        }
                    }
                    // if(val){
                    //     var aObj=null;
                    //     for ( i = 0; i < obj.length; i++) {
                    //         if (obj[i] && obj[i][attr] && obj[i][attr] == val) {
                    //             if(!aObj){
                    //               aObj=[];
                    //             }
                    //             aObj.push(obj[i]);
                    //             break;
                    //         }
                    //     }
                    //     obj=aObj;
                    // }
                    // else{
                    //     for ( i = 0; i < obj.length; i++) {
                    //         if (obj[i] && obj[i][attr] && obj[i][attr] == val) {
                    //             obj=obj[i];
                    //             break;
                    //         }
                    //     }
                    // }

                }
                else if (checkObject(obj)) {
                    if (obj[attr] && checkObject(obj[attr])) {
                        obj = obj[attr];
                    }
                    else if (!obj[attr]) {
                        obj = null;
                    }
                }
                return { "index": i, "foubdObj": obj, "objAtt": attr }
            }
            return null;

        }

        function handleKeyValAssign(paramNotion, sourceJson, parameters) {
            if (paramNotion.length > 1) {
                var keyVal = paramNotion.split('=');
                if (keyVal && keyVal.length > 1) {
                    var param = keyVal[1].substring(1, keyVal[1].length - 1);
                    var key = keyVal[0].substring(1);
                    var val = searchFromParam(parameters, param);
                    if (val && key) {
                        return searchFromSourceObj(sourceJson, val, key)
                        // if (key ==  PRIMARY_COLUMN_NAME || key == CODE_COLUMN_NAME) {
                        //     return searchFromSourceObj(sourceJson, val, key)
                        // }
                    }
                }
            }
            return null;
        }

        function fetchItemFromArray(conditionPart, sourceJson, parameters) {
            var selector = fetchVariablePart(conditionPart);
            if (selector && selector[0] && selector[0].length > 0) {
                return handleKeyValAssign(selector[0], sourceJson, parameters);
            }
            return null;
        }




        function replaceJsonContent(objectPath, rootObj, newObj, index) {
            if (rootObj && objectPath) {
                if (index >= objectPath.length) {
                    if (angular.isArray(rootObj)) {
                        rootObj.push(newObj);
                    }
                    else {
                        rootObj = newObj;
                    }
                }
                else {
                    var attr = objectPath[index];
                    rootObj[attr] = replaceJsonContent(objectPath, rootObj[attr], newObj, index + 1);
                }
            }
            return rootObj;
        }




        return service;
    }
})();
