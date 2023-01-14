(function () {
    'use strict';
    angular
        .module('app.common')
        .directive('tdCalender', tdCalender)
        .controller('CalenderDialogController', CalenderDialogController);

    /** @ngInject */
    function tdCalender() {
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
            controller: "CalenderDialogController",
            controllerAs: 'vm',
            templateUrl: 'app/common/directives/calender/calender.directive.html'

        };
    }

    function CalenderDialogController($mdDialog, sessionId, msbCommonApiService, msbDateTimeService, addOption) {

        var vm = this;
        vm.sessionId = sessionId;
        vm.closeDialog = closeDialog;
        vm.addOption = addOption;
        vm.toViewController = false;
        vm.addHoliday = addHoliday;
        vm.holidays = [];
        vm.allHolidayData = [];
        vm.removeItemFromCalendarData = removeItemFromCalendarData;
        var pathPrefix = "/[TECHDISER_ID=$calendarID]";

        init();

        function init() {

            vm.calendarData = [
                {
                    "sessionId": vm.sessionId,
                    "holidayId": "01.01.202010.01.20209Eid",
                    "startDate": "03.01.2020",
                    "endDate": "05.01.2020",
                    "datesBetween": [
                        "03.01.2020",
                        "04.01.2020",
                        "05.01.2020"
                    ],
                    "numberOfHolidays": 3,
                    "reason": "Shab-e-Barat"
                },
                {
                    "sessionId": vm.sessionId,
                    "holidayId": "10.01.202021.01.202011Eid",
                    "startDate": "12.01.2020",
                    "endDate": "14.01.2020",
                    "datesBetween": [
                        "12.01.2020",
                        "13.01.2020",
                        "14.01.2020"
                    ],
                    "numberOfHolidays": 3,
                    "reason": "Eid-ul-Fitr"
                }
            ];
            vm.holiday = [
                {

                    "startDate": "25.01.2020",
                    "endDate": "27.01.2020",
                    "reason": "Eid-ul-Fitr"
                }
            ];
            vm.toViewController = true;

            // calendarData();
        }

        function calendarData() {
            var path = pathPrefix + "/";
            var params = [{ "key": "calendarID", "value": "order1Holiday" }];
            msbCommonApiService.getItems("CALENDAR", null, function (data) {
                if (data) {
                    vm.calender = data;
                }
                vm.allHolidayData = vm.calender;
                holidayData(vm.allHolidayData);
                vm.toViewController = true;
            }, null, true, null, "clientUrl", path, params);
        }

        function getDaysBetweenTwoDates(startDate, endDate) {

            var datesBetween = msbDateTimeService.getDatesBtnStartAndEndDates(startDate, endDate);
            return datesBetween.length;
        }

        function getDaysBetweendates(startDate, endDate) {
            var datesBetween = msbDateTimeService.getDatesBtnStartAndEndDates(startDate, endDate);
            // datesBetween.splice(0,1);
            // datesBetween.splice(datesBetween.length-1,1);
            return datesBetween;
        }

        function prepareCombineArrayOfDatesOfHolidays(proEndDate) {
            var combineArray = [];
            if (proEndDate) {
                proEndDate.forEach(function (proEndDateItem) {
                    proEndDateItem.calender.forEach(function (calenderItem) {
                        if (calenderItem) {
                            calenderItem.totalDatesIncludingStartAndEndDate.forEach(function (dateItem) {
                                combineArray.push(dateItem);
                            })
                        }
                    })
                })
            }
            return combineArray;
        }

        function removeDuplicateItems(origin) {
            var unique = origin.filter(function (item, pos) {
                return origin.indexOf(item) == pos;
            });
            return unique;
        }

        function addHoliday() {

            if (vm.holiday) {
                vm.holiday.forEach(function (holidayItem) {
                    var obj = {};
                    obj.startDate = holidayItem.startDate;
                    obj.sessionId = vm.sessionId;
                    obj.endDate = holidayItem.endDate;
                    obj.numberOfHolidays = getDaysBetweenTwoDates(obj.startDate, obj.endDate);
                    obj.holidayId = holidayItem.startDate + holidayItem.endDate + obj.numberOfHolidays + holidayItem.reason;
                    obj.reason = holidayItem.reason;
                    obj.datesBetween = getDaysBetweendates(obj.startDate, obj.endDate);
                    vm.calendarData.push(obj);
                });
            }
        }

        function getIndexOfRemovingItem(array, id) {
            var index = array.map(function (sessionsItem) {
                return sessionsItem.sessionId;
            }).indexOf(id);
            return index;
        }

        function removeItemFromCalendarData(holidayId) {

            var index = getIndexOfRemovingItem(vm.calendarData, holidayId);

            if (index) {
                vm.calendarData.splice(index, 1);
            }
        }

        function holidayData(holidays) {
            if (holidays) {
                holidays.forEach(function (holiday) {
                    holidayDataPrepare(holiday);
                });
            }
        }

        function holidayDataPrepare(holiday) {
            var info = {
                "start": msbDateTimeService.formatDateValue(holiday.start, "dd.MM.yyyy"),
                "end": msbDateTimeService.formatDateValue(holiday.end, "dd.MM.yyyy"),
                "days": holiday.days,
                "reason": holiday.reason
            }

            vm.holidays.push(info);
        }

        function saveHoliday(holiday) {
            vm.allHolidayData.push(holiday);
            msbCommonApiService.saveInnerItem("order1Holiday", vm.allHolidayData, "CALENDAR", "clientUrl", "/holidays", [], function (data) {
                if (data) {

                }
                calendarData();
            }, null, null, true);
        }

        function closeDialog() {
            $mdDialog.hide(vm.calendarData);
        }

    }
})();
