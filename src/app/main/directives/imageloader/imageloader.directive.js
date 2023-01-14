(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdImageLoader', ImageLoaderDirective);

    /** @ngInject */
    function ImageLoaderDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                selectionType: '=',
                itemList: '=',
                imageTitle: '=',
                imageObject: '=',
                maxSize: '=',
                onUpload: '&'
            },
            controller: "ImageLoaderDirectiveController",
            controllerAs: 'vm',
            templateUrl: function (el, attr) {
                if (attr) {
                    if (attr.type === 'inform') {
                        return 'app/main/directives/imageloader/imageloader-form.html';
                    } else if (attr.type === 'single') {
                        return 'app/main/directives/imageloader/imageloader-single.html';
                    } else {
                        return 'app/main/directives/imageloader/imageloader.html';
                    }
                }
            }
        };
    }
})();