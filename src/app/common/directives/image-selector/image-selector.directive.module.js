(function () {
    'use strict';

    angular
        .module('app.common')
        .directive('msbImageSelector', msbImageSelectorDirective);

    /** @ngInject */
    function msbImageSelectorDirective() {
        return {
            restrict: 'E',
            scope: {
                labelText: '=',
                helperItems: '=',
                maxSize: '=',
                onUpload: '&',
            },
            controller: "msbImageSelectorDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/common/directives/image-selector/image-selector-directive.html'

        };
    }

})();