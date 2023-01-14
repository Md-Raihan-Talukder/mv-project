(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('checkListDirectiveController', checkListDirectiveController);

    /** @ngInject */

    function checkListDirectiveController($scope) {
        var vm = this;
        vm.updateCheckedCount = updateCheckedCount;
        vm.addCheckItem = addCheckItem;
        vm.removeChecklist = removeChecklist;
        vm.removeChecklistItem = removeChecklistItem;


        function updateCheckedCount(list) {
            var checkItems = list.checkItems;
            var checkedItems = 0;
            var allCheckedItems = 0;
            var allCheckItems = 0;

            angular.forEach(checkItems, function (checkItem) {
                if (checkItem.checked) {
                    checkedItems++;
                }
            });

            list.checkItemsChecked = checkedItems;

            // angular.forEach(vm.card.checklists, function (item)
            // {
            //     allCheckItems += item.checkItems.length;
            //     allCheckedItems += item.checkItemsChecked;
            // });

            // vm.card.checkItems = allCheckItems;
            // vm.card.checkItemsChecked = allCheckedItems;
        }


        function addCheckItem(text, checkList) {
            if (!text || text === '') {
                return;
            }

            var newCheckItem = {
                'name': text,
                'checked': false
            };

            if ($scope.onAddItem({ item: { newCheckItem: newCheckItem, checkList: checkList } })) {
                updateCheckedCount(checkList);
            }

        }


        function removeChecklist(item) {

            if ($scope.onRemoveCheckList({ item: item })) {
                angular.forEach($scope.itemList, function (list) {
                    updateCheckedCount(list);
                });
            }

        }


        function removeChecklistItem(item, list) {
            if ($scope.onRemoveItem({ item: { newCheckItem: item, checkList: list } })) {
                angular.forEach($scope.itemList, function (list) {
                    updateCheckedCount(list);
                });
            }
        }

    }

})();
