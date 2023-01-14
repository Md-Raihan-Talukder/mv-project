(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('dataCaptureService', dataCaptureService);

    /** @ngInject */
    function dataCaptureService(commonApiService, utilService) {

        var service = {
            initItem: initItem,
            setColumnToVSegment: setColumnToVSegment,
            isNumberKey: isNumberKey,
            getCategory: getCategory,
            isFullPage: isFullPage,
            columnFilter: columnFilter,
            getDatePickerTitle: getDatePickerTitle
        };

        function getDatePickerTitle(title) {
            title = title.replace('Date', '').replace('date', '');
            return title;
        }

        function columnFilter(item, columns) {
            if (item.deleted || item.type === 'index') {
                return false;
            }

            if (item.type === 'numeric' && item.formula && item.formula.trim().length) {
                return false;
            }

            if (columns && columns.length && hasColumnInGroup(item, columns)) {
                return false;
            }


            return true
        };

        function hasColumnInGroup(item, columns) {
            for (var i = 0; i < columns.length; i++) {
                if (columns[i].type === 'group' && columns[i].columns && columns[i].columns.length) {
                    return columns[i].columns.indexOf(item.data) > -1;
                }
            }
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

        function getCategory(col) {

            switch (col.type) {
                case 'multilineText':
                case 'text':
                case 'numeric':
                    if (col.refference && col.refference.trim().length) {
                        return 'select';
                    }

                    return 'text';

                case 'trueFalse':
                    return 'checkbox';

                default:
                    break;
            }
        }

        function isFullPage(col) {
            switch (col.type) {
                case 'multilineText':
                case 'html':
                case 'image':
                case 'attachment':
                case 'register':
                case 'link':
                    return true;
                case 'text':
                    if (col.refference && col.refference.trim().length && col.refferenceMultiple) {
                        return true;
                    }
                    return false;
                default:
                    return false;
            }
        }

        function setColumnToVSegment(rows, columns) {
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                for (var j = 0; j < row.columns.length; j++) {
                    var col = row.columns[j];
                    for (var k = 0; k < col.hSegments.length; k++) {
                        var hSegment = col.hSegments[k];
                        for (var l = 0; l < hSegment.vSegments.length; l++) {
                            var vSegment = hSegment.vSegments[l];
                            vSegment.column = getColumByDataProperty(vSegment.dataProperty, columns);
                        }
                    }
                }
            }
        }

        function getColumByDataProperty(data, columns) {
            var index = utilService.getIndex(columns, 'data', data);
            if (index >= 0) {
                return columns[index];
            }
        }

        function initItem(item, columns) {

            for (var i = 0; i < columns.length; i++) {

                var col = columns[i];
                var data = item[col.data];

                switch (col.type) {
                    case 'multilineText':
                    case 'text':
                    case 'html':
                        if (col.refference && col.refference.trim().length && col.refferenceMultiple) {
                            if (data.constructor !== Array) {
                                item[col.data] = [];
                            }
                        } else {
                            item[col.data] = data || "";
                        }
                        break;
                    case 'numeric':
                        item[col.data] = data || 0;
                        break;
                    case 'date':
                        if (col.isDefaultCurrentDate) {
                            var format = CONSTANT_DATE_TIME_FORMATS.CONSTANT_SYS_DATE_FORMAT + CONSTANT_DATE_TIME_FORMATS.CONSTANT_DATE_TIME_SEPARATOR + CONSTANT_DATE_TIME_FORMATS.CONSTANT_SYS_TIME_FORMAT;
                            item[col.data] = data || utilService.formatDateValue(new Date(), format);
                        }
                        break;
                        // case 'link':                        
                        // vm.item[col.data] = {title:"", url:""};
                        break;
                    case 'register':
                        getRegister(item, col.registerId, col.data);
                        break;
                    case 'image':
                        if (data.constructor !== Array) {
                            item[col.data] = [];
                        }
                        break;
                    case 'trueFalse':
                        item[col.data] = data || false;
                        break;
                    case 'attachment':
                        if (data.constructor !== Array) {
                            item[col.data] = [];
                        }
                        break;

                    default:
                        break;
                }

            }

            return item;
        }

        function getRegister(item, id, key) {
            commonApiService.getItem(item, "REGISTER", id, key);
        }

        return service;
    }
})();