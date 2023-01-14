(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('jsonArrayService', jsonArrayService);

    /** @ngInject */
    function jsonArrayService(utilService, CONSTANT_DATE_TIME_FORMATS, CONSTANT_SEPERATOR) {


        var service = {
            initJsonToArray: initJsonToArray,
            inintArrayToJson: inintArrayToJson
        };



        //----------------------Serverend Convertion Starts -----------------------------

        //-------------- Register Definition Starts --------------------------------



        function getRegisterColumnDef(serviceCode, rootObjId, tp, seperator) {  //-------populates 'arrayColumnDefinitions'
            return {
                sCD: serviceCode,
                rOID: rootObjId,
                cID: rootObjId + seperator + tp,
                ctype: tp,
                cDef: [],
                uniqueKeySets: null,
            };
        }

        function getRegisterColumnItemDef(pName, pType, pIsPrimaryKeyMember, pIsSearchable) {   //-------populates 'arrayColumnDefinitions.cDef'
            return {
                title: pName,
                type: pType,
                isPrimaryKeyMember: (pIsPrimaryKeyMember) ? true : false,
                isSearchable: (pIsSearchable) ? true : false,
            };
        }

        function getRegisterDataDef() {  //-------populates 'jsonContent'
            return {
                dataSet: [],
                isArray: false,
                columnDefinition: null
            }
        }



        //-------------- Register Definition Ends --------------------------------



        var arrayColumnDefinitions = [];
        var arrayIndexer = [];
        var loadableContent = null;
        var format = CONSTANT_DATE_TIME_FORMATS.CONSTANT_SYS_DATE_FORMAT + CONSTANT_DATE_TIME_FORMATS.CONSTANT_DATE_TIME_SEPARATOR + CONSTANT_DATE_TIME_FORMATS.CONSTANT_SYS_TIME_FORMAT;



        function initJsonToArray(serviceCode, rootObjId, tna, convertionConfig) {

            var jsn = 0;

            console.log('starting object to array at: ' + new Date());

            arrayColumnDefinitions = [];
            arrayIndexer = [];

            var isArr = false;
            if (angular.isArray(tna)) {
                isArr = true;
            }
            var jsonContent = getRegisterDataDef();
            jsonContent.isArray = isArr;

            if (isArr) {
                for (jsn = 0; jsn < tna.length; jsn++) {
                    var retrievedInfo = [];

                    convertJsonToArray(serviceCode, rootObjId, CONSTANT_SEPERATOR, convertionConfig, retrievedInfo, tna[jsn]);

                    var i = retrievedInfo.length;
                    while (i >= 0) {
                        if (retrievedInfo[i] && retrievedInfo[i].arrContent && retrievedInfo[i].arrContent.length <= 0) {
                            retrievedInfo.splice(i, 1);
                        }
                        i--;
                    }

                    jsonContent.dataSet.push(retrievedInfo)
                }
                jsonContent.columnDefinition = arrayColumnDefinitions;
                // jsonContent.convertionConfig=convertionConfig;
                // jsonContent.arrayIndexer=arrayIndexer;
                jsonContent.columnDefinition = angular.fromJson(angular.toJson(arrayColumnDefinitions));
                jsonContent.convertionConfig = angular.fromJson(angular.toJson(convertionConfig));
            }
            else {
                var retrievedInfo = [];

                convertJsonToArray(serviceCode, rootObjId, CONSTANT_SEPERATOR, convertionConfig, retrievedInfo, tna);
                var def = angular.fromJson(angular.toJson(arrayColumnDefinitions));
                jsonContent.dataSet.push(retrievedInfo);
                jsonContent.columnDefinition = arrayColumnDefinitions;
                // jsonContent.convertionConfig=convertionConfig;
                // jsonContent.arrayIndexer=arrayIndexer;
                jsonContent.columnDefinition = angular.fromJson(angular.toJson(arrayColumnDefinitions));
                jsonContent.convertionConfig = angular.fromJson(angular.toJson(convertionConfig));
            }
            if (arrayIndexer.length > 0) {
                console.log(arrayIndexer[0]);
            }
            console.log('ended object to array at: ' + new Date());
            //var srlz=pako.gzip(JSON.stringify(preparedJsonArray), { to: 'Uint8Array' });
            //console.log('serialized size: '+srlz.length);
            return jsonContent;
        }


        function inintArrayToJson(itm, convertionConfig) {
            var preparedTnA = [];
            console.log('starting array to object at: ' + new Date());
            if (itm) {
                loadableContent = itm.dataSet;
                arrayColumnDefinitions = itm.columnDefinition;
                if (itm.dataSet && arrayColumnDefinitions) {
                    if (itm.isArray) {
                        for (var i = 0; i < itm.dataSet.length; i++) {
                            if (itm.dataSet[i]) {
                                preparedTnA.push(convertArrayToJson(CONSTANT_SEPERATOR, convertionConfig, i));
                            }
                        }
                    }
                    else {
                        preparedTnA.push(convertArrayToJson(CONSTANT_SEPERATOR, convertionConfig, 0));
                    }
                }

            }
            console.log('finished array to object at: ' + new Date());


            return preparedTnA;

        }

        function getcolDefinitionIndex(pType) {
            for (var i = 0; i < arrayColumnDefinitions.length; i++) {
                if (arrayColumnDefinitions.length > 0 && arrayColumnDefinitions[i].ctype == pType) {
                    return i;
                }
            }
            return -1;
        }



        //   pUniqueKeySets: 2D Array, each array item will result into a Unique set of Data
        function getRegisterArrayItem(serviceCode, rootObjId, pArrType, pConvertionConfig, seperator) {

            pArrType = ((pArrType) ? pArrType : pConvertionConfig.rootArrType);

            var tIndex = getcolDefinitionIndex(pArrType);

            if (tIndex >= 0) {
                return tIndex;
            }

            var regColDef = getRegisterColumnDef(serviceCode, rootObjId, pArrType, seperator);

            arrayColumnDefinitions.push(regColDef);

            return arrayColumnDefinitions.length - 1;

        }




        function getItemSelfIndex(rowNumber) {
            return rowNumber;
        }

        var selfArrayType = 'nAT';
        var pathToObject = 'nOP'
        var positionInArray = 'nAP'
        var infoSerialNumber = 'nSL'
        var nodeAttributeHierarchy = 'nAPat';
        var rootObjectID = 'rOID';
        var opServiceCode = 'sCD';
        var objectID = 'oID';
        var parentArrayType = 'pAT';
        var pathToParentObject = 'pOP';
        var parentObjectId = 'pID';
        var childAttributes = 'chAttr';




        function convertJsonToArray(serviceCode, rootObjId, seperator, pConvertionConfig,
            retrievedInfo, obj, ofAttribute, referenceAttr,
            pathToNode, prntObjectId, attrhirch, referredFromArray, indexInParrentArray) {

            if (!indexInParrentArray) {
                indexInParrentArray = 0;
            }
            if (ofAttribute == undefined || ofAttribute == null) {
                ofAttribute = pConvertionConfig.rootArrType;
            }
            if (referenceAttr == undefined || referenceAttr == null) {
                referenceAttr = pConvertionConfig.rootArrType;
            }
            if (prntObjectId == undefined || prntObjectId == null) {
                prntObjectId = rootObjId;
            }

            if (angular.isObject(obj)) {

                var refColDef = getRegisterArrayItem(serviceCode, rootObjId, ofAttribute, pConvertionConfig, seperator);

                if (angular.isArray(obj)) {
                    if (obj.length <= 0) {
                        return [];
                    }
                    if (angular.isObject(obj[0])) {
                        for (var i = 0; i < obj.length; i++) {
                            if (angular.isObject(obj[i])) {
                                var retVal = convertJsonToArray(serviceCode, rootObjId, seperator, pConvertionConfig, retrievedInfo, obj[i], ofAttribute, referenceAttr, pathToNode, prntObjectId, attrhirch, true, i)
                                if (typeof retVal === 'string' && retVal.split(pConvertionConfig.linearArr).length > 1) {
                                    obj[i] = retVal;
                                }
                            }
                        }
                    }
                    else {
                        obj = pConvertionConfig.linearArr + obj.join(seperator);
                        return obj;
                    }
                }
                else if (!((typeof obj === 'number') || (typeof obj === 'boolean') || (typeof obj === 'string'))) {

                    var dt = [];

                    pathToNode = (pathToNode) ? pathToNode : CONSTANT_SEPERATOR;

                    attrhirch = (attrhirch) ? attrhirch : CONSTANT_SEPERATOR;


                    var pMD = {};

                    pMD[opServiceCode] = serviceCode;
                    pMD[rootObjectID] = rootObjId;

                    pMD[selfArrayType] = ofAttribute;
                    pMD[pathToObject] = '';
                    pMD[positionInArray] = '-1';

                    pMD[parentObjectId] = prntObjectId;

                    pMD[parentArrayType] = referenceAttr;
                    pMD[pathToParentObject] = pathToNode;

                    pMD[nodeAttributeHierarchy] = attrhirch;
                    pMD[childAttributes] = '';


                    pConvertionConfig.initialLength = dt.length;

                    var objList = [];
                    var tkitem = false;

                    if (arrayColumnDefinitions && refColDef < arrayColumnDefinitions.length && arrayColumnDefinitions[refColDef].cDef) {
                        var cObj = obj;
                        var currentId = pConvertionConfig.defaultId;
                        angular.forEach(obj, function (value, key) {
                            if (key.toLowerCase() == pConvertionConfig.objectId.col.toLowerCase() && pConvertionConfig.defaultId != value) {
                                currentId = value;
                            }

                            var toGenerateOndemand = false;
                            if (pConvertionConfig.generateOndemand && angular.isArray(pConvertionConfig.generateOndemand)) {
                                for (var g = 0; g < pConvertionConfig.generateOndemand.length; g++) {
                                    if (pConvertionConfig.generateOndemand[g] && pConvertionConfig.generateOndemand[g].tobeGenenerated.toLowerCase() == key.toLowerCase()) {
                                        if (pConvertionConfig.generateOndemand[g].conditions && angular.isArray(pConvertionConfig.generateOndemand[g].conditions)) {
                                            if (pConvertionConfig.generateOndemand[g].conditions.length > 0) {
                                                var f = 0;
                                                for (; f < pConvertionConfig.generateOndemand[g].conditions.length; f++) {
                                                    if (pConvertionConfig.generateOndemand[g].conditions[f] && pConvertionConfig.generateOndemand[g].conditions[f].attribute && pConvertionConfig.generateOndemand[g].conditions[f].val) {
                                                        if (pConvertionConfig.generateOndemand[g].conditions[f].val != cObj[pConvertionConfig.generateOndemand[g].conditions[f].attribute]) {
                                                            break;
                                                        }
                                                    }
                                                }
                                                if (f >= pConvertionConfig.generateOndemand[g].conditions.length) {
                                                    toGenerateOndemand = true;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }


                            var dtType = pConvertionConfig.dataTypeUndfnd;
                            var dtContent = null;

                            var j = pConvertionConfig.initialLength;

                            for (; j < arrayColumnDefinitions[refColDef].cDef.length; j++) {
                                if (key.toLowerCase() == arrayColumnDefinitions[refColDef].cDef[j].title.toLowerCase()) {
                                    break;
                                }
                            }

                            var k = dt.length;
                            for (; k <= j; k++) {
                                dt.push(null);
                            }
                            if (toGenerateOndemand) {
                                dtType = pConvertionConfig.ondemand;
                                dtContent = pConvertionConfig.ondemand;
                            }
                            else if (value != undefined) {
                                if (angular.isObject(value)) {
                                    if (typeof value.getMonth === 'function') {
                                        dtType = pConvertionConfig.dataTypeTime;
                                        dtContent = utilService.formatDateValue(value, format);
                                    }
                                    else if (angular.isArray(value) && value.length > 0 && !angular.isObject(value[0])) {
                                        dtType = pConvertionConfig.dataTypeArr;
                                        dtContent = pConvertionConfig.linearArr + value.join(seperator)
                                    }
                                    else {
                                        tkitem = true;
                                        var isArr = false;
                                        if (angular.isArray(value)) {
                                            isArr = true;
                                            dtType = pConvertionConfig.dataTypeArr;
                                        }
                                        else {
                                            dtType = pConvertionConfig.dataTypeObj;
                                        }
                                        //dtContent=( (angular.isArray(value))? pConvertionConfig.forArray+'-'+key:pConvertionConfig.forObject+'-'+key );
                                        dtContent = ((angular.isArray(value)) ? pConvertionConfig.forArray : pConvertionConfig.forObject);
                                        objList.push({ 'refKey': key, 'refValue': value, 'arrType': isArr });
                                    }
                                }
                                else if ((typeof value === 'number') || (typeof value === 'boolean') || (typeof value === 'string')) {
                                    if (typeof value === 'number') {
                                        dtType = pConvertionConfig.dataTypeNumber;
                                    }
                                    else if (typeof value === 'boolean') {
                                        dtType = pConvertionConfig.dataTypeBool;
                                    }
                                    else if (typeof value === 'string') {
                                        dtType = pConvertionConfig.dataTypeString;
                                    }
                                    tkitem = true;
                                    dtContent = value;
                                }
                            }
                            dt[j] = dtContent;
                            if (j == arrayColumnDefinitions[refColDef].cDef.length) {
                                arrayColumnDefinitions[refColDef].cDef.push(getRegisterColumnItemDef(key, dtType));
                            }

                        });

                        if (dt.length > pConvertionConfig.initialLength && tkitem) {

                            pathToNode = pathToNode + currentId + seperator;

                            pMD[pathToObject] = pathToNode;

                            //pMD[objectID]=pMD[opServiceCode]+seperator+pMD[rootObjectID]+seperator+pMD[selfArrayType]+seperator+pMD[pathToObject]+seperator+pMD[positionInArray];

                            if (referredFromArray) {
                                pMD[positionInArray] = '' + indexInParrentArray;
                            }

                            pMD[objectID] = pMD[opServiceCode] + seperator + pMD[rootObjectID] + seperator + pMD[selfArrayType] + seperator + pMD[pathToObject] + seperator + pMD[positionInArray];


                            pMD[infoSerialNumber] = '' + retrievedInfo.length;
                            retrievedInfo.push({ "md": pMD, "info": dt });

                            //sendInfoData(dt);

                            for (var i = 0; i < objList.length; i++) {
                                pMD[childAttributes] = CONSTANT_SEPERATOR + objList[i].refKey;
                                var retVal = convertJsonToArray(
                                    serviceCode,
                                    rootObjId,
                                    seperator,
                                    pConvertionConfig,
                                    retrievedInfo,
                                    objList[i].refValue,
                                    objList[i].refKey,
                                    pMD[selfArrayType],
                                    pathToNode,
                                    pMD[objectID],
                                    attrhirch + seperator + objList[i].refKey
                                );
                                if (typeof retVal === 'string') {
                                    obj[i] = retVal;
                                }
                            }
                        }
                    }



                }
            }
            return '';

        }



        function convertArrayToJson(seperator, pConvertionConfig, indx) {
            var preparedObj = [];
            try {
                if (loadableContent[indx] && arrayColumnDefinitions) {
                    for (var j = loadableContent[indx].length - 1; j >= 0; j--) {
                        if (loadableContent[indx][j] && loadableContent[indx][j].info && loadableContent[indx][j].md) {
                            if (loadableContent[indx][j].md[selfArrayType]) {
                                var tIndex = getcolDefinitionIndex(loadableContent[indx][j].md[selfArrayType]);
                                if (tIndex >= 0) {
                                    if (!arrayColumnDefinitions[tIndex].jsonStr) {
                                        arrayColumnDefinitions[tIndex].jsonStr = createJsonFromArray(arrayColumnDefinitions[tIndex].cDef, pConvertionConfig);
                                    }

                                    if (arrayColumnDefinitions[tIndex].jsonStr) {
                                        var wkrJson = JSON.parse(arrayColumnDefinitions[tIndex].jsonStr);
                                        if (wkrJson) {
                                            for (var k = pConvertionConfig.initialLength; k < loadableContent[indx][j].info.length; k++) {
                                                if (loadableContent[indx][j].info[k] != undefined && arrayColumnDefinitions[tIndex].cDef && arrayColumnDefinitions[tIndex].cDef.length > k) {
                                                    var colTttl = arrayColumnDefinitions[tIndex].cDef[k].title;
                                                    if (colTttl) {
                                                        if (arrayColumnDefinitions[tIndex].cDef[k].type == pConvertionConfig.dataTypeTime) {
                                                            wkrJson[colTttl] = utilService.convertToDateTime(loadableContent[indx][j].info[k]);
                                                        }
                                                        else if (arrayColumnDefinitions[tIndex].cDef[k].type == pConvertionConfig.dataTypeString) {
                                                            wkrJson[colTttl] = loadableContent[indx][j].info[k];
                                                        }
                                                        else if (arrayColumnDefinitions[tIndex].cDef[k].type == pConvertionConfig.dataTypeNumber) {
                                                            wkrJson[colTttl] = loadableContent[indx][j].info[k];
                                                        }
                                                        else if (arrayColumnDefinitions[tIndex].cDef[k].type == pConvertionConfig.dataTypeBool) {
                                                            wkrJson[colTttl] = loadableContent[indx][j].info[k];
                                                        }
                                                        else if (arrayColumnDefinitions[tIndex].cDef[k].type == pConvertionConfig.dataTypeArr &&
                                                            (typeof loadableContent[indx][j].info[k] === 'string') &&
                                                            loadableContent[indx][j].info[k].startsWith(pConvertionConfig.linearArr)) {
                                                            var strArr = loadableContent[indx][j].info[k].split(pConvertionConfig.linearArr)[1];
                                                            if (strArr) {
                                                                loadableContent[indx][j].info[k] = strArr.split(seperator);
                                                            }
                                                            else {
                                                                loadableContent[indx][j].info[k] = [];
                                                            }
                                                            wkrJson[colTttl] = loadableContent[indx][j].info[k];
                                                        }
                                                        else if (arrayColumnDefinitions[tIndex].cDef[k].type == pConvertionConfig.dataTypeArr) {
                                                            if (angular.isArray(loadableContent[indx][j].info[k])) {
                                                                wkrJson[colTttl] = loadableContent[indx][j].info[k];
                                                            }
                                                        }
                                                        else if (arrayColumnDefinitions[tIndex].cDef[k].type == pConvertionConfig.dataTypeObj) {
                                                            if (angular.isObject(loadableContent[indx][j].info[k])) {
                                                                wkrJson[colTttl] = loadableContent[indx][j].info[k];
                                                            }
                                                        }
                                                        else {
                                                            wkrJson[colTttl] = loadableContent[indx][j].info[k];
                                                        }
                                                    }
                                                }
                                            }
                                            //if(loadableContent[indx][j].md[pathToParentObject]){
                                            if (loadableContent[indx][j].md[parentObjectId]) {
                                                var m = -1;
                                                for (var s = j - 1; s >= 0; s--) {
                                                    if (loadableContent[indx][s] && loadableContent[indx][s].info) {
                                                        if (loadableContent[indx][s].md[objectID] == loadableContent[indx][j].md[parentObjectId]) {
                                                            m = s;
                                                            break;
                                                        }

                                                        // if(loadableContent[indx][s].md[pathToObject]==loadableContent[indx][j].md[pathToParentObject]){
                                                        //         if(loadableContent[indx][s].md[selfArrayType]==loadableContent[indx][j].md[parentArrayType]){
                                                        //             m=s;
                                                        //             break;
                                                        //         }
                                                        // }
                                                    }
                                                }
                                                if (m < 0) {
                                                    console.log('Couldn\'t assign: ' + loadableContent[indx][j].md[selfArrayType] + ' , ' + loadableContent[indx][j].md[pathToObject]);
                                                }

                                                if (m != null && m != undefined && m >= 0 && m < loadableContent[indx].length) {
                                                    if (loadableContent[indx][m] && loadableContent[indx][m].info && loadableContent[indx][m].md && loadableContent[indx][m].md[selfArrayType]) {
                                                        var refIndex = getcolDefinitionIndex(loadableContent[indx][m].md[selfArrayType]);
                                                        if (refIndex >= 0 && arrayColumnDefinitions.length > refIndex && arrayColumnDefinitions[refIndex].cDef) {
                                                            for (var p = 0; p < arrayColumnDefinitions[refIndex].cDef.length; p++) {
                                                                if (arrayColumnDefinitions[refIndex].cDef[p].title.toLowerCase() == loadableContent[indx][j].md[selfArrayType].toLowerCase()) {
                                                                    if (arrayColumnDefinitions[refIndex].cDef[p].type == pConvertionConfig.dataTypeObj) {
                                                                        loadableContent[indx][m].info[p] = wkrJson;
                                                                    }
                                                                    else if (arrayColumnDefinitions[refIndex].cDef[p].type == pConvertionConfig.dataTypeArr) {
                                                                        if (!angular.isArray(loadableContent[indx][m].info[p])) {
                                                                            loadableContent[indx][m].info[p] = [];
                                                                        }
                                                                        if (loadableContent[indx][j].md[positionInArray] >= 0) {
                                                                            for (var r = loadableContent[indx][m].info[p].length; r <= loadableContent[indx][j].md[positionInArray]; r++) {
                                                                                loadableContent[indx][m].info[p].push(null);
                                                                            }
                                                                            loadableContent[indx][m].info[p][loadableContent[indx][j].md[positionInArray]] = wkrJson;
                                                                        }
                                                                    }
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }

                                            if (j <= 0) {
                                                return wkrJson;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                console.log(err);
            }
            return {};
        }

        // function objClone(obj) {
        //     if (null == obj || "object" != typeof obj) return obj;
        //     var copy = obj.constructor();
        //     for (var attr in obj) {
        //         if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        //     }
        //     return copy;
        // }

        function createJsonFromArray(arr, conf) {
            var preprdJson = [];
            if (arr) {
                for (var i = conf.initialLength; i < arr.length; i++) {
                    var dtDef = 'null';
                    if (arr[i].type == conf.dataTypeObj) {
                        dtDef = '{}';
                    }
                    else if (arr[i].type == conf.dataTypeArr) {
                        dtDef = '[]';
                    }
                    preprdJson.push('"' + arr[i].title + '":' + dtDef);
                }
            }
            //return JSON.parse('{'+preprdJson.join()+'}');
            return '{' + preprdJson.join() + '}';
        }

        function objClone(obj) {
            if (null == obj || "object" != typeof obj) return obj;
            var preprdJson = {};
            for (var attr in obj) {
                preprdJson[attr] = '';
            }
            return preprdJson;

        }

        //-------------------------------------------- JSON-Array Completed ------------------------------


        return service;
    }
})();
