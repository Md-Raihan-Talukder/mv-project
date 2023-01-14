#!/bin/bash
readonly MARKER_STATE="//CODE_GENERATOR_MARKER_STATE"
readonly MARKER_TAB_ITEM="<!-- CODE_GENERATOR_MARKER_TAB_ITEM -->"
readonly MARKER_ID_GEN="//CODE_GENERATOR_MARKER_ID_GEN"
htmlPath=$(pwd)
appDirPath=${htmlPath%/main*}
relPath=${htmlPath#/*src/}

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
    sed -i "0,/$1/!b;//a\\$2" $3
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

spinalToMacroCase() {
    local snakeCase=${1//-/_}
    local macroCase=${snakeCase^^}
    echo "$macroCase"
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
    echo -e "\nPress Enter to Confirm Otherwise Provide Correct Name" >&2
    read -e -p "$1 [${cyan}${bold}$2${reset}]: " -i "$2" name
    echo "$name"
    echo -e "$1${green}[CONFIRMED]${reset} : $name \n\n" >&2
}

getSTATE() {
    # state subMenuName controller  uiView relPath
    local relPath="${5//\//\\\/}"
    echo "\
            .state('app.$1', {\n\
                url: '\/$2',\n\
                views: {\n\
                    '$4': {\n\
                        templateUrl: '$relPath\/$2\/$2.html',\n\
                        controller: '$3 as vm'\n\
                    }\n\
                }\n\
            })"

}

defaultViewCtrl() {
    # moduleAppName ctrlName
    echo "(function () {
    'use strict';
    angular
        .module('app.$1')
        .controller('$2', $2);

    /** @ngInject */
    function $2() {
        debugger
        var TECHDISER_COMPONENT_NAME = "\""$2"\"";
        var TECHDISER_SERVICE_INFO = {};
        var vm = this;
        vm.loadViewContent = true
        $MARKER_ID_GEN
    }
})();"
}

getTabItem() {
    # state title uiview
    echo "\
                <md-tab ui-sref="\""$1"\"" md-on-select="\""vm.onTabSelected()"\"" label="\""$2"\"">\n\
                    <div class="\""white-bg"\"" ui-view="\""$3"\"" style="\""height: calc(100% - 48px)"\""><\/div>\n\
                <\/md-tab>"
}

defaultViewHtml() {
    # title
    echo "<div layout="\""row"\"" style="\""height: 100%;"\"" class="\""scrollable"\"" ms-scroll>
    <h1 class="\""ml-30"\""> This is $1 Index Page</h1>
</div>"
}

htmlHandler() {
    # subMenuName ctrlFunction menuDir
    local menuTitle=$(spinalToTitle "$1")
    local htmlFileString=$("$2" "$menuTitle")
    echo "$htmlFileString" >$htmlPath/"$1"/$htmlFileName
    logString+="${blue}[M]: Write to File ${magenta}$htmlFileName${blue} at $htmlPath/"$1"/${reset}\n"

}

ctrlHandler() {
    # submenuname ctrlFunction moduleAppName MenuName menuDir
    local ctrlName=$(spinalToCtrlName "$4" "$1")
    local ctrlFileString=$("$2" "$3" "$ctrlName")
    echo "$ctrlFileString" >$htmlPath/"$1"/$jsFileName
    logString+="${blue}[M]: Write to File ${magenta}$jsFileName${blue} at $htmlPath/"$1"/${reset}\n"

}

logString="\n\n"
DATE_WITH_TIME=$(date "+%Y/%m/%d- Time - %H:%M:%S")
logString+="$DATE_WITH_TIME"
logString+="\n\n"

printf '\e[5 q'
echo -e "Use spinal-case naming convention"
echo "Module Name(spinal-case)"?
read moduleName

echo -e "\nMenu/SubMenu/Popup Name?"
read menuName

echo -e "\nTab Names(Use spinal-case naming convention. For multiple tab separate using space)?"
read tabNames

moduleDirName=$(confirmAndContinue "Module Directory Name" "$moduleName")

if isDirectory $appDirPath/main/$moduleDirName; then
    logString+="[I]: Directory ${magenta}$moduleDirName${reset} Exists at $appDirPath/main/${reset}\n"
else
    echo -e "${red}[E]: Directory not found in ${magenta}$moduleDirName${red} at $appDirPath/main/${reset}\n"
    exit 1
fi

moduleFileName=$(spinalToModuleFileName "$moduleName")
moduleFileName=$(confirmAndContinue "Module File Name" "$moduleFileName")
moduleAppName=$(confirmAndContinue "Module APP Name" "$moduleName")

menuState="$moduleAppName.$menuName"
menuState=$(confirmAndContinue "Menu/SubMenu/Popup State (Without app.)" "$menuState")

menuHtmlFileName=$(spinalToHtmlFileName "$menuName")
menuHtmlFileName=$(confirmAndContinue "$menuName Html File Name" "$menuHtmlFileName")
uiView="uiView"
uiView=$(confirmAndContinue "ui-view name" "$uiView")

if isFile $menuHtmlFileName; then
    logString+="[I]: Html File ${magenta}$menuHtmlFileName${reset} Exists at $htmlPath${reset}\n"
    isHtmlExist=true
else

    logString+="${red}[E]: Tab items can't be created because html file ${magenta}$menuHtmlFileName${red} not exist at $htmlPath/${reset}\n"
    isHtmlExist=false
fi

for tabName in $tabNames; do

    if isDirectory "$tabName"; then
        logString+="${yellow}[W]: Directory ${magenta}$tabName${yellow} Already Exists at $htmlPath/${reset}\n"
    else
        mkdir $tabName
        logString+="${cyan}[A]: Created Directory ${magenta}$tabName${cyan} at $htmlPath/${reset}\n"
    fi

    htmlFileName=$(spinalToHtmlFileName "$tabName")

    if isFile "$tabName"/$htmlFileName; then
        logString+="${yellow}[W]: File ${magenta}$htmlFileName${yellow} Already Exists at $htmlPath/$tabName/${reset}\n"
    else
        touch "$tabName"/$htmlFileName
        logString+="${cyan}[A]: Created File ${magenta}$htmlFileName${cyan} at $htmlPath/$tabName/${reset}\n"

        htmlHandler "$tabName" "defaultViewHtml" "$menuDirName"

    fi

    jsFileName=$(spinalToJsFileName "$tabName")

    if isFile "$tabName"/$jsFileName; then
        logString+="${yellow}[W]: File ${magenta}$jsFileName${yellow} Already Exists at $htmlPath/$tabName/${reset}\n"
    else
        touch "$tabName"/$jsFileName
        logString+="${cyan}[A]: Created File ${magenta}$jsFileName${cyan} at $htmlPath/$tabName/${reset}\n"

        ctrlHandler "$tabName" "defaultViewCtrl" "$moduleAppName" "$menuName" "$menuDirName"

    fi

done

if isFile $appDirPath/main/$moduleDirName/$moduleFileName; then
    logString+="[I]: Module File ${magenta}$moduleFileName${reset} Exists at $appDirPath/main/$moduleDirName/${reset}\n"

    for tabName in $tabNames; do
        tabState="$menuState.$tabName"
        tabState=$(confirmAndContinue "$tabName State" "$tabState")

        tabCtrlName=$(spinalToCtrlName "$menuName" "$tabName")

        if isExists "'app.$tabState'" "$appDirPath/main/$moduleDirName/$moduleFileName"; then
            logString+="${yellow}[W]: ${magenta}"$tabName"${yellow} State "$tabState" already exist at module file $appDirPath/main/$moduleDirName/$moduleFileName${reset}\n"

        else
            if isExists "$MARKER_STATE" "$appDirPath/main/$moduleDirName/$moduleFileName"; then
                path=
                tabSTATE=$(getSTATE "$tabState" "$tabName" "$tabCtrlName" "$uiView" "$relPath")
                addLineBeforeFirstMatch "$MARKER_STATE" "$tabSTATE" "$appDirPath/main/$moduleDirName/$moduleFileName"
                logString+="${blue}[M]: ${magenta}$tabName${blue} State "$tabState" created at module file $moduleFileName${reset}\n"
            else
                logString+="${red}[E]: ${magenta}$tabName${red} State "$tabState" can't be created because marker ${magenta}$MARKER_STATE${red} not available at module file $appDirPath/main/$moduleDirName/$moduleFileName${reset}\n"
            fi

        fi

        if $isHtmlExist; then
            tabTitle=$(spinalToTitle "$tabName")

            if isExists ""\""app.$tabState"\""" "$htmlPath/$menuHtmlFileName"; then

                logString+="${yellow}[W]: Sub Menu Item ${magenta}"app.$tabState"${yellow} already exist at html file $htmlPath/$menuHtmlFileName${reset}\n"

            else

                if isExists "$MARKER_TAB_ITEM" "$htmlPath/$menuHtmlFileName"; then

                    tabHtmlItem=$(getTabItem "app.$tabState" "$tabTitle" "$uiView")
                    addLineBeforeFirstMatch "$MARKER_TAB_ITEM" "$tabHtmlItem" "$htmlPath/$menuHtmlFileName"
                    logString+="${blue}[M]: ${magenta}$tabName${blue} added at Html file $htmlPath/$menuHtmlFileName${reset}\n"

                else

                    logString+="${red}[E]: ${magenta}$tabName${red} Sub Menu Item can't be added because marker ${magenta}$MARKER_TAB_ITEM${red} not available at html file $htmlPath/$menuHtmlFileName${reset}\n"
                fi

            fi
        fi

    done

else

    logString+="${red}[E]: Module file ${magenta}$moduleFileName${red} not exist at $appDirPath/main/$moduleDirName/${reset}\n"
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
