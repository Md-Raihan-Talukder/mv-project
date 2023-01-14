
(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('dataPreparationMgtService', dataPreparationMgtService);

    /** @ngInject */
    function dataPreparationMgtService(msbUtilService, msbCommonApiService, SAVE_POLICY_SPEC, PARAM_NOTION) {

        var service = {
            getSavePathIDs: getSavePathIDs,
            getPersistableInfo: getPersistableInfo,
        };

        function dataPreparationHandler() {

            var opDef = {
                intiHandleOperation: intiHandleOperation
            }

            function existingInfoCallback(params, templateData, remainingAttribures, idGenerationPolicies, templateAttributes, persistableData, saveAttributes) {

                function getInnerObject(obj) {
                    var containerObj = null;
                    if (obj) {
                        if (angular.isArray(obj) && obj.length > 0 && angular.isObject(obj[0])) {
                            containerObj = obj[0];
                        } else {
                            containerObj = obj;
                        }
                    }
                    return containerObj;
                }

                function sampleIdGenerationPolicy() {
                    var obj = {
                        templatePath: "/attr1/attr1.1",
                        concateAttributes: ["prefix", "abc", "xyz"],
                        refereceObject: { prefix: "prefix", abc: "id1", xyz: "id2" }
                    }
                }

                function objectIdPreparator(parentId, params, idGenerationPolicies, exploredPath) {

                    function concateAssociatedReferences(keyValues) {

                        var concatenatedVal = "";

                        if (keyValues) {

                            keyValues.forEach(function (item) {
                                if (item) {
                                    concatenatedVal += item;
                                }
                            });

                        }

                        return concatenatedVal;

                    }

                    function checkForReferenceObject(params, preparationPolicy) {
                        var status = false;
                        if (preparationPolicy.concateAttributes
                            && preparationPolicy.concateAttributes.length > 0
                            && preparationPolicy.refereceObject) {
                            var found = true;
                            for (var i = 0; i < preparationPolicy.concateAttributes.length; i++) {
                                var attr = preparationPolicy.concateAttributes[i];
                                if (!preparationPolicy.refereceObject[attr]) {
                                    var value = msbUtilService.searchFromParam(params, attr);
                                    if (!msbUtilService.checkUndefined(value)) {
                                        found = false;
                                    }
                                }
                            }
                            if (found) {
                                status = true;
                            }
                        }
                        return status;
                    }

                    function validatePolicyDef(params, preparationPolicy) {

                        var status = false;

                        if (preparationPolicy && params) {
                            status = checkForReferenceObject(params, preparationPolicy);
                        }

                        return status;
                    }

                    function prepareParamKeys(params, preparationPolicy) {
                        var keyValues = [];
                        if (preparationPolicy.concateAttributes
                            && preparationPolicy.concateAttributes.length > 0
                            && preparationPolicy.refereceObject) {
                            var found = true;
                            for (var i = 0; i < preparationPolicy.concateAttributes.length; i++) {
                                var attr = preparationPolicy.concateAttributes[i];
                                if (preparationPolicy.refereceObject[attr]) {
                                    keyValues.push(preparationPolicy.refereceObject[attr]);
                                } else {
                                    var value = msbUtilService.searchFromParam(params, attr);
                                    if (attr == "TECHDISER_SELRIAL_ID") {
                                        value = "serial" + value;
                                    }
                                    keyValues.push(value);
                                }
                            }
                        }
                        return keyValues;

                    }

                    function handleIdGenPolicy(parentId, params, preparationPolicy) {

                        var id = "";

                        var validationStatus = validatePolicyDef(params, preparationPolicy);

                        var keyValues = prepareParamKeys(params, preparationPolicy);

                        if (validationStatus && keyValues) {
                            id = parentId + concateAssociatedReferences(keyValues);
                        }

                        return id;

                    }

                    function prepareObjectId(parentId, params, idGenerationPolicies, exploredPath) {

                        var id = "";

                        if (exploredPath) {

                            var itemIndex = msbUtilService.getIndex(idGenerationPolicies, "templatePath", exploredPath);

                            if (itemIndex >= 0) {
                                var preparationPolicy = idGenerationPolicies[itemIndex];
                                if (preparationPolicy) {
                                    id = handleIdGenPolicy(parentId, params, preparationPolicy)
                                    if (id) {
                                        idGenerationPolicies[itemIndex][SAVE_POLICY_SPEC.pathId] = id;
                                    }
                                }
                            }

                        }

                        return id;

                    }

                    return prepareObjectId(parentId, params, idGenerationPolicies, exploredPath);
                }

                function prepareObjectAttributes(templateData, id) {

                    var preparedObj = {};

                    preparedObj.TECHDISER_ID = id;

                    return preparedObj;
                }

                function prepareObjectContents(parentId, params, templateData, idGenerationPolicies, exploredPath) {

                    var preparedObject = null;

                    var id = objectIdPreparator(parentId, params, idGenerationPolicies, exploredPath);
                    if (id) {
                        preparedObject = prepareObjectAttributes(templateData, id);
                    }

                    return preparedObject;

                }

                function prepareObject(parentId, params, templateData, idGenerationPolicies, exploredPath) {

                    var preparedObject = null;
                    var obj = getInnerObject(templateData);

                    if (obj) {
                        var info = prepareObjectContents(parentId, params, templateData, idGenerationPolicies, exploredPath);
                        if (info) {
                            if (angular.isArray(templateData)) {
                                preparedObject = [];
                                preparedObject.push(info);
                            } else {
                                preparedObject = info;
                            }
                        }
                    }

                    return preparedObject;
                }

                function getInnerTemplate(templateData, objAttr) {

                    var newTemplate = null;

                    if (templateData && objAttr) {
                        newTemplate = getInnerObject(templateData);
                        newTemplate = newTemplate[objAttr];
                    }

                    return newTemplate;
                }

                function getExploredPath(exploredPath, objAttr) {

                    if (objAttr != PARAM_NOTION.starterNotion) {
                        exploredPath += (exploredPath.endsWith(PARAM_NOTION.starterNotion)) ? objAttr : PARAM_NOTION.starterNotion + objAttr;
                    }

                    if (!exploredPath) {
                        exploredPath = objAttr;
                    }

                    return exploredPath;
                }

                function initInnerObjPreparation(params, templateData, remainingAttribures, idGenerationPolicies, templateAttributes, persistableData, saveAttributes, exploredPath, parentId) {

                    var preparedObject = null;

                    if (!exploredPath) {
                        exploredPath = "";
                    }

                    if (!parentId) {
                        parentId = "";
                    }

                    if (templateData && remainingAttribures) {

                        var attrObj = remainingAttribures[0];

                        if (attrObj && attrObj.attr) {

                            var objAttr = attrObj.attr;

                            exploredPath = getExploredPath(exploredPath, objAttr);

                            if (remainingAttribures.length == 1) {

                                preparedObject = persistableData;

                            } else {

                                preparedObject = prepareObject(parentId, params, templateData, idGenerationPolicies, exploredPath);

                                if (preparedObject && preparedObject.TECHDISER_ID) {

                                    if (remainingAttribures.length > 1) {
                                        var otherAttribures = remainingAttribures.slice(1, remainingAttribures.length);
                                        var newTemplate = (otherAttribures[0].attr) ? getInnerTemplate(templateData, otherAttribures[0].attr) : null;
                                        if (newTemplate) {
                                            var innerObject = initInnerObjPreparation(params, newTemplate, otherAttribures, idGenerationPolicies, templateAttributes, persistableData, saveAttributes, exploredPath, preparedObject.TECHDISER_ID);
                                            if (innerObject) {

                                                saveAttributes.splice(saveAttributes.length - 1, 1);

                                                var isGrandParentConainerArray = true;
                                                var isParentConainerArray = false;
                                                var containerAttribute = otherAttribures[0].attr;
                                                if (templateData[containerAttribute]) {
                                                    isGrandParentConainerArray = false;
                                                    if (angular.isArray(templateData[containerAttribute])) {
                                                        isParentConainerArray = true;
                                                    } else {
                                                        isParentConainerArray = false;
                                                    }
                                                } else if (angular.isArray(templateData)) {
                                                    isGrandParentConainerArray = true;
                                                    if (angular.isArray(templateData[0][containerAttribute])) {
                                                        isParentConainerArray = true;
                                                    } else {
                                                        isParentConainerArray = false;
                                                    }
                                                }
                                                if (isParentConainerArray) {
                                                    var info = [];
                                                    info.push(innerObject);
                                                    innerObject = info;
                                                }

                                                preparedObject[containerAttribute] = innerObject;

                                            } else {
                                                preparedObject = null;
                                            }
                                        } else {
                                            preparedObject = null;
                                        }

                                    } else {
                                        preparedObject = preparedObject;
                                    }

                                }
                            }


                        }
                    }

                    return preparedObject;

                }

                return initInnerObjPreparation(params, templateData, remainingAttribures, idGenerationPolicies, templateAttributes, persistableData, saveAttributes);

            }

            function trimSavePath(dataSavePath) {

                var path = "";

                if (dataSavePath) {
                    var lastIndex = dataSavePath.lastIndexOf(PARAM_NOTION.starterNotion);
                    if (lastIndex >= 0) {
                        path = dataSavePath.substring(0, lastIndex);
                    }
                }

                return path;

            }

            function getMatchedAttributeIndex(workingAttribute, templateAttributes) {
                var matchedIndex = 0;
                if (workingAttribute && templateAttributes) {
                    for (; matchedIndex < templateAttributes.length; matchedIndex++) {
                        var toBreak = true;
                        if (templateAttributes[matchedIndex] && matchedIndex < workingAttribute.length
                            && workingAttribute[matchedIndex]
                            && workingAttribute[matchedIndex].attr == templateAttributes[matchedIndex].attr) {
                            toBreak = false;
                        }
                        if (toBreak) {
                            break;
                        }
                    }
                    if (matchedIndex >= templateAttributes.length) {
                        matchedIndex = templateAttributes.length - 1;
                    } else if (!matchedIndex) {
                        matchedIndex = -1;
                    }
                }
                return matchedIndex;
            }

            function getMatchedPath(refernecePath, templateAttributes, matchedIndex) {

                var refPath = PARAM_NOTION.starterNotion;

                if (refernecePath && templateAttributes) {
                    if (matchedIndex < templateAttributes.length) {
                        var lastItem = templateAttributes[matchedIndex];
                        if (lastItem && lastItem.pos) {
                            refPath = refernecePath.substring(0, lastItem.pos);
                        }
                    }
                }

                return refPath;
            }

            function getRemainingPath(refernecePath, matchedPath) {
                var remainingPath = "";
                if (refernecePath && matchedPath && refernecePath.length >= matchedPath.length) {
                    remainingPath = refernecePath.substring(matchedPath.length);
                }
                return remainingPath;
            }

            function getAttributesInPath(path) {
                var attributes = [];
                var pos = 0;
                if (path) {
                    if (path == PARAM_NOTION.starterNotion) {
                        attributes = [];
                    } else {
                        var pathComponents = path.split(PARAM_NOTION.starterNotion);
                        pathComponents.forEach(function (item) {
                            if (item) {
                                pos += item.length + PARAM_NOTION.starterNotion.length;
                                var paramPos = item.trim().indexOf(PARAM_NOTION.variableContainer);
                                var endPosition = -1;
                                if (paramPos < 0) {
                                    endPosition = item.length;
                                } else if (paramPos >= 0) {
                                    endPosition = paramPos;
                                }
                                if (endPosition > 0) {
                                    var attr = item.substring(0, endPosition);
                                    attributes.push(
                                        {
                                            "attr": attr,
                                            "pos": pos
                                        }
                                    );
                                }
                            }
                        });
                    }
                }
                return attributes;
            }

            function getTemplateSerach(templatePath, templateAttributes, matchedIndex) {

                var templateSearchPath = (matchedIndex >= 0)
                    ? getMatchedPath(templatePath, templateAttributes, matchedIndex)
                    : "/";
                var remaingPath = templatePath.substring(templateSearchPath.length);

                var indexOfNextAttribute = 0;

                if (remaingPath) {

                    var pathComponents = remaingPath.split(PARAM_NOTION.starterNotion);

                    if (pathComponents.length > 0) {

                        var i = 0;
                        var item = pathComponents[i];
                        while (item.trim().startsWith(PARAM_NOTION.variableContainer)) {
                            indexOfNextAttribute += item.length + PARAM_NOTION.starterNotion.length;
                            item = pathComponents[++i];
                        }

                        indexOfNextAttribute = indexOfNextAttribute - 1;

                    }

                }

                if (indexOfNextAttribute) {
                    templateSearchPath += remaingPath.substring(0, indexOfNextAttribute);
                }

                return templateSearchPath;

            }

            function getRemainingAttributes(templateAttributes, matchedIndex) {

                var remainingAttributes = [];

                if (templateAttributes) {
                    remainingAttributes = (templateAttributes && templateAttributes.length > matchedIndex)
                        ? templateAttributes.slice(matchedIndex + 1, templateAttributes.length)
                        : [];
                    remainingAttributes.unshift({ attr: "/", pos: 1 });
                }

                return remainingAttributes;

            }

            function populateParamInfo(params, idGenerationPolicies, savePath) {

                function getSavePathComponents(savePath) {
                    var info = [];
                    if (savePath) {
                        info = savePath.split(PARAM_NOTION.starterNotion);
                    }
                    return info;
                }

                function getVariableName(component, variableNotion) {
                    var variableName = "";
                    var varIndex = component.indexOf(variableNotion);
                    if (varIndex >= 0) {
                        var variableStartPosition = varIndex + variableNotion.length;
                        var variableEndPoistionAfterStart = component.substring(variableStartPosition).indexOf(PARAM_NOTION.variableContainerEnd);
                        if (variableEndPoistionAfterStart >= 0) {
                            var variableEndPoistion = variableStartPosition + variableEndPoistionAfterStart;
                            variableName = component.substring(variableStartPosition, variableEndPoistion);
                        }
                    }
                    return variableName;
                }

                function getPathToComponent(savePath, componentStartPosition) {
                    var pathToComponent = "";
                    if (savePath) {
                        var stringBeforeComponent = savePath.substring(0, componentStartPosition);
                        var omitIndices = [];
                        var i = 0;
                        while (i < stringBeforeComponent.length) {
                            var chr = stringBeforeComponent.substring(i, i + 1);
                            if (chr == PARAM_NOTION.variableContainer) {
                                var endIndex = i;
                                while (chr != PARAM_NOTION.variableContainerEnd) {
                                    endIndex++;
                                    if (endIndex >= stringBeforeComponent.length) {
                                        break;
                                    }
                                    chr = stringBeforeComponent.substring(endIndex, endIndex + 1);
                                }
                                if (endIndex > i && endIndex < stringBeforeComponent.length) {
                                    omitIndices.push({ start: i, end: endIndex });
                                }
                                i = endIndex + 1;
                            }
                            i++;
                        }

                        for (var i = 0; i < stringBeforeComponent.length; i++) {
                            var indexToOmit = false;
                            omitIndices.forEach(function (item) {
                                if (item && i >= item.start && i <= item.end) {
                                    indexToOmit = true;
                                }
                            });
                            if (!indexToOmit) {
                                pathToComponent += stringBeforeComponent[i];
                            }
                        }

                        if (pathToComponent) {
                            pathToComponent = pathToComponent.replace("//", "/");
                        }

                        if (!pathToComponent) {
                            pathToComponent = "/";
                        }
                    }

                    return pathToComponent;

                }

                function setTechIdsForComponents(idGenerationPolicies, savePathComponents, savePath, params) {

                    var variableNotion = "TECHDISER_ID=$";
                    var pos = 0;
                    if (savePathComponents) {
                        savePathComponents.forEach(function (component) {
                            if (component) {
                                var variableName = getVariableName(component, variableNotion);
                                if (variableName) {
                                    var pathWithAttribute = getPathToComponent(savePath, pos);
                                    var policyIndex = msbUtilService.getIndex(idGenerationPolicies, "templatePath", pathWithAttribute);
                                    var policyId = (policyIndex < 0) ? "" : idGenerationPolicies[policyIndex][SAVE_POLICY_SPEC.pathId];
                                    if (policyId) {
                                        var paramIndex = msbUtilService.getIndex(params, "key", variableName);
                                        if (paramIndex >= 0) {
                                            params[paramIndex]["value"] = policyId;
                                        } else {
                                            params.push({ key: variableName, value: policyId });
                                        }
                                    }
                                }

                                pos += component.length + PARAM_NOTION.starterNotion.length;
                            }
                        });
                    }

                }

                function updateparamInfo(params, idGenerationPolicies, savePath) {

                    var savePathComponents = getSavePathComponents(savePath);

                    setTechIdsForComponents(idGenerationPolicies, savePathComponents, savePath, params);

                }

                updateparamInfo(params, idGenerationPolicies, savePath);

            }

            function fixParentObjects(callBack, parentPath, params, persistableData, persistDef, exploredPath) {

                // -------- value initiation --------------------
                var serviceName = persistDef[SAVE_POLICY_SPEC.serviceName];
                var taskName = persistDef[SAVE_POLICY_SPEC.taskName];

                var templatePath = persistDef[SAVE_POLICY_SPEC.templatePath];
                var savePath = persistDef[SAVE_POLICY_SPEC.dataSavePath];

                var idGenerationPolicies = persistDef[SAVE_POLICY_SPEC.idGenerationPolicies];

                //-------------- operation starts -------------------
                var saveAttributes = getAttributesInPath(savePath);
                var exploredAttributes = (exploredPath) ? getAttributesInPath(parentPath) : [];
                var templateAttributes = getAttributesInPath(templatePath);
                var matchedIndex = getMatchedAttributeIndex(exploredAttributes, templateAttributes);

                var templateSearchPath = getTemplateSerach(templatePath, templateAttributes, matchedIndex);



                var remainingAttribures = getRemainingAttributes(templateAttributes, matchedIndex);

                // id = template object ID.  in template path and accordingly in params

                if (parentPath && idGenerationPolicies) {

                    msbCommonApiService.getItems(serviceName, null, function (templateData) {

                        var pathInfo = angular.copy(saveAttributes);

                        if (templateData) {

                            var preparedObj = existingInfoCallback(params, templateData, remainingAttribures, idGenerationPolicies, templateAttributes, persistableData, saveAttributes);

                            if (preparedObj) {

                                var dataSavepath = getTemplateSerach(savePath, pathInfo, saveAttributes.length - 1);

                                var psersisInstruction = getInfoPathInstruction(dataSavepath, preparedObj);

                                populateParamInfo(params, idGenerationPolicies, savePath);

                                params.push({ "key": SAVE_POLICY_SPEC.backeSavePath, "value": dataSavepath });
                                params.push({ "key": SAVE_POLICY_SPEC.preparedObj, "value": preparedObj });

                                callBack(params);

                            } else {

                                callBack(null);

                            }

                        } else {

                            callBack(null);

                        }



                    }, null, false, null, taskName, templateSearchPath, params);

                } else {
                    callBack(null);
                }

            }

            function getInfoPathInstruction(path, data) {
                return { path: path, data: data }
            }

            function fixContainerObject(callBack, trimedDataSavePath, dataSavePath, parentObj, persistableData, persistDef) {

                if (!trimedDataSavePath || !dataSavePath || !parentObj) {
                    callBack(null);
                }

                var endIndex = trimedDataSavePath.length + PARAM_NOTION.starterNotion.length;

                var lastAttribute = dataSavePath.substring(endIndex);

                if (!parentObj[lastAttribute]) {

                    if (parentObj.TECHDISER_ID) {

                        var templatePath = persistDef[SAVE_POLICY_SPEC.templatePath];
                        var serviceName = persistDef[SAVE_POLICY_SPEC.serviceName];
                        var taskName = persistDef[SAVE_POLICY_SPEC.taskName];

                        if (templatePath && serviceName && taskName) {

                            msbCommonApiService.getItems(serviceName, null, function (templateData) {

                                if (templateData) {

                                    var parentItem = {};

                                    parentItem.TECHDISER_ID = parentObj.TECHDISER_ID;

                                    if (angular.isArray(templateData)) {
                                        parentItem[lastAttribute] = [];
                                        parentItem[lastAttribute].push(persistableData);
                                    } else {
                                        parentItem[lastAttribute] = persistableData;
                                    }

                                    var psersisInstruction = getInfoPathInstruction(trimedDataSavePath, info);

                                    params.push({ "key": SAVE_POLICY_SPEC.backeSavePath, "value": trimedDataSavePath });
                                    params.push({ "key": SAVE_POLICY_SPEC.preparedObj, "value": persistableData });

                                    callBack(psersisInstruction);

                                } else {
                                    callBack(null);
                                }

                            }, null, false, null, taskName, templatePath, params);

                        } else {
                            callBack(null);
                        }

                    } else {
                        callBack(null);
                    }

                } else {

                    var psersisInstruction = getInfoPathInstruction(dataSavePath, persistableData);
                    callBack(psersisInstruction);

                }
            }

            function intiHandleOperation(callBack, params, forPersist) {

                var dataPreparator = dataPreparationHandler();

                if (msbUtilService.checkUndefined(callBack, params)) {

                    var persistDef = msbUtilService.searchFromParam(params, SAVE_POLICY_SPEC.specDef);

                    if (persistDef) {

                        var dataSavePath = persistDef[SAVE_POLICY_SPEC.dataSavePath];

                        var persistableData = (forPersist) ? persistDef[SAVE_POLICY_SPEC.persistableData] : {};

                        if (dataSavePath && persistableData) {

                            if (dataSavePath == PARAM_NOTION.starterNotion) {

                                var psersisInstruction = getInfoPathInstruction(PARAM_NOTION.starterNotion, persistableData);

                                params.push({ "key": SAVE_POLICY_SPEC.backeSavePath, "value": dataSavePath });
                                params.push({ "key": SAVE_POLICY_SPEC.preparedObj, "value": persistableData });

                                callBack(params);

                            } else {

                                var containerObject = persistDef[SAVE_POLICY_SPEC.containerObject];

                                var trimedDataSavePath = trimSavePath(dataSavePath);

                                if (!containerObject) {

                                    fixParentObjects(callBack, trimedDataSavePath, params, persistableData, persistDef, "");

                                } else {

                                    var parentObj = msbUtilService.jsonManipulator(containerObject, params, trimedDataSavePath);
                                    var exploredPath = msbUtilService.getExploredPath();
                                    if (!parentObj) {

                                        fixParentObjects(callBack, trimedDataSavePath, params, persistableData, persistDef, exploredPath);

                                    } else {

                                        fixContainerObject(callBack, trimedDataSavePath, dataSavePath, parentObj, persistableData, persistDef);
                                    }

                                }

                            }

                        } else {

                            callBack(null);

                        }

                    } else {
                        callBack(null);
                    }

                }

            }

            return opDef;

        }

        function getSavePathIDs(callBack, params) {

            var dataPreparator = dataPreparationHandler();

            dataPreparator.intiHandleOperation(callBack, params, false);
        }

        function getPersistableInfo(callBack, params) {

            var dataPreparator = dataPreparationHandler();

            dataPreparator.intiHandleOperation(callBack, params, true);

        }



        return service;


    }

})();
