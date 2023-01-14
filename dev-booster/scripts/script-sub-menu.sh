#!/bin/bash
readonly MARKER_STATE="//CODE_GENERATOR_MARKER_STATE"
readonly MARKER_SUB_MENU="//CODE_GENERATOR_MARKER_SUB_MENU"

readonly MARKER_ID_GEN="//CODE_GENERATOR_MARKER_ID_GEN"
readonly MARKER_SUB_MENU_LAYOUT="<!-- CODE_GENERATOR_MARKER_HTML_SUB_MENU -->"
readonly MARKER_SIDE_NAV_LAYOUT="<!-- CODE_GENERATOR_MARKER_HTML_SIDE_NAV -->"

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
    echo -e "\n${cyan}${bold}Press Enter to Confirm Otherwise Provide Correct Name${reset}" >&2
    read -e -p "$1 : " -i "$2" name
    echo "$name"
    echo -e "$1 : $name ${green}[CONFIRMED]${reset}\n\n" >&2
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

getSubMenuItem() {
    # MenuTitle state
    echo "\
                {\n\
                    title: "\""$1"\"",\n\
                    state: "\""$2"\""\n\
                },"

}

getSubMenuGroupChildren() {
    # MenuTitle state
    echo "\
                    {\n\
                        title: "\""$1"\"",\n\
                        state: "\""$2"\""\n\
                    },"

}
getSubMenuGroupItem() {
    # MenuTitle marker
    echo "\
                {\n\
                    title: "\""$1"\"",\n\
                    child: [\n\
                        $2\n\
                    ]\n\
                },"

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

defaultViewHtml() {
    # title
    echo "<div>
    <td-common-detail-prev-next un-save-state="\""unSaveState"\"" on-save="\""vm.saveHandlerService.save()"\""></td-common-detail-prev-next>
</div>
<h1>
    <center>This Is $1 Index Page<center>
</h1>"
}

simpleWorkSpaceHtml() {
    # menuTitle
    echo "<div ng-if="\""vm.loadViewContent"\"" class="\""page-layout simple right-sidenav"\"" layout="\""row"\"" style="\""height:100%;"\"">
    <div class="\""center"\"" layout="\""column"\"" style="\""width: 100%;"\"">
        <div layout="\""row"\"" class="\""header md-accent-bg h-40"\"">
            <div class="\""ml-25 font-size-20 font-weight-900"\"" layout="\""row"\"" layout-align="\""start center"\"">
                <span>$1</span>
            </div>
            <td-common-detail-prev-next un-save-state="\""unSaveState"\"" on-save="\""vm.saveHandlerService.save()"\""></td-common-detail-prev-next>
        </div>
        <div class="\""scrollable"\"" layout="\""row"\""  style="\""height: calc(100% - 50px)"\"" ms-scroll>
            <h1>
                <center>Simple Workspace Layout<br>Your Content Here (ms-scroll with proper heght is given)</center>
            </h1>
        </div>
    </div>
</div>"
}

htmlHandler() {
    # subMenuName ctrlFunction
    local menuTitle=$(spinalToTitle "$1")
    local htmlFileString=$("$2" "$menuTitle")
    echo "$htmlFileString" >$htmlPath/"$1"/$htmlFileName
    logString+="${blue}[M]: Write to File ${magenta}$htmlFileName${blue} at $htmlPath/"$1"/${reset}\n"

}

ctrlHandler() {
    # submenuname ctrlFunction moduleAppName MenuName
    local ctrlName=$(spinalToCtrlName "$4" "$1")
    local ctrlFileString=$("$2" "$3" "$ctrlName")
    echo "$ctrlFileString" >$htmlPath/"$1"/$jsFileName
    logString+="${blue}[M]: Write to File ${magenta}$jsFileName${blue} at $htmlPath/"$1"/${reset}\n"

}

getSubMenuLayout() {
    # uiView
    echo "\
            <!-- SUB MENU LAYOUT ADDED -->\n\
            <div ng-if="\""vm.loadViewContent"\"" id="\""common-detail"\"" class="\""page-layout simple right-sidenav"\"" layout="\""row"\"" style="\""height: 100%;"\"">\n\
                <md-sidenav class="\""left-sidenav w-200"\"" md-component-id="\""left-sidenav"\"" md-is-locked-open="\""\$mdMedia('gt-md')"\"" ng-include="\""'app\/main\/common\/details\/sidenavs\/leftSideNav.html'"\"" ms-sidenav-helper style="\""overflow:hidden;"\"">\n\
                <\/md-sidenav>\n\
                <div class="\""scrollable"\"" layout="\""row"\"" ui-view="\""$1"\"" style="\""width: 100%;height:100%;"\"" ms-scroll> <\/div>\n\
            <\/div>"
}

getSideNavLayout() {
    # uiView
    echo "\
<!-- SIDE NAV LAYOUT ADDED -->\n\
<div id="\""common-detail"\"" ng-if="\""vm.loadViewContent"\"" class="\""page-layout simple right-sidenav"\"" layout="\""row"\"" style="\""height: 100%;"\"">\n\
    <md-sidenav class="\""left-sidenav w-205"\"" md-component-id="\""left-sidenav"\"" md-is-locked-open="\""\$mdMedia('gt-md') && vm.leftNavPined "\"" ng-include="\""'app\/main\/common\/details\/sidenavs\/leftSideNav.html'"\"" ms-sidenav-helper style="\""overflow:hidden;"\"">\n\
    <\/md-sidenav>\n\
\n\
    <div class="\""center"\"" layout="\""column"\"" flex>\n\
        <div layout="\""row"\"" class="\""header md-accent-bg"\"">\n\
            <md-button class="\""md-icon-button main-sidenav-toggle"\"" ng-click="\""vm.toggleSidenav('left-sidenav')"\"">\n\
                <md-icon md-font-icon="\""icon-backburger"\"" class="\""icon"\"" ng-class="\""{'transform-180' : !vm.leftNavPined}"\""><\/md-icon>\n\
            <\/md-button>\n\
\n\
            <div layout="\""row"\"" layout-align="\""start center"\"" flex>\n\
                <div class="\""mr-25 font-size-18"\"" layout="\""row"\"" layout-align="\""start center"\"" ng-if="\""vm.headerTitle"\"">\n\
                    <span>{{vm.headerTitle}}<\/span>\n\
                <\/div>\n\
            <\/div>\n\
        <\/div>\n\
        <div class="\""scrollable"\"" layout="\""row"\"" ui-view="\""$1"\"" style="\""width: 100%;height:100%;"\"" ms-scroll><\/div>\n\
    <\/div>\n\
<\/div>"
}

logString="\n\n"
DATE_WITH_TIME=$(date "+%Y/%m/%d- Time - %H:%M:%S")
logString+="$DATE_WITH_TIME"
logString+="\n\n"

printf '\e[5 q'
echo -e "Use spinal-case naming convention"
echo "Module Name(spinal-case)"?
read moduleName

echo -e "\nMenu/SubMenu/Tab/Popup Name?"
read menuName

echo -e "\nSub Menu Groups(Use spinal-case naming convention. For multiple Group separate using space. Skip for none)?"
read subMenuGroups

COUNTER=0
for subMenuGroup in $subMenuGroups; do
    echo -e "\n"
    echo -n "$subMenuGroup sub menus (Use spinal-case naming convention. For multiple sub menu separate using space)?: "
    read subMenus
    declare -A subMenuList$COUNTER="(
        [subMenuGroup]="$subMenuGroup"
        [subMenus]='$subMenus'
    )"
    COUNTER+=1
done

echo -e "\n"
echo -n "sub menus without group(Use spinal-case naming convention. For multiple sub menu separate using space, Skip for none)?: "
read subMenus
declare -A subMenuList$COUNTER="(
    [subMenuGroup]="WITHOUT_GROUP"
    [subMenus]='$subMenus'
)"

declare -n subMenuList

moduleDirName=$(confirmAndContinue "Module Directory Name" "$moduleName")

if isDirectory $appDirPath/main/$moduleDirName; then
    logString+="[I]: Directory ${magenta}$moduleDirName${reset} Exists at $appDirPath/main/${reset}\n"
else
    echo -e "${red}[E]: Directory not found in ${magenta}$moduleDirName${red} at $appDirPath/main/${reset}\n"
    exit 1
fi
uiView="uiView"
uiView=$(confirmAndContinue "ui-view name" "$uiView")

moduleFileName=$(spinalToModuleFileName "$moduleName")
moduleFileName=$(confirmAndContinue "Module File Name" "$moduleFileName")
moduleAppName=$(confirmAndContinue "Module APP Name" "$moduleName")

menuState="$moduleAppName.$menuName"
menuState=$(confirmAndContinue "Menu/SubMenu/Tab/Popup State (Without app.)" "$menuState")

menuControllerFileName=$(spinalToJsFileName "$menuName")
menuControllerFileName=$(confirmAndContinue "$menuName Controller File Name" "$menuControllerFileName")

menuHtmlFileName=$(spinalToHtmlFileName "$menuName")
menuHtmlFileName=$(confirmAndContinue "$menuName Html File Name" "$menuHtmlFileName")

if isFile $menuControllerFileName; then
    logString+="[I]: Controller File ${magenta}$menuControllerFileName${reset} Exists at $htmlPath${reset}\n"
    isControllerExist=true
else

    logString+="${red}[E]: Sub Menu items can't be created because controller file ${magenta}$menuControllerFileName${red} not exist at $htmlPath${reset}\n"
    isControllerExist=false
fi
noHtmlMarkerExist=false
if isFile $menuHtmlFileName; then
    logString+="[I]: Html File ${magenta}$menuHtmlFileName${reset} Exists at $htmlPath${reset}\n"
    if isExists "<!-- SUB MENU LAYOUT ADDED -->" "$menuHtmlFileName"; then
        logString+="${yellow}[W]: Sub menu layout already exist at html file $htmlPath/$menuHtmlFileName${reset}\n"
    else
        if isExists "$MARKER_SUB_MENU_LAYOUT" "$menuHtmlFileName"; then
            subMenuLayout=$(getSubMenuLayout "$uiView")
            addLineAfterFirstMatch "$MARKER_SUB_MENU_LAYOUT" "$subMenuLayout" "$menuHtmlFileName"
            logString+="${blue}[M]: Sub menu layout added at html file $htmlPath/$menuHtmlFileName${reset}\n"
        else
            noHtmlMarkerExist=true
        fi
    fi
    if isExists "<!-- SIDE NAV LAYOUT ADDED -->" "$menuHtmlFileName"; then
        logString+="${yellow}[W]: Sub menu layout already exist at html file $htmlPath/$menuHtmlFileName${reset}\n"
    else
        if isExists "$MARKER_SIDE_NAV_LAYOUT" "$menuHtmlFileName"; then
            sideNavLayout=$(getSideNavLayout "$uiView")
            addLineAfterFirstMatch "$MARKER_SIDE_NAV_LAYOUT" "$sideNavLayout" "$menuHtmlFileName"
            logString+="${blue}[M]: Sub menu layout added at html file $htmlPath/$menuHtmlFileName${reset}\n"
        else
            noHtmlMarkerExist=true

        fi

    fi

    if $noHtmlMarkerExist; then

        logString+="${red}[E]: Sub menu layout can't be added because marker ${magenta}$MARKER_SUB_MENU_LAYOUT${red} not available at html file $htmlPath/$menuHtmlFileName${reset}\n"
    fi
else

    logString+="${red}[E]: Sub Menu Layout can't be created because html file ${magenta}$menuHtmlFileName${red} not exist at $htmlPath/${reset}\n"
fi

if isFile $appDirPath/main/$moduleDirName/$moduleFileName; then
    logString+="[I]: Module File ${magenta}$moduleFileName${reset} Exists at $appDirPath/main/$moduleDirName${reset}\n"
    for subMenuList in ${!subMenuList@}; do
        for subMenuName in ${subMenuList[subMenus]}; do
            subMenuSate="$menuState.$subMenuName"
            subMenuSate=$(confirmAndContinue "$subMenuName State" "$subMenuSate")

            subMenuControllerName=$(spinalToCtrlName "$menuName" "$subMenuName")

            if isExists "'app.$subMenuSate'" "$appDirPath/main/$moduleDirName/$moduleFileName"; then
                logString+="${yellow}[W]: ${magenta}"$subMenuName"${yellow} State "$subMenuSate" already exist at module file $appDirPath/main/$moduleDirName/$moduleFileName${reset}\n"

            else
                if isExists "$MARKER_STATE" "$appDirPath/main/$moduleDirName/$moduleFileName"; then
                    subMenuSateItem=$(getSTATE "$subMenuSate" "$subMenuName" "$subMenuControllerName" "$uiView" "$relPath")
                    addLineBeforeFirstMatch "$MARKER_STATE" "$subMenuSateItem" "$appDirPath/main/$moduleDirName/$moduleFileName"
                    logString+="${blue}[M]: ${magenta}$subMenuName${blue} State "$subMenuSate" created at module file $appDirPath/main/$moduleDirName/$moduleFileName${reset}\n"
                else
                    logString+="${red}[E]: ${magenta}$subMenuName${red} State "$subMenuSate" can't be created because marker ${magenta}$MARKER_STATE${red} not available at module file $appDirPath/main/$moduleDirName/$moduleFileName${reset}\n"
                fi

            fi

            if $isControllerExist; then
                subMenuTitle=$(spinalToTitle "$subMenuName")

                if isExists ""\""app.$subMenuSate"\""" "$htmlPath/$menuControllerFileName"; then

                    logString+="${yellow}[W]: Sub Menu Item ${magenta}"app.$subMenuSate"${yellow} already exist at controller file $htmlPath/$menuControllerFileName${reset}\n"

                else

                    if isExists "$MARKER_SUB_MENU" "$htmlPath/$menuControllerFileName"; then

                        if [[ ${subMenuList[subMenuGroup]} == "WITHOUT_GROUP" ]]; then

                            subMenuItem=$(getSubMenuItem "$subMenuTitle" "app.$subMenuSate")
                            addLineBeforeFirstMatch "$MARKER_SUB_MENU" "$subMenuItem" "$htmlPath/$menuControllerFileName"
                            logString+="${blue}[M]: ${magenta}$subMenuName${blue} added at controller file $htmlPath/$menuControllerFileName${reset}\n"
                        else

                            subMenuGroupTitle=$(spinalToTitle "${subMenuList[subMenuGroup]}")
                            subMenuGroupTitleMacro=$(spinalToMacroCase "${subMenuList[subMenuGroup]}")

                            if ! isExists "//CODE_GENERATOR_MARKER_CHILD_SUB_MENU$subMenuGroupTitleMacro" "$htmlPath/$menuControllerFileName"; then

                                subMenuGroupItem=$(getSubMenuGroupItem "$subMenuGroupTitle" "\/\/CODE_GENERATOR_MARKER_CHILD_SUB_MENU$subMenuGroupTitleMacro")
                                addLineBeforeFirstMatch "$MARKER_SUB_MENU" "$subMenuGroupItem" "$htmlPath/$menuControllerFileName"
                                logString+="${blue}[M]: ${magenta}$subMenuGroupTitle${blue} group item added at controller file $htmlPath/$menuControllerFileName${reset}\n"
                            else
                                logString+="${yellow}[W]: ${magenta}$subMenuGroupTitle${yellow} group item already exist at controller file $htmlPath/$menuControllerFileName${reset}\n"

                            fi

                            subMenuItem=$(getSubMenuGroupChildren "$subMenuTitle" "app.$subMenuSate")
                            addLineBeforeFirstMatch "//CODE_GENERATOR_MARKER_CHILD_SUB_MENU$subMenuGroupTitleMacro" "$subMenuItem" "$htmlPath/$menuControllerFileName"
                            logString+="${blue}[M]: ${magenta}$subMenuName${blue} added at controller file $htmlPath/$menuControllerFileName${reset}\n"

                        fi

                    else

                        logString+="${red}[E]: ${magenta}$subMenuName${red} Sub Menu Item can't be added because marker ${magenta}$MARKER_SUB_MENU${red} not available at controller file $htmlPath/$menuControllerFileName${reset}\n"
                    fi

                fi
            fi

        done
    done

else
    logString+="${red}[E]: Module file ${magenta}$moduleFileName${red} not exist at $appDirPath/main/$moduleDirName${reset}\n"
fi

unset -n subMenuList
declare -n subMenuList

layout="SUB_MENU"
if $isControllerExist; then

    if isExists "vm.toggleSidenav" "$htmlPath/$menuControllerFileName"; then
        layout="SIDE_NAV"
    fi
fi

for subMenuList in ${!subMenuList@}; do
    for subMenuName in ${subMenuList[subMenus]}; do

        if isDirectory "$subMenuName"; then
            logString+="${yellow}[W]: Directory ${magenta}$subMenuName${yellow} Already Exists at $htmlPath/${reset}\n"
        else
            mkdir $subMenuName
            logString+="${cyan}[A]: Created Directory ${magenta}$subMenuName${cyan} at $htmlPath/${reset}\n"
        fi

        htmlFileName=$(spinalToHtmlFileName "$subMenuName")

        if isFile "$subMenuName"/$htmlFileName; then
            logString+="${yellow}[W]: File ${magenta}$htmlFileName${yellow} Already Exists at $htmlPath/$subMenuName/${reset}\n"
        else
            touch "$subMenuName"/$htmlFileName
            logString+="${cyan}[A]: Created File ${magenta}$htmlFileName${cyan} at $htmlPath/$subMenuName/${reset}\n"

            if [[ $layout == "SIDE_NAV" ]]; then
                htmlHandler "$subMenuName" "defaultViewHtml"
            else
                htmlHandler "$subMenuName" "simpleWorkSpaceHtml"

            fi

        fi

        jsFileName=$(spinalToJsFileName "$subMenuName")

        if isFile "$subMenuName"/$jsFileName; then
            logString+="${yellow}[W]: File ${magenta}$jsFileName${yellow} Already Exists at $htmlPath/$subMenuName/${reset}\n"
        else
            touch "$subMenuName"/$jsFileName
            logString+="${cyan}[A]: Created File ${magenta}$jsFileName${cyan} at $htmlPath/$subMenuName/${reset}\n"

            ctrlHandler "$subMenuName" "defaultViewCtrl" "$moduleAppName" "$menuName"

        fi

    done
done

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
