(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('utilService', utilService);

    /** @ngInject */
    function utilService($mdToast, msUtils, $mdDialog, $document, CONSTANT_DATE_TIME_FORMATS, CONSTANT_DATE_FORMAT,
        CONSTANT_SYS_DATE_FORMAT, CONSTANT_DATE_REGULAR_EXP, CONSTANT_SYS_DATE_REGULAR_EXP,
        serverUrl, $http, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME, DUPLICATE_ID_SEPERATOR) {


        var service = {
            showToast: showToast,
            getCurrentUser: getCurrentUser,
            saveLoginDataLocally: saveLoginDataLocally,
            checkLogin: checkLogin,
            removeLoginDataLocally: removeLoginDataLocally,
            formatDateValue: formatDateValue,
            convertToSysDate: convertToSysDate,
            convertToUIDate: convertToUIDate,
            subtractDate: subtractDate,
            addDate: addDate,
            dateDiff: dateDiff,
            getGreaterDate: getGreaterDate,
            getLesserDate: getLesserDate,
            getMaxDate: getMaxDate,
            getMonthDates: getMonthDates,
            getDateBetweenDates: getDateBetweenDates,
            getMinDate: getMinDate,
            getWeekDay: getWeekDay,
            getWeekDays: getWeekDays,
            getDefaultWeekend: getDefaultWeekend,
            convertSysDays: convertSysDays,
            createNumberRange: createNumberRange,
            convertToDateTime: convertToDateTime,
            getSystemHollydays: getSystemHollydays,
            getSystemBookedDays: getSystemBookedDays,
            replaceSpaces: replaceSpaces,
            generateId: generateId,
            getIndex: getIndex,
            getCalandarHours: getCalandarHours,
            getCalandarMins: getCalandarMins,
            isExist: isExist,
            sortItems: sortItems,
            downLoadJson: downLoadJson,
            addPrototypeMethods: addPrototypeMethods,
            flatten: flatten,
            removeDuplicateNumber: removeDuplicateNumber,
            getIndexByValues: getIndexByValues,
            getItemsByProperties: getItemsByProperties,
            dotNetFormatter: dotNetFormatter,
            generateNumericId: generateNumericId,
            isNumberKey: isNumberKey,
            confirmAndDelete: confirmAndDelete,

        };

        function confirmAndDelete(type, items, yesCalback, noCalback, event) {

            $mdDialog.show({
                controller: 'MsbConfirmDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/main/common/dialogs/confirm/confirm-dialog.html',
                parent: angular.element($document.body),
                clickOutsideToClose: false,
                preserveScope: true,
                multiple: true,
                skipHide: true,
                locals: {
                    Type: type,
                    Items: items
                }
            }).then(function (answer) {
                if (answer && yesCalback) {
                    yesCalback();
                }
            }, function () {
                if (noCalback) {
                    noCalback();
                }
            });
        }

        function isNumberKey(evt) {
            var valid = true;
            var element = angular.element(evt.target);

            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if (charCode === 45) {//minus sign
                var index = element.val().indexOf('-');
                if (index >= 0) {
                    valid = false;
                } else {
                    valid = evt.target.selectionStart === 0 ? true : false;
                }
            } else if (charCode === 46) {// decimal point
                if (element.val().indexOf('.') >= 0) {
                    valid = false;
                } else {
                    valid = true;
                }
            } else if (charCode > 46 && (charCode < 48 || charCode > 57)) {
                valid = false;
            }
            if (!valid) {
                evt.preventDefault();
            }

            return valid;
        }
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function generateNumericId(length) {
            length = length || 8;
            var timestamp = +new Date;
            var ts = timestamp.toString();
            var parts = ts.split("").reverse();
            var id = "";

            for (var i = 0; i < length; ++i) {
                var index = getRandomInt(0, parts.length - 1);
                id += parts[index];
            }

            return id;
        }

        function dotNetFormatter(x, formatString, currencyPrefix) {
            var result = formatString;
            if (formatString.indexOf("N") > -1 || formatString.indexOf("C") > -1 || formatString.indexOf("P") > -1) {
                if (formatString.indexOf("N") > -1) {
                    result = "#,#";
                }
                if (formatString.indexOf("C") > -1) {
                    result = currencyPrefix ? currencyPrefix + "#,#" : "$#,#";
                }
                if (formatString.indexOf("P") > -1) {
                    result = "#,#%";
                }
                var decimalDigit = parseInt(formatString.substr(1, formatString.length - 1));
                for (var i = 0; i < decimalDigit; i++) {
                    if (i === 0) {
                        result += ".";
                    }
                    result += "0";
                }
            }

            return String.format("{0:" + result + "}", x);
        }

        function flatten(arr) {
            return arr.reduce(function (flat, toFlatten) {
                return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
            }, []);
        }

        function addPrototypeMethods() {

            Date.isLeapYear = function (year) {
                return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
            };

            Date.getDaysInMonth = function (year, month) {
                return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
            };

            Date.prototype.isLeapYear = function () {
                return Date.isLeapYear(this.getFullYear());
            };

            Date.prototype.getDaysInMonth = function () {
                return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
            };

            Date.prototype.addMonths = function (value) {
                var n = this.getDate();
                this.setDate(1);
                this.setMonth(this.getMonth() + value);
                this.setDate(Math.min(n, this.getDaysInMonth()));
                return this;
            };

            Date.prototype.addDays = function (days) {
                var dat = new Date(this.valueOf());
                dat.setDate(dat.getDate() + days);
                return dat;
            };

            Date.prototype.firstDay = function () {
                var dat = new Date(this.valueOf());
                dat = new Date(dat.getFullYear(), dat.getMonth(), 1);
                return dat;
            };

            Date.prototype.lastDay = function () {
                var dat = new Date(this.valueOf());
                dat = new Date(dat.getFullYear(), dat.getMonth() + 1, 0);
                return dat;
            };



        }

        function removeDuplicateNumber(str) {
            if (str) {
                var cnt = []
                var startChar = DUPLICATE_ID_SEPERATOR;
                var isCarryingStartChar = false;
                var takeChar = true;
                for (var i = 0, len = str.length; i < len; i++) {
                    takeChar = true;
                    if (str[i] == startChar) {
                        isCarryingStartChar = true;
                        takeChar = false;
                    }
                    else if (isCarryingStartChar && (str[i] == '0' || !isNaN(str[i]))) {
                        takeChar = false;
                    }
                    else {
                        isCarryingStartChar = false;
                    }
                    if (takeChar) {
                        cnt.push(str[i])
                    }
                }
                return cnt.join('');
            }
            return '';
        }

        function downLoadJson(obj, filename) {
            var object = JSON.parse(angular.toJson(obj));
            var json = JSON.stringify(object, null, 2);
            var blob = new Blob([json], { type: "text/plain;charset=utf-8" });
            saveAs(blob, filename);
        }

        function sortItems(items, prop) {
            if (prop) {
                return items.sort(propComparator(prop));
            }
            return items.sort(compare);
        }

        function compare(a, b) {
            if (a[SERIAL_COLUMN_NAME] < b[SERIAL_COLUMN_NAME]) {
                return -1;
            }

            if (a[SERIAL_COLUMN_NAME] > b[SERIAL_COLUMN_NAME]) {
                return 1;
            }

            return 0;
        }

        function propComparator(prop) {
            return function (a, b) {
                return a[prop] - b[prop];
            }
        }

        function isExist(items, property, propertyValue, id) {
            var index = getIndex(items, property, propertyValue);
            if (index >= 0) {
                var item = items[index];
                return item[PRIMARY_COLUMN_NAME] !== id;
            }
            return false;
        }

        function getIndex(items, property, propertyValue) {
            if (!items) {
                items = [];
            }

            for (var i = 0; i < items.length; i++) {
                if (items[i][property] === propertyValue) {
                    return i;
                }
            }
            return -1;
        }

        function getIndexByValues(items, propertyValues) {
            if (!items) {
                items = [];
            }

            for (var i = 0; i < items.length; i++) {
                var found = true;
                for (var j = 0; j < propertyValues.length; j++) {
                    var property = propertyValues[j].key;
                    var propertyValue = propertyValues[j].value;

                    if (items[i][property] !== propertyValue) {
                        found = false;
                    }
                }

                if (found) {
                    return i;
                }
            }
            return -1;
        }

        function getItemsByProperties(items, propertyValues) {
            var searchedItems = [];
            if (!items) {
                items = [];
            }

            for (var i = 0; i < items.length; i++) {
                var found = true;
                for (var j = 0; j < propertyValues.length; j++) {
                    var property = propertyValues[j].key;
                    var propertyValue = propertyValues[j].value;

                    if (items[i][property] !== propertyValue) {
                        found = false;
                    }
                }

                if (found) {
                    searchedItems.push(items[i]);
                }
            }

            return searchedItems;
        }

        function generateId(val) {
            return msUtils.guidGenerator();
        }

        function replaceSpaces(val) {
            return val.toString().replace(/(\s([a-z]|[A-Z]))/g,
                function ($1) {
                    return $1.toUpperCase().replace(' ', '');
                });
        }


        function createNumberRange(min, max, step) {
            step = step || 1;
            var input = [];
            for (var i = min; i <= max; i += step) {
                input.push(i);
            }
            return input;
        };

        // var weekday = new Array(7);
        //     weekday[0]=  "Sunday";
        //     weekday[1] = "Monday";
        //     weekday[2] = "Tuesday";
        //     weekday[3] = "Wednesday";
        //     weekday[4] = "Thursday";
        //     weekday[5] = "Friday";
        //     weekday[6] = "Saturday";

        var weekday = [];
        var weekends = [];
        var sysHolidays = [];
        var monthNames = [];
        var sysBookedDays = [];

        var calandarHours = [];
        var calandarMin = [];

        function getCalandarHours() {
            if (calandarHours.length <= 0) {
                for (var i = 0; i < 23; i++) {
                    calandarHours.push(i);
                }
            }
            return calandarHours;
        }

        function getCalandarMins() {
            if (calandarMin.length <= 0) {
                for (var i = 0; i < 60; i++) {
                    calandarMin.push(i);
                }
            }
            return calandarMin;
        }

        function initCalandarSetup() {

            var calandarCerviceName = 'calandar/';

            $http.get(serverUrl + calandarCerviceName + 'calandar.json').success(function (response) {
                weekday = response.definition.weekday;
                weekends = response.definition.weekends;
                sysHolidays = response.definition.sysHollydays;
                monthNames = response.definition.monthNames;
                sysBookedDays = response.definition.sysBookedDays;
            })
                .error(function (err) {
                    weekday = [];
                    weekends = [];
                    sysHolidays = [];
                    monthNames = [];
                    sysBookedDays = [];
                });


        }

        initCalandarSetup();




        function convertSysDays(days) {
            var uidays = [];
            for (var i = 0; i < days.length; i++) {
                var sysDt = convertToUIDate(days[i]);
                uidays.push(sysDt);
            }
            return uidays;
        }

        function getMonthDates(mon, yr, dateFormat) {
            if (!dateFormat) dateFormat = CONSTANT_DATE_FORMAT;
            mon = parseInt(mon);
            yr = parseInt(yr);
            var firstDay = new Date(yr + '-' + mon + '-01');
            var lastDay = new Date(yr + '-' + (mon + 1) + '-01');
            return getDateBetweenDates(firstDay, lastDay);
        }
        function getDateBetweenDates(firstDay, lastDay, dateFormat) {
            if (!dateFormat) dateFormat = CONSTANT_DATE_FORMAT;
            lastDay.setDate(lastDay.getDate() - 1);
            var monthDates = [];
            monthDates.push(formatDateValue(firstDay, dateFormat));
            while (firstDay < lastDay) {
                firstDay.setDate(firstDay.getDate() + 1);
                monthDates.push(formatDateValue(firstDay, dateFormat));
            }
            return monthDates;
        }

        function getMonthDefinition() {

            return monthNames;
        }


        function getWeekDays() {

            return weekday;
        }

        function getDefaultWeekend() {
            return weekends;
        }

        function getSystemHollydays() {
            return sysHolidays;
        }

        function getSystemBookedDays() {
            return sysBookedDays;
        }


        function getWeekDay(dt) {
            if (!dt.match(CONSTANT_DATE_REGULAR_EXP)) {
                return '';
            }
            dt = convertToSysDate(dt);
            dt = new Date(dt);
            return weekday[dt.getDay()];
        }

        function getMinDate(dates) {
            if (dates.length) {
                var date = dates[0];
                for (var i = 1; i < dates.length; i++) {
                    date = getLesserDate(date, dates[i]);
                }
                return date;
            }
            return '';
        }

        function getMaxDate(dates) {
            if (dates.length) {
                var date = dates[0];
                for (var i = 1; i < dates.length; i++) {
                    date = getGreaterDate(date, dates[i]);
                }
                return date;
            }
            return '';
        }

        function getGreaterDate(date1, date2) {
            if (!date1.match(CONSTANT_DATE_REGULAR_EXP) || !date2.match(CONSTANT_DATE_REGULAR_EXP)) {
                return '';
            }
            var tdate1 = convertToSysDate(date1);
            var tdate2 = convertToSysDate(date2);
            if (tdate2 > tdate1) return date2;
            return date1;
        };

        function getLesserDate(date1, date2) {
            if (!date1.match(CONSTANT_DATE_REGULAR_EXP) || !date2.match(CONSTANT_DATE_REGULAR_EXP)) {
                return '';
            }
            var tdate1 = convertToSysDate(date1);
            var tdate2 = convertToSysDate(date2);
            if (tdate2 < tdate1) return date2;
            return date1;
        };

        function addDate(date, daysToAdd, isDuration) {
            if (isDuration) {
                daysToAdd = daysToAdd - 1;
            }
            if (!date.match(CONSTANT_DATE_REGULAR_EXP)) {
                return '';
            }
            daysToAdd = ((!Number.isInteger(daysToAdd)) ? parseInt(daysToAdd) : daysToAdd);
            var dtStr = convertToSysDate(date);

            var dt = new Date(dtStr);
            dt.setDate(dt.getDate() + daysToAdd);

            return formatDateValue(dt, CONSTANT_DATE_FORMAT);
        };

        function dateDiff(date1, date2, isDuration) {
            if (!date1.match(CONSTANT_DATE_REGULAR_EXP) || !date2.match(CONSTANT_DATE_REGULAR_EXP)) {
                return '';
            }
            date1 = convertToSysDate(date1);
            date2 = convertToSysDate(date2);
            date1 = new Date(date1);
            date2 = new Date(date2);
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            if (isDuration) {
                timeDiff = timeDiff + 1;
            }
            return Math.ceil(timeDiff / (1000 * 3600 * 24));
        };


        function subtractDate(date, daysToSubtract, isDuration) {
            if (isDuration) {
                daysToSubtract = daysToSubtract - 1;
            }
            if (!date.match(CONSTANT_DATE_REGULAR_EXP)) {
                return '';
            }
            daysToSubtract = ((!Number.isInteger(daysToSubtract)) ? parseInt(daysToSubtract) : daysToSubtract);
            var dtStr = convertToSysDate(date);

            var dt = new Date(dtStr);
            dt.setDate(dt.getDate() - daysToSubtract);

            return formatDateValue(dt, CONSTANT_DATE_FORMAT);
        };

        function convertToSysDate(dateStr) {
            if (!dateStr.match(CONSTANT_DATE_REGULAR_EXP)) {
                return '';
            }

            var str = dateStr.split('.');
            return str[2] + '-' + str[1] + '-' + str[0];
        };
        function convertToUIDate(dateStr) {
            if (!dateStr.match(CONSTANT_SYS_DATE_REGULAR_EXP)) {
                return '';
            }
            var str = dateStr.split('-');
            return str[2] + '.' + str[1] + '.' + str[0];
        };

        function convertToDateTime(dateTimeStr) {
            try {
                if (!dateTimeStr) {
                    return '';
                }

                var str = dateTimeStr.split(CONSTANT_DATE_TIME_FORMATS.CONSTANT_DATE_TIME_SEPARATOR);
                if (str.length !== 2) {
                    return '';
                }

                var dateStr = str[0];
                var timeStr = str[1];


                if (!dateStr.match(CONSTANT_SYS_DATE_REGULAR_EXP)) {
                    return '';
                }

                var splitedDateStr = dateStr.split('-');
                if (splitedDateStr.length !== 3) {
                    return '';
                }

                var splitedTimeStr = timeStr.split(':');

                if (splitedTimeStr.length === 3) {
                    return new Date(splitedDateStr[0], splitedDateStr[1] - 1, splitedDateStr[2],
                        splitedTimeStr[0], splitedTimeStr[1], splitedTimeStr[2]);
                }

                return new Date(splitedDateStr[0], splitedDateStr[1], splitedDateStr[2]);
            } catch (e) {
                return '';
            }
        };

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
        };

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
        };


        function showToast(text, theme, delay, pos) {
            var hideDelay = delay ? delay : 500;
            var position = pos ? pos : 'top center';
            var toast = $mdToast.simple()
                .textContent(text)
                .theme(theme)
                .position(position)
                .hideDelay(hideDelay);

            $mdToast.show(toast);
        }

        function saveLoginDataLocally(response) {
            localStorage.setItem('td.currentUser', JSON.stringify(response.user));
            localStorage.setItem('td.hasLogin', true);
        }

        function removeLoginDataLocally(response) {
            localStorage.setItem('td.currentUser', "");
            localStorage.setItem('td.hasLogin', "");
        }

        function checkLogin() {
            return localStorage.getItem('td.hasLogin') === "true";
        }

        function getCurrentUser() {
            var user = localStorage.getItem('td.currentUser');
            if (user) {
                return JSON.parse(user);
            }
        }

        return service;
    }

})();
