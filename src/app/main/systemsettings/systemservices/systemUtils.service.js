(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .factory('systemUtils', systemUtils);

    /** @ngInject */
    function systemUtils($mdDialog, utilService) {
        var services = {
            getIndexes: getIndexes,
            hasItems: hasItems,
            exists: exists,
            isNotExist: isNotExist,
            filterItemValues: filterItemValues,
            closeDialog: closeDialog,
            filterArrayWithRespectToIndexes: filterArrayWithRespectToIndexes,
            reverseString: reverseString,
            getSLNumber: getSLNumber,
            isNumberKey: isNumberKey
        };

        return services;

        function exists(item, list) {
            var index = utilService.getIndex(list, "id", item.id);
            return index > -1;
        }

        function getIndexes(items, property, propertyValue) {
            var indexes = [];
            if (!items) {
                return indexes;
            }

            for (var i = 0; i < items.length; i++) {
                if (items[i][property] === propertyValue) {
                    indexes.push(i);
                }
            }
            return indexes;
        }

        function filterItemValues(items, property) {
            var values = [];
            if (!items || !items.length) {
                return values;
            }

            for (var i = 0; i < items.length; i++) {
                values.push(items[i][property]);
            }

            return values;
        }

        function isNotExist(items, propertyName, propertyValue) {
            var indexes = getIndexes(items, propertyName, propertyValue);
            return indexes.length === 0;
        }

        function hasItems(items) {
            var indexes = getIndexes(items, "deleted", false);
            return indexes.length === 0;
        }

        function hasItems(items, propertyName, propertyValue) {
            var indexes = getIndexes(items, propertyName, propertyValue);
            var matchedItems = [];
            if (indexes.length) {
                for (var i = 0; i < indexes.length; i++) {
                    if (items[indexes[i]].deleted === false) {
                        matchedItems.push(items[indexes[i]]);
                    }
                }
            }
            return matchedItems.length === 0;
        }

        function closeDialog() {
            $mdDialog.hide();
        }

        function filterArrayWithRespectToIndexes(items, indexList) {
            if (!items.length) {
                return [];
            }
            if (indexList.length > items.length) {
                return items;
            }
            for (var i = 0; i < indexList.length; i++) {
                items.splice(indexList[i], 1);
            }
            return items;
        }

        function reverseString(inputString) {
            return inputString.split("").reverse().join("");
        }

        function getSLNumber(list) {
            if (!list || !list.length) {
                return 1;
            } else {
                return list.length + 1;
            }
        }

        function isNumberKey(evt) {
            var valid = true;
            var element = angular.element(evt.target);
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if (charCode === 45) {
                var index = element.val().indexOf('-');
                if (index >= 0) {
                    valid = false;
                } else {
                    valid = evt.target.selectionStart === 0 ? true : false;
                }
            } else if (charCode === 46) {
                if (element.val().indexOf('.') >= 0) {
                    valid = false;
                } else {
                    valid = true;
                }
            } else if (charCode !== 46 && (charCode < 48 || charCode > 57)) {
                valid = false;
            }
            if (!valid) {
                evt.preventDefault();
            }

            return valid;
        }
    }
})();
