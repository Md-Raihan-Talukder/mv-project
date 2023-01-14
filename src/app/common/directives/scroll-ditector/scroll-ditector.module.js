(function () {
    'use strict';

    angular
        .module('app.common')
        .directive('scrollDitector', scrollDitector);

    /** @ngInject */
    function scrollDitector() {
        return {
            restrict: 'A',
            scope: {
                callback: '&onScroll',
            },
            link: function (scope, elem, attrs) {
                $(elem).on('scroll', function (evt) {
                    if (scope.callback) {
                        scope.callback({ evt: evt });
                    }
                });
            }
        }
    }

})();