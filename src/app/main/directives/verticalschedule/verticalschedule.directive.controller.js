(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('VerticalscheduleController', VerticalscheduleController);

    /** @ngInject */

    function VerticalscheduleController($scope) {
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
    }

})();