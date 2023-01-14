(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdColorPicker', colorPicker)

    /** @ngInject */
    function colorPicker() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                selectedColor: '=',
                objectKey: '=',
                onColorChange: '&'
            },
            controller: "ColorPickerController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/colorpicker/color.html'
        };
    }

})();


(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('ColorPickerController', ColorPickerController);

    /** @ngInject */
    function ColorPickerController($scope) {
        var vm = this;

        init();

        function init() {
            $scope.$watch("selectedColor", function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    var info = { objectKey: $scope.objectKey, color: newValue };
                    $scope.onColorChange({ info: info });
                }
            }, true);
        }

    }

})();