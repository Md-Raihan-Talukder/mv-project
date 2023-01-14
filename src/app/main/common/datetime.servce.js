(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('dateTimeService', dateTimeService);

    /** @ngInject */
    function dateTimeService(utilService, CONSTANT_DATE_TIME_FORMATS, CONSTANT_DATE_FORMAT, CONSTANT_DATE_REGULAR_EXP, CONSTANT_SYS_DATE_REGULAR_EXP) {

        var service = {
            formatDateValue: formatDateValue,
            convertToDateTime: convertToDateTime,
            convertToDate: convertToDate,
            isDateObj: isDateObj,
            addDays: addDays,
            dateSorter: dateSorter,
            dateDifferenceFormated: dateDifferenceFormated,
            dateDifference: dateDifference,
            convertToSysDate: convertToSysDate,
            monthDifference: monthDifference,
            getDateOfToday: getDateOfToday
        };

        function convertToSysDate(dateStr) {
            if (!dateStr.match(CONSTANT_DATE_REGULAR_EXP)) {
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
            var date1 = new Date(utilService.convertToSysDate(a));
            var date2 = new Date(utilService.convertToSysDate(b));

            return date1 - date2;
        }

        function addDays(dateTime, days) {
            dateTime = new Date(utilService.convertToSysDate(dateTime));
            if (!dateTime) {
                return "";
            }
            dateTime = dateTime.addDays(days * 1);
            return dateTime;
        }

        function convertToDate(dateStr) {
            try {
                if (!dateStr) {
                    return '';
                }

                var splitedDateStr = dateStr.split('.');

                if (splitedDateStr.length !== 3) {
                    return '';
                }

                var year = splitedDateStr[2] * 1;
                var month = splitedDateStr[1] * 1;
                var day = splitedDateStr[0] * 1;


                return new Date(year, month - 1, day);

            } catch (e) {
                return '';
            }
        }

        function convertToDateTime(dateTimeStr, uiDate, onlyDate) {
            try {
                if (!dateTimeStr) {
                    return '';
                }

                if (!onlyDate) {
                    var str = dateTimeStr.split(CONSTANT_DATE_TIME_FORMATS.CONSTANT_DATE_TIME_SEPARATOR);
                    if (str.length !== 2) {
                        return '';
                    }

                    var dateStr = str[0];
                    var timeStr = str[1];
                } else {
                    dateStr = dateTimeStr;
                }

                var regx = uiDate ? CONSTANT_DATE_REGULAR_EXP : CONSTANT_SYS_DATE_REGULAR_EXP;
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

        function getDateOfToday() {
            var toDay = new Date();
            return formatDateValue(toDay);
        }

        function formatDateValue(srcDate, format) {

            if (srcDate === undefined || srcDate === '') {
                return '';
            }

            format = format || CONSTANT_DATE_FORMAT;

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


        return service;
    }
})();