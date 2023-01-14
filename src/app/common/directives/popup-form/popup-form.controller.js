(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('MsbPopUpFormController', MsbPopUpFormController);

    /** @ngInject */
    function MsbPopUpFormController($scope, $mdDialog, $document) {
        var vm = this;
        $scope.showPopUp = showPopUp;

        function showPopUp() {

            $mdDialog.show({
                controller: 'DataEntryDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/common/dialogs/data-entry/data-entry.html',
                parent: angular.element($document.body),
                clickOutsideToClose: false,
                preserveScope: true,
                multiple: true,
                locals: {
                    Item: $scope.item,
                    Type: $scope.itemType,
                    FormId: $scope.formId,
                    ColumnDefs: $scope.columnDefs,
                    ServiceKey: $scope.serviceKey
                }
            }).then(function (answer) {
                if (!answer) {
                    return;
                }

                $scope.onOk({ item: angular.copy(answer) });
            });

        }

    }
})();