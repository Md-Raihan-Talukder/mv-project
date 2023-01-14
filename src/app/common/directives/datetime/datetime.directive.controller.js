(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('DateTimePickerDirectiveController', DateTimePickerDirectiveController);

    /** @ngInject */

    function DateTimePickerDirectiveController($scope, msbDateTimeService, CONSTANT_DATE_TIME_CONSTANTS) {
        var vm = this;
        vm.DateTime = $scope.dateTime ? msbDateTimeService.convertToDateTime($scope.dateTime) : $scope.dateTime;
        vm.date = msbDateTimeService.formatDateValue(vm.DateTime);
        vm.time = msbDateTimeService.formatDateValue(vm.DateTime, 'hh:mm tt');


        $scope.$watch('vm.date', function () {
            makeDate();
        });

        $scope.$watch('vm.time', function () {
            makeDate();
        });

        function makeDate() {
            var format = CONSTANT_DATE_TIME_CONSTANTS.CONSTANT_SYS_DATE_FORMAT + CONSTANT_DATE_TIME_CONSTANTS.CONSTANT_DATE_TIME_SEPARATOR + CONSTANT_DATE_TIME_CONSTANTS.CONSTANT_SYS_TIME_FORMAT;
            var timestamp = Date.parse(msbDateTimeService.convertToSysDate(vm.date))

            if (isNaN(timestamp)) {
                vm.DateTime = null;
                $scope.dateTime = null;
                return;
            }

            var dateTime = new Date(timestamp);
            if ($scope.isTime) {

                var timeReg = /(\d+)\:(\d+) (\w+)/;
                var parts = vm.time.match(timeReg);

                if (!parts || parts.length < 4) {
                    vm.DateTime = dateTime;
                    $scope.dateTime = msbDateTimeService.formatDateValue(vm.DateTime, format);
                    return;
                }

                var hours = /am/i.test(parts[3]) ?
                    function (am) { return am < 12 ? am : 0 }(parseInt(parts[1], 10)) :
                    function (pm) { return pm < 12 ? pm + 12 : 12 }(parseInt(parts[1], 10));

                var minutes = parseInt(parts[2], 10);
                dateTime.setHours(hours);
                dateTime.setMinutes(minutes);
            }

            vm.DateTime = dateTime;
            $scope.dateTime = msbDateTimeService.formatDateValue(vm.DateTime, format);

        }

    }

})();
