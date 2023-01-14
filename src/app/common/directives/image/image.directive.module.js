(function () {
    'use strict';

    angular
        .module('app.common')
        .directive('msbImageLoader', msbImageLoaderDirective);

    /** @ngInject */
    function msbImageLoaderDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                selectionType: '=',
                itemList: '=?',
                imageTitle: '=',
                imageObject: '=',
                imageWidth: '=',
                imageHeight: '=',
                doNotShow: '=',
                maxSize: '=',
                onUpload: '&',
                onRemove: '&'
            },
            controller: "msbImageLoaderDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/common/directives/image/image-directive.html'
        };
    }
})();