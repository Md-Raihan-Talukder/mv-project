#!/bin/bash
readonly MARKER_STATE="//CODE_GENERATOR_MARKER_STATE"
readonly MARKER_SAVE_ITEM="//CODE_GENERATOR_MARKER_SAVE_ITEM"
readonly MARKER_APP_NAME="//CODE_GENERATOR_MARKER_APP_NAME"

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

addModuleNameToIndexModule() {

    if isFile $TD_PATH/src/app/index.module.js; then
        if isExists "'app.$1'" $TD_PATH/src/app/index.module.js; then
            logString+="${yellow}[W]: App Name ${magenta}'app.$1'${yellow} Already Exists $TD_PATH/src/app/index.module.js${reset}\n"
        else
            if isExists "$MARKER_APP_NAME" "$TD_PATH/src/app/index.module.js"; then
                addLineBeforeFirstMatch "$MARKER_APP_NAME" "            'app.$1'," "$TD_PATH/src/app/index.module.js"
                logString+="${blue}[M]: App Name ${magenta}'app.$1'${blue} added at $TD_PATH/src/app/index.module.js${reset}\n"
            else
                logString+="${red}[E]: App Name ${magenta}'app.$1'${red} can't be added because marker ${magenta}$MARKER_APP_NAME${red} not available at $TD_PATH/src/app/index.module.js${reset}\n"
            fi

        fi
    else
        logString+="${red}[E]: index.module.js not available at $TD_PATH/src/app/${reset}\n"
    fi
}

getMODULE() {
    # moduleAppName moduleTitle
    echo "(function () {
    'use strict';

    angular
        .module('app.$1', [])
        .config(config);

    /** @ngInject */
    function config(\$stateProvider, msNavigationServiceProvider) {
        \$stateProvider
            .state('app.$1', {
                abstract: true,
                url: '/$1'
            })
        $MARKER_STATE
        msNavigationServiceProvider.saveItem('$1', {
            title: '$2',
            icon: 'icon-desktop-mac',
            weight: -100
        });
        $MARKER_SAVE_ITEM
    }

})();"
}

getSTATE() {
    # state menuName controller moduleDir
    echo "\
            .state('app.$1', {\n\
                url: '\/$2',\n\
                views: {\n\
                    'content@app': {\n\
                        templateUrl: 'app\/main\/$4\/$2\/$2.html',\n\
                        controller: '$3 as vm'\n\
                    }\n\
                }\n\
            })"

}

getSAVE_ITEM() {
    # state menuTitle
    echo "\
        msNavigationServiceProvider.saveItem('$1', {\n\
            title: '$2',\n\
            state: 'app.$1',\n\
            icon: 'icon-cog-box',\n\
            weight: 1\n\
        });"
}

simpleWorkSpaceCtrl() {
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
    }
})();"
}

simpleWorkSpaceHtml() {
    # menuTitle
    echo "<div ng-if="\""vm.loadViewContent"\"" class="\""page-layout simple right-sidenav"\"" layout="\""row"\"" style="\""height:100%;"\"">
    <div class="\""center"\"" layout="\""column"\"" style="\""width: 100%;"\"">
        <div layout="\""row"\"" class="\""header md-accent-bg h-50"\"">
            <div class="\""mr-25 font-size-20 font-weight-900"\"" layout="\""row"\"" layout-align="\""start center"\"">
                <span>$1</span>
            </div>
            <td-common-detail-prev-next un-save-state="\""unSaveState"\"" on-save="\""vm.saveHandlerService.save()"\""></td-common-detail-prev-next>
        </div>
        <div class="\""scrollable"\"" layout="\""row"\"" style="\""height: calc(100% - 50px)"\"" ms-scroll>
            <h1>
                <center>Simple Workspace Layout<br>Your Content Here (ms-scroll with proper heght is given)</center>
            </h1>
        </div>
    </div>
</div>"
}

infoMenuLevel3Ctrl() {
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
        vm.selectObj = function selectObj(obj) {
            vm.selectedObj = obj
        }
        vm.array = [
            {
                "\""title"\"": "\""array1"\"",
                "\""secondArray"\"": [
                    {
                        "\""title"\"": "\""sub array 1"\"",
                        "\""thirdArray"\"": [
                            {
                                "\""title"\"": "\""Child Array 1"\"",

                            },
                            {
                                "\""title"\"": "\""Child Array 2"\"",

                            }
                        ]
                    },
                    {
                        "\""title"\"": "\""sub array 2"\"",
                        "\""thirdArray"\"": [
                            {
                                "\""title"\"": "\""Child Array 1"\"",

                            }
                        ]
                    }
                ]
            },
            {
                "\""title"\"": "\""array2"\"",
                "\""secondArray"\"": [
                    {
                        "\""title"\"": "\""sub array 1"\"",
                        "\""thirdArray"\"": [
                            {
                                "\""title"\"": "\""Child Array 1"\"",

                            }
                        ]
                    },
                    {
                        "\""title"\"": "\""sub array 2"\"",
                        "\""thirdArray"\"": [
                            {
                                "\""title"\"": "\""Child Array 1"\"",

                            }
                        ]
                    }
                ]
            }
        ]
    }
})();"
}

infoMenuLevel3Html() {
    # menutitle
    echo "<div ng-if="\""vm.loadViewContent"\"" class="\""page-layout simple right-sidenav"\"" layout="\""row"\"" style="\""height:100%;"\"">
    <div class="\""center"\"" layout="\""column"\"" style="\""width: 100%;"\"">
        <div layout="\""row"\"" class="\""header md-accent-bg h-50"\"">
            <div class="\""mr-25 font-size-20 font-weight-900"\"" layout="\""row"\"" layout-align="\""start center"\"">
                <span>$1</span>
            </div>
            <td-common-detail-prev-next un-save-state="\""unSaveState"\"" on-save="\""vm.saveHandlerService.save()"\""></td-common-detail-prev-next>
        </div>
        <div class="\""scrollable"\"" layout="\""row"\"" style="\""height: calc(100% - 50px)"\"" ms-scroll>
            <div layout="\""row"\"" style="\""height: 100%;width: 100%;"\"">
                <div class="\""br w-200"\"" style="\""height: 100%; background-color: rgb(255, 255, 255);"\"" layout="\""column"\"">

                    <div class="\""blue-100-bg bb h-40"\"" layout="\""column"\"" layout-align="\""center start"\"">
                        <span class="\""header-title font-size-16 ml-10"\"">Info Menu</span>
                    </div>

                    <div class="\""scrollable"\"" style="\""height: 100%;"\"" ms-scroll>
                        <div layout="\""row"\"" ng-repeat="\""obj in vm.array"\"">

                            <msb-expand-collapse>
                                <div layout="\""row"\"" class="\""msb-collapse-header cursor-pointer navigation-simple"\"" style="\""width:100%"\"" ng-click="\""(clicked) ?  clicked=false: clicked=true"\"">
                                    <md-button class="\""h-40 item  bb"\"" style="\""width:100%;background-color: rgb(255, 237, 204);"\"">
                                        <div layout="\""row"\"" layout-align="\""start center"\"" style="\""height: 100%;margin-left: -15px;"\"">
                                            <md-icon md-font-icon="\""icon-view-list"\"" class="\""s16 md-accent"\""></md-icon>
                                            <div class="\""w-130"\"">{{obj.title}}</div>
                                            <md-icon ng-if="\""!clicked"\"" md-font-icon="\""icon-chevron-right"\"" class="\""s16 md-accent"\""></md-icon>
                                            <md-icon ng-if="\""clicked"\"" md-font-icon="\""icon-chevron-down"\"" class="\""s16 md-accent"\"">
                                            </md-icon>
                                        </div>
                                    </md-button>
                                </div>

                                <div class="\""msb-collapse-content navigation-simple"\"" style="\""width: 100%;display: none;background-color: rgb(240, 240, 240) "\"">

                                    <div ng-repeat="\""secondObj in obj.secondArray"\"">
                                        <msb-expand-collapse>
                                            <div layout="\""row"\"" class="\""msb-collapse-header cursor-pointer navigation-simple"\"" style="\""width:100%"\"" ng-click="\""(clicked) ?  clicked=false: clicked=true"\"">
                                                <md-button class="\""h-40 item  bb"\"" style="\""width:100%;background-color: rgb(255, 243, 219)"\"">
                                                    <div layout="\""row"\"" layout-align="\""start center"\"" style="\""height: 100%;"\"">
                                                        <md-icon md-font-icon="\""icon-view-list"\"" class="\""s14 md-accent"\"">
                                                        </md-icon>
                                                        <div class="\""w-110"\"">{{secondObj.title}}</div>
                                                        <md-icon ng-if="\""clicked"\"" md-font-icon="\""icon-chevron-right"\"" class="\""s16 md-accent"\"">
                                                        </md-icon>
                                                        <md-icon ng-if="\""!clicked"\"" md-font-icon="\""icon-chevron-down"\"" class="\""s16 md-accent"\"">
                                                        </md-icon>
                                                    </div>
                                                </md-button>
                                            </div>

                                            <div class="\""msb-collapse-content navigation-simple"\"" style="\""width: 100%;display: none;background-color: rgb(255, 248, 235) "\"">
                                                <md-button layout="\""row"\"" ng-repeat="\""thirdObj in secondObj.thirdArray"\"" class="\""h-40 item bb"\"" style="\""width: 100%;"\"" ng-click="\""vm.selectObj(thirdObj)"\"" ng-class="\""{'blue-100-bg': vm.selectedObj == thirdObj}"\"">
                                                    <div layout="\""column"\"" style="\""margin-left: 10px;"\"">
                                                        <md-icon md-font-icon="\"" icon-apps"\"" class="\""s12"\"">
                                                        </md-icon>
                                                    </div>
                                                    <span>{{thirdObj.title}}</span>
                                                </md-button>
                                            </div>
                                        </msb-expand-collapse>
                                    </div>
                                </div>
                            </msb-expand-collapse>

                        </div>
                    </div>
                </div>

                <div class="\""scrollable"\"" layout="\""column"\"" style="\""width: calc(100% - 200px)"\"" ms-scroll>
                    <h1>
                        <center>Info Menu Level 3 Layout<br>WorkSpace Component here (ms-scroll enabled with proper height)<br>{{vm.selectedObj.title}}</center>
                    </h1>
                </div>
            </div>
        </div>
    </div>
</div>"
}

infoMenuLevel1Ctrl() {
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
        vm.selectObj = function selectObj(obj) {
            vm.selectedObj = obj
        }
        vm.array = [
            {
                "\""title"\"": "\""object 1"\"",
            },
            {
                "\""title"\"": "\""object 2"\"",
            },
            {
                "\""title"\"": "\""object 3"\"",
            },
            {
                "\""title"\"": "\""object 4"\"",
            }
        ]
    }
})();"
}

infoMenuLevel1Html() {
    # title
    echo "<div ng-if="\""vm.loadViewContent"\"" class="\""page-layout simple right-sidenav"\"" layout="\""row"\"" style="\""height:100%;"\"">
    <div class="\""center"\"" layout="\""column"\"" style="\""width: 100%;"\"">
        <div layout="\""row"\"" class="\""header md-accent-bg h-50"\"">
            <div class="\""mr-25 font-size-20 font-weight-900"\"" layout="\""row"\"" layout-align="\""start center"\"">
                <span>$1</span>
            </div>
            <td-common-detail-prev-next un-save-state="\""unSaveState"\"" on-save="\""vm.saveHandlerService.save()"\""></td-common-detail-prev-next>
        </div>
        <div class="\""scrollable"\"" layout="\""row"\""  style="\""height: calc(100% - 50px)"\"" ms-scroll>
            <div layout="\""row"\"" style="\""height: 100%;width:100%"\"">
                <div class="\""br white-bg w-200"\"" style="\""height: 100%;"\"" layout="\""column"\"">

                    <div class="\""blue-grey-100-bg bb h-40"\"" layout="\""column"\"" layout-align="\""center start"\"">
                        <span class="\""header-title font-size-16 ml-10"\"">Info Menu</span>
                    </div>

                    <div class="\""scrollable"\"" style="\""height: 100%;width:100%"\"" ms-scroll>
                        <div layout="\""row"\"" ng-repeat="\""obj in vm.array"\"" class="\""cursor-pointer navigation-simple"\"" style="\""width:100%"\"">
                            <md-button class="\""h-45 item  bb"\"" style="\""width:100%;background-color: rgb(255, 248, 235);"\"" ng-click="\""vm.selectObj(obj)"\"" ng-class="\""{'blue-100-bg': vm.selectedObj == obj}"\"">
                                <div layout="\""row"\"" layout-align="\""start center"\"" style="\""height: 100%;margin-left: -10px;"\"">
                                    <md-icon md-font-icon="\""icon-apps"\"" class="\""s16 md-accent"\""></md-icon>
                                    <div class="\""w-130"\"">{{obj.title}}</div>
                                    </md-icon>
                                </div>
                            </md-button>
                        </div>
                    </div>
                </div>

                <div class="\""scrollable"\"" layout="\""column"\"" style="\""width: calc(100% - 200px)"\"" ms-scroll>
                    <h1>
                        <center>Info Menu Level 1 Layout<br>Your Content Here (ms-scroll with proper heght is given)<br>{{vm.selectedObj.title}}</center>
                    </h1>
                </div>
            </div>
        </div>
    </div>
</div>"
}

infoMenuLevel2Ctrl() {
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
        vm.selectObj = function selectObj(obj) {
            vm.selectedObj = obj
        }
        vm.array = [
            {
                "\""title"\"": "\""array1"\"",
                "\""secondArray"\"": [
                    {
                        "\""title"\"": "\""Item 1"\"",
                    },
                    {
                        "\""title"\"": "\""Item 2"\"",
                    }
                ]
            },
            {
                "\""title"\"": "\""array2"\"",
                "\""secondArray"\"": [
                    {
                        "\""title"\"": "\""Item 1"\"",
                    },
                    {
                        "\""title"\"": "\""Item 2"\"",
                    }
                ]
            }
        ]
    }
})();"
}

infoMenuLevel2Html() {
    # title
    echo "<div ng-if="\""vm.loadViewContent"\"" class="\""page-layout simple right-sidenav"\"" layout="\""row"\"" style="\""height:100%;"\"">
    <div class="\""center"\"" layout="\""column"\"" style="\""width: 100%;"\"">
        <div layout="\""row"\"" class="\""header md-accent-bg h-50"\"">
            <div class="\""mr-25 font-size-20 font-weight-900"\"" layout="\""row"\"" layout-align="\""start center"\"">
                <span>$1</span>
            </div>
            <td-common-detail-prev-next un-save-state="\""unSaveState"\"" on-save="\""vm.saveHandlerService.save()"\""></td-common-detail-prev-next>
        </div>
        <div class="\""scrollable"\"" layout="\""row"\"" style="\""height: calc(100% - 50px)"\"" ms-scroll>
            <div layout="\""row"\"" style="\""height: 100%;width: 100%;"\"">
                <div class="\""br w-200 white-bg"\"" style="\""height: 100%;"\"" layout="\""column"\"">

                    <div class="\""blue-100-bg bb h-40"\"" layout="\""column"\"" layout-align="\""center start"\"">
                        <span class="\""header-title font-size-16 ml-10"\"">Info Menu</span>
                    </div>

                    <div class="\""scrollable"\"" style="\""height: 100%;"\"" ms-scroll>
                        <div layout="\""row"\"" ng-repeat="\""obj in vm.array"\"">
                            <msb-expand-collapse>
                                <div layout="\""row"\"" class="\""msb-collapse-header cursor-pointer navigation-simple"\"" style="\""width:100%"\"" ng-click="\""(clicked) ?  clicked=false: clicked=true"\"">
                                    <md-button class="\""h-40 item  bb"\"" style="\""width:100%;background-color: rgb(255, 237, 204);"\"">
                                        <div layout="\""row"\"" layout-align="\""start center"\"" style="\""height: 100%;margin-left: -15px;"\"">
                                            <md-icon md-font-icon="\""icon-view-list"\"" class="\""s16 md-accent"\""></md-icon>
                                            <div class="\""w-130"\"">{{obj.title}}</div>
                                            <md-icon ng-if="\""!clicked"\"" md-font-icon="\""icon-chevron-right"\"" class="\""s16 md-accent"\""></md-icon>
                                            <md-icon ng-if="\""clicked"\"" md-font-icon="\""icon-chevron-down"\"" class="\""s16 md-accent"\"">
                                            </md-icon>
                                        </div>
                                    </md-button>
                                </div>

                                <div class="\""msb-collapse-content navigation-simple"\"" style="\""width: 100%;display: none;background-color:rgb(255, 248, 235) "\"">
                                    <md-button layout="\""row"\"" ng-repeat="\""secondObj in obj.secondArray"\"" class="\""h-40 item bb"\"" style="\""width: 100%;"\"" ng-click="\""vm.selectObj(secondObj)"\"" ng-class="\""{'blue-100-bg': vm.selectedObj == secondObj}"\"">
                                        <div layout="\""column"\"">
                                            <md-icon md-font-icon="\"" icon-apps"\"" class="\""s12"\"">
                                            </md-icon>
                                        </div>
                                        <span>{{secondObj.title}}</span>
                                    </md-button>
                                </div>
                            </msb-expand-collapse>

                        </div>
                    </div>
                </div>

                <div class="\""scrollable"\"" layout="\""column"\""  style="\""width: calc(100% - 200px)"\"" ms-scroll>
                    <h1>
                        <center>Info Menu Level 2 Layout<br>Your Content Here (ms-scroll with proper heght is given)<br>{{vm.selectedObj.title}}</center>
                    </h1>
                </div>
            </div>
        </div>
    </div>
</div>"
}

sideNavWorkSpaceCtrl() {
    # moduleAppName ctrlName menuTitle
    echo "(function () {
    'use strict';
    angular
        .module('app.$1')
        .controller('$2', $2);

    /** @ngInject */
    function $2(\$mdSidenav) {
        debugger
        var TECHDISER_COMPONENT_NAME = "\""$2"\"";
        var TECHDISER_SERVICE_INFO = {};
        var vm = this;
        vm.loadViewContent = true
        vm.leftNavPined = true
        vm.headerTitle = "\""$3"\""
        vm.toggleSidenav = function toggleSidenav(sidenavId) {

            if (\$mdSidenav(sidenavId).isLockedOpen()) {
                vm.leftNavPined = false
                \$mdSidenav(sidenavId).close()
            } else {
                vm.leftNavPined = true
                \$mdSidenav(sidenavId).toggle()
            }
        }

        vm.sideNav = {
            subMenuHeader: "\""Side Nav"\"",
            menuList: [
                //CODE_GENERATOR_MARKER_SUB_MENU
            ]
        }
    }
})();"
}

sideNavWorkSpaceHtml() {
    # title
    echo "<!-- CODE_GENERATOR_MARKER_HTML_SIDE_NAV -->"
}

subMenuWorkSpaceCtrl() {
    # moduleAppName ctrlName menuTitle
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
        vm.sideNav = {
            subMenuHeader: "\""Sub Menu"\"",
            menuList: [
                //CODE_GENERATOR_MARKER_SUB_MENU
            ]
        }
    }
})();"
}

subMenuWorkSpaceHtml() {
    echo "<!-- CODE_GENERATOR_MARKER_HTML_SUB_MENU -->"
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
    }
})();"
}

defaultViewHtml() {
    # title
    echo "<h1><center>Default View<br>This Is $1 Index Page<center></h1>"
}

htmlHandler() {
    # menuname ctrlFunction
    local menuTitle=$(spinalToTitle "$1")
    local htmlFileString=$("$2" "$menuTitle")
    echo "$htmlFileString" >$TD_PATH/src/app/main/$moduleDirName/"$1"/$htmlFileName
    logString+="${blue}[M]: Write to File ${magenta}$htmlFileName${blue} at $TD_PATH/src/app/main/$moduleDirName/"$1"/${reset}\n"

}

ctrlHandler() {
    # menuname ctrlFunction moduleAppName
    local menuTitle=$(spinalToTitle "$1")
    local ctrlName=$(spinalToCtrlName "$moduleName" "$1")
    local ctrlFileString=$("$2" "$3" "$ctrlName" "$menuTitle")
    echo "$ctrlFileString" >$TD_PATH/src/app/main/$moduleDirName/"$1"/$jsFileName
    logString+="${blue}[M]: Write to File ${magenta}$jsFileName${blue} at $TD_PATH/src/app/main/$moduleDirName/"$1"/${reset}\n"

}

logString="\n\n"
DATE_WITH_TIME=$(date "+%Y/%m/%d- Time - %H:%M:%S")
logString+="$DATE_WITH_TIME"
logString+="\n\n"

if isDirectory "$TD_PATH/src/app/main/"; then
    logString+="[I]: TECHDISER_PATH Exists\n"
else
    echo -e "\n${red}[E]: TECHDISER PATH "$TD_PATH" not exist$reset\n"
    exit 1
fi

printf '\e[5 q'
echo -e "Use spinal-case naming convention"
echo "Module Name(spinal-case)"?
read moduleName

echo -e "\nMenu Names(Use spinal-case naming convention. For multiple menu separate using space)?"
read menuNames

echo -e "\n\nTo use layout for menu use option\n 1: Simple Workspace\n 2: Info Menu Workspace\n 3: Side Nav Workspace\n 4: Sub Menu Workspace\nPress enter for default workspace\n"

COUNTER=0
for menuName in $menuNames; do
    echo -e "\n"
    echo -n "$menuName layout : "
    read layout
    if [[ $layout == 2 ]]; then
        echo -n "$menuName info menu level(1-3) : "
        read level
    else
        level=0
    fi
    declare -A menuList$COUNTER="(
        [menuName]="$menuName"
        [layout]=$layout
        [level]=$level
    )"
    COUNTER+=1
done

# moduleName="bash-test-new"

# declare -A menuList0=(
#     [menuName]='menu-one'
#     [layout]=1
#     [level]=0
# )
# declare -A menuList1=(
#     [menuName]='menu-two'
#     [layout]=2
#     [level]=1
# )
# declare -A menuList2=(
#     [menuName]='menu-three'
#     [layout]=2
#     [level]=2
# )
# declare -A menuList3=(
#     [menuName]='menu-four'
#     [layout]=2
#     [level]=3
# )
# declare -A menuList4=(
#     [menuName]='menu-five'
#     [layout]=3
#     [level]=0
# )
# declare -A menuList5=(
#     [menuName]='menu-six'
#     [layout]=4
#     [level]=1
# )

declare -n menuList

moduleDirName=$(confirmAndContinue "Module Directory Name" "$moduleName")
moduleTitle=$(spinalToTitle "$moduleName")

if isDirectory $TD_PATH/src/app/main/$moduleDirName; then
    logString+="${yellow}[W]: Directory ${magenta}$moduleDirName${yellow} Already Exists at $TD_PATH/src/app/main/${reset}\n"
else
    mkdir $TD_PATH/src/app/main/$moduleDirName
    logString+="${cyan}[A]: Created Directory ${magenta}$moduleDirName${cyan} at $TD_PATH/src/app/main/${reset}\n"
fi

moduleFileName=$(spinalToModuleFileName "$moduleName")
moduleFileName=$(confirmAndContinue "Module File Name" "$moduleFileName")

moduleAppName=$(confirmAndContinue "Module APP Name" "$moduleName")
addModuleNameToIndexModule "$moduleAppName"

if isFile $TD_PATH/src/app/main/$moduleDirName/$moduleFileName; then
    logString+="${yellow}[W]: File ${magenta}$moduleFileName${yellow} Already Exists at $TD_PATH/src/app/main/$moduleDirName/${reset}\n"
else
    touch $TD_PATH/src/app/main/$moduleDirName/$moduleFileName
    logString+="${cyan}[A]: Created File ${magenta}$moduleFileName${cyan} at $TD_PATH/src/app/main/$moduleDirName/${reset}\n"
    MODULE=$(getMODULE "$moduleAppName" "$moduleTitle")
    echo "$MODULE" >$TD_PATH/src/app/main/$moduleDirName/$moduleFileName
    logString+="${blue}[M]: Write to File ${magenta}$moduleFileName${blue} at $TD_PATH/src/app/main/$moduleDirName/${reset}\n"
fi

for menuList in ${!menuList@}; do

    menuSate="$moduleAppName.${menuList[menuName]}"
    menuSate=$(confirmAndContinue "${menuList[menuName]} State" "$menuSate")

    menuControllerName=$(spinalToCtrlName "$moduleName" "${menuList[menuName]}")

    if isExists ".state('app.$menuSate'" "$TD_PATH/src/app/main/$moduleDirName/$moduleFileName"; then

        logString+="${yellow}[W]: State ${magenta}"app.$menuSate"${yellow} Already Exist at module file $TD_PATH/src/app/main/$moduleDirName/$moduleFileName${reset}\n"

    else

        if isExists "$MARKER_STATE" "$TD_PATH/src/app/main/$moduleDirName/$moduleFileName"; then
            menuSTATE=$(getSTATE "$menuSate" "${menuList[menuName]}" "$menuControllerName" "$moduleDirName")
            addLineBeforeFirstMatch "$MARKER_STATE" "$menuSTATE" "$TD_PATH/src/app/main/$moduleDirName/$moduleFileName"
            logString+="${blue}[M]: ${magenta}${menuList[menuName]}${blue} State created at module file $TD_PATH/src/app/main/$moduleDirName/$moduleFileName${reset}\n"
        else
            logString+="${red}[E]: ${magenta}${menuList[menuName]}${red} State can't be created because marker ${magenta}$MARKER_STATE${red} not available at module file $TD_PATH/src/app/main/$moduleDirName/$moduleFileName${reset}\n"
        fi

    fi

    if isExists "msNavigationServiceProvider.saveItem('$menuSate'" "$TD_PATH/src/app/main/$moduleDirName/$moduleFileName"; then

        logString+="${yellow}[W]: Save Item ${magenta}"$menuSate"${yellow} Already Exist at module file $TD_PATH/src/app/main/$moduleDirName/$moduleFileName${reset}\n"

    else

        if isExists "$MARKER_SAVE_ITEM" "$TD_PATH/src/app/main/$moduleDirName/$moduleFileName"; then
            menuTitle=$(spinalToTitle "${menuList[menuName]}")
            menuSAVE_ITEM=$(getSAVE_ITEM "$menuSate" "$menuTitle")
            addLineBeforeFirstMatch "$MARKER_SAVE_ITEM" "$menuSAVE_ITEM" "$TD_PATH/src/app/main/$moduleDirName/$moduleFileName"
            logString+="${blue}[M]: ${magenta}${menuList[menuName]}${blue} Save Item created at module file $TD_PATH/src/app/main/$moduleDirName/$moduleFileName${reset}\n"
        else
            logString+="${red}[E]: ${magenta}${menuList[menuName]}${red} Save Item can't be created because marker ${magenta}$MARKER_SAVE_ITEM${red} not available at module file $TD_PATH/src/app/main/$moduleDirName/$moduleFileName${reset}\n"
        fi
    fi

done

unset -n menuList
declare -n menuList

cd $TD_PATH/src/app/main/$moduleDirName/

for menuList in ${!menuList@}; do

    if isDirectory "${menuList[menuName]}"; then
        logString+="${yellow}[W]: Directory ${magenta}${menuList[menuName]}${yellow} Already Exists at $TD_PATH/src/app/main/$moduleDirName/${reset}\n"
    else
        mkdir ${menuList[menuName]}
        logString+="${cyan}[A]: Created Directory ${magenta}${menuList[menuName]}${cyan} at $TD_PATH/src/app/main/$moduleDirName/${reset}\n"
    fi

    htmlFileName=$(spinalToHtmlFileName "${menuList[menuName]}")

    if isFile "${menuList[menuName]}"/$htmlFileName; then
        logString+="${yellow}[W]: File ${magenta}$htmlFileName${yellow} Already Exists at $TD_PATH/src/app/main/$moduleDirName/${menuList[menuName]}/${reset}\n"
    else
        touch "${menuList[menuName]}"/$htmlFileName
        logString+="${cyan}[A]: Created File ${magenta}$htmlFileName${cyan} at $TD_PATH/src/app/main/$moduleDirName/${menuList[menuName]}/${reset}\n"

        case ${menuList[layout]} in

        1)
            htmlHandler "${menuList[menuName]}" "simpleWorkSpaceHtml"
            ;;

        2)
            case ${menuList[level]} in

            1)

                htmlHandler "${menuList[menuName]}" "infoMenuLevel1Html"
                ;;

            2)
                htmlHandler "${menuList[menuName]}" "infoMenuLevel2Html"
                ;;

            3)
                htmlHandler "${menuList[menuName]}" "infoMenuLevel3Html"
                ;;

            *)
                htmlHandler "${menuList[menuName]}" "infoMenuLevel1Html"
                ;;
            esac
            ;;

        3)

            htmlHandler "${menuList[menuName]}" "sideNavWorkSpaceHtml"
            ;;

        4)

            htmlHandler "${menuList[menuName]}" "subMenuWorkSpaceHtml"
            ;;

        *)
            htmlHandler "${menuList[menuName]}" "defaultViewHtml"
            ;;
        esac
    fi

    jsFileName=$(spinalToJsFileName "${menuList[menuName]}")

    if isFile "${menuList[menuName]}"/$jsFileName; then
        logString+="${yellow}[W]: File ${magenta}$jsFileName${yellow} Already Exists at $TD_PATH/src/app/main/$moduleDirName/${menuList[menuName]}/${reset}\n"
    else
        touch "${menuList[menuName]}"/$jsFileName
        logString+="${cyan}[A]: Created File ${magenta}$jsFileName${cyan} at $TD_PATH/src/app/main/$moduleDirName/${menuList[menuName]}/${reset}\n"

        case ${menuList[layout]} in

        1)
            ctrlHandler "${menuList[menuName]}" "simpleWorkSpaceCtrl" "$moduleAppName"
            ;;

        2)
            case ${menuList[level]} in

            1)
                ctrlHandler "${menuList[menuName]}" "infoMenuLevel1Ctrl" "$moduleAppName"
                ;;

            2)
                ctrlHandler "${menuList[menuName]}" "infoMenuLevel2Ctrl" "$moduleAppName"
                ;;

            3)
                ctrlHandler "${menuList[menuName]}" "infoMenuLevel3Ctrl" "$moduleAppName"
                ;;

            *)
                ctrlHandler "${menuList[menuName]}" "infoMenuLevel1Ctrl" "$moduleAppName"
                ;;
            esac
            ;;

        3)
            ctrlHandler "${menuList[menuName]}" "sideNavWorkSpaceCtrl" "$moduleAppName"
            ;;

        4)
            ctrlHandler "${menuList[menuName]}" "subMenuWorkSpaceCtrl" "$moduleAppName"
            ;;

        *)
            ctrlHandler "${menuList[menuName]}" "defaultViewCtrl" "$moduleAppName"
            ;;
        esac
    fi

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
