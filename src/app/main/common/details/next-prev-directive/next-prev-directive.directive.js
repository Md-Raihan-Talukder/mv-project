(function () {
    'use strict';

    angular
        .module('app.common')
        .directive('tdCommonDetailPrevNext', tdCommonDetailPrevNext)
        .controller('CommonDetailPrevNextController', CommonDetailPrevNextController);

    /** @ngInject */
    function tdCommonDetailPrevNext() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                unSaveState: '=',
                onSave: '&',
            },
            controller: "CommonDetailPrevNextController",
            controllerAs: 'vm',
            templateUrl: 'app/main/common/details/next-prev-directive/next-prev-directive.html'
        };
    }

    /** @ngInject */
    function CommonDetailPrevNextController(cmmonDetailService, msbUtilService, $scope, $state) {
        var vm = this;

        vm.onSave = onSave;
        vm.gotoDir = gotoDir;
        vm.updateSaveAnd = updateSaveAnd;

        init();

        function init() {
            var menu = cmmonDetailService.getMenuList();
            vm.menuList = menu.menuList;
            vm.stateName = menu.stateName;
            vm.saveAnd = menu.saveAnd;

        }

        function updateSaveAnd() {
            vm.saveAnd = !vm.saveAnd;
            cmmonDetailService.updateSaveAnd(vm.saveAnd);
        }

        function onSave() {
            $scope.onSave();
        }

        function gotoDir(dir) {
            var func = dir === "next" ? goToNext : goToPrev;
            if (vm.saveAnd) {
                $scope.onSave({ callBack: func });
            } else {
                func();
            }
        }

        function goToNext() {

            var index = cmmonDetailService.getSelectedIndex();
            if (index < vm.menuList.length - 1) {
                goToPage(vm.menuList[index + 1].state, vm.menuList[index + 1].url);
            }
        }

        function goToPrev() {
            var index = cmmonDetailService.getSelectedIndex();
            if (index > 0) {
                goToPage(vm.menuList[index - 1].state, vm.menuList[index - 1].url);
            }
        }

        function goToPage(s, url) {
            if (s && url) {
                cmmonDetailService.updateSelected(s, url);
                var state = vm.stateName + "." + s;
                $state.go(state, { "url": url }, { "location": "replace" });

            }
        }


    }



})();