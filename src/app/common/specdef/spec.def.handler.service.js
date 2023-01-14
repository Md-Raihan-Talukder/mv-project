(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('specDefHandlerService', specDefHandlerService);

    /** @ngInject */
    function specDefHandlerService(SAVE_POLICY_SPEC, PARAM_NOTION, $injector, dataPreparationMgtService, msbUtilService) {

        var service = {
            samplingOpHandler : samplingOpHandler,
            generatePathIDs : generatePathIDs,
            prepareParamInfo : prepareParamInfo
        }

        function prepareParamInfo(serviceName,taskName,templatePath,dataSavePath,contextObjectId, jsonServiceName, params){

            if(!params){
                params = [];
            }

            var p_contextObjectId = msbUtilService.searchFromParam(params, SAVE_POLICY_SPEC.contextObjectId);
            var p_templatePath = msbUtilService.searchFromParam(params, SAVE_POLICY_SPEC.templatePath);
            var p_serviceName = msbUtilService.searchFromParam(params, SAVE_POLICY_SPEC.serviceName);
            var p_jsonServiceName = msbUtilService.searchFromParam(params, SAVE_POLICY_SPEC.jsonServiceName);
            var p_taskName = msbUtilService.searchFromParam(params, SAVE_POLICY_SPEC.taskName);
            var p_dataSavePath = msbUtilService.searchFromParam(params, SAVE_POLICY_SPEC.dataSavePath);

            if(!p_contextObjectId){
                params.push({"key": SAVE_POLICY_SPEC.contextObjectId, "value": contextObjectId});
            }

            if(!p_serviceName){
                params.push({"key": SAVE_POLICY_SPEC.serviceName, "value": serviceName});
            }

            if(!p_jsonServiceName){
                params.push({"key": SAVE_POLICY_SPEC.jsonServiceName, "value": jsonServiceName});
            }

            if(!p_taskName){
                params.push({"key": SAVE_POLICY_SPEC.taskName, "value": taskName});
            }

            if(!p_dataSavePath) {
                params.push({"key": SAVE_POLICY_SPEC.dataSavePath, "value": dataSavePath});
            }
            if(!p_templatePath){
                params.push({"key": SAVE_POLICY_SPEC.templatePath, "value": templatePath});
            }

            return params;
        }

        function generatePathIDs(callBack, params){

            function prepareIdSpec(callBack, params) {

                var templatePath = msbUtilService.searchFromParam(params, SAVE_POLICY_SPEC.templatePath);
                var serviceName = msbUtilService.searchFromParam(params, SAVE_POLICY_SPEC.serviceName);
                var jsonServiceName = msbUtilService.searchFromParam(params, SAVE_POLICY_SPEC.jsonServiceName);
                var taskName = msbUtilService.searchFromParam(params, SAVE_POLICY_SPEC.taskName);
                var dataSavePath = msbUtilService.searchFromParam(params, SAVE_POLICY_SPEC.dataSavePath);

                if(templatePath && jsonServiceName && taskName && dataSavePath){
                    samplingOpHandler(
                        function(policy){
                            var info = {};
                            if(policy){
                                info[SAVE_POLICY_SPEC.serviceName] = serviceName;
                                info[SAVE_POLICY_SPEC.taskName] = taskName;
                                info[SAVE_POLICY_SPEC.dataSavePath] = dataSavePath;
                                info[SAVE_POLICY_SPEC.templatePath] = templatePath;
                                info[SAVE_POLICY_SPEC.containerObject] = null;
                                info[SAVE_POLICY_SPEC.idGenerationPolicies] = policy;
                                info[SAVE_POLICY_SPEC.persistableData] = {};
                                params.push({"key": SAVE_POLICY_SPEC.specDef, "value": info});
                            }
                            getPathIDs(callBack, params);

                        },
                        SAVE_POLICY_SPEC.specType[0],
                        templatePath,
                        jsonServiceName
                    );
                }

            }

            function getPathIDs(callBack, params){

                dataPreparationMgtService.getSavePathIDs( function(updatedParams){

                    if(updatedParams) {
                        params = updatedParams;
                    }
                    callBack(params);
                }, params );

            }

            prepareIdSpec(callBack, params);


        }


        function requestHandler(jsonServiceName, specType, servicePath){

            function getAttributesInPath(path) {
                var attributes = [];
                var pos = 0;
                if(path) {
                    attributes.push("root");
                    if(path!=PARAM_NOTION.starterNotion){
                        var pathComponents = path.split(PARAM_NOTION.starterNotion);
                        pathComponents.forEach(function(item){
                            if(item){
                                pos += item.length + PARAM_NOTION.starterNotion.length;
                                var paramPos = item.trim().indexOf(PARAM_NOTION.variableContainer);
                                var endPosition = -1;
                                if(paramPos<0){
                                    endPosition = item.length;
                                } else if(paramPos>=0){
                                    endPosition = paramPos;
                                }
                                if(endPosition>0){
                                    var attr = item.substring(0,endPosition);
                                    attributes.push(attr);
                                }
                            }
                        });
                    }
                }
                return attributes;
            }

            function getFunctionNames(attributes, ignoreLastItrem){

                var functionNames = [];
                var cPath = "";;
                if(attributes){
                    attributes.forEach(function(pathItem,index){
                        var excludable = (ignoreLastItrem) ? 1 : 0;
                        if(pathItem && index < attributes.length - excludable){
                            if(index>0){
                                cPath += pathItem.substring(0,1).toUpperCase() + pathItem.substring(1);
                            } else {
                                cPath += pathItem;
                            }
                            functionNames.push(cPath +"Def");
                        }
                    });
                }
                return functionNames;
            }

            function handleIdGenSpec(servicePath, ignoreLastItrem){
                var attributes = getAttributesInPath(servicePath);
                var funtionNames = getFunctionNames(attributes, ignoreLastItrem);
                return funtionNames;
            }

            function getIdGenerationPolicies(jsonServiceName, specType, servicePath){

                var idGenerationPolicies = [];
                if(jsonServiceName){
                    var jsonService = $injector.get(jsonServiceName);
                    if(jsonService){
                        var functionNames = handleIdGenSpec(servicePath, true);
                        idGenerationPolicies = jsonService.specInterface(specType, servicePath, functionNames);
                    }
                }
                return idGenerationPolicies;

            }

            function fetchIdPrefix(jsonServiceName, specType, servicePath){

                var prefix = "";
                if(jsonServiceName){
                    var jsonService = $injector.get(jsonServiceName);
                    if(jsonService){
                        var functionNames = handleIdGenSpec(servicePath, false);
                        prefix = jsonService.specInterface(specType, servicePath, functionNames);
                    }
                }
                return prefix;

            }

            function specInterface(jsonServiceName, specType, servicePath){
                var info = null;
                if(specType == SAVE_POLICY_SPEC.specType[0]){
                    info = getIdGenerationPolicies(jsonServiceName, specType, servicePath);
                } else if(specType == SAVE_POLICY_SPEC.specType[1]){
                    info = fetchIdPrefix(jsonServiceName, specType, servicePath);
                }
                return info;
            }

            return specInterface(jsonServiceName, specType, servicePath);

        }

        function samplingOpHandler(callback, specType, servicePath, jsonServiceName){



            var info = requestHandler(jsonServiceName, specType, servicePath);

            callback(info);

        }

        return service;

    }
})();
