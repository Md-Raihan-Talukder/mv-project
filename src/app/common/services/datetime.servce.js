(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('msbDateTimeService', msbDateTimeService);

    /** @ngInject */
    function msbDateTimeService(msbUtilService, CONSTANT_DATE_TIME_CONSTANTS, CONSTANT_APP_MODE) {

        var vm = this;
        var service = {
            formatDateValue: formatDateValue,
            convertToDateTime: convertToDateTime,
            convertToDate: convertToDate,
            isDateObj: isDateObj,
            addDays: addDays,
            previousDay: previousDay,
            nextDay: nextDay,
            dateSorter: dateSorter,
            dateDifferenceFormated: dateDifferenceFormated,
            dateDifference: dateDifference,
            convertToSysDate: convertToSysDate,
            monthDifference: monthDifference,
            checkOverlap: checkOverlap,
            isLeapYear: isLeapYear,
            daysInMonth: daysInMonth,
            isValidDate: isValidDate,
            isBetween: isBetween,
            createBoardWeek: createBoardWeek,
            getAppModeCurrentDate: getAppModeCurrentDate,
            getDateOfToday: getDateOfToday,
            getDatesBtnStartAndEndDates: getDatesBtnStartAndEndDates,
            listOfDaysWithExtraDays: listOfDaysWithExtraDays
        };

        function previousDay(date) {
            if (date) {
                return formatDateValue(addDays(date, -1), "dd.MM.yyyy");
            }
        }

        function nextDay(date) {
            if (date) {
                return formatDateValue(addDays(date, 1), "dd.MM.yyyy");
            }
        }

        function listOfDaysWithExtraDays(startDate, endDate, pre, post) {
            if (startDate && endDate) {
                var preStart = formatDateValue(addDays(startDate, -pre), "dd.MM.yyyy");
                var postEnd = formatDateValue(addDays(endDate, post), "dd.MM.yyyy");

                return getDatesBtnStartAndEndDates(preStart, postEnd);
            }
        }

        function getDateOfToday() {
            var toDay = new Date();
            return formatDateValue(toDay);
        }

        function getAppModeCurrentDate(date) {
            if (CONSTANT_APP_MODE == "1") {
                if (date) {
                    return convertToDate(date)
                }
            }
            return new Date()
        }

        function createBoardWeek(startDate, endDate, weekend) {
            var days = [], weeks = [];
            weekend = weekend != null ? weekend * 1 : 6;
            startDate = reCalculateStartDate(startDate, weekend);
            endDate = reCalculateEndDate(endDate, weekend);

            var startWeek = 1;
            var currentWeek = 0;
            var week = { date: angular.copy(date), days: [] };


            for (var date = moment(startDate); date.diff(endDate) <= 0; date.add(1, 'days')) {
                var dt = new Date(date);
                var day = {
                    year: dt.getFullYear(),
                    month: dt.getMonth(),
                    day: dt.getDate(),
                    fullDate: dt,
                    date: formatDateValue(dt)
                };

                if (isWeekStartDate(dt, weekend)) {
                    currentWeek += 1;
                }

                if (startWeek !== currentWeek) {
                    weeks.push(week);
                    week = { date: angular.copy(dt), days: [] };
                    startWeek = currentWeek;
                }

                week.days.push(day);

                days.push(day);
            }

            //week = finishWeek(week);
            weeks.push(week);

            return { days: days, weeks: weeks }

        }

        function isWeekStartDate(date, custom) {
            if (!custom) { custom = 0 };
            var day = date.getDay();
            return day === custom;
        }

        function reCalculateStartDate(date, custom) {
            if (!custom) { custom = 0 };
            var day = date.getDay();
            if (day < custom) {
                return date.addDays(Math.abs(7 - (custom - day)) * -1);
            }

            return date.addDays(Math.abs((custom - day)) * -1);
        }

        function reCalculateEndDate(date, custom) {
            if (!custom) { custom = 0 };
            var day = date.getDay();
            if (day < custom) {
                return date.addDays(Math.abs(custom - (day + 1)));
            }

            return date.addDays(6 - Math.abs(custom - day));
        }

        function isBetween(date, startDate, endDate, isDate) {
            var start = isDate ? startDate : new Date(convertToSysDate(startDate));
            var end = isDate ? endDate : new Date(convertToSysDate(endDate));
            var item = isDate ? date : new Date(convertToSysDate(date));

            return item >= start && item <= end;
        }

        function checkOverlap(dateRanges, startAttr, endAttr, isDate) {
            var ranges = [];
            if (!startAttr) {
                startAttr = "startDate";
            }

            if (!endAttr) {
                endAttr = "endDate";
            }


            for (var i = 0; i < dateRanges.length; i++) {
                var startDate = isDate ? dateRanges[i][startAttr] :
                    new Date(convertToSysDate(dateRanges[i][startAttr]));
                var endDate = isDate ? dateRanges[i][endAttr] :
                    new Date(convertToSysDate(dateRanges[i][endAttr]));
                var range = {
                    "start": startDate,
                    "end": endDate
                };
                ranges.push(range);
            }

            return getOverlap(ranges);

        }

        function getOverlap(dateRanges) {
            var sortedRanges = dateRanges.sort(function (previous, current) {
                var previousTime = previous.start.getTime();
                var currentTime = current.start.getTime();

                if (previousTime < currentTime) {
                    return -1;
                }

                if (previousTime === currentTime) {
                    return 0;
                }
                return 1;
            });

            var result = sortedRanges.reduce(function (result, current, idx, arr) {
                if (idx === 0) { return result; }
                var previous = arr[idx - 1];

                var previousEnd = previous.end.getTime();
                var currentStart = current.start.getTime();
                var overlap = (previousEnd >= currentStart);

                if (overlap) {
                    result.overlap = true;
                    result.ranges.push({
                        previous: previous,
                        current: current
                    })
                }

                return result;
            }, { overlap: false, ranges: [] });


            return result;
        }

        function convertToSysDate(dateStr) {
            if (!dateStr.match(CONSTANT_DATE_TIME_CONSTANTS.CONSTANT_DATE_REGULAR_EXP)) {
                return '';
            }

            var str = dateStr.split('.');
            return str[2] + '-' + str[1] + '-' + str[0];
        };

        function monthDifference(d1, d2) {
            var months;
            months = (d2.getFullYear() - d1.getFullYear()) * 12;
            months -= d1.getMonth() + 1;
            months += d2.getMonth();
            return months <= 0 ? 0 : months;
        }

        function dateDifferenceFormated(startDate, endDate, mayNegative) {

            var sSDate = new Date(convertToSysDate(startDate));
            var sEDate = new Date(convertToSysDate(endDate));

            return dateDifference(sSDate, sEDate, mayNegative);
        }

        function dateDifference(a, b, mayNegative) {
            var _MS_PER_DAY = 1000 * 60 * 60 * 24;
            var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
            var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
            if (mayNegative) {
                return Math.floor((utc2 - utc1) / _MS_PER_DAY);
            }

            return Math.abs(Math.floor((utc2 - utc1) / _MS_PER_DAY));
        }

        function dateSorter(a, b) {
            var date1 = new Date(convertToSysDate(a));
            var date2 = new Date(convertToSysDate(b));

            return date1 - date2;
        }

        function addDays(dateTime, days) {
            dateTime = new Date(convertToSysDate(dateTime));
            if (!dateTime) {
                return "";
            }
            dateTime = dateTime.addDays(days * 1);
            return dateTime;
        }

        function isValidDate(dateStr) {
            return !!convertToDate(dateStr);
        }

        function convertToDate(dateStr) {
            try {
                if (!dateStr) {
                    return null;
                }

                var splitedDateStr = dateStr.split('.');

                if (splitedDateStr.length !== 3) {
                    return null;
                }

                if (splitedDateStr[2].length !== 4) {
                    return null;
                }

                if (splitedDateStr[0].length !== 2) {
                    return null;
                }

                if (splitedDateStr[1].length !== 2) {
                    return null;
                }

                var year = splitedDateStr[2] * 1;
                var month = splitedDateStr[1] * 1;
                var day = splitedDateStr[0] * 1;

                if (month > 12) {
                    return null;
                }

                var days = daysInMonth(year, month - 1);

                if (day > days) {
                    return null;
                }

                return new Date(year, month - 1, day);

            } catch (e) {
                return '';
            }
        }

        function daysInMonth(year, month) {
            return [31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
        };

        function isLeapYear(year) {
            return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
        }

        function convertToDateTime(dateTimeStr, uiDate, onlyDate) {
            try {
                if (!dateTimeStr) {
                    return '';
                }

                if (!onlyDate) {
                    var str = dateTimeStr.split(CONSTANT_DATE_TIME_CONSTANTS.CONSTANT_DATE_TIME_SEPARATOR);
                    if (str.length !== 2) {
                        return '';
                    }

                    var dateStr = str[0];
                    var timeStr = str[1];
                } else {
                    dateStr = dateTimeStr;
                }

                var regx = uiDate ? CONSTANT_DATE_TIME_CONSTANTS.CONSTANT_DATE_REGULAR_EXP : CONSTANT_DATE_TIME_CONSTANTS.CONSTANT_SYS_DATE_REGULAR_EXP;
                var separator = uiDate ? '.' : '-';


                if (!dateStr.match(regx)) {
                    return '';
                }

                var splitedDateStr = dateStr.split(separator);

                if (splitedDateStr.length !== 3) {
                    return '';
                }

                if (!onlyDate) {

                    var splitedTimeStr = timeStr.split(':');

                    if (splitedTimeStr.length === 3) {
                        return new Date(splitedDateStr[0], splitedDateStr[1] - 1, splitedDateStr[2],
                            splitedTimeStr[0], splitedTimeStr[1], splitedTimeStr[2]);
                    }
                }

                return new Date(splitedDateStr[0], splitedDateStr[1], splitedDateStr[2]);
            } catch (e) {
                return '';
            }
        }

        function isDateObj(obj) {
            return !isNaN(obj.getTime());
        }

        function formatDateValue(srcDate, format) {

            if (srcDate === undefined || srcDate === '') {
                return '';
            }

            format = format || CONSTANT_DATE_TIME_CONSTANTS.CONSTANT_DATE_FORMAT;

            // month names array
            var monthNames = getMonthDefinition();

            // day names array
            var dayNames = getWeekDays();

            var dateValue;

            try {
                //if srcDate is a json date
                if (srcDate.toString().indexOf('/Date(') != -1) {
                    dateValue = new Date(parseInt(srcDate.replace('/Date(', '').replace(')/', ''), 10));
                } else {
                    dateValue = srcDate;
                }

                //format the date value
                return format.replace(/(yyyy|yy|MMMM|MMM|MM|M|dddd|ddd|dd|d|HH|H|hh|h|mm|m|ss|s|tt|t)/gi,
                    function ($1) {
                        switch ($1) {
                            case 'yyyy':
                                return dateValue.getFullYear();
                            case 'yy':
                                return dateValue.getFullYear().toString().substr(2);
                            case 'MMMM':
                                return monthNames[dateValue.getMonth()];
                            case 'MMM':
                                return monthNames[dateValue.getMonth()].substr(0, 3);
                            case 'MM':
                                return fillValue('0', (dateValue.getMonth() + 1), 2, 'left');
                            case 'M':
                                return dateValue.getMonth();
                            case 'dddd':
                                return dayNames[dateValue.getDay()];
                            case 'ddd':
                                return dayNames[dateValue.getDay()].substr(0, 3);
                            case 'dd':
                                return fillValue('0', dateValue.getDate(), 2, 'left');
                            case 'd':
                                return dateValue.getDate();
                            case 'HH':
                                return fillValue('0', dateValue.getHours(), 2, 'left');
                            case 'HH:00':
                                return fillValue('0', dateValue.getHours(), 4, 'left');
                            case 'H':
                                return dateValue.getHours();
                            case 'hh':
                                var hh;
                                return fillValue('0', ((hh = dateValue.getHours() % 12) ? hh : 12), 2, 'left');
                            case 'h':
                                var h;
                                return ((h = dateValue.getHours() % 12) ? h : 12);
                            case 'mm':
                                return fillValue('0', dateValue.getMinutes(), 2, 'left');
                            case 'm':
                                return dateValue.getMinutes();
                            case 'ss':
                                return fillValue('0', dateValue.getSeconds(), 2, 'left');
                            case 's':
                                return dateValue.getSeconds();
                            case 'tt':
                                return dateValue.getHours() < 12 ? 'AM' : 'PM';
                            case 't':
                                return dateValue.getHours() < 12 ? 'A' : 'P';
                            default:
                                return '';
                        }
                    });

            } catch (e) {
                return '';
            }
        }

        function fillValue(fillValue, actualValue, length, direction) {
            //make sure to convert to string
            var result = actualValue.toString();
            var pad = length - result.length;

            while (pad > 0) {
                if (direction.toString().toLowerCase() === 'left') {
                    result = fillValue + result;
                } else {
                    result = result + fillValue;
                }

                pad--;
            }

            return result;
        }

        function getMonthDefinition() {
            return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        }

        function getWeekDays() {
            return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        }

        function getDatesBtnStartAndEndDates(startDate, endDate) {

            var d1 = convertToSysDate(startDate);
            var d2 = convertToSysDate(endDate);
            var stDat = new Date(d1);
            var endDat = new Date(d2);

            var date = createBoardWeek(stDat, endDat);
            var dateArray = [];
            dateArray.push(date);

            var selectedDate = [];

            if (dateArray) {

                dateArray.forEach(function (dateItem) {
                    dateItem.days.forEach(function (daysItem) {
                        var myDate = daysItem.date;
                        var dateContainer = [];
                        var obj = {};
                        dateArray.forEach(function (dtItem) {
                            dtItem.days.forEach(function (dsItem) {

                                if (dsItem.date == startDate) {
                                    obj.startData = dsItem.date;
                                }
                                if (dsItem.date == endDate) {
                                    obj.endData = dsItem.date;
                                }

                            })
                        });
                        dateContainer.push(obj);

                        dateContainer.forEach(function (dateContainerItem) {
                            var startDateGiven = dateContainerItem.startData;
                            var endDateGiven = dateContainerItem.endData;
                            var betweenDates = isBetween(myDate, startDateGiven, endDateGiven, false);
                            if (betweenDates == true) {
                                selectedDate.push(myDate);
                            }
                        });

                    })
                })
            }
            return selectedDate;
        }

        return service;
    }
})();
