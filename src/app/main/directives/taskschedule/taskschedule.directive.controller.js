(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('TaskScheduleDirectiveController', TaskScheduleDirectiveController);

    /** @ngInject */

    function TaskScheduleDirectiveController($scope, utilService, CONSTANT_DATE_TIME_FORMATS) {
        var vm = this;
        vm.timeRequired = timeRequired;

        function timeRequired() {
            return $scope.schedule.timeRequired;

            // if(!$scope.schedule.startDateTime || !$scope.schedule.endDateTime)
            // {
            // 	return true;
            // }    	
            // var date1 =utilService.convertToSysDate(utilService.formatDateValue($scope.schedule.startDateTime));		
            // var date2 = utilService.convertToSysDate(utilService.formatDateValue($scope.schedule.endDateTime));		

            //      	return  date1 ===  date2;
        }

    }

})();
