(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('msbXlDirectiveController', msbXlDirectiveController);

    /** @ngInject */
    function msbXlDirectiveController($scope, $timeout) {
        var vm = this;

        init();

        function init() {


            vm.settings = {

                stretchH: 'all',
                width: 806,
                autoWrapRow: true,
                height: 487,
                manualRowResize: true,
                manualColumnResize: true,
                rowHeaders: true,
                colHeaders: true,
                manualRowMove: true,
                manualColumnMove: true,
                contextMenu: true,
                columnSorting: true
            };
        }
    }
})();