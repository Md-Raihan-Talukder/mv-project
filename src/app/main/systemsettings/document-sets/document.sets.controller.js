(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('DocumentSetsController', DocumentSetsController);


    /** @ngInject */
    function DocumentSetsController(msbCommonApiService, msbUtilService, $state,
        PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME) {

        var vm = this;


        init();

        function init() {



        }


    }
})();
