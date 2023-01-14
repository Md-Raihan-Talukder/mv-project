(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('RecurringOptionsDirectiveController', RecurringOptionsDirectiveController);

    /** @ngInject */

    function RecurringOptionsDirectiveController($scope, utilService, CONSTANT_DATE_TIME_FORMATS) {
        var vm = this;
        vm.recurringEveryValues = utilService.createNumberRange(1, 30);
        $scope.schedule.recurringOptions.repeatEvery = $scope.schedule.recurringOptions.repeatEvery ?
            $scope.schedule.recurringOptions.repeatEvery : 1;
        vm.getEveryText = getEveryText;
        vm.getRepeatOn = getRepeatOn;
        vm.getDayName = getDayName;
        vm.getRepeatAt = getRepeatAt;
        vm.modeChange = modeChange;

        var startDate = new Date();
        startDate.setHours(9);
        startDate.setMinutes(0);

        var endDate = new Date();
        endDate.setHours(18);
        endDate.setMinutes(0);


        $scope.schedule.recurringOptions.startDateTime = utilService.formatDateValue(startDate, CONSTANT_DATE_TIME_FORMATS.CONSTANT_SYS_DATE_FORMAT + CONSTANT_DATE_TIME_FORMATS.CONSTANT_DATE_TIME_SEPARATOR + CONSTANT_DATE_TIME_FORMATS.CONSTANT_SYS_TIME_FORMAT);
        $scope.schedule.recurringOptions.endDateTime = utilService.formatDateValue(endDate, CONSTANT_DATE_TIME_FORMATS.CONSTANT_SYS_DATE_FORMAT + CONSTANT_DATE_TIME_FORMATS.CONSTANT_DATE_TIME_SEPARATOR + CONSTANT_DATE_TIME_FORMATS.CONSTANT_SYS_TIME_FORMAT);

        function modeChange() {
            $scope.schedule.recurringOptions.recurringValues = [];
            $scope.schedule.recurringOptions.recurringDays = [];
        }

        function getEveryText() {
            var val = "";
            switch ($scope.schedule.recurringOptions.recurringMode) {
                case 'daily':
                    val = "day";
                    break;
                case 'weekly':
                    val = "week";
                    break;
                case 'monthly':
                    val = "month";
                    break;
                case 'yearly':
                    val = "year";
                    break;
                default:
                    break;
            }

            if ($scope.schedule.recurringOptions.repeatEvery > 1) {
                val += "s";
            }

            return val;

        }
        function getDayName(dayVal) {
            if ($scope.schedule.recurringOptions.recurringMode === "weekly") {
                var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                return dayNames[dayVal - 1];
            }

            if ($scope.schedule.recurringOptions.recurringMode === "yearly") {
                var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return monthNames[dayVal - 1];
            }


            return dayVal
        }

        function getRepeatAt() {
            return utilService.createNumberRange(1, 30);
        }


        function getRepeatOn() {
            var val;
            switch ($scope.schedule.recurringOptions.recurringMode) {
                case 'daily':
                    val = 1;
                    break;
                case 'weekly':
                    val = 7;
                    break;
                case 'monthly':
                    val = 30;
                    break;
                case 'yearly':
                    val = 12;
                    break;
                default:
                    break;
            }

            return utilService.createNumberRange(1, val);

        }
    }

})();
