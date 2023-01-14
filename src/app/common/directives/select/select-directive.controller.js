(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('MsbSelectController', MsbSelectController);

    /** @ngInject */
    function MsbSelectController($scope, $mdDialog, $document) {
        var vm = this;
        $scope.selectItem = selectItem;

        init();

        function init() {

        }

        function selectItem() {
            $mdDialog.show({
                controller: 'FormItemDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/common/directives/form/dialogs/select/form-item-dialog.html',
                parent: angular.element($document.body),
                clickOutsideToClose: false,
                preserveScope: true,
                multiple: true,
                skipHide: true,
                locals: {
                    Column: null,
                    DataSet: $scope.selectedItems,
                    SelectID: $scope.selectId,
                    SingleSelection: $scope.singleSelection,
                    SlectType: $scope.slectType,
                    Items: null,
                    ListColumns: null,
                    KeyProperty: null
                }
            }).then(function (answer) {
                if (!answer) {
                    return;
                }

                $scope.onSelect({ items: answer.items });
            });
        }

    }
})();