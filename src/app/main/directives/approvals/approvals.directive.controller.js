(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('ApprovalsController', ApprovalsController);

    /** @ngInject */

    function ApprovalsController($scope, $mdDialog, $document) {
        //console.log($scope.rowspan);

        var initialWorkingDays = '';

        var getControl = function (objId, parentID, val) {
            return {
                objId: objId,
                parentID: parentID,
                objVal: val
            };
        };
        var controls = [];
        var fetchvalue = function (objId, parentID) {
            var i = 0
            for (; i < controls.length; i++) {
                if (controls[i].objId == objId && controls[i].parentID == parentID) {
                    return controls[i];
                }
            }
            return null;
        };
        $scope.updateValue = function (objId, parentID, val) {
            var foundObj = fetchvalue(objId, parentID);
            if (foundObj) {
                foundObj.objVal = val;
            }
            else {
                controls.push(getControl(objId, parentID, val));
            }
        };
        $scope.dataChange = function (objId, parentID, calculationID, currentValue) {
            if (currentValue) {
                var foundObj = fetchvalue(objId, parentID);
                var previousValue = ((foundObj) ? foundObj.objVal : '');
                if (currentValue != previousValue) {
                    $scope.oninfochange({ objId: objId, parentID: parentID, calculationID: calculationID, previousValue: previousValue });
                }
            }
        };
        $scope.approvalRemove = function (ob) {
            $scope.dataremove({ obj: ob.id, indx: 2 });
        };

        function workdaysDefChanged() {
            if ($scope.accordion && $scope.accordion && $scope.accordion.scheduleCalander && $scope.accordion.scheduleCalander.weekEnds) {
                var workStatus = angular.toJson($scope.accordion.scheduleCalander.workingDays);
                $scope.workdaysChanged({ previousWorkDef: initialWorkingDays, currentWorkDef: workStatus });

            }
        }

        $scope.openCalandarDialog = function (ev) {
            if ($scope.accordion && $scope.accordion && $scope.accordion.scheduleCalander && $scope.accordion.scheduleCalander.weekEnds) {
                initialWorkingDays = angular.toJson($scope.accordion.scheduleCalander.workingDays);
            }
            $mdDialog.show({
                controller: 'CommonCalandarDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/main/wbs/calandar/common.calandar.modal.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    paccordion: $scope.accordion,
                }
            }).then(function (calStatus) {
                workdaysDefChanged();
            }, function (calStatus) {
                workdaysDefChanged();
                //$scope.status = 'You cancelled the dialog.';
            });
        }
    }

})();