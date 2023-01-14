#!/bin/bash

createMenuState() {
    name_upper=$(sed -r 's/(^|-)(\w)/\U\2/g' <<<"$moduleName-$menuName")
    foo="$(tr '[:upper:]' '[:lower:]' <<<${name_upper:0:1})${name_upper:1}"
    foo+="Ctrl"
    menuState="
            .state('app.$moduleName.$menuName', {
                url: '/$menuName',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/$moduleName/$menuName/$menuName.html',
                        controller: '$foo as vm'
                    }
                }
            })"
    module+=$menuState
}

saveMenuItem() {
    title_upper=$(sed 's/[^-]\+/\L\u&/g' <<<"$menuName")
    title=${title_upper//-/ }
    menuItem="
        msNavigationServiceProvider.saveItem('$moduleName.$menuName', {
            title: '$title',
            state: 'app.$moduleName.$menuName',
            icon: 'icon-cog-box',
            weight: 1
        });"
    module+=$menuItem
}

addModuleSaveItem() {
    moduleName_upper=$(sed 's/[^-]\+/\L\u&/g' <<<"$moduleName")
    moduleTitle=${moduleName_upper//-/ }
    moduleSaveItem="
        msNavigationServiceProvider.saveItem('$moduleName', {
            title: '$moduleTitle',
            icon: 'icon-desktop-mac',
            weight: -80
        });"

    module+=$moduleSaveItem
}

simpleWorkSpace() {
    name_upper=$(sed -r 's/(^|-)(\w)/\U\2/g' <<<"$moduleName-$menuName")
    ctrlName="$(tr '[:upper:]' '[:lower:]' <<<${name_upper:0:1})${name_upper:1}"
    ctrlName+="Ctrl"

    ctrl="(function () {
    'use strict';
    angular
        .module('app.$moduleName')
        .controller('$ctrlName', $ctrlName);

    /** @ngInject */
    function $ctrlName() {
        debugger
        var TECHDISER_COMPONENT_NAME = "\""$ctrlName"\"";
        var TECHDISER_SERVICE_INFO = {};
        var vm = this;
        vm.loadViewContent = true
    }
})();"

    echo "$ctrl" >$menuName/$jsFileName.ctrl.js
    logString+="write to file $jsFileName.ctrl.js $(pwd)/$menuName\n"
    title_upper=$(sed 's/[^-]\+/\L\u&/g' <<<"$menuName")
    title=${title_upper//-/ }

    html="<div ng-if="\""vm.loadViewContent"\"" class="\""page-layout simple right-sidenav"\"" layout="\""row"\"" style="\""height:100%;"\"">
    <div class="\""center"\"" layout="\""column"\"" style="\""width: 100%;"\"">
        <div layout="\""row"\"" class="\""header md-accent-bg h-50"\"">
            <div class="\""mr-25 font-size-20 font-weight-900"\"" layout="\""row"\"" layout-align="\""start center"\"">
                <span>$title</span>
            </div>
            <td-common-detail-prev-next un-save-state="\""unSaveState"\"" on-save="\""vm.saveHandlerService.save()"\""></td-common-detail-prev-next>
        </div>
        <div class="\""scrollable"\"" layout="\""row"\"" flex ms-scroll>
            <h1>
                <center>Simple Workspace Layout<br>Your Content Here (ms-scroll with proper heght is given)</center>
            </h1>
        </div>
    </div>
</div>"
    echo "$html" >$menuName/$menuName.html
    logString+="write to file $menuName.html $(pwd)/$menuName\n"
}

infoMenuLevel3() {

    name_upper=$(sed -r 's/(^|-)(\w)/\U\2/g' <<<"$moduleName-$menuName")
    ctrlName="$(tr '[:upper:]' '[:lower:]' <<<${name_upper:0:1})${name_upper:1}"
    ctrlName+="Ctrl"

    ctrl="(function () {
    'use strict';
    angular
        .module('app.$moduleName')
        .controller('$ctrlName', $ctrlName);

    /** @ngInject */
    function $ctrlName() {
        debugger
        var TECHDISER_COMPONENT_NAME = "\""$ctrlName"\"";
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

    echo "$ctrl" >$menuName/$jsFileName.ctrl.js
    logString+="write to file $jsFileName.ctrl.js $(pwd)/$menuName\n"
    title_upper=$(sed 's/[^-]\+/\L\u&/g' <<<"$menuName")
    title=${title_upper//-/ }

    html="<div ng-if="\""vm.loadViewContent"\"" class="\""page-layout simple right-sidenav"\"" layout="\""row"\"" style="\""height:100%;"\"">
    <div class="\""center"\"" layout="\""column"\"" style="\""width: 100%;"\"">
        <div layout="\""row"\"" class="\""header md-accent-bg h-50"\"">
            <div class="\""mr-25 font-size-20 font-weight-900"\"" layout="\""row"\"" layout-align="\""start center"\"">
                <span>$title</span>
            </div>
            <td-common-detail-prev-next un-save-state="\""unSaveState"\"" on-save="\""vm.saveHandlerService.save()"\""></td-common-detail-prev-next>
        </div>
        <div class="\""scrollable"\"" layout="\""row"\"" flex ms-scroll>
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

                <div class="\""scrollable"\"" layout="\""column"\"" style="\""height: 100%;"\"" flex ms-scroll>
                    <h1>
                        <center>Info Menu Level 3 Layout<br>WorkSpace Component here (ms-scroll enabled with proper height)<br>{{vm.selectedObj.title}}</center>
                    </h1>
                </div>
            </div>
        </div>
    </div>
</div>"

    echo "$html" >$menuName/$menuName.html
    logString+="write to file $menuName.html $(pwd)/$menuName\n"
}

infoMenuLevel1() {

    name_upper=$(sed -r 's/(^|-)(\w)/\U\2/g' <<<"$moduleName-$menuName")
    ctrlName="$(tr '[:upper:]' '[:lower:]' <<<${name_upper:0:1})${name_upper:1}"
    ctrlName+="Ctrl"

    ctrl="(function () {
    'use strict';
    angular
        .module('app.$moduleName')
        .controller('$ctrlName', $ctrlName);

    /** @ngInject */
    function $ctrlName() {
        debugger
        var TECHDISER_COMPONENT_NAME = "\""$ctrlName"\"";
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

    echo "$ctrl" >$menuName/$jsFileName.ctrl.js
    logString+="write to file $jsFileName.ctrl.js $(pwd)/$menuName\n"
    title_upper=$(sed 's/[^-]\+/\L\u&/g' <<<"$menuName")
    title=${title_upper//-/ }

    html="<div ng-if="\""vm.loadViewContent"\"" class="\""page-layout simple right-sidenav"\"" layout="\""row"\"" style="\""height:100%;"\"">
    <div class="\""center"\"" layout="\""column"\"" style="\""width: 100%;"\"">
        <div layout="\""row"\"" class="\""header md-accent-bg h-50"\"">
            <div class="\""mr-25 font-size-20 font-weight-900"\"" layout="\""row"\"" layout-align="\""start center"\"">
                <span>$title</span>
            </div>
            <td-common-detail-prev-next un-save-state="\""unSaveState"\"" on-save="\""vm.saveHandlerService.save()"\""></td-common-detail-prev-next>
        </div>
        <div class="\""scrollable"\"" layout="\""row"\"" flex ms-scroll>
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

                <div class="\""scrollable"\"" layout="\""column"\"" style="\""height: 100%;"\"" flex ms-scroll>
                    <h1>
                        <center>Info Menu Level 1 Layout<br>Your Content Here (ms-scroll with proper heght is given)<br>{{vm.selectedObj.title}}</center>
                    </h1>
                </div>
            </div>
        </div>
    </div>
</div>"

    echo "$html" >$menuName/$menuName.html
    logString+="write to file $menuName.html $(pwd)/$menuName\n"
}

infoMenuLevel2() {

    name_upper=$(sed -r 's/(^|-)(\w)/\U\2/g' <<<"$moduleName-$menuName")
    ctrlName="$(tr '[:upper:]' '[:lower:]' <<<${name_upper:0:1})${name_upper:1}"
    ctrlName+="Ctrl"

    ctrl="(function () {
    'use strict';
    angular
        .module('app.$moduleName')
        .controller('$ctrlName', $ctrlName);

    /** @ngInject */
    function $ctrlName() {
        debugger
        var TECHDISER_COMPONENT_NAME = "\""$ctrlName"\"";
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

    echo "$ctrl" >$menuName/$jsFileName.ctrl.js
    logString+="write to file $jsFileName.ctrl.js $(pwd)/$menuName\n"
    title_upper=$(sed 's/[^-]\+/\L\u&/g' <<<"$menuName")
    title=${title_upper//-/ }

    html="<div ng-if="\""vm.loadViewContent"\"" class="\""page-layout simple right-sidenav"\"" layout="\""row"\"" style="\""height:100%;"\"">
    <div class="\""center"\"" layout="\""column"\"" style="\""width: 100%;"\"">
        <div layout="\""row"\"" class="\""header md-accent-bg h-50"\"">
            <div class="\""mr-25 font-size-20 font-weight-900"\"" layout="\""row"\"" layout-align="\""start center"\"">
                <span>$title</span>
            </div>
            <td-common-detail-prev-next un-save-state="\""unSaveState"\"" on-save="\""vm.saveHandlerService.save()"\""></td-common-detail-prev-next>
        </div>
        <div class="\""scrollable"\"" layout="\""row"\"" flex ms-scroll>
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
            
                <div class="\""scrollable"\"" layout="\""column"\"" style="\""height: 100%;"\"" flex ms-scroll>
                    <h1>
                        <center>Info Menu Level 2 Layout<br>Your Content Here (ms-scroll with proper heght is given)<br>{{vm.selectedObj.title}}</center>
                    </h1>
                </div>
            </div>
        </div>
    </div>
</div>"

    echo "$html" >$menuName/$menuName.html
    logString+="write to file $menuName.html $(pwd)/$menuName\n"
}

sideNavWorkSpace() {

    name_upper=$(sed -r 's/(^|-)(\w)/\U\2/g' <<<"$moduleName-$menuName")
    ctrlName="$(tr '[:upper:]' '[:lower:]' <<<${name_upper:0:1})${name_upper:1}"
    ctrlName+="Ctrl"

    title_upper=$(sed 's/[^-]\+/\L\u&/g' <<<"$menuName")
    title=${title_upper//-/ }

    ctrl="(function () {
    'use strict';
    angular
        .module('app.$moduleName')
        .controller('$ctrlName', $ctrlName);

    /** @ngInject */
    function $ctrlName(\$mdSidenav) {
        debugger
        var TECHDISER_COMPONENT_NAME = "\""$ctrlName"\"";
        var TECHDISER_SERVICE_INFO = {};
        var vm = this;
        vm.loadViewContent = true
        vm.leftNavPined = true
        vm.headerTitle = "\""$title"\""
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
            "\""subMenuHeader"\"": "\""Side Nav"\"",
            "\""menuList"\"": [
                {
                    "\""title"\"": "\""Menu One"\"",
                    "\""state"\"": "\""state"\""
                },
                {
                    "\""title"\"": "\""Menu Two"\"",
                    "\""child"\"": [
                        {
                            "\""title"\"": "\""Sub Menu 1"\"",
                            "\""child"\"": [
                                {
                                    "\""title"\"": "\""Child Menu 1"\"",
                                    "\""state"\"": "\""state"\""
                                },
                                {
                                    "\""title"\"": "\""Child Menu 2"\"",
                                    "\""state"\"": "\""state"\""
                                },
                            ]
                        },
                        {
                            "\""title"\"": "\""Sub Menu 2"\"",
                            "\""state"\"": "\""state"\""
                        },
                    ]
                }
            ]
        }
    }
})();"

    echo "$ctrl" >$menuName/$jsFileName.ctrl.js
    logString+="write to file $jsFileName.ctrl.js $(pwd)/$menuName\n"

    html="<div id="\""common-detail"\"" ng-if="\""vm.loadViewContent"\"" class="\""page-layout simple right-sidenav"\"" layout="\""row"\"" style="\""height: 100%;"\"">
    <md-sidenav class="\""left-sidenav w-205"\"" md-component-id="\""left-sidenav"\"" md-is-locked-open="\""\$mdMedia('gt-md') && vm.leftNavPined "\"" ng-include="\""'app/main/common/details/sidenavs/leftSideNav.html'"\"" ms-sidenav-helper style="\""overflow:hidden;"\"">
    </md-sidenav>

    <div class="\""center"\"" layout="\""column"\"" flex>
        <div layout="\""row"\"" class="\""header md-accent-bg"\"">
            <md-button class="\""md-icon-button main-sidenav-toggle"\"" ng-click="\""vm.toggleSidenav('left-sidenav')"\"">
                <md-icon md-font-icon="\""icon-backburger"\"" class="\""icon"\"" ng-class="\""{'transform-180' : !vm.leftNavPined}"\""></md-icon>
            </md-button>

            <div layout="\""row"\"" layout-align="\""start center"\"" flex>
                <div class="\""mr-25 font-size-18"\"" layout="\""row"\"" layout-align="\""start center"\"" ng-if="\""vm.headerTitle"\"">
                    <span>{{vm.headerTitle}}</span>
                </div>
            </div>
        </div>
        <div class="\""scrollable"\"" layout="\""row"\"" ui-view="\""uiView"\"" style="\""width: 100%;height:100%;"\"" ms-scroll>
            <h1>
                <center>side-nav workspace <br> uiView Content Here <br> use save directive seperately for diffrent menu <br>(ms-scroll with proper heght is given)</center>
            </h1>
        </div>
    </div>
</div>"

    echo "$html" >$menuName/$menuName.html
    logString+="write to file $menuName.html $(pwd)/$menuName\n"
}

defaultView() {
    name_upper=$(sed -r 's/(^|-)(\w)/\U\2/g' <<<"$moduleName-$menuName")
    ctrlName="$(tr '[:upper:]' '[:lower:]' <<<${name_upper:0:1})${name_upper:1}"
    ctrlName+="Ctrl"

    ctrl="(function () {
    'use strict';
    angular
        .module('app.$moduleName')
        .controller('$ctrlName', $ctrlName);

    /** @ngInject */
    function $ctrlName() {
        debugger
        var TECHDISER_COMPONENT_NAME = "\""$ctrlName"\"";
        var TECHDISER_SERVICE_INFO = {};
        var vm = this;
        vm.loadViewContent = true
    }
})();"

    echo "$ctrl" >$menuName/$jsFileName.ctrl.js
    logString+="write to file $jsFileName.ctrl.js $(pwd)/$menuName\n"
    title_upper=$(sed 's/[^-]\+/\L\u&/g' <<<"$menuName")
    title=${title_upper//-/ }
    echo "<h1><center>Default View<br>This Is $title Index Page<center></h1>" >$menuName/$menuName.html
    logString+="write to file $menuName.html $(pwd)/$menuName\n"
}

addModuleNameToIndexModule() {
    if grep -q "'app.$moduleName'" ../../index.module.js; then
        echo "Module "\""$moduleName"\"" is already exist"
    else
        sed -i '1h;1!H;$!d;x;s/.*'\''[^\n]*/&,\n            '\''app.'"$moduleName"''\''/' ../../index.module.js
        logString+="modified file index.module.js\n"
    fi
}

writeToModuleFile() {
    moduleFileName=${moduleName//-/.}
    echo "$module" >$moduleFileName.module.js
    logString+="write to file $moduleFileName.module.js $(pwd)\n"
}

addLastPortionOfModule() {
    last="

    }

})();"

    module+=$last
}

logString="\n"

cd src/app/main/
echo "Module Name(spinal-case)"?
read moduleName
echo "Menu Names(Use spinal-case. For multiple menu separate using space)?"
read menuNames

module="(function () {
    'use strict';

    angular
        .module('app.$moduleName', [])
        .config(config);

    /** @ngInject */
    function config(\$stateProvider, msNavigationServiceProvider) {
        \$stateProvider
            .state('app.$moduleName', {
                abstract: true,
                url: '/$moduleName'
            })"

mkdir $moduleName
logString+="created folder $moduleName $(pwd)\n"
cd $moduleName

echo -e "\n\nTo use layout for menu use option\n 1: Simple Workspace\n 2: Info Menu Workspace\n 3: Side Nav workspace\nPress enter for none\n"

for menuName in $menuNames; do
    mkdir $menuName
    logString+="created folder $menuName $(pwd)\n"
    touch $menuName/$menuName.html
    logString+="created file $menuName.html $(pwd)/$menuName\n"
    jsFileName=${menuName//-/.}
    touch $menuName/$jsFileName.ctrl.js
    logString+="created file $jsFileName.ctrl.js $(pwd)/$menuName\n"

    echo -e "\n"
    echo -n "$menuName layout : "
    read layoutOption

    case $layoutOption in

    1)
        simpleWorkSpace
        ;;

    2)
        echo -n "$menuName info menu level : "
        read infoMenuLevel
        case $infoMenuLevel in

        1)
            infoMenuLevel1
            ;;

        2)
            infoMenuLevel2
            ;;

        3)
            infoMenuLevel3
            ;;

        *)
            infoMenuLevel1
            ;;
        esac
        ;;

    3)
        sideNavWorkSpace
        ;;

    *)
        defaultView
        ;;
    esac

done

for menuName in $menuNames; do
    createMenuState
done

addModuleSaveItem

for menuName in $menuNames; do
    saveMenuItem
done

addLastPortionOfModule

writeToModuleFile

addModuleNameToIndexModule
echo -e "$logString"
echo -e "done\n"