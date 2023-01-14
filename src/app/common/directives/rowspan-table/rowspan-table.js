(function () {
    'use strict';

    angular
        .module('app.common')
        .directive('msbRowSpanTableStrip', msbRowSpanTableStripDirective);

    function msbRowSpanTableStripDirective() {
        return {
            restrict: 'E',
            scope: {
                strips: '=',
                stripDef: '='
            },
            controller: "msbRowSpanTableStripDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/common/directives/rowspan-table/rowspan-table.html'

        };
    }

})();