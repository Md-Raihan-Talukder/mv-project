(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('webSoc', webSoc);

    /** @ngInject */
    function webSoc($websocket, Webworker, CONSTANT_RESPONSE_TYPES, CONSTANT_VIEW_INFO, CONSTANT_SEPERATOR, SOCKET_OPERATION_ERROR, WS_FRAME_END) {

        var service = {
            initWebWorker: initWebWorker,
            getSubscriptionCode: getSubscriptionCode,
        }



        var callBacks = [];

        function getResponseObj(pType) {
            return {
                responseType: pType,
                data: null
            }
        }

        function getCallBackObj(opCode, pFunc) {
            return {
                code: opCode,
                callBack: pFunc
            }
        }

        function getOperation() {
            return {
                operationDef: null, isInitialized: false
            };
        }


        function getPositioveAck() {
            return CONSTANT_RESPONSE_TYPES[0];
        }

        function getCallbackRequiredAck() {
            return CONSTANT_RESPONSE_TYPES[1];
        }

        function getCodeRequiredAck() {
            return CONSTANT_RESPONSE_TYPES[2];
        }

        function getNegativeAck() {
            return CONSTANT_RESPONSE_TYPES[3];
        }

        function checkForPositiveResponse(obj) {
            if (obj && obj.responseType == getPositioveAck()) {
                return true;
            }
            return false;
        }

        function getCallBack(pCode) {
            for (var i = 0; i < callBacks.length; i++) {
                if (callBacks[i] && callBacks[i].code) {
                    if (callBacks[i].code.toLowerCase() == pCode.toLowerCase()) {
                        return callBacks[i];
                    }
                }
            }
            return null;
        }

        function subscribeCallBack(pCode, pFunc) {
            var res = null;
            if (!pCode) {
                res = getResponseObj(getCodeRequiredAck());
                res.data = 'Subscription Failed';
                return res;
            }
            if (!pFunc) {
                res = getResponseObj(getCallbackRequiredAck());
                res.data = 'Subscription Failed';
                return res;
            }
            var cb = getCallBack(pCode);
            if (!cb) {
                callBacks.push(getCallBackObj(pCode, pFunc));
            }
            res = getResponseObj(getPositioveAck());
            res.data = pCode;
            return res;
        }
        //{"TNA":{"ACTIONS":"SAVE_TNA"}}

        function getSubscriptionCode(operationDef) {
            var fCode = '';
            var opCode = '';
            if (operationDef) {
                for (var key in operationDef) {
                    if (CONSTANT_VIEW_INFO[key]) {
                        fCode = CONSTANT_VIEW_INFO[key]["CODE"];
                        if (operationDef[key]) {
                            for (var opKey in operationDef[key]) {
                                if (CONSTANT_VIEW_INFO[key][opKey]) {
                                    if (CONSTANT_VIEW_INFO[key][opKey] && (typeof CONSTANT_VIEW_INFO[key][opKey].join === 'function')) {
                                        for (var i = 0; i < CONSTANT_VIEW_INFO[key][opKey].length; i++) {
                                            if (CONSTANT_VIEW_INFO[key][opKey][i][operationDef[key][opKey]]) {
                                                opCode = CONSTANT_VIEW_INFO[key][opKey][i][operationDef[key][opKey]];
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (opCode) {
                                    break;
                                }
                            }
                        }
                    }
                    if (opCode) {
                        break;
                    }
                }
                return fCode + CONSTANT_SEPERATOR + opCode;
            }
            return '';
        }


        function initWsSubscription(serviceDef, callbackFunc) {
            var res = getResponseObj(getNegativeAck());
            res.data = "initiation failed"
            var opCode = getSubscriptionCode(serviceDef);
            if (opCode) {
                return subscribeCallBack(opCode, callbackFunc);
            }
            return res;
        }




        function initWebWorker(wrkrOperationDef, wrkrData, callbackFunc) {

            var subsCode = initWsSubscription(wrkrOperationDef, callbackFunc);

            if (subsCode && subsCode.data && checkForPositiveResponse(subsCode)) {

                var callbck = getCallBack(subsCode.data);




            }
            else {
                if (callbackFunc) {
                    //var attr=
                    //callbackFunc({[SOCKET_OPERATION_ERROR]:'operation not defined properly'});
                }
            }

        }



        return service;


    }
})();



/*

        // function that will become a worker
        function asyncWorker(first, second) {
            // api to send a promise notification
            notify(first);
            // api to resolve the promise. Note: according to the $q spec,
            // a promise cannot be used once it has been resolved or rejected.
            complete(second);
        }

*/


/*
        var myWorker = Webworker.create(async, {
            async: true, // prevent the function return from resolving the promise
            useHelper: true/false, // defaults to false for most browsers. defaults to true for IE.
            onMessage: function(event) {}, // every event from the worker fires this when async:true
            onError: function(event) {}, // error event from the worker
            onReturn: function(data) {}, // return value from the function
            onComplete: function(data) {}, // data from complete/resolve function
            onNotice: function(data) {} // data from notice function
        });
*/