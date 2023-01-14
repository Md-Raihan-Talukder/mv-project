(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('msbUtilService', msbUtilService);

    /** @ngInject */
    function msbUtilService($rootScope, DATA_SOURCE, CONSTANT_DATE_TIME_CONSTANTS, MSB_OPERATORS, msUtils,
        $mdToast, PARAM_NOTION, $mdDialog, $document, PRIMARY_COLUMN_NAME,
        SERIAL_COLUMN_NAME, TKDR_PATH_SUFFIX, SAVE_POLICY_SPEC, MAT_TEST_TYPES) {


        var service = {
            confirmUnsavedData: confirmUnsavedData,
            showToast: showToast,
            generateId: generateId,
            replaceSpaces: replaceSpaces,
            createNumberRange: createNumberRange,
            downLoadJson: downLoadJson,
            sortItems: sortItems,
            isExist: isExist,
            getIndex: getIndex,
            getIndexByValues: getIndexByValues,
            getItemsByProperties: getItemsByProperties,
            getConfirmDef: getConfirmDef,
            confirmAndDelete: confirmAndDelete,
            showPrompt: showPrompt,
            flatten: flatten,
            dotNetFormatter: dotNetFormatter,
            addPrototypeMethods: addPrototypeMethods,
            isNumberKey: isNumberKey,
            generateNumericId: generateNumericId,
            filterByParams: filterByParams,
            jsonManipulator: jsonManipulator,
            searchFromParam: searchFromParam,
            checkObject: checkObject,
            fetchVariablePart: fetchVariablePart,
            pathHandler: pathHandler,
            getObjectIndex: getObjectIndex,
            deepJsonSearch: deepJsonSearch,
            mergeObj: mergeObj,
            cartesianProduct: cartesianProduct,
            getOrganizationId: getOrganizationId,
            fetchDataWithContainer: fetchDataWithContainer,
            jsonDeepManipulator: jsonDeepManipulator,
            getFlattenedJsonArray: getFlattenedJsonArray,
            getFlattenedJson: getFlattenedJson,
            createTableRows: createTableRows,
            checkUndefined: checkUndefined,
            getTitleByIdKey: getTitleByIdKey,
            changeAllTechDiserdIds: changeAllTechDiserdIds,
            capitalizeString: capitalizeString,
            gruopBy: gruopBy,
            openDirectiveDialog: openDirectiveDialog,
            openMultimenuDialog: openMultimenuDialog,
            showConfirmDialog: showConfirmDialog,
            gcdArray: gcdArray,
            formateNumber: formateNumber,
            removeItems: removeItems,
            isNumber: isNumber,
            increment: increment,
            converToNumber: converToNumber,
            getUiqueAttr: getUiqueAttr,
            makeTitleFromCamel: makeTitleFromCamel,
            confirmAndDo: confirmAndDo,
            getItemsFromStr: getItemsFromStr,
            getObjectByParams: getObjectByParams,
            spliceOrPush: spliceOrPush,
            isValidReg: isValidReg,

            getServiceKey: getServiceKey,
            getPoEnquiryServiceKey: getPoEnquiryServiceKey,
            getIndexMatchingStartsWith: getIndexMatchingStartsWith,
            removeItemFromArrayByIndex: removeItemFromArrayByIndex,

            validateObject: validateObject,

            getExploredPath: getExploredPath,

            retrieveDataType: retrieveDataType,

            getDataTypes: getDataTypes,

            reduceFractionPart: reduceFractionPart,

            addPathSuffix: addPathSuffix,
            getPathSuffix: getPathSuffix,

            loopCallbackCracker: loopCallbackCracker,
            getMatTests: getMatTests

        };
        function getMatTests(matType) {
            var test = []
            if (MAT_TEST_TYPES) {
                MAT_TEST_TYPES.forEach(function (item) {
                    if (item && item.matTypes && item.matTypes.indexOf(matType) >= 0) {
                        test.push(item)
                    }
                })
            }
            return angular.copy(test)
        }

        function loopCallbackCracker(arrayItem, searchForValue, itemMatchAttribute, callbackMatchAttribute) {

            var allCalled = true;

            callbackMatchAttribute = (callbackMatchAttribute) ? callbackMatchAttribute : "isCalled";

            var getUnitIndex = getIndex(arrayItem, itemMatchAttribute, searchForValue);
            if (getUnitIndex >= 0) {
                arrayItem[getUnitIndex][callbackMatchAttribute] = true;
            }

            arrayItem.forEach(function (unitItem) {
                if (unitItem && !unitItem[callbackMatchAttribute]) {
                    allCalled = false;
                }
            });

            return allCalled;

        }

        function addPathSuffix(param, pathSuffixValue) {
            if (param) {
                pathSuffixValue = (pathSuffixValue.trim().startsWith("/")) ? pathSuffixValue.trim() : ("/" + pathSuffixValue.trim());
                if (Array.isArray(param)) {
                    var suffinxIndex = getIndex(param, "key", TKDR_PATH_SUFFIX);
                    if (suffinxIndex >= 0) {
                        param[suffinxIndex].value = pathSuffixValue;
                    } else {
                        param.push({ "key": TKDR_PATH_SUFFIX, "value": pathSuffixValue });
                    }
                } else {
                    param.TKDR_PATH_SUFFIX = pathSuffixValue;
                }

            }
            return param;
        }

        function getPathSuffix(param) {
            var suffix = "";
            if (param) {
                if (Array.isArray(param)) {
                    var suffinxIndex = getIndex(param, "key", TKDR_PATH_SUFFIX);
                    suffix = (suffinxIndex >= 0) ? param[suffinxIndex].value : "";
                } else {
                    suffix = param.TKDR_PATH_SUFFIX;
                }

                if (suffix) {
                    suffix = (suffix.trim().startsWith("/")) ? suffix.trim() : ("/" + suffix.trim());
                }
            }
            return suffix;
        }

        function reduceFractionPart(actualData, fractionLength) {

            function getReducedData(actualData, fractionLength) {

                fractionLength = (fractionLength) ? fractionLength : 0;

                var reducedData = 0;

                if (actualData) {
                    var actualDataStr = "" + actualData;
                    var pointIndex = actualDataStr.indexOf(".");
                    if (pointIndex >= 0) {
                        var reduceLength = pointIndex + fractionLength;
                        var reduceDataStr = (parseFloat(actualData).toPrecision(reduceLength))
                        reducedData = (isNaN(reduceDataStr)) ? 0 : parseFloat(reduceDataStr);
                    } else {
                        reducedData = actualData;
                    }
                }

                return reducedData;

            }

            return (actualData && actualData - Math.floor(actualData) > 0) ? getReducedData(actualData, fractionLength) : actualData;



        }

        function getDataTypes() {
            return {
                DATA_TYPE_PRIMITIVE_NUMBER: "N",
                DATA_TYPE_PRIMITIVE_STRING: "S",
                DATA_TYPE_PRIMITIVE_BOOLEAN: "B",
                DATA_TYPE_ARRAY: "A",
                DATA_TYPE_OBJECT: "O",
                DATA_TYPE_UNDEFINED: "U"
            };
        }

        function retrieveDataType(attrValue) {

            var dataTypes = getDataTypes();

            if (!attrValue) { //-----------------treates "", 0 as invalid also
                return dataTypes.DATA_TYPE_UNDEFINED;
            }

            if (Array.isArray(attrValue)) {
                return dataTypes.DATA_TYPE_ARRAY;
            }

            if (typeof attrValue == 'object') {
                return dataTypes.DATA_TYPE_OBJECT;
            }

            if (typeof attrValue == 'number') {
                return dataTypes.DATA_TYPE_PRIMITIVE_NUMBER;
            }

            if (typeof attrValue == 'string') {
                return dataTypes.DATA_TYPE_PRIMITIVE_STRING;
            }

            if (typeof attrValue == 'boolean') {
                return dataTypes.DATA_TYPE_PRIMITIVE_BOOLEAN;
            }

        }


        function isValidReg(item) {
            if (item) {
                if (item.age) {
                    item.age = isNumber(item.age) ? item.age * 1 : 0;
                }
            }
        }

        var poEnqServiceKey = ""

        function getPoEnquiryServiceKey(isEnquiry) {
            if (isEnquiry) {
                poEnqServiceKey = DATA_SOURCE['inquiry']
                return DATA_SOURCE['inquiry']
            }
            poEnqServiceKey = DATA_SOURCE['po-details-enq']
            return DATA_SOURCE['po-details-enq']
        }

        function getServiceKey() {
            if (poEnqServiceKey && poEnqServiceKey != "") {
                return poEnqServiceKey;
            }
            if ($rootScope['state'] && $rootScope['state']['current'] && $rootScope['state']['current']['name']) {
                var stateName = $rootScope['state']['current']['name'].split('.')[1]
                poEnqServiceKey = DATA_SOURCE[stateName]
                console.log("Current State: " + DATA_SOURCE[stateName]);
                return DATA_SOURCE[stateName]
            }
        }

        function removeItemFromArrayByIndex(arr, index) {

            if (!arr || index == undefined || index < 0) {
                return arr;
            }

            var info = [];
            arr.forEach(function (item, ndx) {
                if (ndx != index) {
                    info.push(item);
                }
            });

            return info;

        }

        function spliceOrPush(arr, params, pushItem) {

            if (arr && Array.isArray(arr) && pushItem) {
                if (!params) {
                    var idInd = arr.indexOf(pushItem);
                    if (idInd > -1) {
                        arr.splice(idInd, 1)
                    }
                    else {
                        arr.push(pushItem);
                    }
                }
                else if (params && Array.isArray(params)) {
                    var arrInd = getIndexByValues(arr, params);
                    if (arrInd > -1) {
                        arr.splice(arrInd, 1)
                    }
                    else {
                        arr.push(pushItem);
                    }
                }
            }
        }

        function confirmAndDo(message, yesCalback, noCalback, event) {

            message = message ? message : "The item will be  deleted";
            var confirm = $mdDialog.confirm()
                .title('Are you sure?')
                .content(message)
                .ariaLabel('Delete Task')
                .ok('OK')
                .cancel('Cancel')
                .targetEvent(event);

            $mdDialog.show(confirm).then(function () {
                if (yesCalback) {
                    yesCalback();
                }
            }, function () {
                if (noCalback) {
                    noCalback();
                }
            });
        }

        function makeTitleFromCamel(att) {

            if (att) {
                var result = att.replace(/([A-Z])/g, " $1");
                var finalResult = result.charAt(0).toUpperCase() + result.slice(1);
                return finalResult.trim();
            }
        }

        function getUiqueAttr(items, attr) {

            var attrs = Array.from(new Set(items.map(function (currentValue, index, arr) {
                return currentValue[attr];
            })
            ));

            return attrs;
        }

        function converToNumber(n) {

            n = isNumber(n) ? n * 1 : 0;
            return msbGcd(n);
        }

        function increment(total, number) {

            var num = isNumber(number) ? number * 1 : 0;
            total += num;

            return total;
        }

        function isNumber(n) {

            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        function formateNumber(number, toFixed) {

            return number.toFixed(toFixed).replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,');
        }

        function gcdArray(arr, prop) {

            var gcdres = msbGcd(prop ? arr[0][prop] : arr[0], prop ? arr[1][prop] : arr[1]);
            for (var i = 3; i < arr.length; i++) {
                gcdres = msbGcd(gcdres, prop ? arr[i][prop] : arr[i]);
            }
            return gcdres
        }

        function msbGcd(a, b) {

            b = isNumber(b) ? b * 1 : 0;
            a = isNumber(a) ? a * 1 : 0;

            if (!b) { return a; }

            return msbGcd(b, a % b);
        }

        function removeItems(array, params, isMultiple) {

            // isMultiple will be handled after updating getIndexByValues func
            if (array && Array.isArray(array)) {
                if (params && Array.isArray(params)) {
                    var index = getIndexByValues(array, params);
                    if (index > -1) {
                        array.splice(index, 1);
                    }

                }
                else if (params && !Array.isArray(params) && typeof params === 'string') {
                    var indexArr = getIndex(array, "TECHDISER_ID", params);
                    if (indexArr > -1) {
                        array.splice(indexArr, 1);
                    }
                }
            }
        }

        function openMultimenuDialog(dialogInfo, callBack) {

            $mdDialog.show({
                controller: 'MultiMenuDataEntryDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/main/common/dialogs/multi-menu-data-entry/multi-menu-data-entry.html',
                parent: angular.element($document.body),
                clickOutsideToClose: false,
                preserveScope: true,
                multiple: true,
                skipHide: true,
                locals: dialogInfo
            }).then(function (answer) {

                if (callBack) {
                    callBack(answer);
                }

            }, function () {
                callBack();
            });
        }

        function openDirectiveDialog(dialogInfo, callBack) {

            $mdDialog.show({
                controller: 'DirectiveDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/main/common/dialogs/directive-dialog/directive-dialog.html',
                parent: angular.element($document.body),
                clickOutsideToClose: false,
                preserveScope: true,
                multiple: true,
                skipHide: true,
                locals: dialogInfo
            }).then(function (answer) {
                // if(!answer ){
                //   return;
                // }

                if (callBack) {
                    callBack(answer);
                }
            });
        }

        function gruopBy(xs, key) {

            return xs.reduce(function (rv, x) {
                (rv[x[key]] = rv[x[key]] || []).push(x);
                return rv;
            }, {});
        };

        function confirmUnsavedData(message, yesCalback, noCalback, event) {

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

        function checkUndefined() {

            // Check passed args are undefined or not
            for (var argInd = 0; argInd < arguments.length; argInd++) {
                if (arguments[argInd] === undefined || arguments[argInd] === null) {
                    return false;
                }
            }
            return true;
        }

        /**
         * [getObjectByParams description]
         * @param  {[array]} arr         [array]
         * @param  {[string or array]} keyOrParams [key or keyVal params]
         * @param  {[any]} value       [value of key]
         * @return {[object]}             [founded obj]
         */

        function getObjectByParams(arr, keyOrParams, value) {

            if (arr && keyOrParams) {
                var arrInd = null;
                if (Array.isArray(keyOrParams)) {
                    arrInd = getIndexByValues(arr, keyOrParams);
                }
                else if (typeof keyOrParams == 'string' && value != undefined) {
                    arrInd = getIndex(arr, keyOrParams, value);
                }
                if (arrInd > -1) {
                    return arr[arrInd];
                }
                return null;
            }
        }

        function getTitleByIdKey(data, key, id) {

            if (checkUndefined(data, key, id)) {
                var dataInd = getIndex(data, key, id);
                if (dataInd > -1) {
                    if (data[dataInd].title) {
                        return data[dataInd].title;
                    }
                    else if (data[dataInd].name) {
                        return data[dataInd].name;
                    }

                }
                else {
                    return "Not Found";
                }
            }
        }

        function changeAllTechDiserdIds(obj, needRef, prefix, isUpdateRef) {

            if (obj) {
                var copyObj = angular.copy(obj)
                obj = JSON.parse(JSON.stringify(obj), function (key, value) {
                    if (key === "TECHDISER_ID") {
                        var oldVal = angular.copy(value);
                        if (needRef == true) {
                            var genValue = generateId();
                            value = (prefix)
                                ? prefix + "#REFID#" + value
                                : genValue + "#REFID#" + value
                        }
                        else {
                            value = generateId();
                        }
                        if (isUpdateRef) {
                            // obj = changeAllReferenceByValue(obj, oldVal, value)
                        }
                    }
                    return value;
                });
                return obj;
            }
        }

        function changeAllReferenceByValue(obj, refValue, updatedValue) {

            if (!obj || !refValue || !updatedValue) {
                return
            }
            obj = JSON.parse(JSON.stringify(obj), function (key, value) {
                if (value === refValue) {
                    value = updatedValue;
                }
                return value;
            });
            return obj;
        }

        function capitalizeString(str) {

            // Cap Str 'hello world' = 'Hello World'
            if (str) {
                return str.replace(/\w\S*/g, function (str) {
                    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
                });
            }
        }

        function createTableRows(flat, tblPosCols) {

            var table = [];

            for (var i = 0; i < flat.length; i++) {
                var item = flat[i];
                var row = [];
                for (var j = 0; j < tblPosCols.length; j++) {
                    var colDef = tblPosCols[j];
                    var col = { "key": colDef.key, "text": flat[i][colDef.key] };
                    var items = $.grep(flat, function (dt) {
                        return dt[colDef.key] === flat[i][colDef.key];
                    });

                    col.rowSpan = items.length;

                    if (isValidRowSpan(i, col, colDef, table)) {
                        row.push(col);
                    } else {
                        //   col.text ="dd"
                        //   row.push(col);
                    }
                }

                table.push(row);
            }

            return table;

        }

        function isValidRowSpan(index, col, colDef, table) {

            var prevRow = table[index - 1];
            if (!prevRow) {
                return true;
            } else {

                var takenItems = $.grep(table, function (dt, i) {
                    if (i < (index - col.rowSpan)) {
                        return false;
                    }

                    var indx = getIndex(dt, "key", colDef.key);
                    if (indx < 0) {
                        return false;
                    }

                    var prevCol = dt[indx];
                    return prevCol.text === col.text;
                });

                if (col.rowSpan === 1) {
                    return true;
                }


                if (takenItems.length === 0 || takenItems.length > col.rowSpan) {
                    return true;
                }

            }


            return false;
        }

        function getFlattenedJsonArray(json) {

            var items = [];
            for (var i = 0; i < json.length; i++) {
                items = items.concat(getFlattenedJson(json[i]));
            }

            return items;
        }

        function getFlattenedJson(json, prntJson, prntAttr) {

            var explorables = [];
            var arrayFound = false;

            var newObj = {};

            angular.forEach(
                json, function (val, attr) {

                    var nAttr = (prntAttr) ? prntAttr + "#" + attr : attr;
                    if (val) {
                        if (arrayFound == false && angular.isArray(val)) {
                            arrayFound = true;
                            for (var l = 0; l < val.length; l++) {
                                if (val[l]) {

                                    //var xAttr=nAttr+'#'+l;
                                    explorables.push({ "attr": nAttr, "val": val[l] });
                                }
                            }
                        }
                        else if (!angular.isArray(val) && checkObject(val)) {
                            explorables.push({ "attr": nAttr, "val": val });
                        }
                        else if (!checkObject(val)) {
                            newObj[nAttr] = val;
                        }
                    }
                    else {
                        newObj[nAttr] = val;
                    }
                }
            );

            var fObjects = [];

            for (var i = 0; i < explorables.length; i++) {
                if (explorables[i]) {
                    var addables = getFlattenedJson(explorables[i].val, newObj, explorables[i].attr);
                    fObjects = fObjects.concat(addables);
                }
            }

            if (fObjects.length == 0) {
                fObjects.push(newObj)
            }
            else {
                for (var i = 0; i < fObjects.length; i++) {
                    if (fObjects[i]) {
                        fObjects[i] = mergeObj(newObj, fObjects[i])
                    }
                }
            }

            return fObjects;

        }

        function cartesianProduct(params, isKeyVal) {
            //
            // Example input params
            // var keyVal = [
            //        {"key":"instituteId","value":"institute-1"},
            //        {"key":"departmentId","value":["department-1","department-2"]}
            //     ];
            //  var arr = [[0,1], [0,1,2,3], [0,1,2]];

            return isKeyVal ? keyValCartesian(params) : cartesian(params);
        }

        function keyValCartesian(keyVal) {
            //
            for (var i = 0; i < keyVal.length; i++) {
                var param = keyVal[i];
                if (param.value && !angular.isArray(param.value)) {
                    var val = angular.copy(param.value)
                    param.value = [];
                    param.value.push(val);
                }
            }

            return cartesianForKeyVal(keyVal);

        }

        function cartesianForKeyVal(keyVals) {

            var r = [], arg = keyVals, max = arg.length - 1;
            function helper(arr, i) {
                for (var j = 0, l = arg[i].value.length; j < l; j++) {
                    var a = arr.slice(0); // clone arr
                    var param = { "key": arg[i].key, "value": arg[i].value[j] };
                    a.push(param);
                    if (i == max)
                        r.push(a);
                    else
                        helper(a, i + 1);
                }
            }

            helper([], 0);
            return r;
        }

        function cartesian(arr) {

            var r = [], arg = arr, max = arg.length - 1;
            function helper(arr, i) {
                for (var j = 0, l = arg[i].length; j < l; j++) {
                    var a = arr.slice(0); // clone arr
                    a.push(arg[i][j]);
                    if (i == max)
                        r.push(a);
                    else
                        helper(a, i + 1);
                }
            }
            helper([], 0);
            return r;
        }

        function getRandomInt(min, max) {

            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function generateNumericId(length) {

            length = length || 8;
            var timestamp = +new Date;
            var ts = timestamp.toString();
            var parts = ts.split("").reverse();
            var id = "";

            for (var i = 0; i < length; ++i) {
                var index = getRandomInt(0, parts.length - 1);
                id += parts[index];
            }

            return id;
        }

        function isNumberKey(evt) {

            var valid = true;
            var element = angular.element(evt.target);

            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if (charCode === 45) {//minus sign
                var index = element.val().indexOf('-');
                if (index >= 0) {
                    valid = false;
                } else {
                    valid = evt.target.selectionStart === 0 ? true : false;
                }
            } else if (charCode === 46) {// decimal point
                if (element.val().indexOf('.') >= 0) {
                    valid = false;
                } else {
                    valid = true;
                }
            } else if (charCode > 46 && (charCode < 48 || charCode > 57)) {
                valid = false;
            }
            if (!valid) {
                evt.preventDefault();
            }

            return valid;
        }

        function dotNetFormatter(x, formatString, currencyPrefix) {

            var result = formatString;
            if (formatString.indexOf("N") > -1 || formatString.indexOf("C") > -1 || formatString.indexOf("P") > -1) {
                if (formatString.indexOf("N") > -1) {
                    result = "#,#";
                }
                if (formatString.indexOf("C") > -1) {
                    result = currencyPrefix ? currencyPrefix + "#,#" : "$#,#";
                }
                if (formatString.indexOf("P") > -1) {
                    result = "#,#%";
                }
                var decimalDigit = parseInt(formatString.substr(1, formatString.length - 1));
                for (var i = 0; i < decimalDigit; i++) {
                    if (i === 0) {
                        result += ".";
                    }
                    result += "0";
                }
            }

            return String.format("{0:" + result + "}", x);
        }

        function flatten(arr) {

            return arr.reduce(function (flat, toFlatten) {
                return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
            }, []);
        }

        function addPrototypeMethods() {

            Date.isLeapYear = function (year) {
                return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
            };

            Date.getDaysInMonth = function (year, month) {
                return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
            };

            Date.prototype.isLeapYear = function () {
                return Date.isLeapYear(this.getFullYear());
            };

            Date.prototype.getDaysInMonth = function () {
                return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
            };

            Date.prototype.addMonths = function (value) {
                var n = this.getDate();
                this.setDate(1);
                this.setMonth(this.getMonth() + value);
                this.setDate(Math.min(n, this.getDaysInMonth()));
                return this;
            };

            Date.prototype.addDays = function (days) {
                var dat = new Date(this.valueOf());
                dat.setDate(dat.getDate() + days);
                return dat;
            };

            Date.prototype.firstDay = function () {
                var dat = new Date(this.valueOf());
                dat = new Date(dat.getFullYear(), dat.getMonth(), 1);
                return dat;
            };

            Date.prototype.lastDay = function () {
                var dat = new Date(this.valueOf());
                dat = new Date(dat.getFullYear(), dat.getMonth() + 1, 0);
                return dat;
            };
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

        function confirmAndDelete(type, items, yesCalback, noCalback, event) {

            $mdDialog.show({
                controller: 'MsbConfirmDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/common/dialogs/confirm/confirm-dialog.html',
                parent: angular.element($document.body),
                clickOutsideToClose: false,
                preserveScope: true,
                multiple: true,
                skipHide: true,
                locals: {
                    Type: type,
                    Items: items
                }
            }).then(function (answer) {
                if (answer && yesCalback) {
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

        function showConfirmDialog(message, callBack, event) {

            $mdDialog.show(getConfirmDef(message, event)).then(function () {

                callBack();

            }, function () {
                // Cancel Action
            });
        }

        function showToast(text, theme, delay, pos) {

            var hideDelay = delay ? delay : 500;
            var position = pos ? pos : 'top center';
            var toast = $mdToast.simple()
                .textContent(text)
                .theme(theme)
                .position(position)
                .hideDelay(hideDelay);

            $mdToast.show(toast);
        }

        function primaryKeyGenerator(obj, attributes) {

            var primaryKey = "";
            if (attributes) {
                // attributes.sort();
                if (obj) {
                    angular.forEach(obj, function (val, key) {
                        if (key && (-1 < attributes.indexOf(key))) {
                            primaryKey += val;
                        }
                    });
                }
            }
            return primaryKey;
        }

        function generateId(obj, attributes) {

            if (obj) {
                return primaryKeyGenerator(obj, attributes)
            }
            return msUtils.guidGenerator();
        }

        function replaceSpaces(str) {

            var items = (str) ? str.split(" ") : [];

            var preparedStr = items.join("");

            return preparedStr;
        }

        function createNumberRange(min, max, step) {

            step = step || 1;
            var input = [];
            for (var i = min; i <= max; i += step) {
                input.push(i);
            }
            return input;
        };

        function downLoadJson(obj, filename) {

            var object = JSON.parse(angular.toJson(obj));
            var json = JSON.stringify(object, null, 2);
            var blob = new Blob([json], { type: "text/plain;charset=utf-8" });
            saveAs(blob, filename);
        }

        function sortItems(items, prop, isDate) {

            if (prop) {
                if (isDate) {
                    return items.sort(propComparator(prop, isDate));
                }

                return items.sort(propComparator(prop));
            }

            return items.sort(compare);
        }

        function compare(a, b) {

            if (a[SERIAL_COLUMN_NAME] < b[SERIAL_COLUMN_NAME]) {
                return -1;
            }

            if (a[SERIAL_COLUMN_NAME] > b[SERIAL_COLUMN_NAME]) {
                return 1;
            }

            return 0;
        }

        function propComparator(prop, isDate) {

            return function (a, b) {
                if (isDate) {
                    var date1 = new Date(convertToSysDate(a[prop]));
                    var date2 = new Date(convertToSysDate(b[prop]));

                    return date1 - date2;
                }

                return a[prop] - b[prop];
            }
        }

        function convertToSysDate(dateStr) {
            if (!dateStr || !dateStr.match(CONSTANT_DATE_TIME_CONSTANTS.CONSTANT_DATE_REGULAR_EXP)) {
                return '';
            }

            var str = dateStr.split('.');
            return str[2] + '-' + str[1] + '-' + str[0];
        };

        function isExist(items, property, propertyValue, id) {

            var index = getIndex(items, property, propertyValue);
            if (index >= 0) {
                var item = items[index];
                return item[PRIMARY_COLUMN_NAME] !== id;
            }
            return false;
        }

        function getIndex(items, property, propertyValue) {

            if (!items) {
                items = [];
            }

            for (var i = 0; i < items.length; i++) {
                if (items[i][property] !== null && items[i][property] === propertyValue) {
                    return i;
                }
            }
            return -1;
        }

        function getIndexMatchingStartsWith(items, property, propertyValue) {
            if (!items) {
                items = [];
            }

            for (var i = 0; i < items.length; i++) {
                if (items[i][property] !== null && items[i][property].startsWith(propertyValue)) {
                    return i;
                }
            }
            return -1;
        }

        function getIndexByValues(items, propertyValues) {

            if (!items) {
                items = [];
            }

            for (var i = 0; i < items.length; i++) {
                var found = true;
                for (var j = 0; j < propertyValues.length; j++) {
                    var property = propertyValues[j].key;
                    var propertyValue = propertyValues[j].value;

                    if (items[i][property] !== propertyValue) {
                        found = false;
                    }
                }

                if (found) {
                    return i;
                }
            }
            return -1;
        }

        function filterByParam(data, param) {

            var dts = $.grep(data, function (datum) {
                datum = angular.copy(datum);
                if (param.path) {
                    if (!param.params) {
                        param.params = [];
                    }
                    datum = jsonManipulator(datum, param.params, param.path);
                    if (!param.isArray && Array.isArray(datum)) {
                        datum = datum[0];
                    }
                    if (!datum) {
                        return false;
                    }
                }
                if (Array.isArray(param.value)) {

                    if (Array.isArray(datum[param.key])) {
                        for (var i = 0; i < param.value.length; i++) {
                            var dtIndex = datum[param.key].indexOf(param.value[i]);
                            if (dtIndex === -1) {
                                return false;
                            }
                        }
                        return true;

                    } else {
                        for (var i = 0; i < param.value.length; i++) {
                            if (datum[param.key] === param.value[i]) {
                                return true;
                            }
                        }
                        return false;
                    }
                } else {
                    if (param.isArray) {

                        for (var i = 0; i < datum.length; i++) {
                            if (datum[i][param.key] === param.value) {
                                return true;
                            }
                        }

                    } else {
                        if (Array.isArray(datum[param.key])) {
                            return datum[param.key].indexOf(param.value) > -1;
                        } else {
                            if (param.operator) {
                                return MSB_OPERATORS[param.operator](datum[param.key], param.value);
                            }

                            return datum[param.key] === param.value;
                        }
                    }

                }
            });

            return dts;
        }

        function filterByParams(data, params) {

            if (params && params.length) {
                for (var i = 0; i < params.length; i++) {
                    data = filterByParam(data, params[i]);
                }
            }
            return data;
        }

        function getItemsByProperties(items, propertyValues) { // propertyValues = [{key, value, path, params}]

            var searchedItems = [];
            if (!items) {
                items = [];
            }

            return filterByParams(items, propertyValues);
        }

        function getKeyValueNames(keyVal) {

            var kInfo = { "param": null, "key": null }
            if (keyVal) {
                keyVal = keyVal.split('=');
                if (keyVal && keyVal.length > 1) {
                    kInfo.param = keyVal[1].substring(1, keyVal[1].length - 1);
                    kInfo.key = keyVal[0].substring(1);
                }
            }
            return kInfo;
        }

        function pathHandler(parameterObj, path) {

            var preparedPath = '';
            if (parameterObj && path) {
                var paramNotions = path.split(/\[*\]/g);
                if (paramNotions && paramNotions.length > 0) {
                    for (var i = 0; i < paramNotions.length; i++) {
                        if (paramNotions[i]) {
                            var prts = paramNotions[i].split('[');
                            if (prts && prts.length > 0) {
                                for (var j = 0; j < prts.length; j++) {
                                    if (prts[j].split('=').length > 1) {
                                        var vl = null;
                                        if (prts[j]) {
                                            var kInfo = getKeyValueNames('[' + prts[j] + ']');
                                            if (kInfo && kInfo.param && kInfo.key) {
                                                vl = searchFromParam(parameterObj, kInfo.param);
                                            }
                                        }
                                        if (vl) {
                                            preparedPath = preparedPath + vl;
                                        }
                                        else {
                                            preparedPath = preparedPath + prts[j]
                                        }
                                    }
                                    else {
                                        preparedPath = preparedPath + prts[j]
                                    }
                                }
                            }
                            else {
                                preparedPath = preparedPath + paramNotions[i]
                            }
                        }

                    }
                }
                else {
                    return path;
                }
            }
            return preparedPath;
        }

        function deepJsonSearch(rootObj, path, techIDs, retrieveDeep, retrievedDt, dtRoot) {

            if (!path || !rootObj) return null;
            var invoked = false;
            if (!retrievedDt) {
                retrievedDt = [];
                if (angular.isArray(techIDs)) {
                    invoked = true;
                    for (var m = 0; m < techIDs.length; m++) {
                        if (techIDs[m]) {
                            //console.log("starting for path: "+path +"; of ID: "+techIDs[m]);
                            retrievedDt = deepJsonSearch(rootObj, path, techIDs[m], retrieveDeep, retrievedDt, dtRoot);
                        }
                    }
                }
            }
            if (!invoked && angular.isArray(rootObj)) {
                for (var l = 0; l < rootObj.length; l++) {
                    if (rootObj[l]) {
                        //console.log("starting for path: "+path +"; of ID: "+techIDs+"; of: "+rootObj[l][PRIMARY_COLUMN_NAME]);
                        retrievedDt = deepJsonSearch(rootObj[l], path, techIDs, retrieveDeep, retrievedDt, dtRoot)
                    }
                }
            }
            else if (checkObject(rootObj)) {
                //console.log("path: "+path +"; of: "+rootObj[PRIMARY_COLUMN_NAME]);
                if (path == PARAM_NOTION.starterNotion) {
                    if (rootObj && checkObject(rootObj) && rootObj[PRIMARY_COLUMN_NAME] == techIDs) {
                        retrievedDt = insertRetrievedJson(retrievedDt, rootObj)
                    }
                }
                else {
                    var pathComponents = path.split(PARAM_NOTION.starterNotion);
                    var cRoot = rootObj;
                    var i = 1;
                    for (; i < pathComponents.length && cRoot;) {
                        var isIncremented = false;
                        if (pathComponents[i]) {
                            var attr = pathComponents[i];
                            if (angular.isObject(cRoot[attr])) {
                                cRoot = cRoot[attr];
                                i++;
                                isIncremented = true;
                            }
                            //console.log(attr);
                            if (angular.isArray(cRoot)) {
                                var nPath = (i >= pathComponents.length) ? PARAM_NOTION.starterNotion : '';
                                for (var j = i; j < pathComponents.length; j++) {
                                    nPath = PARAM_NOTION.starterNotion + pathComponents[j];
                                }
                                if (nPath) {
                                    retrievedDt = deepJsonSearch(cRoot, nPath, techIDs, retrieveDeep, retrievedDt, rootObj)
                                }
                                break;
                            }
                            if (cRoot && i == pathComponents.length - 1 && cRoot[attr] && checkObject(cRoot) && cRoot[PRIMARY_COLUMN_NAME] == techIDs) {
                                // console.log("inserting for: "+attr);
                                retrievedDt = insertRetrievedJson(retrievedDt, (dtRoot) ? ((retrieveDeep) ? cRoot : rootObj) : rootObj, (checkObject(cRoot[attr])) ? '' : attr)
                            }
                        }
                        if (!isIncremented) {
                            i++;
                        }
                    }
                }

            }
            return retrievedDt;
        }

        function insertRetrievedJson(retrievedDt, rootObj, attr) {

            if (rootObj && rootObj[PRIMARY_COLUMN_NAME]) {
                var k = 0;
                for (var k = 0; k < retrievedDt.length; k++) {
                    if (retrievedDt[k] && retrievedDt[k][PRIMARY_COLUMN_NAME] == rootObj[PRIMARY_COLUMN_NAME]) {
                        break;
                    }
                }
                if (k >= retrievedDt.length) {
                    if (attr) {
                        var nObj = { "TECHDISER_ID": rootObj[PRIMARY_COLUMN_NAME] };
                        nObj[attr] = rootObj[attr]
                        retrievedDt.push(nObj);
                    }
                    else {
                        retrievedDt.push(rootObj);
                    }

                }
            }

            return retrievedDt;
        }

        function jsonDeepManipulator(rootObj, path, techIDs, newObj, attr) {

            var ptArr = fetchDataWithContainer(rootObj, path, techIDs);
            if (ptArr && ptArr.length > 0) {
                var altPath = PARAM_NOTION.starterNotion + "[TECHDISER_ID=" + ptArr[0].TECHDISER_ID + "]";
                var b = 0;
                var comp = path.split(PARAM_NOTION.starterNotion);
                for (b = 1; b < ptArr.length; b++) {
                    if (ptArr[b] && ptArr[b].TECHDISER_ID && comp[b]) {
                        altPath += PARAM_NOTION.starterNotion + comp[b] + "[TECHDISER_ID=" + ptArr[b].TECHDISER_ID + "]"
                    }
                    else {
                        break;
                    }
                }
                if (b >= ptArr.length && altPath) {
                    if (attr) {
                        altPath = (attr[0] == PARAM_NOTION.starterNotion) ? altPath + attr : altPath + PARAM_NOTION.starterNotion + attr;
                    }
                    return jsonManipulator(rootObj, [], altPath, newObj)
                }


            }
        }

        function fetchDataWithContainer(rootObj, path, techIDs, retrieveDeep, retrievedDt, dtRoot) {

            var pObj = null;
            if (!path || !rootObj) return null;
            var invoked = false;
            if (!retrievedDt) {
                retrievedDt = [];
            }
            if (!invoked && angular.isArray(rootObj)) {
                for (var l = 0; l < rootObj.length; l++) {
                    if (rootObj[l]) {
                        //console.log("starting for path: "+path +"; of ID: "+techIDs+"; of: "+rootObj[l][PRIMARY_COLUMN_NAME]);
                        retrievedDt = fetchDataWithContainer(rootObj[l], path, techIDs, retrieveDeep, retrievedDt, dtRoot)
                        if (retrievedDt.length > 0) {
                            var f = 0;
                            for (; f < retrievedDt.length; f++) {
                                if (retrievedDt[f] && retrievedDt[f].TECHDISER_ID == rootObj[l].TECHDISER_ID) {
                                    break;
                                }
                            }
                            if (f >= retrievedDt.length) {
                                retrievedDt.unshift(rootObj[l]);
                            }
                            break;
                        }
                    }
                }
            }
            else if (checkObject(rootObj)) {
                //console.log("path: "+path +"; of: "+rootObj[PRIMARY_COLUMN_NAME]);
                if (path == PARAM_NOTION.starterNotion) {
                    if (rootObj && checkObject(rootObj) && rootObj[PRIMARY_COLUMN_NAME] == techIDs) {
                        retrievedDt.push(rootObj);
                    }
                }
                else {
                    var pathComponents = path.split(PARAM_NOTION.starterNotion);
                    var cRoot = rootObj;
                    var i = 1;
                    for (; i < pathComponents.length && cRoot;) {
                        var isIncremented = false;
                        if (pathComponents[i]) {
                            var attr = pathComponents[i];
                            if (angular.isObject(cRoot[attr])) {
                                cRoot = cRoot[attr];
                                i++;
                                isIncremented = true;
                            }
                            //console.log(attr);
                            if (angular.isArray(cRoot)) {
                                var nPath = (i >= pathComponents.length) ? PARAM_NOTION.starterNotion : '';
                                for (var j = i; j < pathComponents.length; j++) {
                                    nPath = nPath + PARAM_NOTION.starterNotion + pathComponents[j];
                                }
                                if (nPath) {
                                    retrievedDt = fetchDataWithContainer(cRoot, nPath, techIDs, retrieveDeep, retrievedDt, rootObj)
                                }
                                break;
                            }
                            if (cRoot && i == pathComponents.length - 1 && cRoot[attr] && checkObject(cRoot) && cRoot[PRIMARY_COLUMN_NAME] == techIDs) {
                                retrievedDt.push(cRoot);
                                break;
                            }
                        }
                        if (!isIncremented) {
                            i++;
                        }
                    }
                }

            }

            return retrievedDt;
        }

        var objExploredPath = "";

        function getExploredPath() {
            return objExploredPath;
        }

        //    "path": [""/[TECHDISER_ID=$styleId]/materials[TECHDISER_ID=$materialId]/"]"/[TECHDISER_ID=$styleId]/materials[TECHDISER_ID=$materialId]/consumptionInfo[$consumptionType]"
        //     STYLE1, material1, supplier1
        //    "path": "/[TECHDISER_ID=$styleId]/materials[TECHDISER_ID=$materialId]/consumptionInfo[$consumptionType]"
        function jsonManipulator(rootObj, parameterObj, path, newObj, isArray,
            pickPathData, container, toRemove, isNextCall,
            containerLinkPath, containerLinkData
        ) {


            if (!isNextCall) {
                objExploredPath = "";
            }


            if (!path) {
                return rootObj;
            }
            else if (angular.isArray(path)) {
                var pathInfo = angular.copy(rootObj)
                for (var p = 0; p < path.length; p++) {
                    if (path[p]) {
                        if (p < path.length - 1) {
                            pathInfo = jsonManipulator(pathInfo, parameterObj, path[p], newObj, isArray, pickPathData, {}, false, true)
                        }
                        else {
                            pathInfo = jsonManipulator(pathInfo, parameterObj, path[p], newObj, isArray, pickPathData, null, false, true)
                        }

                    }
                    if (!pathInfo) {
                        break;
                    }
                }
                return pathInfo;
            }
            else {
                var exploredPath = '';
                var objectPath = [];
                var dtContainer = container;
                var prevAttr = [];
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
                                                exploredPath += att;
                                                objectPath.push(att);
                                                if (sourceJson[att]) {
                                                    sourceJson = sourceJson[att];
                                                } else if (!sourceJson[att] && containerLinkPath && containerLinkData) {
                                                    var foundContainerData = jsonManipulator(containerLinkData, parameterObj, exploredPath);
                                                    if (foundContainerData) {
                                                        sourceJson[att] = foundContainerData;
                                                        sourceJson = sourceJson[att];
                                                    }
                                                }

                                                if (sourceJson) {
                                                    if (angular.isArray(sourceJson)) {
                                                        var obj = fetchItemFromArray(paramNotion, sourceJson, parameterObj);
                                                        if (obj && obj.index >= 0) {
                                                            objectPath.push(obj.index);
                                                            sourceJson = obj.foubdObj;
                                                            exploredPath += paramNotion;
                                                        }

                                                    }
                                                    else if (paramNotion && paramNotion.length > 1) {
                                                        if (paramNotion.charAt(1) === PARAM_NOTION.paramNotion) {
                                                            var paramKey = paramNotion.substring(2, paramNotion.length - 1);
                                                            var paramVal = searchFromParam(parameterObj, paramKey);
                                                            if (sourceJson[paramVal] && checkObject(sourceJson[paramVal])) {
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
                                        }
                                        else if (paramNotion.split('=').length > 1) {
                                            var obj = handleKeyValAssign(paramNotion, sourceJson, parameterObj);
                                            if (obj && obj.index >= 0) {
                                                objectPath.push(obj.index);
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
                                        if (!sourceJson[atr] && containerLinkPath && containerLinkData) {
                                            var foundContainerData = jsonManipulator(containerLinkData, parameterObj, exploredPath + atr);
                                            if (foundContainerData) {
                                                sourceJson[atr] = foundContainerData;
                                            }
                                        }
                                        if (i == pathComponents.length - 1 && !sourceJson[atr]) {
                                            if (newObj) {
                                                addAttribute(sourceJson, atr, isArray, true);
                                            } else {
                                                addAttribute(sourceJson, atr, isArray, false);
                                            }
                                        }
                                        sourceJson = sourceJson[atr];
                                        objectPath.push(atr);
                                        exploredPath += pathComponents[i];
                                    }

                                }
                                var cAttr = '';
                                if (container) {
                                    if (sourceJson && objectPath.length > 0) {
                                        if (isNaN(objectPath[objectPath.length - 1])) {
                                            cAttr = objectPath[objectPath.length - 1];
                                            container[cAttr] = angular.copy(sourceJson);
                                        }
                                        else if (objectPath.length > 1 && isNaN(objectPath[objectPath.length - 2])) {
                                            cAttr = objectPath[objectPath.length - 2];
                                            if (!container[cAttr]) {
                                                container[cAttr] = [];
                                            }
                                            container[cAttr] = angular.copy(sourceJson)
                                        }
                                        else {
                                            dtContainer = angular.copy(sourceJson);
                                        }
                                    }
                                    else {
                                        dtContainer = angular.copy(sourceJson);
                                    }
                                }
                                if (cAttr) {
                                    prevAttr.push(cAttr);
                                    dtContainer = replaceJsonContent(prevAttr, dtContainer, container[cAttr], 0, true, toRemove);
                                    container = container[cAttr]
                                }
                            }
                        }
                        if (exploredPath == path) {
                            //objectPath= newObj;
                            if (pickPathData) {
                                return fetchContainers(objectPath, rootObj, pathComponents);
                            }
                            else {
                                if (!dtContainer) {
                                    if (newObj) {
                                        rootObj = replaceJsonContent(objectPath, rootObj, newObj, 0, false, toRemove);
                                    }
                                    else {
                                        return angular.copy(sourceJson);
                                    }
                                }
                                else {
                                    return dtContainer;
                                }
                            }

                        }
                    }
                }

                objExploredPath = exploredPath;

                if (!newObj || container) {
                    return null;
                }
                return rootObj;
            }


        }

        function fetchContainers(objectPath, rootObj, pathComponents, indx, attr) {

            if (!indx) {
                indx = 0;
            }
            if (objectPath && objectPath.length > indx) {
                attr = (isNaN(objectPath[indx])) ? objectPath[indx] : attr
                var cAttr = objectPath[indx];
                var obj = angular.copy(rootObj[cAttr]);
                if (angular.isArray(rootObj) && rootObj.length > objectPath[indx]) {
                    if (attr) {
                        rootObj[attr] = [];
                        rootObj[attr].push(fetchContainers(objectPath, obj, pathComponents, indx + 1, attr));
                    }
                    else {
                        rootObj = [];
                        rootObj.push(fetchContainers(objectPath, obj, pathComponents, indx + 1, attr));
                    }
                }
                else if (attr) {
                    rootObj[attr] = fetchContainers(objectPath, obj, pathComponents, indx + 1, attr);
                }
                else if (obj) {
                    rootObj[cAttr] = fetchContainers(objectPath, obj, pathComponents, indx + 1, attr);
                }
            }
            return rootObj;
        }

        function addAttribute(obj, attr, isArray, forSave) {


            if (obj && attr) {
                if (!obj[attr]) {
                    if (isArray) {
                        obj[attr] = [];
                    }
                    else if (forSave) {
                        obj[attr] = {};
                    }
                    else {
                        obj[attr] = null;
                    }
                }
            }
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
            //
            if (str) {
                return str.match(/\[.*\]/g);
            }
            return '';
        }

        function searchFromSourceObj(obj, val, attr) {

            if (obj) {
                // if(angular.isArray(val)){
                //   console.log("=============================================",val);
                // }
                var i = -1;
                if (angular.isArray(obj)) {
                    if (attr == PRIMARY_COLUMN_NAME) {
                        var nV = null;
                        for (i = 0; i < obj.length; i++) {
                            if (obj[i] && obj[i][attr]) {
                                if (angular.isArray(val)) {
                                    for (var f = 0; f < val.length; f++) {
                                        if (obj[i][attr] == val[f]) {
                                            if (!nV) {
                                                nV = [];
                                            }
                                            var c = 0;
                                            if (nV) {
                                                for (; c < nV.length; c++) {
                                                    if (nV[c] && nV[c][attr] && nV[c][attr] == obj[i][attr]) {
                                                        break;
                                                    }
                                                }
                                                if (c >= nV.length) {
                                                    nV.push(obj[i]);
                                                }
                                            }
                                        }
                                    }
                                }
                                else {
                                    if (obj[i][attr] == val) {
                                        nV = obj[i];
                                        break;
                                    }
                                }
                            }

                        }
                        obj = nV;
                    }
                    else {
                        for (i = 0; i < obj.length; i++) {
                            if (!obj[i][attr]) {
                                obj.splice(i, 1);
                                i--;
                            }
                            else if (obj[i][attr] && val) {
                                if (angular.isArray(val)) {
                                    var f = 0;
                                    for (; f < val.length; f++) {
                                        if (obj[i][attr] == val[f]) {
                                            break;
                                        }
                                    }
                                    if (f >= val.length) {
                                        obj.splice(i, 1);
                                        i--;
                                    }
                                }
                                else if (!checkObject(val) && obj[i][attr] != val) {
                                    obj.splice(i, 1);
                                    i--;
                                }
                            }
                        }
                    }

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
                    var key = keyVal[0].substring(1);
                    var val = '';
                    if (keyVal[1][0] == '$') {
                        var param = keyVal[1].substring(1, keyVal[1].length - 1);
                        val = searchFromParam(parameters, param);
                    }
                    else {
                        val = keyVal[1].substring(0, keyVal[1].length - 1);
                    }
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
            if (selector == null) {
                if (angular.isArray(sourceJson)) {
                    var dt = [];
                    for (var i = 0; i < sourceJson.length; i++) {
                        if (sourceJson[i] && sourceJson[i][conditionPart] && sourceJson[i][conditionPart]) {
                            if (angular.isArray(sourceJson[i][conditionPart])) {
                                var a = 0;
                                for (; a < sourceJson[i][conditionPart].length; a++) {
                                    if (sourceJson[i][conditionPart][a] && sourceJson[i][conditionPart][a].TECHDISER_ID) {
                                        var j = 0;
                                        for (; j < dt.length; j++) {
                                            if (dt[j] && dt[j].TECHDISER_ID && dt[j].TECHDISER_ID == sourceJson[i][conditionPart][a].TECHDISER_ID) {
                                                break;
                                            }
                                        }
                                        if (j >= dt.length) {
                                            dt.push(sourceJson[i][conditionPart][a]);
                                        }
                                    }
                                }

                            }
                            else if (checkObject(sourceJson[i][conditionPart])) {
                                var j = 0;
                                for (; j < dt.length; j++) {
                                    if (dt[j] && dt[j].TECHDISER_ID && dt[j].TECHDISER_ID == sourceJson[i][conditionPart].TECHDISER_ID) {
                                        break;
                                    }
                                }
                                if (j >= dt.length) {
                                    dt.push(sourceJson[i][conditionPart]);
                                }
                            }
                        }
                    }
                    if (dt.length > 0) {
                        return { "index": 0, "foubdObj": dt, "objAtt": conditionPart }
                    }
                    else {
                        return { "index": -1, "foubdObj": null, "objAtt": conditionPart }
                    }

                }
                else if (checkObject(sourceJson)) {
                    return { "index": 0, "foubdObj": sourceJson[conditionPart], "objAtt": conditionPart }
                }
            }
            if (selector && selector[0] && selector[0].length > 0) {
                return handleKeyValAssign(selector[0], sourceJson, parameters);
            }
            return null;
        }

        function getObjectIndex(objects, object) {

            for (var i = 0; i < objects.length; i++) {
                if (angular.equals(objects[i], object)) {
                    return i;
                }
            }

            return -1;
        }

        function replaceJsonContent(objectPath, rootObj, newObj, index, alwaysReplace, toRemove) {

            if (rootObj && objectPath) {
                if (index >= objectPath.length) {
                    if (angular.isArray(rootObj)) {
                        if (toRemove) {
                            if (Array.isArray(toRemove)) {
                                for (var trI = 0; trI < toRemove.length; trI++) {
                                    var tRInd = getIndex(rootObj, "TECHDISER_ID", toRemove[trI].TECHDISER_ID);
                                    if (tRInd > -1) {
                                        rootObj.splice(tRInd, 1);
                                    }
                                }
                            } else if (newObj) {
                                rootObj = newObj;
                            }

                        }
                        if (angular.isArray(newObj)) {
                            //console.log(rootObj);
                            if (alwaysReplace) {
                                rootObj = newObj;
                            }
                            else {
                                for (var i = 0; i < newObj.length; i++) {
                                    if (newObj[i]) {
                                        if (checkObject(newObj[i])) {
                                            var indx = getIndex(rootObj, PRIMARY_COLUMN_NAME, newObj[i][PRIMARY_COLUMN_NAME]);
                                            if (indx > -1) {
                                                rootObj[indx] = angular.copy(newObj[i]);
                                            } else {
                                                rootObj.unshift(newObj[i]);
                                            }
                                        }
                                        else {
                                            var f = 0;
                                            for (; f < rootObj.length; f++) {
                                                if (rootObj[f] == newObj[i]) {
                                                    break;
                                                }
                                            }
                                            if (f >= rootObj.length) {
                                                rootObj.push(newObj[i]);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            if (alwaysReplace) {
                                rootObj = newObj;
                            }
                            else {
                                rootObj.unshift(newObj);
                            }
                        }
                    }
                    else {
                        rootObj = newObj;
                    }
                }
                else {
                    var attr = objectPath[index];
                    rootObj[attr] = replaceJsonContent(objectPath, rootObj[attr], newObj, index + 1, alwaysReplace, toRemove);
                }
            }
            return rootObj;
        }

        function mergeObj(jsonSource, jsonDest, excludes, includes) {

            if (jsonSource && jsonDest) {
                if (checkObject(jsonSource) && checkObject(jsonDest)) {
                    angular.forEach(jsonSource, function (valueSrc, keySrc) {
                        if (keySrc != PRIMARY_COLUMN_NAME) {
                            var excludeIndex = (excludes && excludes.indexOf(keySrc) >= 0) ? false : true;
                            var includeIndex = (!includes || includes.indexOf(keySrc) >= 0) ? true : false;
                            if (excludeIndex && includeIndex) {
                                jsonDest[keySrc] = (valueSrc) ? angular.copy(valueSrc) : null;
                            }
                        }
                    });
                }
            }
            return jsonDest;
        }

        function getOrganizationId() {

            return "Organization_1";
        }

        function getItemsFromStr(str) {

            var itemArr = [];
            if (str != "") {
                str.split(",").forEach(function (item) {
                    item = item.trim();
                    var items = item.split("-");
                    if (items.length > 1 && !isNaN(items[0]) && !isNaN(items[1])) {
                        var start = parseInt(items[0]);
                        var end = parseInt(items[1]);
                        for (var i = start; i <= end; i++) {
                            itemArr.push(i);
                        }
                    } else if (item != "") {
                        itemArr.push(parseInt(item));
                    }
                })
            }
            return itemArr;
        }

        function validateObject(objectData, validationPlocies) {

            const POLICY_TYPES = {
                REGEX: "RGX",
                MANDATORY: "Mandatory"
            }


            function sampleValidationPolicy() {
                var objectValidationPlocies = [
                    {
                        "attrName": "name",
                        "attributePath": "/name",
                        "policies": [

                            {
                                "policyType": "RGX",
                                "expression": "^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$",
                                "message": "Invalid Name"
                            },

                            {
                                "policyType": "Mandatory",
                                "message": "Can not Empty"
                            }
                        ]
                    },
                    {
                        "attrName": "age",
                        "attributePath": "/age",
                        "policies": [

                            {
                                "policyType": "RGX",
                                "expression": "^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$",
                                "message": "Invalid Age"
                            },

                            {
                                "policyType": "Mandatory",
                                "message": "Can not Empty"
                            }
                        ]
                    }
                    // {
                    //     "attrName" : "phone",
                    //     "attributePath" : "/phone",
                    //     "policies" : [

                    //         {"policyType" : "RGX",
                    //         "expression" : "^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$",
                    //         "message"   : "Invalid Phone Number"},

                    //         {"policyType" : "Mandatory",
                    //         "message"   : "Can not Empty"}
                    //         ]
                    // },
                    // {
                    //     "attrName" : "lastDegreeObtained",
                    //     "attributePath" : "/lastDegreeObtained",
                    //     "policies" : [

                    //         {"policyType" : "Mandatory",
                    //         "message"   : "No Degree Found"}
                    //         ]
                    // },
                    // {
                    //     "attrName" : "road",
                    //     "attributePath" : "/addresses/road",
                    //     "policies" : [

                    //         {"policyType" : "Mandatory",
                    //         "message"   : "Can not Empty"},

                    //         {"policyType" : "RGX",
                    //         "expression" : "^\\d+\\w*\\s*(?:(?:[\\-\\/]?\\s*)?\\d*(?:\\s*\\d+\\/\\s*)?\\d+)?\\s+",
                    //         "message"   : "Invalid Address"}

                    //         ]
                    // },
                    // {
                    //     "attrName" : "email",
                    //     "attributePath" : "/email",
                    //     "policies" : [

                    //         {"policyType" : "RGX",
                    //         "expression" : "^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$",
                    //         "message"   : "Invalid Email"},

                    //         {"policyType" : "Mandatory",
                    //         "message"   : "Can not Empty"}
                    //         ]
                    // },
                    // {
                    //     "attrName" : "district",
                    //     "attributePath" : "/district",
                    //     "policies" : [

                    //         {
                    //             "policyType" : "RGX",
                    //             "expression" : "^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$",
                    //             "message"   : "Invalid District"
                    //         }
                    //     ]
                    // }
                ];

                return objectValidationPlocies;
            }

            function sampleUsage() {
                function validedObject(objectData, validationPlocies) {

                    var validationStatusReport = objectValidationHandler.objectValidator(objectData, validationPlocies);

                    return validationStatusReport;

                }

                var sampleObject = {
                    "name": "Md. Raihan Talukder",
                    "age": 23
                    // "email" : ["xyz@gmail.com","abc"],
                    // "phone" : "01724010437",
                    // "something" : true
                };

                var objectValidationPlocies = sampleValidationPolicy();

                var validationStatusReport = validedObject(sampleObject, objectValidationPlocies);
                var statusStr = JSON.stringify(validationStatusReport);

                return statusStr;
            }

            function validationHandler(attrValue, validationPlocies, attrname, path) {

                var opDef = this;

                opDef.getValidationStatusObject = getValidationStatusObject;
                opDef.handleMandatoryData = handleMandatoryData;
                opDef.handleRegularExpression = handleRegularExpression;
                opDef.validatePrimitiveValue = validatePrimitiveValue;

                function getValidationStatusObject() {
                    return {
                        status: true,
                        message: ""
                    }
                }

                function handleMandatoryData(attrValue, policy, path) {

                    var validationStatus = opDef.getValidationStatusObject();

                    if (!attrValue && policy && policy.expression) {
                        validationStatus.status = false;
                        validationStatus.policy = policy.expression;
                        validationStatus.attrname = policy.attrname;
                        validationStatus.path = path;
                        validationStatus.message = (policy.message) ? policy.expression : "Invalid Data"
                    }

                    return validationStatus;

                }


                function handleRegularExpression(attrname, attrValue, policy, path) {

                    var validationStatus = opDef.getValidationStatusObject();

                    if (attrValue && policy && policy.expression) {
                        if (!attrValue.match(policy.expression)) {
                            validationStatus.status = false;
                            validationStatus.value = attrValue;
                            validationStatus.policy = policy.expression;
                            validationStatus.attrname = policy.attrname;
                            validationStatus.path = path;
                            validationStatus.message = (policy.message) ? policy.message : "Invalid Data"
                        }
                    }

                    return validationStatus;

                }

                function validatePrimitiveValue(attrValue, validationPlocies, attrname, path) {

                    var validationReport = [];

                    if (attrname && validationPlocies) {
                        for (var j = 0; j < validationPlocies.length; j++) {

                            if (validationPlocies[j] && validationPlocies[j].policies) {

                                if (path && path == validationPlocies[j].attributePath) {

                                    for (var k = 0; k < validationPlocies[j].policies.length; k++) {

                                        if (validationPlocies[j].policies[k] && validationPlocies[j].policies[k].policyType) {

                                            if (validationPlocies[j].policies[k].policyType == POLICY_TYPES.REGEX) {
                                                var validationStatus = opDef.handleRegularExpression(attrname, attrValue, validationPlocies[j].policies[k], path);
                                                if (validationStatus && !validationStatus.status) {
                                                    validationReport.push(validationStatus);
                                                }
                                            } else if (validationPlocies[j].policies[k].policyType == POLICY_TYPES.MANDATORY) {
                                                var validationStatus = opDef.handleMandatoryData(attrValue, validationPlocies[j].policies[k], path);
                                                if (validationStatus && !validationStatus.status) {
                                                    validationReport.push(validationStatus);
                                                }
                                            }

                                        }

                                    }

                                }
                            }

                        }
                    }



                    return validationReport;

                }

                return opDef.validatePrimitiveValue(attrValue, validationPlocies, attrname, path);

            }

            function handleArrayValue(attrValue, validationPlocies, exploreObjectAttributes, attrname, path, dataTypes) {

                var arrayHandler = this;

                arrayHandler.initArrayDataHandler = initArrayDataHandler;

                function initArrayDataHandler(attrValue, validationPlocies, exploreObjectAttributes, attrname, path, dataTypes) {

                    var validationStatus = [];

                    if (attrValue) {
                        for (var i = 0; i < attrValue.length; i++) {
                            if (attrValue[i]) {
                                var arrayItemValidationStatus = exploreObjectAttributes(attrValue[i], validationPlocies, attrname, path, dataTypes);
                                if (arrayItemValidationStatus) {
                                    validationStatus = validationStatus.concat(arrayItemValidationStatus);
                                }
                            }
                        }
                    }

                    return validationStatus;
                }

                return arrayHandler.initArrayDataHandler(attrValue, validationPlocies, exploreObjectAttributes, attrname, path, dataTypes);

            }

            function handleStringValue(attrValue, validationPlocies, attrname, path) {

                var validationStatus = [];

                if (!attrname || !attrValue) {
                    return null;
                }

                validationStatus = validationHandler(attrValue, validationPlocies, attrname, path);


                return validationStatus;

            }

            function handleNumericValue(attrValue, validationPlocies, attrname, path) {

                var validationStatus = false;

                if (attrname && attrValue) {
                    attrValue = "" + attrValue;
                    validationStatus = validationHandler(attrValue, validationPlocies, attrname, path);
                }

                return validationStatus;

            }

            function handleBooleanValue(attrValue, validationPlocies, attrname, path) {

                var validationStatus = [];

                if (!attrname || !attrValue) {
                    return null;
                }

                validationStatus = validationHandler(attrValue, validationPlocies, attrname, path);


                return validationStatus;

            }

            function handlePrimitiveData(attrValue, validationPlocies, attrname, valueType, path, dataTypes) {

                var validationStatusReport = [];

                var validationStatus = performDataValidation(valueType, attrValue, validationPlocies, attrname, path, dataTypes);

                if (validationStatus) {
                    validationStatusReport = validationStatusReport.concat(validationStatus)
                }

                return validationStatusReport;

            }

            function performDataValidation(dataType, attrValue, validationPlocies, attrname, path, dataTypes) {

                var validationStatus = [];

                if (!dataType) {
                    return validationStatus;
                }

                if (dataType == dataTypes.DATA_TYPE_PRIMITIVE_STRING) {
                    validationStatus = handleStringValue(attrValue, validationPlocies, attrname, path)
                }

                if (dataType == dataTypes.DATA_TYPE_PRIMITIVE_NUMBER) {
                    validationStatus = handleNumericValue(attrValue, validationPlocies, attrname, path)
                }

                if (dataType == dataTypes.DATA_TYPE_PRIMITIVE_BOOLEAN) {
                    validationStatus = handleBooleanValue(attrValue, validationPlocies, attrname, path)
                }

                return validationStatus;

            }

            function objectInfoHandler(objectData, validationPlocies, exploreObjectAttributes, path, dataTypes) {

                var objHandler = this;

                objHandler.handleObjectAttrValue = handleObjectAttrValue;
                objHandler.handleObjectTypeData = handleObjectTypeData;


                function handleObjectAttrValue(attrValue, validationPlocies, attrname, exploreObjectAttributes, path, dataTypes) {

                    var validationStatus = [];

                    if (attrValue && attrname) {
                        validationStatus = exploreObjectAttributes(attrValue, validationPlocies, attrname, path, dataTypes);
                    }

                    return validationStatus;

                }

                function handleObjectTypeData(objectData, validationPlocies, exploreObjectAttributes, path, dataTypes) {

                    var validationStatusReport = [];

                    var initialPath = path;

                    if (objectData && validationPlocies) {

                        var attr = Object.keys(objectData);

                        for (var i = 0; i < attr.length; i++) {

                            if (attr[i]) {

                                var attrname = attr[i];

                                var attrValue = objectData[attrname];

                                if (initialPath) {
                                    initialPath = path + (path.endsWith("/") ? "" : "/") + attrname;
                                }

                                var validationStatus = objHandler.handleObjectAttrValue(attrValue, validationPlocies, attrname, exploreObjectAttributes, initialPath);

                                var valueType = retrieveDataType(objectData);

                                if (validationStatus && validationStatus.length > 0) {

                                    if (valueType = dataTypes.DATA_TYPE_OBJECT) {

                                        validationStatusReport = validationStatusReport.concat(validationStatus);

                                    } else {

                                        var validationReportItem = {
                                            attributeName: attrname,
                                            validationStatus: validationStatus
                                        };

                                        validationStatusReport.push(validationReportItem);
                                    }

                                }

                            }
                        }
                    }

                    return validationStatusReport;

                }

                return objHandler.handleObjectTypeData(objectData, validationPlocies, exploreObjectAttributes, path, dataTypes)

            }

            function absentAttributeHandler(objectData, validationPlocies, path, policyTypes) {


                function getObjectPath(path) {
                    var objectPath = "";
                    if (path) {
                        var lastIndexOfSeparator = path.lastIndexOf("/");
                        if (lastIndexOfSeparator > 0) {
                            objectPath = path.substring(0, lastIndexOfSeparator);
                        }
                    }
                    return objectPath + "/";
                }

                function fetchMandatoryAttributes(validationPlocies, path, policyTypes) {

                    var mandatoryAttributes = [];

                    var objectPathWithSeparator = path + ((path.endsWith("/")) ? "" : "/");
                    // getObjectPath(path);

                    if (validationPlocies && policyTypes) {
                        validationPlocies.forEach(function (item) {
                            if (item && item.attrName && item.attributePath) {
                                if (item.attributePath == objectPathWithSeparator + item.attrName) {
                                    if (item.policies) {
                                        item.policies.forEach(function (policy) {
                                            if (policy && policy.policyType && policy.policyType == policyTypes.MANDATORY) {
                                                mandatoryAttributes.push(item.attrName);
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    }

                    return mandatoryAttributes;

                }

                function searchAbsentAttributes(objectData, mandatoryAttributes) {

                    var absendAttributes = [];

                    if (objectData && mandatoryAttributes) {

                        for (var i = 0; i < mandatoryAttributes.length; i++) {

                            if (mandatoryAttributes[i]) {

                                var attr = Object.keys(objectData);

                                var j = 0;

                                for (; j < attr.length; j++) {
                                    if (attr[j] == mandatoryAttributes[i]) {
                                        break;
                                    }
                                }

                                if (j >= attr.length) {
                                    absendAttributes.push(mandatoryAttributes[i]);
                                }

                            }
                        }

                    }

                    return absendAttributes;

                }

                function prepareAbsentReport(absentAttributes, path) {

                    var absentReports = [];

                    if (absentAttributes) {
                        absentAttributes.forEach(function (item) {
                            if (item) {
                                var info = {};
                                info.status = false;
                                info.message = "Attribute Not Found";
                                info.path = path + (path.endsWith("/") ? "" : "/") + item;
                                absentReports.push(info);
                            }
                        });
                    }

                    return absentReports;

                }

                function checkForAbsentAttributes(objectData, validationPlocies, path, policyTypes) {

                    var validationReport = [];

                    if (objectData && validationPlocies && path) {

                        var mandatoryAttributes = fetchMandatoryAttributes(validationPlocies, path, policyTypes);

                        var absentAttributes = searchAbsentAttributes(objectData, mandatoryAttributes);

                        validationReport = prepareAbsentReport(absentAttributes, path);

                    }

                    return validationReport;


                }

                return checkForAbsentAttributes(objectData, validationPlocies, path, policyTypes);

            }

            function exploreObjectAttributes(objectData, validationPlocies, attrname, path, dataTypes) {

                if (!path) {
                    path = '/';
                }

                if (!dataTypes) {
                    dataTypes = getDataTypes();
                }

                var validationStatusReport = [];

                if (!objectData || !validationPlocies) {
                    return validationStatusReport;
                }

                var validationStatus = [];

                var valueType = retrieveDataType(objectData);

                if (valueType == dataTypes.DATA_TYPE_OBJECT) {

                    validationStatus = objectInfoHandler(objectData, validationPlocies, exploreObjectAttributes, path, dataTypes);

                    var absetStatusReport = absentAttributeHandler(objectData, validationPlocies, path, POLICY_TYPES);

                    validationStatus = validationStatus.concat(absetStatusReport);

                } else if (valueType == dataTypes.DATA_TYPE_ARRAY) {

                    validationStatus = handleArrayValue(objectData, validationPlocies, exploreObjectAttributes, attrname, path, dataTypes);

                } else if (attrname) {

                    validationStatus = handlePrimitiveData(objectData, validationPlocies, attrname, valueType, path, dataTypes);
                }

                if (validationStatus) {
                    validationStatusReport = validationStatusReport.concat(validationStatus)
                }

                return validationStatusReport;

            }

            // ---------------  initiaing operation ---------------------------

            return exploreObjectAttributes(objectData, validationPlocies)


        }

        return service;
    }

})();
