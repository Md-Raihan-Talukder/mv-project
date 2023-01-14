(function () {
    'use strict';

    angular
        .module('app.common')
        .directive('msbImageViewer', msbImageViewerDirective);

    /** @ngInject */
    function msbImageViewerDirective() {
        return {
            restrict: 'E',
            scope: {
                items: '=',
                helperItems: '=',
                onRemove: '&',
            },
            controller: "msbImageViewerDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/common/directives/image-viewer/image-viewer-directive.html'

        };
    }

})();