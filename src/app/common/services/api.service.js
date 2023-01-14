(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('msbCommonApiService', msbCommonApiService);

    /** @ngInject */
    function msbCommonApiService($injector, $mdDialog, $timeout, msbUtilService, msbCommonApi,
        CONSTANT_APP_MODE, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME, PARAM_NOTION) {

        var service = {
            fillDataToVmObject: fillDataToVmObject,
            getItem: getItem,
            getItems: getItems,
            getItemsByKeys: getItemsByKeys,
            saveItem: saveItem,
            saveItems: saveItems,
            getIdFromServer: getIdFromServer,
            saveInnerItem: saveInnerItem,
            interfaceManager: interfaceManager,
            workingDataManager: workingDataManager,
        };

        var supportives = []

        function workingDataManager(callback, calls) {
            // [
            //     {serviceName,taskCode,param,vmData, vmDatPath}
            // ]
            if (callback && calls && calls.length > 0) {
                var called = 0;
                calls.forEach(function (fCall) {
                    if (fCall && fCall.serviceName && fCall.taskCode && fCall.params && fCall.vmDataPath) {
                        var existingDat = msbUtilService.jsonManipulator(fCall.vmData, fCall.params, fCall.vmDataPath);
                        if (!existingDat) {
                            interfaceManager(function (data) {
                                if (data && fCall.vmDataPath) {
                                    fCall.vmData = msbUtilService.jsonManipulator(fCall.vmData, fCall.params, fCall.vmDataPath, data);
                                }
                                called++;
                                // fCall.data=data;
                                if (called == calls.length) {
                                    callback(calls)
                                }
                            }, fCall.serviceName, fCall.taskCode, fCall.params)
                        }
                        else {
                            called++;
                        }
                    }
                });
            }
        }


        function interfaceManager(callBack, serviceName, taskCode, param) {
            var func = null;
            if (supportives) {
                // for(var i=0;i<supportives.length;i++){
                //     if(supportives[i] && supportives[i].serviceName==serviceName){
                //         if(!supportives[i].service){
                //             supportives.splice(i,1)
                //             break;
                //         }
                //         func = supportives[i].service["interfaceDef"];
                //     }
                // }
                if (func == null) {
                    var myService = $injector.get(serviceName);
                    // var newServc={"service":myService,"serviceName":serviceName};
                    func = myService["interfaceDef"];
                }
            }
            if (func) {
                return func(callBack, taskCode, param)
            }
            return null;
        }


        function fillDataToVmObject(data, vm, vmObject) {

            if (!vm[vmObject]) {
                vm[vmObject] = [];
            }

            for (var i = 0; i < data.length; i++) {
                var index = msbUtilService.getIndex(vm[vmObject], PRIMARY_COLUMN_NAME, data[i][PRIMARY_COLUMN_NAME]);
                if (index > -1) {
                    vm[vmObject][index] = data[i];
                } else {
                    vm[vmObject].push(data[i]);
                }

            }
        }

        function getIdFromServer(serviceKey, callBack, taskKey, rootObjectId, path) {
            msbCommonApi.getIdFromServer(serviceKey, taskKey, rootObjectId, path).then(function (response) {
                if (callBack) {
                    callBack(response.data.data);
                }
            }, function (response) {
                console.log("Error in getIdFromServer: " + response);
            });
        }

        function getItem(serviceKey, itemId, itemKey, successCallBack, errorCallback, callBackParams, taskKey, path, paramObj, deepIDs) {
            if (CONSTANT_APP_MODE === "1") {
                if (msbCommonApi.isJsonLoaded(serviceKey, taskKey)) {
                    getSingleItem(serviceKey, itemId, itemKey, successCallBack, errorCallback, callBackParams, taskKey, path, paramObj);
                } else {
                    getItems(serviceKey, null, function () {
                        getSingleItem(serviceKey, itemId, itemKey, successCallBack, errorCallback, callBackParams, taskKey, path, paramObj);
                    }, errorCallback, false, callBackParams, taskKey, path, paramObj, deepIDs);
                }
            } else {
                getSingleItem(serviceKey, itemId, itemKey, successCallBack, errorCallback, callBackParams, taskKey, path, paramObj);
            }
        }


        function getSingleItem(serviceKey, itemId, itemKey, successCallBack, errorCallback, callBackParams, taskKey, path, paramObj) {

            msbCommonApi.getSingleItem(serviceKey, itemId, itemKey, taskKey).then(function (response) {
                var data = response.data.data;
                if (path) {
                    data = msbUtilService.jsonManipulator(data, paramObj, path);
                }

                if (successCallBack) {
                    successCallBack(data, callBackParams);
                }
            }, function (response) {
                console.log("Error in getItem: " + response);
                if (errorCallback) {
                    errorCallback(response);
                }
            });
        }

        function getItemsByKeys(serviceKey, itemKey, itemkeys, successCallBack, errorCallback, callBackParams, taskKey, path, paramObj) {

            if (CONSTANT_APP_MODE === "1") {
                if (msbCommonApi.isJsonLoaded(serviceKey, taskKey)) {
                    getItemsByKeysActual(serviceKey, itemKey, itemkeys, successCallBack, errorCallback, callBackParams, taskKey, path, paramObj);
                } else {
                    getItems(serviceKey, null, function () {
                        getItemsByKeysActual(serviceKey, itemKey, itemkeys, successCallBack, errorCallback, callBackParams, taskKey, path, paramObj);
                    }, errorCallback, false, callBackParams, taskKey, path, paramObj, deepIDs);
                }
            } else {
                getItemsByKeysActual(serviceKey, itemKey, itemkeys, successCallBack, errorCallback, callBackParams, taskKey, path, paramObj);
            }

        }

        function getItemsByKeysActual(serviceKey, itemKey, itemkeys, successCallBack, errorCallback, callBackParams, taskKey, path, paramObj) {

            msbCommonApi.getItemsByKeys(serviceKey, itemKey, itemkeys, taskKey).then(function (response) {
                var data = response.data.data;
                if (path) {
                    data = msbUtilService.jsonManipulator(data, paramObj, path);
                }

                if (successCallBack) {
                    successCallBack(data);
                }

            }, function (response) {
                console.log("Error in getItemsByKeys: " + response);
                if (errorCallback) {
                    errorCallback(response);
                }
            });
        }

        function getItems(serviceKey, searchParams, successCallBack, errorCallback, dontPreserveLocally, callBackParams, taskKey, path, paramObj, newObj, deepIDs, retrieveDeep) {

            msbCommonApi.getListItem(serviceKey, searchParams, taskKey)
                .then(function (response) {
                    var data = response.data.data;
                    if (!dontPreserveLocally) {
                        msbCommonApi.updateJsonReadKey(serviceKey, taskKey);
                        if (!response.data.fromq) {
                            for (var i = 0; i < data.length; i++) {
                                msbCommonApi.preserveLocally(serviceKey, data[i], taskKey);
                            }
                        }
                    }

                    if (searchParams) {
                        data = msbUtilService.filterByParams(data, searchParams);
                    }

                    // data = msbUtilService.sortItems(data);

                    if (path) {
                        if (deepIDs) {
                            data = msbUtilService.deepJsonSearch(data, path, deepIDs, retrieveDeep);
                        }
                        else {
                            data = msbUtilService.jsonManipulator(data, paramObj, path, newObj);
                        }
                    }

                    if (successCallBack) {
                        var sortedData = data
                        if (data && data.length > 0) {
                            var sortedData = _.sortBy(data, SERIAL_COLUMN_NAME)
                        }
                        successCallBack(sortedData, callBackParams);
                    }

                }, function (response) {
                    if (errorCallback) {
                        console.log("Error in getItems: " + response);
                        errorCallback(response);
                    }

                });
        }

        function saveItem(item, isNew, serviceKey, successCallBack, errorCallback, dontPreserveLocally, callBackParams, taskKey, doNotMerge) {
            if (!isNew) {
                var id = item[PRIMARY_COLUMN_NAME];
            }

            msbCommonApi.saveItem(serviceKey, id, item, taskKey, doNotMerge)
                .then(function (response) {
                    var data = response.data.data;
                    if (CONSTANT_APP_MODE === "1") {
                        if (!dontPreserveLocally) {
                            msbCommonApi.preserveLocally(serviceKey, data, taskKey);
                        }
                    }
                    if (successCallBack) {
                        successCallBack(data);
                    }

                }, function (response) {
                    console.log("Error in saveItem: " + response);
                    if (errorCallback) {
                        errorCallback(response);
                    }
                });
        }

        function saveInnerItem(itemId, newObj, serviceKey, taskKey, path, paramObj, successCallBack, errorCallback, callBackParams, isArray, toRemove, containerLinkPath, containerLinkData) {

            msbCommonApi.saveInnerItem(itemId, newObj, serviceKey, taskKey, path, paramObj, isArray, toRemove, containerLinkPath, containerLinkData)
                .then(function (response) {
                    var data = response.data.data;

                    if (successCallBack) {
                        successCallBack(data);
                    }

                }, function (response) {
                    console.log("Error in saveItem: " + response);
                    if (errorCallback) {
                        errorCallback(response);
                    }
                });

        }

        function saveItems(serviceKey, items, successCallBack, errorCallback, callBackParams, dontPreserveLocally, taskKey, path, paramObj) {

            msbCommonApi.saveItems(serviceKey, items, taskKey, path, paramObj)
                .then(function (response) {
                    if (CONSTANT_APP_MODE === "1") {
                        if (!dontPreserveLocally) {
                            for (var i = 0; i < response.data.data.length; i++) {
                                msbCommonApi.preserveLocally(serviceKey, response.data.data[i], taskKey);
                            }
                        }
                    }

                    if (successCallBack) {
                        successCallBack(response.data.data);
                    }

                }, function (response) {
                    console.log("Error in saveItems: " + response);
                    if (errorCallback) {
                        errorCallback(response);
                    }
                });
        }

        // function getKeyValueNames(keyVal) {
        //     var kInfo={"param": null , "key": null }
        //     if (keyVal  ) {
        //           keyVal = keyVal.split('=');
        //           if (keyVal && keyVal.length > 1) {
        //               kInfo.param = keyVal[1].substring(1, keyVal[1].length-1);
        //               kInfo.key = keyVal[0].substring(1);
        //           }
        //       }
        //      return kInfo;
        // }


        // function pathHandler(parameterObj, path) {
        //     var preparedPath='';
        //     if (parameterObj && path) {
        //         var paramNotions = path.split(/\[*\]/g);
        //         if (paramNotions && paramNotions.length > 0) {
        //             for (var i=0; i < paramNotions.length; i++) {
        //                 if(paramNotions[i]){
        //                     var prts=paramNotions[i].split('[');
        //                     if(prts && prts.length>0){
        //                         for(var j=0;j<prts.length;j++){
        //                             if(prts[j].split('=').length>1){
        //                                 var vl=null;
        //                                 if(prts[j]){
        //                                     var kInfo=getKeyValueNames('['+prts[j]+']');
        //                                     if(kInfo && kInfo.param && kInfo.key){
        //                                         vl= searchFromParam(parameterObj, kInfo.param);
        //                                     }
        //                                 }
        //                                 if(vl){
        //                                     preparedPath=preparedPath+vl;
        //                                 }
        //                                 else{
        //                                     preparedPath=preparedPath+prts[j]
        //                                 }
        //                             }
        //                             else{
        //                                 preparedPath=preparedPath+prts[j]
        //                             }
        //                         }
        //                     }
        //                     else{
        //                         preparedPath=preparedPath+paramNotions[i]
        //                     }
        //                 }

        //             }
        //         }
        //         else{
        //             return path;
        //         }
        //     }
        //     return preparedPath;
        // }

        // //    "path": "/[TECHDISER_ID=$styleId]/materials[TECHDISER_ID=$materialId]/consumptionInfo[$consumptionType]"
        // function jsonManipulator(rootObj, parameterObj, path, newObj) {
        //         var exploredPath='';
        //         var objectPath=[];
        //         if (rootObj && parameterObj && path) {
        //             if(path==PARAM_NOTION.starterNotion){
        //                 return rootObj;
        //             }
        //             var sourceJson=rootObj;
        //             var tagPath = PARAM_NOTION.starterNotion;
        //             var pathComponents = path.split(PARAM_NOTION.starterNotion);
        //             var i = 1;
        //             if (pathComponents && pathComponents.length > 1) {
        //                 for (; i < pathComponents.length; i++) {
        //                     if (pathComponents[i] && sourceJson){
        //                         exploredPath += PARAM_NOTION.starterNotion;
        //                         if(angular.isArray(sourceJson)){
        //                             var obj=fetchItemFromArray(pathComponents[i],sourceJson,parameterObj);
        //                             if(obj && obj.index>=0){
        //                                 //objectPath=objectPath[i];
        //                                 objectPath.push(obj.index);
        //                                 sourceJson=obj.foubdObj;
        //                                 exploredPath +=pathComponents[i];
        //                             }
        //                         }
        //                         else if( checkObject(sourceJson) ) {
        //                             var paramNotions = fetchVariablePart(pathComponents[i]);
        //                             if (paramNotions && paramNotions.length > 0) {
        //                                 var paramNotion = paramNotions[0];
        //                                 var attrComp = pathComponents[i].split(paramNotion);
        //                                 if(attrComp && attrComp[0]){
        //                                     var att=attrComp[0];
        //                                     if(att && att.length>0){
        //                                         if(sourceJson[att] && checkObject(sourceJson[att]) ){
        //                                             sourceJson=sourceJson[att];
        //                                             //objectPath=objectPath[att];
        //                                             objectPath.push(att);
        //                                             exploredPath +=att;
        //                                         }
        //                                         if(paramNotion && paramNotion.length > 1){
        //                                             if(angular.isArray(sourceJson)){
        //                                                 var obj=fetchItemFromArray(paramNotion,sourceJson,parameterObj);
        //                                                 if(obj && obj.index>=0){
        //                                                     //objectPath=objectPath[i];
        //                                                     objectPath.push(obj.index);
        //                                                     sourceJson=obj.foubdObj;
        //                                                     exploredPath +=paramNotion;
        //                                                 }

        //                                             }
        //                                             else if(paramNotion.charAt(1) === PARAM_NOTION.paramNotion){
        //                                                 var paramKey =paramNotion.substring(2,paramNotion.length-1);
        //                                                 var paramVal = searchFromParam(parameterObj, paramKey);
        //                                                 if(sourceJson[paramVal] && checkObject(sourceJson[paramVal])){
        //                                                     //objectPath=objectPath[att];
        //                                                     objectPath.push(att);
        //                                                     //objectPath=objectPath[paramVal];
        //                                                     objectPath.push(paramVal)
        //                                                     sourceJson=sourceJson[paramVal];
        //                                                     exploredPath +=paramVal;
        //                                                 }
        //                                             }
        //                                             else if(paramNotion.split('=').length>1){
        //                                                 var obj=handleKeyValAssign(paramNotion, sourceJson, parameterObj);
        //                                                 if(obj){
        //                                                     sourceJson=obj.foubdObj;
        //                                                     exploredPath +=paramNotion;
        //                                                 }

        //                                             }
        //                                         }
        //                                     }
        //                                 }
        //                                 else if(paramNotion.split('=').length>1){
        //                                     var obj=handleKeyValAssign(paramNotion, sourceJson, parameterObj);
        //                                     if(obj){
        //                                         sourceJson=obj.foubdObj;
        //                                     }
        //                                     exploredPath +=paramNotion;
        //                                 }
        //                                 else if(pathComponents[i]){
        //                                     var obj=searchFromSourceObj(sourceJson, null, pathComponents[i]);
        //                                     if(obj){
        //                                         var attrb=pathComponents[i];
        //                                         //objectPath=objectPath[attrb];
        //                                         objectPath.push(attrb);
        //                                         sourceJson=obj.foubdObj;
        //                                     }
        //                                     exploredPath +=pathComponents[i];
        //                                 }
        //                             }
        //                             else if(pathComponents[i]){
        //                                 var atr=pathComponents[i];
        //                                 sourceJson=sourceJson[atr];
        //                                 objectPath.push(atr);
        //                                 exploredPath +=pathComponents[i];
        //                             }

        //                         }
        //                     }
        //                 }
        //                 if(exploredPath==path){
        //                     //objectPath= newObj;
        //                     if(newObj){
        //                         rootObj=replaceJsonContent(objectPath,rootObj,newObj,0);
        //                     }
        //                     else{
        //                         return angular.copy(sourceJson);
        //                     }
        //                 }
        //             }
        //         }
        //         if(!newObj){
        //         return null;
        //         }
        //         return rootObj;

        // }

        // function searchFromParam(tagParameters, paramKey) {
        //     if (tagParameters && tagParameters.length > 0) {
        //         for (var i = 0; i < tagParameters.length; i++) {
        //             if (tagParameters[i] && tagParameters[i].key && tagParameters[i].key  == paramKey) {
        //                 return tagParameters[i].value;
        //             }
        //         }
        //     }
        //     return null;
        // }

        // function checkObject(obj){
        //     if( !((typeof obj === 'number') || (typeof obj === 'boolean') || (typeof obj === 'string')) ){
        //         return true;
        //     }
        //     return false;
        // }

        // function fetchVariablePart(str) {
        //     if (str) {
        //         return str.match(/\[.*\]/g);
        //     }
        //     return '';
        // }

        // function searchFromSourceObj(obj, val, attr) {
        //     if(obj){
        //         var i = -1;
        //         if(angular.isArray(obj)){
        //             if(attr==PRIMARY_COLUMN_NAME){
        //                 var nV=null;
        //                 for ( i = 0; i < obj.length; i++) {
        //                     if (obj[i] && obj[i][attr] && obj[i][attr] == val) {
        //                         nV=obj[i];
        //                         break;
        //                     }
        //                 }
        //                 obj=nV;
        //             }
        //             else{
        //                 for ( i = 0; i < obj.length; i++) {
        //                     if(obj[i][attr] && val && obj[i][attr] != val){
        //                         obj.splice(i,1);
        //                         i--;
        //                     }
        //                 }
        //             }
        //             // if(val){
        //             //     var aObj=null;
        //             //     for ( i = 0; i < obj.length; i++) {
        //             //         if (obj[i] && obj[i][attr] && obj[i][attr] == val) {
        //             //             if(!aObj){
        //             //               aObj=[];
        //             //             }
        //             //             aObj.push(obj[i]);
        //             //             break;
        //             //         }
        //             //     }
        //             //     obj=aObj;
        //             // }
        //             // else{
        //             //     for ( i = 0; i < obj.length; i++) {
        //             //         if (obj[i] && obj[i][attr] && obj[i][attr] == val) {
        //             //             obj=obj[i];
        //             //             break;
        //             //         }
        //             //     }
        //             // }

        //         }
        //         else if(checkObject(obj)){
        //             if( obj[attr] && checkObject(obj[attr]) ){
        //                 obj= obj[attr];
        //             }
        //             else if(!obj[attr]){
        //                 obj= null;
        //             }
        //         }
        //         return {"index": i, "foubdObj":obj, "objAtt":attr}
        //     }
        //     return null;

        // }

        // function handleKeyValAssign(paramNotion, sourceJson, parameters) {
        //     if (paramNotion.length > 1  ) {
        //         var keyVal = paramNotion.split('=');
        //         if (keyVal && keyVal.length > 1) {
        //             var param = keyVal[1].substring(1, keyVal[1].length-1);
        //             var key = keyVal[0].substring(1);
        //             var val = searchFromParam(parameters, param);
        //             if (val && key) {
        //                 return searchFromSourceObj(sourceJson, val, key)
        //                 // if (key ==  PRIMARY_COLUMN_NAME || key == CODE_COLUMN_NAME) {
        //                 //     return searchFromSourceObj(sourceJson, val, key)
        //                 // }
        //             }
        //         }
        //     }
        //     return null;
        // }

        // function fetchItemFromArray(conditionPart,sourceJson,parameters){
        //     var selector=fetchVariablePart(conditionPart);
        //     if(selector && selector[0] && selector[0].length>0){
        //         return handleKeyValAssign(selector[0], sourceJson, parameters);
        //     }
        //     return null;
        // }

        // function replaceJsonContent(objectPath,rootObj,newObj,index){
        //     if(rootObj && objectPath){
        //         if(index>=objectPath.length){
        //         if(angular.isArray(rootObj)){
        //             if(angular.isArray(newObj)){
        //                 for(var i=0;i<newObj.length;i++){
        //                     if(newObj[i]){
        //                         rootObj.push(newObj[i]);
        //                     }
        //                 }
        //             }
        //             else{
        //                 rootObj.push(newObj);
        //             }
        //         }
        //         else{
        //             rootObj=newObj;
        //         }
        //         }
        //         else{
        //             var attr=objectPath[index];
        //             rootObj[attr]=replaceJsonContent(objectPath,rootObj[attr],newObj,index+1);
        //         }
        //     }
        //     return rootObj;
        // }



        return service;
    }
})();
