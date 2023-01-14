(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('WeekEndDialogController', WeekEndDialogController);

    /** @ngInject */

    function WeekEndDialogController($mdDialog, $scope, utilService, CONSTANT_DATE_TIME_FORMATS, dialogData, msUtils) {
        var vm = this;
        vm.closeDialog = closeDialog;
        vm.currentYearMonth = dialogData.currentYearMonth;
        vm.dayName = dialogData.dayName
        vm.eventSources = dialogData.eventSources;
        vm.start = dialogData.start;
        vm.end = dialogData.end;
        vm.currentYearMonthDate = angular.copy(dialogData.currentYearMonthDate);
        vm.days = [];
        vm.formatedDays = [];
        vm.requiredDays = [];
        vm.fullYear = true;
        vm.calendarEvent = dialogData.calendarEvent;
        vm.format = CONSTANT_DATE_TIME_FORMATS.CONSTANT_SYS_DATE_FORMAT + CONSTANT_DATE_TIME_FORMATS.CONSTANT_DATE_TIME_SEPARATOR + CONSTANT_DATE_TIME_FORMATS.CONSTANT_SYS_TIME_FORMAT;

        vm.saveEvent = saveEvent;
        vm.deleteEvent = deleteEvent;
        vm.deleteDay = deleteDay;

        init();

        function deleteDay(day) {
            var index = vm.requiredDays.indexOf(day)
            if (index >= 0) {
                vm.requiredDays.splice(index, 1);
                return true;
            }
        }

        function deleteEvent() {
            closeDialog();
            dialogData.onDelete({ selectedDate: vm.currentYearMonthDate, eventId: vm.calendarEvent.id });
        }

        function saveEvent() {
            var holidays = [];
            var holiday = {};
            if (vm.isHoliDay) {
                holiday = {
                    id: vm.calendarEvent ? vm.calendarEvent.id : msUtils.guidGenerator(),
                    isNew: !vm.calendarEvent,
                    title: vm.holidayTitle,
                    start: utilService.convertToDateTime(vm.startDate),
                    end: utilService.convertToDateTime(vm.endDate).setHours(18)
                }

                holidays.push(holiday);
            } else {
                for (var i = 0; i < vm.formatedDays.length; i++) {
                    holiday = {
                        id: msUtils.guidGenerator(),
                        title: "Weekend",
                        start: utilService.convertToDateTime(vm.formatedDays[i]),
                        end: utilService.convertToDateTime(vm.formatedDays[i]).setHours(18)
                    }

                    holidays.push(holiday);
                }
            }

            closeDialog();
            dialogData.onSave({ selectedDate: vm.currentYearMonthDate, days: holidays });

        }

        function init() {
            if (vm.calendarEvent) {
                vm.isHoliDay = true;
                vm.title = "Update Holidays"
                vm.holidayTitle = vm.calendarEvent.title;
                vm.startDate = utilService.formatDateValue(new Date(vm.start), vm.format);
                vm.endDate = utilService.formatDateValue(new Date(vm.end), vm.format);
            } else {
                if (!vm.start) {
                    vm.isHoliDay = false;
                    vm.title = "Set Weekends";
                    vm.holidayTitle = "Weekend";
                    var strSplited = vm.currentYearMonth.split('-');
                    var year = strSplited[0] * 1;
                    var month = strSplited[1] * 1 - 1;
                    if (!vm.fullYear) {
                        getDaysInMonth(year, month);
                    } else {
                        for (var i = 0; i < 12; i++) {
                            getDaysInMonth(year, i);
                        }

                    }
                }

                if (vm.start) {
                    vm.isHoliDay = true;
                    vm.title = "Set Holidays"
                    getDaysInRange()
                    vm.startDate = vm.requiredDays[0];
                    vm.endDate = vm.requiredDays[vm.requiredDays.length - 1];
                }
            }
        }

        function closeDialog() {
            $mdDialog.hide();
        }

        function getDaysInRange() {

            var date = new Date(vm.start._d);
            var endDate = new Date(vm.end._d);

            while (date < endDate) {

                vm.requiredDays.push(utilService.formatDateValue(new Date(date), vm.format));

                vm.days.push(new Date(date));
                date.setDate(date.getDate() + 1);
            }
        }

        function hasWeekend(currentDate) {

            var events = $.grep(vm.eventSources[0], function (event) {

                var start = new Date(event.start);
                var end = new Date(event.end);
                if (event.title === 'Weekend') {
                    if (currentDate >= start && currentDate <= end) {
                        return true;
                    }
                }

            });

            return events.length > 0;

        }


        function getDaysInMonth(year, month) {

            var date = new Date(year, month, 1);

            while (date.getMonth() === month) {

                var dateFormated = utilService.formatDateValue(new Date(date), 'ddd, dd MMM yyyy');

                if (dateFormated.indexOf(vm.dayName) > -1) {
                    if (!hasWeekend(date)) {
                        vm.requiredDays.push(utilService.formatDateValue(new Date(date), 'dddd, dd MMMM yyyy'));
                        vm.formatedDays.push(utilService.formatDateValue(new Date(date), vm.format));
                    }
                }
                vm.days.push(new Date(date));
                date.setDate(date.getDate() + 1);
            }

        }
    }

})();
