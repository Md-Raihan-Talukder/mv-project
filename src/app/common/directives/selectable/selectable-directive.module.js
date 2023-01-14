(function () {
    'use strict';

    angular
        .module('app.common')
        .directive('msbSelectable', MsbSelectableDirective);

    /** @ngInject */
    function MsbSelectableDirective() {
        return {
            restrict: 'E',
            scope: {
                itemMode: '=',
                type: '=',
                info: '=',
                singleSelection: '=',
                slectType: '=',
                selectId: '=',
                helperItems: '=',
                selectedItems: '=?',
                onSelect: '&'
            },
            controller: "MsbSelectableController",
            templateUrl: 'app/common/directives/selectable/selectable.html',
            controllerAs: 'vm'

        };
    }

})();