(function () {
    'use strict';

    angular
        .module('app.common')
        .directive('msbPopUpForm', msbPopUpForm);

    /** @ngInject */
    function msbPopUpForm() {
        return {
            restrict: 'A',
            scope: {
                item: '=',
                itemType: '=',
                formId: '=',
                columnDefs: '=',
                serviceKey: '=',
                onOk: '&'
            },
            link: function (scope, element, attrs) {
                element.bind('click', function () {
                    scope.showPopUp();
                });
            },
            controller: "MsbPopUpFormController",
            controllerAs: 'vm'

        };
    }

})();