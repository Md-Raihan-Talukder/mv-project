#!/bin/bash
readonly MARKER_CONSTANTS="//CODE_GENERATOR_MARKER_CONSTANTS"
readonly MARKER_ID_GEN="//CODE_GENERATOR_MARKER_ID_GEN"
readonly MARKER_ATTRIBUTE_FUNCTION_EXPOSE="//CODE_GENERATOR_MARKER_ATTRIBUTE_FUNCTION_EXPOSE"
readonly MARKER_ATTRIBUTE_FUNCTION="//CODE_GENERATOR_MARKER_ATTRIBUTE_FUNCTION_ADD"

ctrlPath=$(pwd)
appDirPath=${ctrlPath%/main*}
red=$(
    tput sgr0
    tput setaf 1
)
green=$(
    tput sgr0
    tput setaf 2
    tput bold
)
yellow=$(
    tput sgr0
    tput setaf 3
)
blue=$(
    tput sgr0
    tput setaf 4
)
magenta=$(
    tput sgr0
    tput setaf 5
    tput bold
)
cyan=$(
    tput sgr0
    tput setaf 6
)
bold=$(tput bold)
bel=$(tput bel)
reset=$(tput sgr0)

addLineBeforeFirstMatch() {
    local marker="${1//\//\\\/}"
    sed -i "0,/.*$marker.*/s/.*$marker.*/$2\n&/" $3
}

addLineAfterFirstMatch() {
    local marker="${1//\//\\\/}"
    sed -i "0,/$marker/!b;//a\\$2" $3
}

addLineAfterLastMatch() {
    sed -i "1h;1!H;\$!d;x;s/.*$1[^\n]*/&$2/" $3
}

spinalToCamel() {
    local pascalCase=$(sed -r 's/(^|-)(\w)/\U\2/g' <<<"$1")
    local camelCase="$(tr '[:upper:]' '[:lower:]' <<<${pascalCase:0:1})${pascalCase:1}"
    echo "$camelCase"
}

spinalToCtrlName() {
    local pascalCase=$(sed -r 's/(^|-)(\w)/\U\2/g' <<<"$1-$2")
    local camelCase="$(tr '[:upper:]' '[:lower:]' <<<${pascalCase:0:1})${pascalCase:1}"
    camelCase+="Ctrl"
    echo "$camelCase"
}

spinalToTitle() {
    local upperCase=$(sed 's/[^-]\+/\L\u&/g' <<<"$1")
    local title=${upperCase//-/ }
    echo "$title"
}

spinalToJsFileName() {
    local jsFileName=${1//-/.}
    jsFileName+=".ctrl.js"
    echo "$jsFileName"
}

spinalToHtmlFileName() {
    local htmlFileName+="$1.html"
    echo "$htmlFileName"
}

spinalToModuleFileName() {
    local moduleFileName=${1//-/.}
    moduleFileName+=".module.js"
    echo "$moduleFileName"
}

isDirectory() {
    [ -d "$1" ]
}

isFile() {
    [ -f "$1" ]
}

isExists() {
    grep -q "$1" $2
}

confirmAndContinue() {
    echo -e "\n${cyan}${bold}Press Enter to Confirm Otherwise Provide Correct Name${reset}" >&2
    read -e -p "$1 : " -i "$2" name
    echo "$name"
    echo -e "$1 : $name ${green}[CONFIRMED]${reset}\n\n" >&2
}

spinalToMacroCase() {
    local snakeCase=${1//-/_}
    local macroCase=${snakeCase^^}
    echo "$macroCase"
}

spinalToSnakeCase() {
    local snakeCase=${1//-/_}
    echo "$snakeCase"
}

ctrlFile() {
    # moduleApp ctrlName
    echo "(function () {
    'use strict';
    angular
        .module('app.$1')
        .controller('$2', $2);

    /** @ngInject */
    function $2(specDefHandlerService, \$stateParams, \$rootScope) {
        debugger
        var TECHDISER_COMPONENT_NAME = "\""$2"\"";
        var TECHDISER_SERVICE_INFO = {};
        var vm = this;
        vm.loadViewContent = true
        $MARKER_ID_GEN
    }
})();"
}

idGenCode() {
    # taskNameCamel constTask constService attribute templateRootId templateRootIdWOPrefix jsonJsFactName
    echo "\
        //ID_GEN_CODE_DEPLOYED\n\
        //Add dependency specDefHandlerService, \$stateParams, \$rootScope\n\
        vm.preAsynchCallHandler = preAsynchCallHandler();\n\
        vm.asynchCallHandler = asynchCallHandler();\n\
        vm.postAsynchCallHandler = postAsynchCallHandler();\n\
        vm.saveHandlerService = saveHandler();\n\
 \n\
        init();\n\
 \n\
        function init() {\n\
            vm.preAsynchCallHandler.initHandler();\n\
        }\n\
 \n\
        function preAsynchCallHandler() {\n\
 \n\
            var opPreAsync = {\n\
                initHandler: initHandler,\n\
                doOperation: doOperation,\n\
                doNextOperation: doNextOperation\n\
            }\n\
 \n\
            function initHandler() {\n\
                vm.loadViewContent = false;\n\
                doOperation();\n\
            }\n\
 \n\
            function doOperation() {\n\
                vm.$1"Config" = {\n\
                    templatePath: "\""/[TECHDISER_ID=\$templateRootID]/$4"\"",\n\
                    templateRootID: "\""$5"\"", //hardcoded\n\
 \n\
                    pathPrefix: "\""/[TECHDISER_ID=\$dataSaveRootPath]"\"",\n\
                    $4: "\""/$4"\"",\n\
                    // contextObjectId: \$stateParams.contextId, //suffix, should be dynamic\n\
                    contextObjectId: "\""$6"\"",\n\
 \n\
                    serviceName: "\""$3"\"",\n\
                    taskName: "\""$2"\"",\n\
                    jsonServiceName: "\""$7"\""\n\
                };\n\
 \n\
                vm.viewParams = [];\n\
 \n\
                doNextOperation();\n\
            }\n\
 \n\
            function doNextOperation() {\n\
                vm.asynchCallHandler.initHandler();\n\
            }\n\
 \n\
            return opPreAsync;\n\
        }\n\
 \n\
        function asynchCallHandler() {\n\
 \n\
            var opAsync = {\n\
                initHandler: initHandler,\n\
                doOperation: doOperation,\n\
                doNextOperation: doNextOperation\n\
            }\n\
 \n\
            function initHandler() {\n\
                doOperation();\n\
            }\n\
 \n\
            function doOperation() {\n\
                idGenearationHandler();\n\
            }\n\
 \n\
            function idGenearationHandler() {\n\
                vm.viewParams.push({ "\""key"\"": "\""templateRootID"\"", "\""value"\"": vm.$1"Config".templateRootID });\n\
 \n\
                var params = angular.copy(vm.viewParams);\n\
 \n\
                params = specDefHandlerService.prepareParamInfo(\n\
                    vm.$1"Config".serviceName,\n\
                    vm.$1"Config".taskName,\n\
                    vm.$1"Config".templatePath,\n\
                    vm.$1"Config".pathPrefix + vm.$1"Config".$4, //dataSavePath\n\
                    vm.$1"Config".contextObjectId,\n\
                    vm.$1"Config".jsonServiceName,\n\
                    params\n\
                );\n\
 \n\
                specDefHandlerService.generatePathIDs(function (updatedParams) {\n\
                    if (updatedParams) {\n\
                        vm.viewParams = updatedParams;\n\
                        doNextOperation()\n\
                    }\n\
 \n\
                }, params);\n\
            }\n\
 \n\
            function doNextOperation() {\n\
                vm.postAsynchCallHandler.initHandler();\n\
            }\n\
 \n\
            return opAsync;\n\
        }\n\
 \n\
        function postAsynchCallHandler() {\n\
            var opPostAsync = {\n\
                initHandler: initHandler,\n\
                doOperation: doOperation,\n\
                doNextOperation: doNextOperation\n\
            }\n\
 \n\
            function initHandler() {\n\
                doOperation();\n\
            }\n\
 \n\
            function doOperation() {\n\
                doNextOperation();\n\
            }\n\
 \n\
            function doNextOperation() {\n\
                vm.loadViewContent = true;\n\
            }\n\
 \n\
            return opPostAsync;\n\
        }\n\
 \n\
        function saveHandler() {\n\
 \n\
            var saveHandlerObj = {\n\
                save: save\n\
            };\n\
 \n\
            function save() {\n\
                if (\$rootScope.unSaveState) {\n\
                    var saveData = serviceName.prepareSaveData(vm.operationalData) //replace with your operational data\n\
                    savePreparedData(function (data) {\n\
                        if (data) {\n\
                            \$rootScope.unSaveState = false\n\
                            msbUtilService.showToast("\""Consumption Data Saved"\"", "\""success-toast"\"", 3000);\n\
                        }\n\
                        else\n\
                            msbUtilService.showToast("\""Save Operation Failed"\"", "\""error-toast"\"", 3000);\n\
                    }, vm.viewParams, saveData)\n\
 \n\
                }\n\
            }\n\
 \n\
            function savePreparedData(callBack, params, saveData) {\n\
                if (msbUtilService.checkUndefined(callBack, params)) {\n\
                    var itemID = msbUtilService.searchFromParam(params, "\""dataSaveRootPath"\"");\n\
                    var backeSavePath = msbUtilService.searchFromParam(params, SAVE_POLICY_SPEC.backeSavePath);\n\
                    var backendConatinerObj = msbUtilService.searchFromParam(params, SAVE_POLICY_SPEC.preparedObj);\n\
 \n\
                    if (saveData && itemID) {\n\
                        msbCommonApiService.saveInnerItem(itemID, saveData, vm.$1"Config".serviceName, vm.$1"Config".taskName, vm.$1"Config".$4, params,\n\
                            function (data) {\n\
                                callBack(data)\n\
                            }, null, null, true, true, backeSavePath, backendConatinerObj\n\
                        );\n\
                    }\n\
                    else\n\
                        callBack(null)\n\
                }\n\
            }\n\
 \n\
            return saveHandlerObj;\n\
        }"
}

jsonJs() {
    # moduleApp jsonJsFact rootprefix
    echo "(function () {
    'use strict';

    angular
        .module('app.$1')
        .factory('$2', $2);

    /** @ngInject */
    function $2(SAVE_POLICY_SPEC) {

        var service = {
            specInterface: specInterface,
            rootDef: rootDef,
            $MARKER_ATTRIBUTE_FUNCTION_EXPOSE
        };

        function rootDef(specType, servicePath) {

            var prefix = "\""$3"\"";

            function getIdSpec(servicePath) {

                var def = {
                    templatePath: "\""/"\"",
                    concateAttributes: ["\""prefix"\"", "\""contextObjectId"\""],
                    refereceObject: { prefix: prefix }
                };

                def[SAVE_POLICY_SPEC.pathId] = "\"""\"";

                return def;

            }

            function getPrefix() {
                return prefix;
            }

            function specInterface(specType, servicePath) {
                if (specType == SAVE_POLICY_SPEC.specType[0]) {
                    return getIdSpec(servicePath);
                } else if (specType == SAVE_POLICY_SPEC.specType[1]) {
                    return getPrefix();
                }
            }

            return specInterface(specType, servicePath);
        }
        $MARKER_ATTRIBUTE_FUNCTION

        function specInterface(specType, servicePath, functionNames) {

            function getIdGenerationSpec(specType, servicePath, functionNames) {

                var idGenerationPolicies = [];
                if (functionNames) {
                    functionNames.forEach(function (functionName) {
                        if (functionName && service[functionName]) {
                            var executeableFunction = service[functionName];
                            var ideGenPolicy = executeableFunction(specType, servicePath);
                            if (ideGenPolicy) {
                                idGenerationPolicies.push(ideGenPolicy);
                            }
                        }
                    });
                }
                return idGenerationPolicies;
            }

            function fetchIdPrefix(specType, servicePath, functionNames) {

                var idPrefix = "\"""\"";
                if (functionNames && functionNames.length > 0) {
                    var executeableFunction = service[functionNames[functionNames.length - 1]];
                    idPrefix = executeableFunction(specType, servicePath);
                }
                return idPrefix;
            }

            function intOp(specType, servicePath, functionNames) {

                var info = null;

                if (specType == SAVE_POLICY_SPEC.specType[0]) {
                    info = getIdGenerationSpec(specType, servicePath, functionNames);
                } else if (specType == SAVE_POLICY_SPEC.specType[1]) {
                    info = fetchIdPrefix(specType, servicePath, functionNames);
                }

                return info;

            }

            return intOp(specType, servicePath, functionNames);

        }

        return service;

    }
})();"
}

jsonJsFun() {
    # attributePascalCase attributeCamel
    echo "\
        function root$1"Def" (specType, servicePath) {\n\
 \n\
            var prefix = "\""$2"\"";\n\
 \n\
            function getIdSpec(servicePath) {\n\
 \n\
                var def = {\n\
                    templatePath: "\""\/$2"\"",\n\
                    concateAttributes: ["\""prefix"\""],\n\
                    refereceObject: { prefix: prefix }\n\
                };\n\
 \n\
                def[SAVE_POLICY_SPEC.pathId] = "\"""\"";\n\
 \n\
                return def;\n\
            }\n\
 \n\
            function getPrefix() {\n\
                return prefix;\n\
            }\n\
 \n\
            function specInterface(specType, servicePath) {\n\
                if (specType == SAVE_POLICY_SPEC.specType[0]) {\n\
                    return getIdSpec(servicePath);\n\
                } else if (specType == SAVE_POLICY_SPEC.specType[1]) {\n\
                    return getPrefix();\n\
                }\n\
            }\n\
 \n\
            return specInterface(specType, servicePath);\n\
 \n\
        }"
}

jsonJsFunExpose() {
    # attributePascalCase
    echo "            root$1"Def": root$1"Def","
}

json() {
    # attributeNameCamel templateRootId
    echo "{
    "\""data"\"": [
        {
            "\""TECHDISER_ID"\"": "\""$2"\"",
            "\""$1"\"": []
        }
    ]
}"
}

constantService() {
    # service task path
    local path="${3//\//\\\/}"
    echo "\
            "\""$1"\"": {\n\
                "\""$2"\"": "\""$path"\"",\n\
            },"
}

constantTask() {
    # task path
    local path="${2//\//\\\/}"
    echo "                "\""$1"\"": "\""$path"\"","
}
printf '\e[5 q'
echo -e "Module Name(spinal-case)?"
read moduleName
echo -e "tab/menu/sub-menu name(spinal-case)?"
read subMenuName
echo -e "Prefix for root objects TECHDISER_ID(camelCase)?"
read prefix
echo -e "Template TECHDISER_ID Without Prefix(camelCase)?"
read templateRootIdWOprefix
echo -e "Attribute Name(camelCase)? Id will be generated for this attribute"
read attributeName

attributeNameCamel=$attributeName
templateRootId="$prefix""$templateRootIdWOprefix"

moduleAppName=$moduleName
moduleAppName=$(confirmAndContinue "Module App Name" "$moduleAppName")

finished=false
while ! $finished; do
    echo -e "Do you already have your json file?(Y/N)"
    read isJsonAvailable
    isJsonAvailable=${isJsonAvailable^^}
    if [[ $isJsonAvailable == 'Y' || $isJsonAvailable == 'N' ]]; then
        finished=true
    fi
    if [[ $isJsonAvailable == 'Y' ]]; then
        echo -e "$cyan$bold\n\nPlease make sure your json file follow at least this structure\n$reset"
        json=$(json "$attributeNameCamel" "$templateRootId")
        echo "$blue$json"
        echo -e "\n$reset"
        jsonFileName=$subMenuName".json"
        jsonFileName=$(confirmAndContinue "Json File Name" "$jsonFileName")

        jsonPath="$moduleName/$jsonFileName"
        jsonPath=$(confirmAndContinue "Json PATH Relative to "\""src/app/data/"\"" Directory" "$jsonPath")
    fi
done

controllerFileName=$(spinalToJsFileName "$subMenuName")
controllerFileName=$(confirmAndContinue "Controller File Name" "$controllerFileName")

constantServiceName=$(spinalToMacroCase "$moduleName")
constantServiceName=$(confirmAndContinue "Constant Service Name" "$constantServiceName")

constantTaskName=$(spinalToSnakeCase "$subMenuName")
constantTaskName=$(confirmAndContinue "Constant Task Name" "$constantTaskName")

if [[ $isJsonAvailable == 'N' ]]; then
    jsonFileName=$subMenuName".json"
    jsonFileName=$(confirmAndContinue "Json File Name" "$jsonFileName")
    jsonPath="$moduleName/$jsonFileName"
fi

jsonJsFileName=$jsonFileName".js"
jsonJsFileName=$(confirmAndContinue "Json Service File Name" "$jsonJsFileName")

moduleSnakeCase=$(spinalToSnakeCase "$moduleName")
jsonFileSnakeCase=$(spinalToSnakeCase "$jsonFileName")

jsonJsFactName=$moduleSnakeCase"."$jsonFileSnakeCase
jsonJsFactName=${jsonJsFactName//./_}
jsonJsFactName=$(confirmAndContinue "Json Service Name" "$jsonJsFactName")

logString="\n\n"
DATE_WITH_TIME=$(date "+%Y/%m/%d- Time - %H:%M:%S")
logString+="$DATE_WITH_TIME"
logString+="\n\n"

if isExists ""\""$constantServiceName"\"": {" "$appDirPath/index.constants.js"; then
    if isExists ""\""$constantTaskName"\"":" $appDirPath/index.constants.js; then

        logString+="${yellow}[W]: Constant service ${magenta}[$constantServiceName]${yellow} and task ${magenta}[$constantTaskName]${yellow} already exist at $appDirPath/index.constants.js${reset}\n"
    else
        constantTask=$(constantTask "$constantTaskName" "$jsonPath")
        addLineAfterFirstMatch ""\""$constantServiceName"\"": {" "$constantTask" "$appDirPath/index.constants.js"
        logString+="${blue}[M]: Constant task ${magenta}[$constantTaskName]${blue} added at $appDirPath/index.constants.js${reset}\n"
    fi
else
    if isExists "$MARKER_CONSTANTS" "$appDirPath/index.constants.js"; then
        constantService=$(constantService "$constantServiceName" "$constantTaskName" "$jsonPath")
        addLineBeforeFirstMatch "$MARKER_CONSTANTS" "$constantService" "$appDirPath/index.constants.js"
        logString+="${blue}[M]: Constant service ${magenta}[$constantServiceName]${blue} and task ${magenta}[$constantTaskName]${blue} added at $appDirPath/index.constants.js${reset}\n"
    else
        logString+="${red}[E]: Constant service ${magenta}[$constantServiceName]${red} and task ${magenta}[$constantTaskName]${red} can't be added because ${magenta}$MARKER_CONSTANTS${red} not available at module file $appDirPath/index.constants.js${reset}\n"
    fi

fi
ctrlIsAvailable=false
if isFile $ctrlPath/$controllerFileName; then
    logString+="${yellow}[W]: $subMenuName Controller File ${magenta}$controllerFileName${yellow} Already Exists at $ctrlPath${reset}\n"
    ctrlIsAvailable=true

else
    touch $ctrlPath/$controllerFileName
    logString+="${cyan}[A]: Created $subMenuName Controller File ${magenta}$controllerFileName${cyan} at $ctrlPath/${reset}\n"
    ctrlName=$(spinalToCtrlName "$moduleName" "$subMenuName")
    ctrlName=$(confirmAndContinue "$subMenuName controller name" "$ctrlName")
    ctrlFile=$(ctrlFile "$moduleAppName" "$ctrlName")
    echo "$ctrlFile" >$ctrlPath/$controllerFileName
    logString+="${blue}[M]: Write to Controller File ${magenta}$controllerFileName${blue} at $ctrlPath/${reset}\n"
fi

if isExists "$MARKER_ID_GEN" "$ctrlPath/$controllerFileName"; then

    if isExists "//ID_GEN_CODE_DEPLOYED" "$ctrlPath/$controllerFileName"; then

        logString+="${yellow}[W]: ID Gen code exist at controller file $ctrlPath/$controllerFileName${reset}\n"

    else

        taskNameCamel=$(spinalToCamel "$subMenuName")
        idGenCode=$(idGenCode "$taskNameCamel" "$constantTaskName" "$constantServiceName" "$attributeName" "$templateRootId" "$templateRootIdWOprefix" "$jsonJsFactName")
        addLineAfterFirstMatch "$MARKER_ID_GEN" "$idGenCode" "$ctrlPath/$controllerFileName"
        logString+="${blue}[M]: ID Gen code placed at controller file $ctrlPath/$controllerFileName${reset}\n"
        if $ctrlIsAvailable; then
            logString+="${yellow}[W]: Please add dependency ${magenta}specDefHandlerService, \$stateParams, \$rootScope${yellow} at controller file at $ctrlPath/$controllerFileName\n"
        fi

    fi

else
    logString+="${red}[E]: ID Gen code can't be placed because marker ${magenta}$MARKER_ID_GEN${red} not available at controller file $ctrlPath/$controllerFileName${reset}\n"
fi

if isDirectory $appDirPath/common/specdef/$moduleName; then
    logString+="${yellow}[W]: Directory ${magenta}$moduleName${yellow} Already Exists at $appDirPath/common/specdef/${reset}\n"
else
    mkdir $appDirPath/common/specdef/$moduleName
    logString+="${cyan}[A]: Created Directory ${magenta}$moduleName${cyan} at $appDirPath/common/specdef/${reset}\n"
fi

if isFile $appDirPath/common/specdef/$moduleName/$jsonJsFileName; then
    logString+="${yellow}[W]: Json Service File ${magenta}$jsonJsFileName${yellow} Already Exists at $appDirPath/common/specdef/$moduleName/${reset}\n"
else
    touch $appDirPath/common/specdef/$moduleName/$jsonJsFileName
    logString+="${cyan}[A]: Created Json Service File ${magenta}$jsonJsFileName${cyan} at $appDirPath/common/specdef/$moduleName/${reset}\n"
    jsonJs=$(jsonJs "$moduleAppName" "$jsonJsFactName" "$prefix")
    echo "$jsonJs" >$appDirPath/common/specdef/$moduleName/$jsonJsFileName
    logString+="${blue}[M]: Write to Json Service File ${magenta}$jsonJsFileName${blue} at $appDirPath/common/specdef/$moduleName/${reset}\n"
fi

attributeNamePascal=${attributeNameCamel^}
jsonJsFunExpose=$(jsonJsFunExpose "$attributeNamePascal")

if isExists "root$attributeNamePascal"Def"" "$appDirPath/common/specdef/$moduleName/$jsonJsFileName"; then
    logString+="${yellow}[W]: Function ${magenta}root$attributeNamePascal"Def"${yellow} Already Exposed at json service file $appDirPath/common/specdef/$moduleName/$jsonJsFileName${reset}\n"

else
    if isExists "$MARKER_ATTRIBUTE_FUNCTION_EXPOSE" "$appDirPath/common/specdef/$moduleName/$jsonJsFileName"; then
        addLineBeforeFirstMatch "$MARKER_ATTRIBUTE_FUNCTION_EXPOSE" "$jsonJsFunExpose" "$appDirPath/common/specdef/$moduleName/$jsonJsFileName"
        logString+="${blue}[M]: Function ${magenta}root$attributeNamePascal"Def"${blue} exposed at json service file $appDirPath/common/specdef/$moduleName/$jsonJsFileName${reset}\n"
    else
        logString+="${red}[E]: Function ${magenta}root$attributeNamePascal"Def"${blue} can't be exposed at json service file because ${magenta}$MARKER_ATTRIBUTE_FUNCTION_EXPOSE${red} not available at $appDirPath/common/specdef/$moduleName/$jsonJsFileName${reset}\n"
    fi
fi

jsonJsFun=$(jsonJsFun "$attributeNamePascal" "$attributeNameCamel")

if isExists "function root$attributeNamePascal"Def"" "$appDirPath/common/specdef/$moduleName/$jsonJsFileName"; then
    logString+="${yellow}[W]: Function ${magenta}root$attributeNamePascal"Def"${yellow} Already Exist at json service file at $appDirPath/common/specdef/$moduleName/$jsonJsFileName${reset}\n"

else
    if isExists "$MARKER_ATTRIBUTE_FUNCTION" "$appDirPath/common/specdef/$moduleName/$jsonJsFileName"; then
        addLineBeforeFirstMatch "$MARKER_ATTRIBUTE_FUNCTION" "$jsonJsFun" "$appDirPath/common/specdef/$moduleName/$jsonJsFileName"
        logString+="${blue}[M]: Function ${magenta}root$attributeNamePascal"Def"${blue} added at json service file at $appDirPath/common/specdef/$moduleName/$jsonJsFileName${reset}\n"
    else
        logString+="${red}[E]: Function ${magenta}root$attributeNamePascal"Def"${blue} can't be added at json service file because ${magenta}$MARKER_ATTRIBUTE_FUNCTION${red} not available at file $appDirPath/common/specdef/$moduleName/$jsonJsFileName${reset}\n"
    fi
fi

if [[ $isJsonAvailable == 'N' ]]; then
    if isDirectory $appDirPath/data/$moduleName; then
        logString+="${yellow}[W]: Directory ${magenta}$moduleName${yellow} Already Exists at $appDirPath/data/${reset}\n"
    else
        mkdir $appDirPath/data/$moduleName
        logString+="${cyan}[A]: Created Directory ${magenta}$moduleName${cyan} at $appDirPath/data/${reset}\n"
    fi

    if isFile $appDirPath/data/$moduleName/$jsonFileName; then
        logString+="${yellow}[W]: Json File ${magenta}$jsonFileName${yellow} Already Exists at $appDirPath/data/$moduleName/${reset}\n"
    else
        touch $appDirPath/data/$moduleName/$jsonFileName
        logString+="${cyan}[A]: Created Json File ${magenta}$jsonFileName${cyan} at $appDirPath/data/$moduleName/${reset}\n"
        json=$(json "$attributeNameCamel" "$templateRootId")
        echo "$json" >$appDirPath/data/$moduleName/$jsonFileName
        logString+="${blue}[M]: Write to Json File ${magenta}$jsonFileName${blue} at $appDirPath/data/$moduleName/${reset}\n"
    fi

fi

if ! isDirectory $TD_PATH/dev-booster/scripts/logs; then
    mkdir $TD_PATH/dev-booster/scripts/logs
fi

echo -e "$logString"
userName=$USER
echo -e "$logString" >>logs.log
sed -r "s/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[mGK]//g" logs.log | tr -dc '[[:print:]]\n' >>$TD_PATH/dev-booster/scripts/logs/$userName.logs.log
sed -i 's/B//g' $TD_PATH/dev-booster/scripts/logs/$userName.logs.log
sed -i 's/(//g' $TD_PATH/dev-booster/scripts/logs/$userName.logs.log
rm logs.log
