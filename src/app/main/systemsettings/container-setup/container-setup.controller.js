(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('ContainerSetupController', ContainerSetupController);

    /** @ngInject */
    function ContainerSetupController(PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME, $mdDialog,
        msbCommonApiService, msbUtilService, containerSetupService) {

        var vm = this;
        vm.addNewContainer = addNewContainer;
        vm.removeContainer = removeContainer;

        init();

        function init() {
            vm.newCont = { conatiner: null, truck: null, aircraft: null }
            getAssociateData()
        }

        function getAssociateData() {
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    vm.allContainers = data;
                    console.log(data);
                }
            }, "containerSetupService", "getContainers", []);
        }

        function addNewContainer(type, data) {
            if (type && data && data[type] && data[type].title) {
                var newContObj = data[type]
                newContObj.TECHDISER_ID = msbUtilService.generateId()
                newContObj.type = type
                //push
                vm.allContainers.push(newContObj)
                data[type] = null
            }
        }

        function removeContainer(item) {
            msbUtilService.confirmAndDelete(null, [{ item: item.title }], function () {
                msbUtilService.removeItems(vm.allContainers, item.TECHDISER_ID);
            });
        }

    }
})();
