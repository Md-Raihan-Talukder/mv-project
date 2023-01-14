(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('DataCaptureColumnController', DataCaptureColumnController);

    /** @ngInject */
    function DataCaptureColumnController($scope, PRIMARY_COLUMN_NAME, dataCaptureService) {
        var vm = this;
        vm.primaryColumnName = PRIMARY_COLUMN_NAME;
        vm.getCategory = getCategory;
        vm.isNumberKey = isNumberKey;
        vm.labelQuerySearch = labelQuerySearch;
        vm.getDatePickerTitle = getDatePickerTitle;
        vm.updateColumnMode = updateColumnMode;
        vm.onAddInnerItem = onAddInnerItem;

        init();

        function init() {

            vm.taToolbar = [
                ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote', 'bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
                ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent', 'html', 'insertImage', 'insertLink', 'insertVideo', 'wordcount', 'charcount']
            ];
        }

        function onAddInnerItem(innerItem, isNew) {
            $scope.onAddInnerItem({ innerItem: innerItem, isNew: isNew });
        }

        function updateColumnMode(col) {
            col.editMode = !col.editMode;
        }

        function getDatePickerTitle(title) {
            title = title.replace('Date', '').replace('date', '');
            return title;
        }

        function labelQuerySearch(col, query) {

            var refValues = vm.referenceGroups[col.refference];

            return query ? refValues.filter(createFilterFor(query)) : [];
        }

        function createFilterFor(query) {

            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item) {
                return angular.lowercase(item.name).indexOf(lowercaseQuery) >= 0;
            };
        }

        function isNumberKey(evt) {
            return dataCaptureService.isNumberKey(evt);
        }

        function getCategory(col) {
            return dataCaptureService.getCategory(col);
        }

    }
})();
