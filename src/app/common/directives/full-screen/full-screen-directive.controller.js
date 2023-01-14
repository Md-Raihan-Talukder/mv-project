(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('msbFullScreenDirectiveController', msbFullScreenDirectiveController);

    /** @ngInject */
    function msbFullScreenDirectiveController($rootScope) {
        var vm = this;
        vm.makeFullScreen = makeFullScreen;
        vm.iconClass = "icon-fullscreen";
        vm.toolTip = "Full screen"

        function makeFullScreen() {
            $rootScope.isTdFullScreen = !$rootScope.isTdFullScreen;
            vm.iconClass = $rootScope.isTdFullScreen ? "icon-fullscreen-exit" : "icon-fullscreen";
            vm.toolTip = $rootScope.isTdFullScreen ? "Exit full screen" : "Full screen";
        }

    }
})();