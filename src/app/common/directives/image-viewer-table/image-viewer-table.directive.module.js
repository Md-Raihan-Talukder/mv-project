(function () {
    'use strict';

    angular
        .module('app.common')
        .directive('msbImageViewerTable', msbImageViewerTableDirective);

    /** @ngInject */
    function msbImageViewerTableDirective() {
        return {
            restrict: 'E',
            scope: {
                isRound: '=',
                itemMode: '=',
                item: '=',
                helperItems: '=',
                onRemove: '&',
                onUpload: '&',
            },
            controller: "msbImageViewerTableDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/common/directives/image-viewer-table/image-viewer-table-directive.html'

        };
    }

})();