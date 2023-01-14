(function () {
    'use strict';

    angular
        .module('app.common')
        .directive('msbSelect', MsbSelectDirective);

    /** @ngInject */
    function MsbSelectDirective() {
        return {
            restrict: 'A',
            scope: {
                singleSelection: '=',
                slectType: '=',
                selectId: '=',
                selectedItems: '=?',
                onSelect: '&'
            },
            link: function (scope, element, attrs) {
                element.bind('click', function () {
                    scope.selectItem();
                });
            },
            controller: "MsbSelectController",
            controllerAs: 'vm'

        };
    }

})();
