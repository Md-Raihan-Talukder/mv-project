(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('dynamicFormService', dynamicFormService);

    /** @ngInject */
    function dynamicFormService(commonApiService, utilService) {

        var service = {
            getCategory: getCategory,
            isFullPage: isFullPage,
            columnFilter: columnFilter,
        };

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

        return service;
    }
})();