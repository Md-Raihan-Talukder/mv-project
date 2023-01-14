(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdDateTimePicker', DateTimePicker);

    /** @ngInject */
    function DateTimePicker() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                dateTime: '=',
                dateTimeText: '=',
                isTime: '=',
                isDate: '=',
                isDisable: '=',
                pickerClass: '=',
                noWidth: '='
            },
            link: function (scope, element, attrs) {

            },
            controller: "DateTimePickerDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/datetime/datetime.directive.html'

        };
    }
})();