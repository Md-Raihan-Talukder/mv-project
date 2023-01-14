(function () {
    'use strict';

    angular
        .module('app.fbpoc')
        .controller('FbPoc', FbPoc);

    /** @ngInject */
    function FbPoc($mdSidenav, commonApiService, $mdDialog, utilService, PRIMARY_COLUMN_NAME) {
        var vm = this;

        init();
        function init() {
            vm.formColumns = [
                {
                    "title": "Title",
                    "data": "title",
                    "type": "text",
                    "TECHDISER_ID": "1",
                    "flex": 33
                },
                {
                    "title": "Code",
                    "data": "code",
                    "type": "text",
                    "TECHDISER_ID": "2",
                    "flex": 33
                },
                {
                    "title": "Description",
                    "data": "description",
                    "type": "multilineText",
                    "TECHDISER_ID": "3",
                    "flex": 33
                }

            ];
        }
        vm.formData = {
            //   employee: {},
            //   formInfo:"test data"
        };
        vm.log = log;
        function log() {
            console.log(vm.formData);
        }

    }
})();
